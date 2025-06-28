import { ObjectId } from "mongoose";
import { StatusNavigation } from "../enum/statusNavigation";
import { Waypoint } from "../types/waypoint";

/**
 * Interfaccia `INavigationPlan`
 *
 * Descrive la struttura logica di un piano di navigazione.
 * Ogni piano è associato a un utente e contiene:
 * - l'identificativo della barca,
 * - una lista di waypoint che compongono la rotta,
 * - data/ora di inizio e fine navigazione,
 * - stato della richiesta,
 * - eventuale motivazione in caso di rifiuto,
 * - data di creazione.
 */
export interface INavigationPlan {
  id:string | ObjectId;
  userId: string | ObjectId;
  boatId: string;
  waypoints: Waypoint[];
  startDate: Date;
  endDate: Date;
  status: StatusNavigation;
  rejectionReason?: string;
}

