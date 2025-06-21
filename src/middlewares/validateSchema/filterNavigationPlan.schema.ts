import { z } from "zod";
import { StatusNavigation } from "../../model/navigationPlan.interface";
import { isoDateString } from "./navigationPlan.schema";
import { ExportFormat } from "../../enum/exportFormat";
import { UserRole } from "../../model/user.interface";


/**
 * Generatore dinamico di schema Zod per la validazione dei filtri
 * nella ricerca dei piani di navigazione, differenziato per ruolo utente.
 *
 * @param role Ruolo dell’utente (USER o OPERATOR)
 * @returns Uno schema Zod personalizzato in base al ruolo
 */
export const getFilterNavigationSchema = (role: UserRole) => {
  
  
  // Gli operatori possono filtrare solo per stato (`status`)
  if (role === UserRole.OPERATOR) {
    return z.object({
      status: z.nativeEnum(StatusNavigation).optional(), 
    }).strict();
  }
  // Gli utenti possono utilizzare più filtri opzionali:
  // - status: stato del piano
  // - from/to: intervallo di date (su startDate)
  // - format: tipo di esportazione (es. JSON, PDF)
  return z.object({
    status: z.nativeEnum(StatusNavigation).optional(),
    from: isoDateString.optional(),
    to: isoDateString.optional(),
    format: z.nativeEnum(ExportFormat).optional(),
  }).strict().refine(data => {
      if (data.from && data.to) {
        return new Date(data.from) <= new Date(data.to);
      }
      return true;
    });

};