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
  id:string;
  userId: string;
  boatId: string;
  waypoints: Waypoint[];
  startDate: Date;
  endDate: Date;
  status: StatusNavigation;
  rejectionReason?: string;
}

/**
 * Enum `StatusNavigation`
 *
 * Definisce tutti gli stati possibili per una richiesta di piano di navigazione.
 *
 * @property PENDING   La richiesta è stata creata dall’utente ed è in attesa di valutazione.
 * @property ACCEPTED  La richiesta è stata approvata da un operatore.
 * @property REJECTED  La richiesta è stata rifiutata da un operatore (con motivazione associata).
 * @property CANCELLED La richiesta è stata annullata dall’utente prima della valutazione.
 */
export enum StatusNavigation {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled'
}
