import { NextFunction, Response } from 'express';
import { Request} from "express";

import { ErrEnum } from '../factory/error/error_enum';
import { ErrorFactory } from '../factory/error/error_factory';
import { StatusCodes } from 'http-status-codes';
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
const errorHandler = (err: Error | ErrorResponse, req: Request, res: Response, next: NextFunction) => {
    
    let statusCode: StatusCodes;
    let message: string;
    const errorFactory = new ErrorFactory

    if (err instanceof Error) {
        console.error(err); // in produzione sostituire con logger centralizzato
        const internalError = errorFactory.getError(ErrEnum.InternalServerError)
        const error = internalError.getErrorResponse();
        statusCode = error.status;
        message = error.msg;
    }

    else {
      const error = err.getErrorResponse();
      statusCode=error.status;
      message=error.msg;
    }

    // Restituisce la risposta HTTP uniforme
    res.status(statusCode).json({
        error: message,
    });
};

export default errorHandler;
