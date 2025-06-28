import { UserService } from '../services/user_service';
import { Request, Response, NextFunction } from "express";

/**
 * Classe `UserController`
 * 
 * Gestisce le richieste HTTP relative agli utenti.
 * Si occupa di ricevere i dati dal client, invocare la business logic nei service
 * e restituire la risposta HTTP.
 */
export class UserController {

  /**
   * Costruttore del controller.
   * @param userService Istanza del servizio UserService.
   */
  constructor(private userService: UserService) {}

  /**
   * Aggiorna il numero di token di un utente specifico.
   * 
   * Esegue:
   * - Recupera l'ID utente dal path param.
   * - Recupera il numero di token dal corpo della richiesta.
   * - Invia la richiesta al service layer.
   * - Restituisce l'utente aggiornato come risposta JSON.
   * - In caso di errori, invoca il middleware di gestione errori tramite `next()`.
   * 
   * @param req Oggetto Request di Express.
   * @param res Oggetto Response di Express.
   * @param next Funzione Next di Express (gestione errori middleware).
   */
  updateUsertoken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Estrae l'ID utente dalla route parameter
      const userId = req.params.id;

      // Estrae il numero di token da aggiornare dal corpo della richiesta
      const { tokens } = req.body;

      // Chiama il service per aggiornare i token dell'utente
      const updatedUser = await this.userService.updateUserTokens(userId, tokens);

      // Invia risposta HTTP 200 con l'utente aggiornato in formato JSON
      res.status(200).json(updatedUser);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}
