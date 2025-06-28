import { NavigationPlanDao } from "../dao/navigation_plan_dao";
import { INavigationPlan, } from "../model/navigationPlan.interface";
import { INavigationPlanQuery } from "../types/navigationPlanQuery";

/**
 * Classe `NavigationPlanRepository`
 *
 * Repository che fornisce un livello di astrazione tra il DAO (`NavigationPlanDao`) e il resto dell'applicazione.
 * Incapsula la logica di accesso ai dati per la gestione dei piani di navigazione, centralizzando le operazioni CRUD.
 */
export class NavigationPlanRepository {

    /**
     * Costruttore del repository.
     * @param navigationPlanDao DAO incaricato della persistenza dei piani di navigazione.
     */
    constructor(private navigationPlanDao: NavigationPlanDao) {}

    /**
     * Crea un nuovo piano di navigazione.
     * @param navigationPlan Oggetto contenente i dati del piano da creare.
     * @returns Il piano di navigazione appena creato.
     */
    async createPlan(navigationPlan: INavigationPlan): Promise<INavigationPlan> {
        return await this.navigationPlanDao.create(navigationPlan);
    }

    /**
     * Recupera un piano di navigazione tramite identificativo univoco.
     * @param planId Identificativo univoco del piano.
     * @returns Il piano trovato, oppure `null` se non esiste.
     */
    async getPlanById(planId: string): Promise<INavigationPlan | null> {
        return await this.navigationPlanDao.getbyID(planId);
    }

    /**
     * Restituisce tutti i piani di navigazione esistenti.
     * @returns Lista completa dei piani di navigazione.
     */
    async getAllPlans(): Promise<INavigationPlan[]> {
        return await this.navigationPlanDao.getAll();
    }

    /**
     * Aggiorna i dati di un piano di navigazione esistente.
     * @param planId Identificativo del piano da aggiornare.
     * @param updatedFields Oggetto parziale con i campi da aggiornare.
     * @returns Il piano aggiornato, oppure `null` se non trovato.
     */
    async updatePlan(planId: string, updatedFields: Partial<INavigationPlan>): Promise<INavigationPlan | null> {
        return await this.navigationPlanDao.update(planId, updatedFields);
    }

    /**
     * Elimina un piano di navigazione dal sistema.
     * @param planId Identificativo del piano da eliminare.
     */
    async deletePlan(planId: string): Promise<void> {
        await this.navigationPlanDao.delete(planId);
    }

    /**
     * Recupera i piani di navigazione filtrati secondo i criteri specificati.
     * I filtri disponibili includono: stato, intervallo di date, utente proprietario.
     * @param filterQuery Oggetto contenente i criteri di ricerca.
     * @returns Lista di piani di navigazione che soddisfano i criteri forniti.
     */
    async getPlans(filterQuery: INavigationPlanQuery): Promise<INavigationPlan[]> {
        return await this.navigationPlanDao.findFilteredPlans(filterQuery);
    }
}
