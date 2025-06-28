import { IRestrictedArea } from "../model/restrictedArea.interface";
import { RestrictedAreaDao } from "../dao/restricted_area_dao";
import { Waypoint } from "../types/waypoint";

/**
 * Classe `RestrictedAreaRepository`
 *
 * Repository che funge da livello di astrazione tra il DAO (`RestrictedAreaDao`) e il resto dell'applicazione.
 * Espone i metodi principali per la gestione delle aree geografiche ristrette, delegando le operazioni
 * di persistenza al DAO.
 */
export class RestrictedAreaRepository {

  /**
   * Inizializza il repository con un'istanza di DAO.
   * @param restrictedAreaDao DAO per la gestione della persistenza delle aree ristrette.
   */
  constructor(private restrictedAreaDao: RestrictedAreaDao) {}

  /**
   * Crea e registra una nuova area ristretta.
   * @param restrictedArea Oggetto contenente i dati della nuova area.
   * @returns L'istanza dell'area ristretta creata.
   */
  async createArea(restrictedArea: IRestrictedArea): Promise<IRestrictedArea> {
    return await this.restrictedAreaDao.create(restrictedArea);
  }

  /**
   * Recupera un'area ristretta tramite ID univoco.
   * @param restrictedAreaId Identificativo univoco dell'area.
   * @returns L'area trovata, oppure `null` se non esiste.
   */
  async findAreaById(restrictedAreaId: string): Promise<IRestrictedArea | null> {
    return await this.restrictedAreaDao.getbyID(restrictedAreaId);
  }

  /**
   * Cerca un'area ristretta che contenga il rettangolo definito da due waypoint.
   * @param topLeft Waypoint superiore sinistro.
   * @param bottomRight Waypoint inferiore destro.
   * @returns L'area trovata, oppure `null` se non esiste.
   */
  async findAreaByWaypoint(topLeft: Waypoint, bottomRight: Waypoint): Promise<IRestrictedArea | null> {
    return await this.restrictedAreaDao.getbyWaypoint(topLeft, bottomRight);
  }

  /**
   * Restituisce tutte le aree ristrette presenti nel sistema.
   * @returns Array di oggetti `IRestrictedArea`.
   */
  async listAllAreas(): Promise<IRestrictedArea[]> {
    return await this.restrictedAreaDao.getAll();
  }

  /**
   * Aggiorna una specifica area ristretta.
   * @param restrictedAreaId Identificativo univoco dell'area da aggiornare.
   * @param restrictedArea Dati aggiornati (parziali) dell'area.
   * @returns L'area aggiornata, oppure `null` se non trovata.
   */
  async updateArea(restrictedAreaId: string, restrictedArea: Partial<IRestrictedArea>): Promise<IRestrictedArea | null> {
    return await this.restrictedAreaDao.update(restrictedAreaId, restrictedArea);
  }

  /**
   * Elimina un'area ristretta dal sistema.
   * @param restrictedAreaId Identificativo univoco dell'area da eliminare.
   */
  async removeArea(restrictedAreaId: string): Promise<void> {
    await this.restrictedAreaDao.delete(restrictedAreaId);
  }
}
