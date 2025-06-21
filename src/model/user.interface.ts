/**
 * Enum `UserRole`
 *
 * Definisce i ruoli consentiti nel sistema:
 * - USER: utente standard che può inviare richieste di piani di navigazione.
 * - OPERATOR: operatore autorizzato a gestire le richieste e le aree vietate.
 * - ADMIN: amministratore con privilegi estesi (es. ricarica dei token).
 */
export enum UserRole {
  USER = 'user',
  OPERATOR = 'operator',
  ADMIN = 'admin',
}

/**
 * Interfaccia `IUser`
 *
 * Rappresenta la struttura logica di un utente nel sistema.
 * Estende `Document` di Mongoose per essere compatibile con le operazioni del database.
 *
 * @property role   Il ruolo dell'utente: può essere 'user', 'operator' o 'admin'.
 * @property tokens Il numero di token posseduti dall'utente, utilizzati per pagare le richieste.
 */

export interface IUser{
  id:string,
  email:string,
  password:string,
  role: UserRole;
  tokens? : number;
}