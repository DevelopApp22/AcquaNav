import { IRestrictedArea } from "../model/restrictedArea.interface";
import RestrictedArea from "../model/schema/restrictedArea_model";
import { Waypoint } from "../types/waypoint";
import { IDao } from "./idao.interface";
/**
 * Classe `RestrictedAreaDao`
 *
 * Implementa l'interfaccia generica `IDao` per la gestione dei dati relativi alle aree geografiche ristrette.
 * Fornisce i metodi CRUD per interagire con il modello `RestrictedArea` salvato in MongoDB tramite Mongoose.
 * 
 */

export class RestrictedAreaDao implements IDao<IRestrictedArea>{

    /**
     * Crea e salva una nuova area ristretta nel database.
     * @param item Oggetto `IRestrictedArea` da inserire.
     * @returns L'area creata.
     */
    async create(item: IRestrictedArea): Promise<IRestrictedArea> {
        const restricted_area = await RestrictedArea.create(item);
        return restricted_area;
    }

    /**
     * Recupera un'area ristretta in base all'identificativo univoco.
     * @param id Identificativo dell'area.
     * @returns L'area trovata o `null` se non esiste.
     */
    async getbyID(id: string): Promise<IRestrictedArea | null> {
        const restricted_area = await RestrictedArea.findById(id);
        return restricted_area;
    }

    /**
     * Restituisce l'elenco completo di tutte le aree ristrette presenti nel database.
     * @returns Array di oggetti `IRestrictedArea`.
     */
    async getAll(): Promise<IRestrictedArea[]> {
        const restricted_area = await RestrictedArea.find();
        return restricted_area;
    }

      /**
     * Restituisce l'elenco completo di tutte le aree ristrette presenti nel database.
     * @returns Array di oggetti `IRestrictedArea`.
     */
    async getbyWaypoint(topLeft:Waypoint,bottomRight:Waypoint): Promise<IRestrictedArea|null> {
        const restricted_area = await RestrictedArea.findOne({topLeft,bottomRight});
        return restricted_area;
    }

    /**
     * Aggiorna un'area ristretta esistente in base all'ID fornito.
     * @param id Identificativo dell'area da aggiornare.
     * @param item Oggetto parziale con i campi da modificare.
     * @returns L'area aggiornata o `null` se non trovata.
     */
    async update(id: string, item: Partial<IRestrictedArea>): Promise<IRestrictedArea | null> {
        const restricted_area = await RestrictedArea.findByIdAndUpdate(id, item, { new: true });
        return restricted_area;
    }

    /**
     * Elimina un'area ristretta dal database in base all'identificativo.
     * @param id Identificativo dell'area da eliminare.
     */
    async delete(id: string): Promise<void> {
        await RestrictedArea.findByIdAndDelete(id);
    }
}
