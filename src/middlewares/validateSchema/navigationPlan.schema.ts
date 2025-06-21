import { z } from "zod";
import { ErrorMessages } from "../../factory/error/errorMessages";
import { addHours, isAfter } from "date-fns";

/**
 * Schema `isoDateString`
 *
 * Valida che la stringa sia una data valida in formato ISO 8601.
 * Esempio valido: `'2025-06-01T00:00:00Z'`
 */
export const isoDateString = z.string().refine(val => !isNaN(Date.parse(val)), {
  message: ErrorMessages.INVALID_DATE_FORMAT,
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
