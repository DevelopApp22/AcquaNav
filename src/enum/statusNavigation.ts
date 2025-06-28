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
