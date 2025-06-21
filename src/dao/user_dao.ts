import {User} from "../model/schema/user_model"
import { IUser } from "../model/user.interface";
import { IDao } from "./idao.interface";

/**
 * Classe `UserDao`
 *
 * Implementa l'interfaccia generica `IDao` per la gestione degli utenti (`IUser`).
 * Fornisce operazioni CRUD per interagire con il modello `User` salvato in MongoDB tramite Mongoose.
 *
 */


export class UserDao implements IDao<IUser> {

    constructor() {}

    /**
     * Crea un nuovo utente nel database.
     * @param item Oggetto `IUser` contenente i dati dell'utente da salvare.
     * @returns L'utente creato.
     */
    async create(item: IUser): Promise<IUser> {
        const user : IUser = await User.create(item);
        return user;
    }

    /**
     * Recupera un utente a partire dal suo identificativo univoco.
     * @param id ID MongoDB dell'utente.
     * @returns L'utente corrispondente oppure `null` se non trovato.
     */
    async getbyID(id: string): Promise<IUser | null> {
        const user  = await User.findById(id);
        return user;
    }

     /**
     * Recupera un utente a partire dalla sua email .
     * @param email ID MongoDB dell'utente.
     * @returns L'utente corrispondente oppure `null` se non trovato.
     */
    async getbyEmail(email: string): Promise<IUser | null> {
        const user :IUser | null = await User.findOne({email:email});
        return user;
    }

    /**
     * Restituisce tutti gli utenti presenti nel database.
     * @returns Array di oggetti `IUser`.
     */
    async getAll(): Promise<IUser[]> {
        const users  = await User.find();
        return users;
    }

    /**
     * Aggiorna un utente esistente in base all'ID fornito.
     * @param id ID dell'utente da aggiornare.
     * @param item Oggetto parziale contenente i campi da modificare.
     * @returns L'utente aggiornato oppure `null` se non esistente.
     */
    async update(id: string, item: Partial<IUser>): Promise<IUser | null> {
        const updatedUser = await User.findByIdAndUpdate(id, item,{
        new: true, // ritorna il documento aggiornato
        runValidators: true, // esegue le validazioni dello schema
    });
        return updatedUser;
    }

    /**
     * Elimina un utente dal database in base all'identificativo.
     * @param id ID dell'utente da rimuovere.
     */
    async delete(id: string): Promise<void> {
        await User.findByIdAndDelete(id);
    }
}