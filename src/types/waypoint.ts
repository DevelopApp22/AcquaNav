/**
 * Tipo `Waypoint`
 *
 * Rappresenta una coordinata geografica con longitudine e latitudine.
 * Utilizzato per definire punti su una mappa o in un percorso di navigazione.
 *
 * @property lon Longitudine (valori validi: -180 a +180)
 * @property lat Latitudine (valori validi: -90 a +90)
 */
export type Waypoint = {
  lat: number;
  lon: number;
};