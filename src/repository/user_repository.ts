import { IUser } from "../model/user.interface";
import { UserDao } from "../dao/user_dao";

/**
 * Classe `UserRepository`
 *
 * Rappresenta il livello di astrazione tra il DAO (`UserDao`) e il resto dell'applicazione.
 * Espone i metodi principali per la gestione degli utenti, delegando le operazioni
 * di accesso al database al rispettivo DAO.
 *
 */

export class UserRepository {
  constructor(private  userDao: UserDao) {}

  /**
   * Registra un nuovo utente nel sistema.
   * @param userData Dati dell’utente da salvare.
   * @returns L’utente creato.
   */
  async registerUser(userData: IUser): Promise<IUser> {
    return this.userDao.create(userData);
  }

  /**
   * Recupera un utente tramite ID.
   * @param userId Identificativo univoco dell’utente.
   * @returns L’utente se esiste, altrimenti `null`.
   */
  async getUserById(userId: string): Promise<IUser | null> {
    return this.userDao.getbyID(userId);
  }

  /**
   * Recupera un utente tramite email.
   * @param email Identificativo univoco dell’utente.
   * @returns L’utente se esiste, altrimenti `null`.
   */
  async getUserByEmail(email: string): Promise<IUser | null> {
    return this.userDao.getbyEmail(email);
  }

  /**
   * Restituisce tutti gli utenti registrati.
   * @returns Array di utenti.
   */
  async getAllUsers(): Promise<IUser[]> {
    return this.userDao.getAll();
  }

  /**
   * Modifica i dati di un utente esistente.
   * @param userId Identificativo dell’utente da aggiornare.
   * @param updatedData Nuove informazioni da applicare.
   * @returns L’utente aggiornato o `null` in caso di mancato riscontro.
   */
  async updateUser(userId: string, updatedData: Partial<IUser>): Promise<IUser | null> {
    return this.userDao.update(userId, updatedData);
  }

  /**
   * Rimuove un utente dal sistema.
   * @param userId Identificativo dell’utente da eliminare.
   */
  async deleteUser(userId: string): Promise<void> {
    await this.userDao.delete(userId);
  }
}
