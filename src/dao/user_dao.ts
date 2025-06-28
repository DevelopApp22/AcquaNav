import {User} from "../model/schema/user_model"
import { IUser } from "../model/user.interface";
import { IDao } from "./idao.interface";

/**
 * Classe `UserDao`
 *
 * Implementa l'interfaccia generica `IDao` per la gestione degli utenti (`IUser`).
 * Fornisce operazioni CRUD per interagire con la collezione `User` su MongoDB tramite Mongoose.
 */
export class UserDao implements IDao<IUser> {

    constructor() {}

    /**
     * Crea un nuovo utente nel database.
     * @param user Oggetto `IUser` contenente i dati dell'utente da salvare.
     * @returns L'utente creato.
     */
    async create(user: IUser): Promise<IUser> {
        return await User.create(user);
    }

    /**
     * Recupera un utente tramite il proprio ID.
     * @param userId Identificativo univoco (MongoDB ObjectId) dell'utente.
     * @returns L'utente trovato, oppure `null` se non esiste.
     */
    async getbyID(userId: string): Promise<IUser | null> {
        return await User.findById(userId);
    }

    /**
     * Recupera un utente tramite indirizzo email.
     * @param email Indirizzo email dell'utente.
     * @returns L'utente trovato, oppure `null` se non esiste.
     */
    async getbyEmail(email: string): Promise<IUser | null> {
        return await User.findOne({ email });
    }

    /**
     * Restituisce l'elenco completo degli utenti.
     * @returns Array di utenti presenti nel database.
     */
    async getAll(): Promise<IUser[]> {
        return await User.find();
    }

    /**
     * Aggiorna i dati di un utente esistente.
     * @param userId Identificativo univoco dell'utente da aggiornare.
     * @param updatedFields Oggetto parziale contenente i campi da aggiornare.
     * @returns L'utente aggiornato, oppure `null` se non trovato.
     */
    async update(userId: string, updatedFields: Partial<IUser>): Promise<IUser | null> {
        return await User.findByIdAndUpdate(
            userId, 
            updatedFields, 
            {
                new: true,           // ritorna il documento aggiornato
                runValidators: true  // applica le validazioni dello schema
            }
        );
    }

    /**
     * Elimina un utente dal database.
     * @param userId Identificativo univoco dell'utente da eliminare.
     */
    async delete(userId: string): Promise<void> {
        await User.findByIdAndDelete(userId);
    }
}
