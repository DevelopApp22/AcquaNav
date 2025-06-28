import { Waypoint } from "../types/waypoint";
/**
 * Interfaccia `IRestrictedArea`
 *
 * Rappresenta un'area geografica ristretta definita da due coordinate:
 * - `topLeft`: punto in alto a sinistra dell'area, come coppia [longitudine, latitudine],
 * - `bottomRight`: punto in basso a destra dell'area, come coppia [longitudine, latitudine].
 *
 * Questa struttura viene utilizzata per identificare zone vietate o soggette a restrizioni
 * all'interno di un sistema di navigazione o controllo del territorio.
 */

export interface IRestrictedArea {
  topLeft: Waypoint;
  bottomRight: Waypoint;
}
