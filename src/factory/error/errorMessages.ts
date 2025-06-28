/**
 * Modulo `ErrorMessages`
 * 
 * Contiene un oggetto costante `ErrorMessages` che raccoglie tutti i messaggi
 * di errore standardizzati utilizzati all'interno dell'applicazione.
 * 
 * Ogni chiave rappresenta un identificatore semantico di un tipo di errore,
 * mentre il valore è una stringa leggibile destinata al client.
 * 
 * Questo file è pensato per:
 * - Centralizzare e uniformare i messaggi di errore,
 * - Evitare stringhe hardcoded sparse nel codice,
 * 
 * Esempi di uso:
 * - All'interno di classi error wrapper (es. `MissingTokenError`)
 * - In factory o middleware che generano risposte HTTP
 */

export const ErrorMessages = {

  // Headers & Payload
  NO_AUTH_HEADER: "Bad Request - No authorization header", // Mancanza dell'header Authorization
  NO_PAYLOAD_HEADER: "Bad Request - No JSON payload header", // Mancanza di header Content-Type: application/json
  MISSING_TOKEN: "Bad Request - Missing JWT Token", // Token JWT assente nella richiesta
  INVALID_TOKEN: "Forbidden - Invalid JWT Token", // Token JWT malformato, scaduto o non valido
  MALFORMED_PAYLOAD: "Bad Request - Malformed payload", // Il corpo della richiesta non ha il formato previsto (es. JSON errato)

  // HTTP Standard Errors
  UNAUTHORIZED: "ERROR - Unauthorized", // Autenticazione richiesta ma non fornita o fallita
  FORBIDDEN: "ERROR - Forbidden", // Autenticazione valida ma l’utente non ha i permessi per accedere alla risorsa
  NOT_FOUND: "ERROR - Not found", // Risorsa non trovata
  INTERNAL_SERVER_ERROR: "ERROR - Internal server error", // Errore generico lato server (es. eccezione non gestita)
  SERVICE_UNAVAILABLE: "ERROR - Service unavailable", // Servizio temporaneamente non disponibile (es. manutenzione)
  BAD_REQUEST: "ERROR - Bad request: missing or malformed input parameters",
  ROUTE_NOT_FOUND: "Not Found - Route not found", // Endpoint non esistente (es. URL sbagliato)

  USER_NOT_FOUND: "ERROR - User not found",
  FORBIDDEN_ROLE: "ERROR - Operation not allowed: only users with role 'USER' can perform this action",
  INSUFFICIENT_TOKENS: "ERROR - User does not have enough tokens",
  INVALID_TOKEN_AMOUNT: "ERROR - Token amount must be greater than 0",
  
  INVALID_EMAIL_FORMAT: "ERROR - Email does not match the required format",

  RESTRICTED_AREA_NOT_FOUND: "ERROR - Restricted area not found",
  RESTRICTED_AREA_ALREADY_EXISTS: "ERROR - A restricted area with the same coordinates already exists",
  NO_RESTRICTED_AREAS_FOUND: "ERROR - No restricted areas found",
  
  INVALID_START_DATE: "ERROR - The start date must be at least 48 hours in the future",
  ROUTE_RESTRICTED: "ERROR - The selected route passes through a restricted or prohibited area",

  PLAN_NOT_FOUND: "ERROR - Navigation plan  not found",
  NO_NAVIGATION_PLANS_FOUND: "ERROR - No navigation plans found",
  CANNOT_CANCEL_PLAN: "ERROR - The navigation plan cannot be cancelled at its current state",
  PLAN_ALREADY_CANCELLED: "ERROR - The navigation plan cannot be modified because it has been cancelled",
  PLAN_STATUS_NOT_EDITABLE: "ERROR - The navigation plan cannot be modified in its current status",
  
  INVALID_OBJECT_ID_FORMAT: "ERROR - Provided ID is not in a valid ObjectId format",
  INVALID_DATE_FORMAT: "ERROR - Date must be in ISO 8601 format (e.g., 2025-06-13T15:30:00Z)",
  LATITUDE_TOO_LOW: "ERROR - Latitude cannot be less than -90",
  LATITUDE_TOO_HIGH: "ERROR - Latitude cannot be greater than 90",
  LONGITUDE_TOO_LOW: "ERROR - Longitude cannot be less than -180",
  LONGITUDE_TOO_HIGH: "ERROR - Longitude cannot be greater than 180",
  BOAT_ID_INVALID_LENGTH: "ERROR - boatId must be exactly 10 characters long",
  WAYPOINTS_MUST_START_AND_END_SAME: "ERROR - The first and last waypoint must be the same",
  START_DATE_AFTER_END_DATE: "ERROR - 'startDate' cannot be after 'endDate'",
  INVALID_CREDENTIALS: "ERROR - Invalid email or password",
};