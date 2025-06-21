// middleware/validate.ts
import { Request, Response, NextFunction } from "express";
import { ErrorFactory } from "../factory/error/error_factory";
import { ErrEnum } from "../factory/error/error_enum";
import { getFilterNavigationSchema } from "./validateSchema/filterNavigationPlan.schema";
import z, {ZodSchema } from "zod";
import { ValidateReq } from "../enum/validateReq";



/**
 * Middleware `validateFilterNavigationPlan`
 *
 * Valida i parametri di query (`req.query`) in base al ruolo dell’utente,
 * usando uno schema dinamico generato da `getFilterNavigationSchema`.
 */
export const validateFilterNavigationPlan = (req: Request, res: Response, next: NextFunction) => {
  const schema = getFilterNavigationSchema(req.user.role);
  const parsed = schema.safeParse(req.query);

  if (!parsed.success) {
    const errors = parsed.error.errors.map(err => ({
      field: err.path.join("."),
      message: err.message,
    }));
    console.log("Validation failed:", errors);

    const errorFactory = new ErrorFactory();
    return next(errorFactory.getError(ErrEnum.BadRequest));
  }

  next();
};


/**
 * Middleware generico `validateWithSchema`
 *
 * Permette di validare dinamicamente il contenuto di `req.body`, `req.query` o `req.params`
 * usando uno schema Zod passato come parametro.
 * 
 * Per il caso `params`, se esiste un solo parametro (es: `/:id`), estrae automaticamente il valore singolo,
 * consentendo di validare direttamente stringhe anziché oggetti.
 * 
 * @param schema Schema Zod da applicare alla validazione
 * @param source Indica da quale parte della richiesta estrarre i dati ('body', 'query', 'params')
 */
export const validateWithSchema = (schema: ZodSchema, source: ValidateReq) => {
  return (req: Request, res: Response, next: NextFunction) => {
    let dataToValidate = req[source]; // estrae i dati dalla sorgente specificata

    // Caso speciale per validare `params` con schema su singolo parametro (es. id)
    if (source === 'params') {
      const paramKeys = Object.keys(req.params);
      
      // Se c’è un solo parametro (es. { id: '...' }), estrai direttamente il valore
      if (paramKeys.length === 1) {
        dataToValidate = req.params[paramKeys[0]];
      }
    }

    // Esegue la validazione tramite Zod
    const parsed = schema.safeParse(dataToValidate);

    if (!parsed.success) {
      // In caso di errore, mappa i messaggi di validazione per eventuale log
      const errors = parsed.error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
      }));

      console.log('Validation failed:', errors);

      // Inoltra errore generico tramite factory centralizzata
      const errorFactory = new ErrorFactory();
      return next(errorFactory.getError(ErrEnum.BadRequest));
    }

    // (Opzionale) Se vuoi salvare i dati validati su req per uso successivo:
    // req.validatedData = parsed.data;

    next();
  };
};