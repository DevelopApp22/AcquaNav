import { INavigationPlan } from "../model/navigationPlan.interface";
import { IDao } from "./idao.interface";
import { NavigationPlan } from "../model/schema/navigationPlan_model";
import { INavigationPlanQuery } from "../types/navigationPlanQuery";

/**
 * Implementazione concreta del DAO (Data Access Object) per la gestione
 * dei piani di navigazione. Fornisce metodi CRUD e query personalizzate
 * usando Mongoose.
 */

export class NavigationPlanDao implements IDao<INavigationPlan> {

    constructor() {}

    /**
     * Crea un nuovo piano di navigazione nel database.
     * @param item Oggetto `INavigationPlan` da salvare.
     * @returns Il piano di navigazione appena creato.
     */
    async create(item: INavigationPlan): Promise<INavigationPlan> {
        const navigatio_plan : INavigationPlan = await NavigationPlan.create(item);
        return navigatio_plan;
    }

    /**
     * Recupera un piano di navigazione in base al suo ID.
     * @param id Identificativo univoco del piano.
     * @returns Il piano trovato oppure `null` se non esiste.
     */
    async getbyID(id: string): Promise<INavigationPlan | null> {
        const navigatio_plan  : INavigationPlan|null = await NavigationPlan.findById(id);
        return navigatio_plan;
    }

    /**
     * Recupera tutti i piani di navigazione presenti nel database.
     * @returns Array contenente tutti i piani.
     */
    async getAll(): Promise<INavigationPlan[]> {
        const navigatio_plan : INavigationPlan[] = await NavigationPlan.find();
        return navigatio_plan;
    }

    /**
     * Aggiorna parzialmente un piano di navigazione tramite il suo ID.
     * @param id ID del piano da aggiornare.
     * @param item Oggetto contenente solo i campi da modificare.
     * @returns Il piano aggiornato oppure `null` se non trovato.
     */
    async update(id: string, item: Partial<INavigationPlan>): Promise<INavigationPlan | null> {
        const navigation_plan : INavigationPlan|null = await NavigationPlan.findByIdAndUpdate(id, item, { new: true });
        return navigation_plan;
    }

    /**
     * Elimina un piano di navigazione dal database.
     * @param id ID del piano da eliminare.
     */
    async delete(id: string): Promise<void> {
        await NavigationPlan.findByIdAndDelete(id);
    }

    /**
     * Recupera i piani di navigazione filtrati in base a una query personalizzata.
     * @param query Oggetto che rappresenta i criteri di filtro (es. stato, date).
     * @returns Lista dei piani che soddisfano i criteri.
     */
    async findFilteredPlans(query: INavigationPlanQuery): Promise<INavigationPlan[]> {
        const navigatio_plan : INavigationPlan[]= await NavigationPlan.find(query);
        return navigatio_plan;
    }
}
