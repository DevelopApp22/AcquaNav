import { ErrEnum } from "../factory/error/error_enum";
import { ErrorFactory } from "../factory/error/error_factory";
import { INavigationPlan } from "../model/navigationPlan.interface";
import { NavigationPlanRepository } from "../repository/navigationPlan_repository";
import { RestrictedAreaRepository } from "../repository/restrictedArea_repository";
import { UserRepository } from "../repository/user_repository";
import { createBoundingBoxPolygon, createLineStringFromCoords, isRouteOutsideBox } from "../utils/geo_spatial_utils";
import { TokenCosts } from "../enum/token_cost";
import { INavigationPlanQuery } from "../types/navigationPlanQuery";
import mongoose, { FilterQuery } from "mongoose";
import { StatusNavigation } from "../enum/statusNavigation";

/**
 * Classe `NavigationPlanService`
 *
 * Gestisce la logica di business per la creazione e gestione dei piani di navigazione.
 * Si occupa di validare l'utente, controllare le aree vietate, gestire i token e applicare le regole di dominio.
 * Funziona come livello intermedio tra controller e repository.
 */
export class NavigationPlanService {

    /**
     * Costruttore del servizio.
     * @param navigationPlanRepository Repository per i piani di navigazione.
     * @param userRepository Repository per gli utenti.
     * @param restrictedAreaRepository Repository per le aree vietate.
     */
    constructor(
        private navigationPlanRepository: NavigationPlanRepository,
        private userRepository: UserRepository,
        private restrictedAreaRepository: RestrictedAreaRepository
    ) {}

    /**
     * Crea un nuovo piano di navigazione, verificando:
     * - Esistenza utente
     * - Disponibilità token
     * - Rotta libera da aree vietate
     * - Scala il costo in token e salva il piano
     * 
     * @param plan Piano di navigazione da creare.
     * @param userId ID dell'utente proprietario.
     * @throws UserNotFound, InsufficientTokens, RouteRestricted
     */
    async createNavigationPlan(plan: INavigationPlan, userId: string): Promise<INavigationPlan> {
        const errorFactory = new ErrorFactory();

        // Recupera l'utente e verifica la sua esistenza
        const user = await this.userRepository.getUserById(userId);
        if (!user) {
            throw errorFactory.getError(ErrEnum.UserNotFound);
        }

        // Verifica disponibilità token
        if (!user.tokens || user.tokens < TokenCosts.CREATE_PLAN) {
            throw errorFactory.getError(ErrEnum.InsufficientTokens);
        }

        // Recupera tutte le aree vietate
        const restrictedAreas = await this.restrictedAreaRepository.listAllAreas();
        const route = createLineStringFromCoords(plan.waypoints);

        // Controlla se la rotta attraversa aree vietate
        for (const area of restrictedAreas) {
            const boundingBox = createBoundingBoxPolygon(area.topLeft, area.bottomRight);
            if (!isRouteOutsideBox(route, boundingBox)) {
                throw errorFactory.getError(ErrEnum.RouteRestricted);
            }
        }

        // Scala il costo token all'utente
        await this.userRepository.updateUser(userId, {
            tokens: user.tokens - TokenCosts.CREATE_PLAN
        });

        // Assegna l'utente al piano e salva
        plan.userId = userId;
        const createdPlan = await this.navigationPlanRepository.createPlan(plan);
        return createdPlan;
    }

    /**
     * Annulla un piano di navigazione (soft delete: imposta lo stato su CANCELLED).
     * 
     * @param id ID del piano.
     * @param userId ID dell'utente che richiede la cancellazione.
     * @throws PlanNotFound, Unauthorized, CannotCancelPlan
     */
    async deleteNavigationPlan(id: string, userId: string): Promise<INavigationPlan> {
        const errorFactory = new ErrorFactory();

        // Recupera il piano
        const plan = await this.navigationPlanRepository.getPlanById(id);
        if (!plan) {
            throw errorFactory.getError(ErrEnum.PlanNotFound);
        }

        // Verifica che l'utente sia il proprietario
        if (plan.userId !== userId) {
            throw errorFactory.getError(ErrEnum.Unauthorized);
        }

        // Solo piani in stato PENDING possono essere annullati
        if (plan.status !== StatusNavigation.PENDING) {
            throw errorFactory.getError(ErrEnum.CannotCancelPlan);
        }

        // Aggiorna lo stato a CANCELLED
        const updatedPlan = await this.navigationPlanRepository.updatePlan(id, {
            status: StatusNavigation.CANCELLED
        });

        return updatedPlan!;
    }

    /**
     * Aggiorna lo stato di un piano di navigazione (es. APPROVED, REJECTED).
     * 
     * Se lo stato è REJECTED, salva anche il motivo.
     * 
     * @param id ID del piano.
     * @param status Nuovo stato.
     * @param reason Facoltativo, motivo del rifiuto.
     * @throws PlanNotFound, PlanNotEditableStatus
     */
    async updatePlanStatus(id: string, status: StatusNavigation, reason?: string): Promise<INavigationPlan> {
        const errorFactory = new ErrorFactory();

        // Recupera il piano
        const plan = await this.navigationPlanRepository.getPlanById(id);
        if (!plan) {
            throw errorFactory.getError(ErrEnum.PlanNotFound);
        }

        // Solo i piani ancora PENDING possono essere aggiornati
        if (plan.status !== StatusNavigation.PENDING) {
            throw errorFactory.getError(ErrEnum.PlanNotEditableStatus);
        }

        // Costruzione dinamica del payload di aggiornamento
        const updatedData: Partial<INavigationPlan> = {
            status,
            ...(status === StatusNavigation.REJECTED && { rejectionReason: reason ?? "" })
        };

        const updatedPlan = await this.navigationPlanRepository.updatePlan(id, updatedData);
        return updatedPlan!;
    }

    /**
     * Recupera i piani di navigazione filtrati tramite query dinamica.
     * 
     * Filtri supportati:
     * - Date (from / to su startDate)
     * - Stato
     * - UserId
     * 
     * @param query Parametri di filtro.
     * @returns Lista di piani filtrati.
     * @throws NoNavigationPlansFound se nessun piano corrisponde ai filtri.
     */
    async getNavigationPlan(query: INavigationPlanQuery): Promise<INavigationPlan[]> {
        const errorFactory = new ErrorFactory();

        // Costruzione filtro dinamico
        const filter: FilterQuery<INavigationPlan> = {
            
            // Se query.status esiste, aggiungiamo la proprietà "status: query.status"
            ...(query.status && { status: query.status }),

            // Se query.userId esiste, aggiungiamo "userId: query.userId"
            ...(query.userId && { userId: query.userId }),

            // Gestione dinamica del range date (startDate)
            ...(query.from || query.to
                ? {
                    startDate: {
                        // Se esiste query.from, aggiungiamo il filtro $gte (maggiore o uguale)
                        ...(query.from && { $gte: new Date(query.from) }),
                        // Se esiste query.to, aggiungiamo il filtro $lte (minore o uguale)
                        ...(query.to && { $lte: new Date(query.to) })
                    }
                }
                : {} // Se né from né to esistono, non aggiungiamo nulla per startDate
            )
        };

        // Esecuzione query con filtro costruito dinamicamente
        const navigationPlans = await this.navigationPlanRepository.getPlans(filter);

        // Se nessun piano trovato, generiamo l'errore specifico
        if (navigationPlans.length === 0) {
            throw errorFactory.getError(ErrEnum.NoNavigationPlansFound);
        }

        return navigationPlans;
    }
}
