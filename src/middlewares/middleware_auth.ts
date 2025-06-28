import { ErrEnum } from "../factory/error/error_enum";
import { ErrorFactory } from "../factory/error/error_factory";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from 'express';
import { UserPayload } from "../types/user_payload";
import { UserRole } from "../enum/userRole";
import { verifyJwt } from "../utils/jwt";

dotenv.config();


/**
 * Middleware `checkAuthHeader`
 *
 * Verifica che la richiesta HTTP contenga l'header `Authorization`.
 * In caso contrario, inoltra un errore generato dalla `ErrorFactory`.
 *
 * @param req Richiesta HTTP in ingresso
 * @param res Risposta HTTP (non usata qui)
 * @param next Funzione per passare al middleware successivo
 */
export function checkAuthHeader(req: Request, res: Response, next: NextFunction): void {

  const authHeader: string | undefined = req.headers.authorization;
  if (authHeader) {
    next();
  } else {
    const errorFactory = new ErrorFactory();
    next(errorFactory.getError(ErrEnum.MissingAuthHeader));
  }
}
/**
 * Middleware `checkToken`
 *
 * Estrae il JWT dal campo `Authorization` dell'header (in formato `Bearer <token>`).
 * Se il token è presente, lo salva in `req.token`, altrimenti genera un errore.
 *
 * @param req Richiesta HTTP con header di autenticazione
 * @param res Risposta HTTP
 * @param next Funzione middleware successivo
 */
export function checkToken(req: Request, res: Response, next: NextFunction): void{
    const bearerHeader: string | undefined = req.headers.authorization;
    if (typeof bearerHeader !== 'undefined'){
        const bearerToken: string = bearerHeader.split(' ')[1];
        req.token = bearerToken;
        next();
        
    } else {
        const errorFactory = new ErrorFactory();
        const err = errorFactory.getError(ErrEnum.MissingToken);
        next(err);
    }
}

/**
 * Middleware `verifyAndAuthenticate`
 *
 * Verifica la validità del JWT presente in `req.token`.
 * Se valido, decodifica il payload e lo salva in `req.user`.
 * In caso di token non valido o scaduto, inoltra un errore.
 *
 * @param req Richiesta HTTP con `req.token` da verificare
 * @param res Risposta HTTP
 * @param next Funzione middleware successivo
 */
export function verifyAndAuthenticate(req: Request, res: Response, next: NextFunction): void{
    try {
        const payload= verifyJwt<UserPayload>(req.token)
        if (payload != null) {
            req.user = payload;
            next();
        }
    } catch{ 
        const errorFactory = new ErrorFactory();
        const err = errorFactory.getError(ErrEnum.InvalidToken);
        next(err); 
    }
}
/**
 * Middleware `authorizeRole`
 *
 * Verifica che l'utente autenticato abbia **almeno uno** dei ruoli ammessi per accedere alla rotta.
 * Se non autorizzato, genera un errore `Unauthorized` tramite `ErrorFactory`.
 *
 * @param allowedRoles Uno o più ruoli ammessi (es. `UserRole.ADMIN`, `UserRole.OPERATOR`)
 * @returns Un middleware Express da usare dopo l'autenticazione
 *
 * @example
 * router.get("/admin", Auth, authorizeRole(UserRole.ADMIN), controller.getAdminData);
 */
export const authorizeRole = (...allowedRoles:UserRole[]) => {

  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user; 
     // Verifica se l'utente è autenticato e ha un ruolo ammesso
    if (!user || !allowedRoles.includes(user.role)) {
      const errorFactory = new ErrorFactory();
      return next(errorFactory.getError(ErrEnum.Unauthorized));
    }
    next(); 
  };
  
};


