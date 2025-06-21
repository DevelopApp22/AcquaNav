/**
 * Estensione dell'interfaccia Request di Express per includere proprietà personalizzate.
 * 
 * In particolare, vengono aggiunti:
 * - token: contiene il token JWT estratto dalla richiesta.
 * - user: contiene il payload utente decodificato dal token, tipizzato tramite UserPayload.
 * 
 * Questa estensione consente a TypeScript di riconoscere le proprietà personalizzate
 * su req senza necessità di cast manuali, migliorando la sicurezza, l'autocompletamento
 * e la manutenibilità del codice.
 * 
 * Si utilizza il meccanismo di module augmentation previsto da TypeScript per estendere
 * i tipi forniti da pacchetti esterni.
 */
import 'express-serve-static-core';
import { UserPayload } from '../user_payload';

declare module 'express-serve-static-core' {
  interface Request {
    token: string;
    user:UserPayload
  }
}