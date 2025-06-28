import * as AuthMiddleware from './middleware_auth';

/**
 * Array `Auth`
 *
 * Insieme di middleware Express da applicare alle rotte protette per eseguire:
 * 1. Verifica che sia presente l'Authorization header.
 * 2. Estrazione del token JWT.
 * 3. Verifica e decodifica del token tramite chiave segreta.
 *
 * Questo array può essere applicato direttamente a qualsiasi rotta che richiede autenticazione.
 *
 * 
 */
export const Auth = [
    AuthMiddleware.checkAuthHeader, 
    AuthMiddleware.checkToken, 
    AuthMiddleware.verifyAndAuthenticate
];

