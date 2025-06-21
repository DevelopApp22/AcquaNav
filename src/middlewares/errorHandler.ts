import { NextFunction, Response } from 'express';
import { Request} from "express";
/**
 * Middleware `errorHandler`
 *
 * Gestisce tutti gli errori lanciati nel flusso Express e li restituisce
 * in un formato standardizzato. Si aspetta che l'errore abbia il metodo `getErrorResponse()`,
 * tipico di una classe `AppError` personalizzata.
 *
 * Se il metodo non è presente, gestisce l’errore come generico 500.
 *
 * @param err Errore catturato (idealmente un'istanza di AppError)
 * @param req Richiesta HTTP (non usata direttamente)
 * @param res Risposta HTTP
 * @param next Funzione per il middleware successivo (non usata qui)
 */
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
   const error= err.getErrorResponse()
   res.status(error.status).json({
    error: error.msg,
  });
};

export default errorHandler;