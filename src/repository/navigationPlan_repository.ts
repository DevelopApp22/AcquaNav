import { NavigationPlanDao } from "../dao/navigation_plan_dao";
import { INavigationPlan, } from "../model/navigationPlan.interface";
import { INavigationPlanQuery } from "../types/navigationPlanQuery";

/**
 * Classe `NavigationPlanRepository`
 *
 * Rappresenta il livello di astrazione tra il DAO (`NavigationPlanDao`) e il resto dell'applicazione.
 * Espone i metodi principali per la gestione dei piani di navigazione, delegando le operazioni
 * di accesso al database al rispettivo DAO.

 *
 */

export class NavigationPlanRepository {

    constructor(private navigationPlanDao: NavigationPlanDao) {}

    /**
     * Crea un nuovo piano di navigazione.
     * @param plan Oggetto da inserire nel database.
     * @returns Il piano appena creato.
     */
    async createPlan(plan: INavigationPlan): Promise<INavigationPlan> {
        return this.navigationPlanDao.create(plan);
    }

    /**
     * Recupera un piano tramite il suo ID.
     * @param id Identificativo univoco del piano.
     * @returns Il piano corrispondente oppure `null` se non esiste.
     */
    async getPlanById(id: string): Promise<INavigationPlan | null> {
        return this.navigationPlanDao.getbyID(id);
    }

    /**
     * Restituisce tutti i piani di navigazione presenti nel sistema.
     * @returns Lista completa dei piani.
     */
    async getAllPlans(): Promise<INavigationPlan[]> {
        return this.navigationPlanDao.getAll();
    }

    /**
     * Aggiorna uno o più campi di un piano di navigazione esistente.
     * @param id ID del piano da aggiornare.
     * @param updateFields Campi parziali da aggiornare.
     * @returns Il piano aggiornato oppure `null` se non esiste.
     */
    async updatePlan(id: string, updateFields: Partial<INavigationPlan>): Promise<INavigationPlan | null> {
        return this.navigationPlanDao.update(id, updateFields);
    }

    /**
     * Elimina un piano di navigazione tramite il suo ID.
     * @param id ID del piano da eliminare.
     */
    async deletePlan(id: string): Promise<void> {
        await this.navigationPlanDao.delete(id);
    }

    /**
     * Recupera tutti i piani filtrati per utente e query opzionale.
     * I filtri possibili sono: stato, data inizio dopo/prima.
     * @param userId ID dell'utente proprietario del piano.
     * @param query Oggetto con i filtri (es. status, startAfter, startBefore).
     * @returns Lista di piani che soddisfano i criteri specificati.
     */
    async getPlans(query: INavigationPlanQuery): Promise<INavigationPlan[]> {
        return await this.navigationPlanDao.findFilteredPlans(query);
    }
}
