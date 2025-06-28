import { INavigationPlan } from "../model/navigationPlan.interface";
import { IDao } from "./idao.interface";
import { NavigationPlan } from "../model/schema/navigationPlan_model";
import { INavigationPlanQuery } from "../types/navigationPlanQuery";

/**
 * Classe `NavigationPlanDao`
 *
 * Implementazione concreta del DAO (Data Access Object) per la gestione
 * dei piani di navigazione. Fornisce metodi CRUD e query personalizzate
 * utilizzando Mongoose.
 */

export class NavigationPlanDao implements IDao<INavigationPlan> {

    constructor() {}

    /**
     * Crea un nuovo piano di navigazione nel database.
     * @param navigationPlan Oggetto `INavigationPlan` da salvare.
     * @returns Il piano di navigazione creato.
     */
    async create(navigationPlan: INavigationPlan): Promise<INavigationPlan> {
        return await NavigationPlan.create(navigationPlan);
    }

    /**
     * Recupera un piano di navigazione tramite identificativo univoco.
     * @param planId Identificativo univoco del piano.
     * @returns Il piano trovato, oppure `null` se non esiste.
     */
    async getbyID(planId: string): Promise<INavigationPlan | null> {
        return await NavigationPlan.findById(planId);
    }

    /**
     * Recupera l'elenco completo dei piani di navigazione.
     * @returns Array di piani di navigazione.
     */
    async getAll(): Promise<INavigationPlan[]> {
        return await NavigationPlan.find();
    }

    /**
     * Aggiorna parzialmente un piano di navigazione tramite il suo ID.
     * @param planId Identificativo del piano da aggiornare.
     * @param updatedFields Oggetto contenente i campi da aggiornare.
     * @returns Il piano aggiornato, oppure `null` se non trovato.
     */
    async update(planId: string, updatedFields: Partial<INavigationPlan>): Promise<INavigationPlan | null> {
        return await NavigationPlan.findByIdAndUpdate(
            planId, 
            updatedFields, 
            { 
                new: true,
                runValidators: true 
            }
        );
    }

    /**
     * Elimina un piano di navigazione dal database.
     * @param planId Identificativo del piano da eliminare.
     */
    async delete(planId: string): Promise<void> {
        await NavigationPlan.findByIdAndDelete(planId);
    }

    /**
     * Recupera i piani di navigazione filtrati secondo una query personalizzata.
     * @param filterQuery Oggetto con i criteri di filtro (es. stato, date, utente).
     * @returns Array di piani che soddisfano i criteri di ricerca.
     */
    async findFilteredPlans(filterQuery: INavigationPlanQuery): Promise<INavigationPlan[]> {
        return await NavigationPlan.find(filterQuery);
    }
}
