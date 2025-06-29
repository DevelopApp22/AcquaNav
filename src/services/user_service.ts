import { UserRepository } from "../repository/user_repository";
import {ErrorFactory} from "../factory/error/error_factory"
import { ErrEnum } from "../factory/error/error_enum";
import { UserRole } from "../enum/userRole";
import { IUser } from "../model/user.interface";

/**
 * Classe `UserService`
 *
 * Contiene la logica di business per la gestione degli utenti.
 * Si interfaccia con il livello repository per l'accesso ai dati e
 * gestisce validazioni e regole applicative.
 */
export class UserService {

    private errorFactory: ErrorFactory;

    /**
     * Costruttore del servizio utenti.
     * @param userRepository Repository per la gestione utenti.
     */
    constructor(private userRepository: UserRepository) {
        this.errorFactory = new ErrorFactory();
    }

    /**
     * Aggiorna il numero di token per un determinato utente.
     * Applica regole di validazione sul ruolo e sui dati esistenti.
     * 
     * @param userId Identificativo dell'utente.
     * @param tokensToAdd Numero di token da aggiungere.
     * @returns L'utente aggiornato.
     * @throws Eccezioni in caso di utente non trovato o ruolo non autorizzato.
     */
    async updateUserTokens(userId: string, tokensToAdd: number): Promise<IUser | null> {
        
        const user = await this.userRepository.getUserById(userId);

        if (!user) {
            throw this.errorFactory.getError(ErrEnum.UserNotFound);
        }

        // Verifica che il ruolo sia valido per l'operazione
        if (user.role === UserRole.OPERATOR || user.role === UserRole.ADMIN) {
            throw this.errorFactory.getError(ErrEnum.ForbiddenRole);
        }

        // Inizializza i token se null o undefined
        const currentTokens = user.tokens ?? 0;
        const updatedTokens = currentTokens + tokensToAdd;

        const updatedUser = await this.userRepository.updateUser(userId, { tokens: updatedTokens });
        return updatedUser;
    }
}