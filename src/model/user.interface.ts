/**
 * Interfaccia `IUser`
 *
 * Rappresenta la struttura logica di un utente nel sistema.
 * Estende `Document` di Mongoose per essere compatibile con le operazioni del database.
 *
 * @property role   Il ruolo dell'utente: può essere 'user', 'operator' o 'admin'.
 * @property tokens Il numero di token posseduti dall'utente, utilizzati per pagare le richieste.
 */

import { ObjectId } from "mongoose";
import { UserRole } from "../enum/userRole";

export interface IUser{
  id:string,
  email:string,
  password:string,
  role: UserRole;
  tokens? : number;
}