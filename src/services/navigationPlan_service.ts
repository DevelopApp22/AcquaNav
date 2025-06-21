import { ErrEnum } from "../factory/error/error_enum";
import { ErrorFactory } from "../factory/error/error_factory";
import { INavigationPlan, StatusNavigation } from "../model/navigationPlan.interface";
import { NavigationPlanRepository } from "../repository/navigationPlan_repository";
import { RestrictedAreaRepository } from "../repository/restrictedArea_repository";
import { UserRepository } from "../repository/user_repository";
import { createBoundingBoxPolygon, createLineStringFromCoords, isRouteOutsideBox } from "../utils/geo_spatial_utils";
import { TokenCosts } from "../enum/token_cost";
import { INavigationPlanQuery } from "../types/navigationPlanQuery";
import { FilterQuery } from "mongoose";


/**
 * Classe `NavigationPlanService`
 *
 * Gestisce la logica di business per la creazione dei piani di navigazione.
 * Si occupa della validazione dell'utente, del controllo delle aree vietate e della gestione dei token.
 * Si interpone tra controller e repository per applicare le regole di dominio prima delle operazioni di persistenza.
 */
export class NavigationPlanService {

    /**
     * Costruttore del servizio.
     * @param navigationPlanRepository Repository per la gestione dei piani di navigazione.
     * @param userRepository Repository per la gestione degli utenti.
     * @param restricted_area Repository delle aree vietate alla navigazione.
     */
    constructor(
        private navigationPlanRepository: NavigationPlanRepository,
        private userRepository: UserRepository,
        private restricted_area: RestrictedAreaRepository
    ) {}

    /**
     * Crea un nuovo piano di navigazione, applicando tutte le regole di business.
     * - Verifica che l'utente esista.
     * - Controlla che abbia abbastanza token.
     * - Controlla che la rotta non attraversi aree vietate.
     * - Scala il costo in token.
     * - Registra il piano nel database.
     *
     * @param plan Oggetto contenente i dati del piano di navigazione.
     * @throws `UserNotFound` se l'utente non esiste.
     * @throws `InsufficientTokens` se l'utente ha meno di 5 token o se la data è troppo ravvicinata.
     * @throws `RouteRestricted` se la rotta attraversa aree vietate.
     */
    async createNavigationPlan(plan: INavigationPlan,userId:string) {
        const errorFactory = new ErrorFactory();
       
        const user = await this.userRepository.getUserById(userId);
    
        if (!user) {
            throw errorFactory.getError(ErrEnum.UserNotFound);
        }

        if (!user.tokens || user.tokens < TokenCosts.CREATE_PLAN) {
            throw errorFactory.getError(ErrEnum.InsufficientTokens);
        }

        const restricted_area = await this.restricted_area.listAllAreas();
        const route = createLineStringFromCoords(plan.waypoints);

        for (const area of restricted_area) {
            
            const boundingBox = createBoundingBoxPolygon(area.topLeft, area.bottomRight);
            if (!isRouteOutsideBox(route, boundingBox)) {
                throw errorFactory.getError(ErrEnum.RouteRestricted);
            }
        }
        await this.userRepository.updateUser(userId, {
            tokens: user.tokens - TokenCosts.CREATE_PLAN
        });

        plan.userId=userId
        await this.navigationPlanRepository.createPlan(plan);
        return plan

    }

    /**
     * Annulla (soft-delete) un piano di navigazione, impostandone lo stato su `CANCELLED`.
     * 
     * Requisiti per poter annullare il piano:
     * - Il piano deve esistere.
     * - L'utente richiedente deve essere il proprietario del piano.
     * - Il piano deve avere stato `PENDING`.
     * 
     * @param id ID del piano da annullare.
     * @param userId ID dell'utente che richiede l'annullamento.
     * 
     * @throws `PlanNotFound` se il piano non esiste.
     * @throws `Unauthorized` se l'utente non è il proprietario del piano.
     * @throws `CannotCancelPlan` se il piano non è in stato `PENDING`.
     * @throws `InternalServerError` per errori generici inattesi.
     */
    async deleteNavigationPlan(id: string, userId: string) {

        const errorFactory = new ErrorFactory();

        const plan = await this.navigationPlanRepository.getPlanById(id);

        if (!plan) {
            throw errorFactory.getError(ErrEnum.PlanNotFound);
        }

        if (plan.userId !== userId) {
            throw errorFactory.getError(ErrEnum.Unauthorized);
        }

        if (plan.status !== StatusNavigation.PENDING) {
            throw errorFactory.getError(ErrEnum.CannotCancelPlan);
        }

        const navigationPlan = await this.navigationPlanRepository.updatePlan(id, {
            status: StatusNavigation.CANCELLED
        });
        return navigationPlan
    }

  
async updatePlanStatus(id: string, status: StatusNavigation, reason?: string) {
    
    const errorFactory = new ErrorFactory();
    const plan = await this.navigationPlanRepository.getPlanById(id);

    if (!plan) {
        throw errorFactory.getError(ErrEnum.PlanNotFound);
    }

    if (plan.status === StatusNavigation.CANCELLED) {
        throw errorFactory.getError(ErrEnum.PlanNotFound);
    }

    const navigationPlan=await this.navigationPlanRepository.updatePlan(id, {
        status: status,
        rejectionReason: status === StatusNavigation.REJECTED ? reason ?? "" : ""
    });

    return navigationPlan
}

    /**
     * Recupera i piani di navigazione in base ai filtri specificati nella query.
     *
     * I filtri supportati includono:
     * - Intervallo di date (startDate): `from` (data inizio minima) e `to` (data inizio massima)
     * - Stato del piano (`status`)
     * - ID dell’utente proprietario del piano (`userId`)
     *
     * Tutti i filtri sono opzionali. Se non viene specificato nulla, restituisce tutti i piani.
     *
     * @param query Oggetto contenente i parametri di filtro.
     * @returns Lista di piani di navigazione che soddisfano i criteri.
     */
    async getNavigationPlan(query: INavigationPlanQuery) {
        const filter: FilterQuery<INavigationPlan> = {};
        if (query.from || query.to) {
                filter.startDate = {};
                if (query.from) {
                filter.startDate.$gte = new Date(query.from);
                }
                if (query.to) {
                filter.startDate.$lte = new Date(query.to);
                }
        }
        if (query.status) {
            filter.status = query.status;
        }
        if (query.userId) {
            filter.userId = query.userId;
        }
        const navigationPlans = await this.navigationPlanRepository.getPlans(filter);

        return navigationPlans;
        }
    }