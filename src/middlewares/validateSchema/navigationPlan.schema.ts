import { z } from "zod";
import { ErrorMessages } from "../../factory/error/errorMessages";
import { addHours, isAfter } from "date-fns";
import { DateTime } from 'luxon';


/**
 * Schema isoDateString 
 * Validare una stringa in formato ISO 8601.
 * La validazione utilizza Luxon per verificare che la stringa rappresenti una data valida.
 */
export const isoDateString = z.string().refine(val => {
  // Tenta di effettuare il parsing della stringa come data ISO 8601
  const dt = DateTime.fromISO(val, { setZone: true });

  // Restituisce true se la stringa rappresenta una data valida secondo Luxon
  return dt.isValid;
}, {
  // Messaggio di errore restituito da Zod se la validazione fallisce
  message: 'Formato data non valido (ISO 8601 richiesto)',
});





/**
 * Schema `waypointSchema`
 *
 * Rappresenta una coordinata geografica.
 * - `lat`: latitudine compresa tra -90 e 90
 * - `lon`: longitudine compresa tra -180 e 180
 */

export const waypointSchema = z.object({
  lat: z.number().min(-90,ErrorMessages.LATITUDE_TOO_LOW).max(90,ErrorMessages.LONGITUDE_TOO_HIGH),
  lon: z.number().min(-180,ErrorMessages.LONGITUDE_TOO_LOW).max(180,ErrorMessages.LONGITUDE_TOO_HIGH),
}).strict();

/**
 * Schema `navigationPlanSchema`
 *
 * Valida i dati necessari per creare un piano di navigazione.
 * I messaggi di errore sono centralizzati tramite `ErrorMessages`.
 *
 * Campi validati:
 * - `boatId`: esattamente 10 caratteri.
 * - `waypoints`: array di almeno 2 coordinate; il primo e l'ultimo devono coincidere.
 * - `startDate`: stringa ISO valida (es. "2025-06-01T12:00:00Z").
 * - `endDate`: stringa ISO valida.
 *
 * Vincoli aggiuntivi:
 * - Il primo e l'ultimo waypoint devono essere uguali, per garantire che il percorso
 *   sia chiuso (ritorno al punto di partenza).
 * - `startDate` deve essere uguale o precedente a `endDate`.
 *
 * Qualsiasi proprietà extra nell'oggetto verrà rifiutata grazie a `.strict()`.
 */
export const navigationPlanSchema = z.object({
  boatId: z.string()
    .length(10, ErrorMessages.BOAT_ID_INVALID_LENGTH),

  waypoints: z.array(waypointSchema)
    .refine((wps) =>
      wps.length >= 2 &&
      wps[0].lat === wps[wps.length - 1].lat &&
      wps[0].lon === wps[wps.length - 1].lon,
      ErrorMessages.WAYPOINTS_MUST_START_AND_END_SAME
    ),

  startDate: isoDateString,
  endDate: isoDateString,

}).strict()
  // Check: startDate <= endDate
  .refine((data) => {
    return new Date(data.startDate) <= new Date(data.endDate);
  },ErrorMessages.START_DATE_AFTER_END_DATE)
  .refine((data) => {
    const now = new Date();
    const minStartDate = addHours(now, 48);
    return isAfter(new Date(data.startDate), minStartDate);
  },ErrorMessages.INVALID_START_DATE);
