import { UserRole } from "../enum/userRole";


/**
 * Interfaccia `UserPayload`
 *
 * Rappresenta il contenuto del payload di un utente autenticato (es. decodificato da un JWT).
 * Viene comunemente associato alla proprietà `req.user` nei middleware di autenticazione.
 *
 * @property id Identificativo univoco dell’utente
 * @property role Ruolo dell’utente (es. USER, ADMIN, OPERATOR)
 */
export interface UserPayload {
  id: string;
  role: UserRole;
}