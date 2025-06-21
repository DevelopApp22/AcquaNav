import { IRestrictedArea } from "../model/restrictedArea.interface";
import { RestrictedAreaDao } from "../dao/restricted_area_dao";
import { Waypoint } from "../types/waypoint";

/**
 * Classe `RestrictedAreaRepository`
 *
 * Rappresenta il livello di astrazione tra il DAO (`RestrictedAreaDao`) e il resto dell'applicazione.
 * Espone i metodi principali per la gestione delle aree geografiche ristrette, delegando le operazioni
 * di accesso al database al rispettivo DAO.
 *
 */

export class RestrictedAreaRepository {
  constructor(private restrictedAreaDao: RestrictedAreaDao) {}

  /**
   * Registra una nuova area ristretta nel sistema.
   * @param areaData Dati dell'area da creare.
   * @returns L'area creata.
   */
  async createArea(areaData: IRestrictedArea): Promise<IRestrictedArea> {
    return this.restrictedAreaDao.create(areaData);
  }

  /**
   * Trova un'area ristretta tramite ID univoco.
   * @param areaId Identificativo dell'area.
   * @returns L'area trovata oppure `null` se non esiste.
   */
  async findAreaById(areaId: string): Promise<IRestrictedArea | null> {
    return await this.restrictedAreaDao.getbyID(areaId);
  }

  /**
   * Trova un'area ristretta tramite ID univoco.
   * @param areaId Identificativo dell'area.
   * @returns L'area trovata oppure `null` se non esiste.
   */
  async findAreaByWaypoint(topLeft:Waypoint,bottomRight:Waypoint): Promise<IRestrictedArea | null> {
    return await this.restrictedAreaDao.getbyWaypoint(topLeft,bottomRight);
  }

  /**
   * Restituisce tutte le aree ristrette presenti nel database.
   * @returns Array di oggetti `IRestrictedArea`.
   */
  async listAllAreas(): Promise<IRestrictedArea[]> {
    return await this.restrictedAreaDao.getAll();
  }

  /**
   * Aggiorna i dati di un'area esistente.
   * @param areaId Identificativo dell'area da modificare.
   * @param updatedData Campi aggiornati dell'area.
   * @returns L'area aggiornata oppure `null` se non trovata.
   */
  async updateArea(areaId: string, updatedData: Partial<IRestrictedArea>): Promise<IRestrictedArea | null> {
    return await this.restrictedAreaDao.update(areaId, updatedData);
  }

  /**
   * Rimuove un'area ristretta dal sistema.
   * @param areaId ID dell'area da eliminare.
   */
  async removeArea(areaId: string): Promise<void> {
    await await this.restrictedAreaDao.delete(areaId);
  }
}