import { ErrEnum } from "../factory/error/error_enum";
import { ErrorFactory } from "../factory/error/error_factory";
import { UserRepository } from "../repository/user_repository";
import { comparePassword } from "../utils/password";
import { generateToken } from "../utils/jwt";

/**
 * Classe `AuthService`
 *
 * Responsabile della logica di autenticazione utente. Valida le credenziali
 * e genera un JWT se l'autenticazione ha successo.
 */
export class AuthService {
  constructor(private userRepository: UserRepository) {}

  /**
   * Metodo `loginUser`
   *
   * Verifica le credenziali di un utente sulla base dell’email e della password.
   * Se le credenziali sono corrette, restituisce un token JWT firmato contenente
   * l’ID e il ruolo dell’utente.
   *
   * @param email Email dell'utente (campo univoco)
   * @param password Password in chiaro fornita dall’utente
   * @returns JWT firmato con i dati dell’utente
   * @throws Errore di tipo `InvalidCredenzial` se utente non trovato o password errata
   */
  async loginUser(email: string, password: string): Promise<string> {
    const errorFactory = new ErrorFactory();

    // Recupera l’utente tramite email
    const user = await this.userRepository.getUserByEmail(email);
    if (!user) {
      throw errorFactory.getError(ErrEnum.InvalidCredenzial);
    }

    // Confronta la password in chiaro con l’hash salvato
    const validatePassword = await comparePassword(password, user.password);
    if (!validatePassword) {
      throw errorFactory.getError(ErrEnum.InvalidCredenzial);
    }

    // Crea il payload da inserire nel token JWT
    const userPayload = {
      id: user.id,
      role: user.role,
    };

    // Genera e restituisce il token
    const token = generateToken(userPayload);
    return token;
  }
}
