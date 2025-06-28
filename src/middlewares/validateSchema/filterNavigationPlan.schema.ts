import { z } from "zod";
import { isoDateString } from "./navigationPlan.schema";
import { ExportFormat } from "../../enum/exportFormat";
import { UserRole } from "../../enum/userRole";
import { StatusNavigation } from "../../enum/statusNavigation";



/**
 * Generatore dinamico di schema Zod per la validazione dei filtri
 * nella ricerca dei piani di navigazione, differenziato per ruolo utente.
 *
 * @param role Ruolo dell’utente (USER o OPERATOR)
 * @returns Uno schema Zod personalizzato in base al ruolo
 */
export const filterNavigationSchema  = z.object({
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
