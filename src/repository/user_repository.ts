import { IUser } from "../model/user.interface";
import { UserDao } from "../dao/user_dao";

/**
 * Classe `UserRepository`
 * 
 * Repository che fornisce un livello di astrazione tra il DAO (`UserDao`) e il resto dell'applicazione.
 * Incapsula la logica di accesso ai dati per la gestione degli utenti, centralizzando
 * le operazioni CRUD sugli utenti.
 */
export class UserRepository {

  /**
   * Costruttore del repository.
   * @param userDao DAO incaricato della persistenza utenti.
   */
  constructor(private userDao: UserDao) {}

  /**
   * Registra un nuovo utente nel sistema.
   * @param user Oggetto contenente i dati dell’utente da creare.
   * @returns L’utente creato.
   */
  async registerUser(user: IUser): Promise<IUser> {
    return await this.userDao.create(user);
  }

  /**
   * Recupera un utente tramite identificativo univoco.
   * @param userId Identificativo univoco dell’utente.
   * @returns L’utente trovato, oppure `null` se non esiste.
   */
  async getUserById(userId: string): Promise<IUser | null> {
    return await this.userDao.getbyID(userId);
  }

  /**
   * Recupera un utente tramite indirizzo email.
   * @param email Indirizzo email dell’utente.
   * @returns L’utente trovato, oppure `null` se non esiste.
   */
  async getUserByEmail(email: string): Promise<IUser | null> {
    return await this.userDao.getbyEmail(email);
  }

  /**
   * Restituisce l’elenco completo degli utenti registrati.
   * @returns Array di oggetti `IUser`.
   */
  async getAllUsers(): Promise<IUser[]> {
    return await this.userDao.getAll();
  }

  /**
   * Aggiorna i dati di un utente esistente.
   * @param userId Identificativo dell’utente da aggiornare.
   * @param user Oggetto parziale contenente i dati da aggiornare.
   * @returns L’utente aggiornato, oppure `null` se non trovato.
   */
  async updateUser(userId: string, user: Partial<IUser>): Promise<IUser | null> {
    return await this.userDao.update(userId, user);
  }

  /**
   * Elimina un utente dal sistema.
   * @param userId Identificativo dell’utente da eliminare.
   */
  async deleteUser(userId: string): Promise<void> {
    await this.userDao.delete(userId);
  }
}

