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
