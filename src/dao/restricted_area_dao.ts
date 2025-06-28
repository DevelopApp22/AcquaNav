import { IRestrictedArea } from "../model/restrictedArea.interface";
import RestrictedArea from "../model/schema/restrictedArea_model";
import { Waypoint } from "../types/waypoint";
import { IDao } from "./idao.interface";
/**
 * Classe `RestrictedAreaDao`
 *
 * Implementa l'interfaccia generica `IDao` per la gestione dei dati relativi alle aree geografiche ristrette.
 * Fornisce operazioni CRUD per interagire con la collezione `RestrictedArea` su MongoDB tramite Mongoose.
 */
export class RestrictedAreaDao implements IDao<IRestrictedArea> {

    /**
     * Crea e salva una nuova area ristretta nel database.
     * @param restrictedArea Oggetto `IRestrictedArea` da inserire.
     * @returns L'area ristretta creata.
     */
    async create(restrictedArea: IRestrictedArea): Promise<IRestrictedArea> {
        return await RestrictedArea.create(restrictedArea);
    }

    /**
     * Recupera un'area ristretta tramite identificativo univoco.
     * @param restrictedAreaId Identificativo univoco dell'area.
     * @returns L'area trovata, oppure `null` se non esiste.
     */
    async getbyID(restrictedAreaId: string): Promise<IRestrictedArea | null> {
        return await RestrictedArea.findById(restrictedAreaId);
    }

    /**
     * Restituisce l'elenco completo delle aree ristrette.
     * @returns Array di oggetti `IRestrictedArea`.
     */
    async getAll(): Promise<IRestrictedArea[]> {
        return await RestrictedArea.find();
    }

    /**
     * Recupera un'area ristretta che contiene i waypoint specificati.
     * @param topLeft Coordinata superiore sinistra.
     * @param bottomRight Coordinata inferiore destra.
     * @returns L'area trovata, oppure `null` se non esiste.
     */
    async getbyWaypoint(topLeft: Waypoint, bottomRight: Waypoint): Promise<IRestrictedArea | null> {
        return await RestrictedArea.findOne({ topLeft, bottomRight });
    }

    /**
     * Aggiorna i dati di un'area ristretta esistente.
     * @param restrictedAreaId Identificativo dell'area da aggiornare.
     * @param updatedFields Oggetto parziale contenente i campi da aggiornare.
     * @returns L'area aggiornata, oppure `null` se non trovata.
     */
    async update(restrictedAreaId: string, updatedFields: Partial<IRestrictedArea>): Promise<IRestrictedArea | null> {
        return await RestrictedArea.findByIdAndUpdate(
            restrictedAreaId,
            updatedFields,
            {
                new: true,
                runValidators: true // Applica le validazioni anche sugli update
            }
        );
    }

    /**
     * Elimina un'area ristretta dal database.
     * @param restrictedAreaId Identificativo dell'area da eliminare.
     */
    async delete(restrictedAreaId: string): Promise<void> {
        await RestrictedArea.findByIdAndDelete(restrictedAreaId);
    }
}
