import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth_service";
import { StatusCodes } from "http-status-codes";

/**
 * Controller `AuthController`
 *
 * Gestisce le richieste HTTP relative all'autenticazione degli utenti.
 * Interagisce con il servizio `AuthService` per eseguire la logica di login.
 */
export class AuthController {
  
  constructor(private authService: AuthService) {}

  /**
   * Metodo `loginUser`
   *
   * Endpoint per il login di un utente. Riceve email e password dal body della richiesta,
   * li passa al servizio di autenticazione e, se validi, restituisce un token JWT.
   *
   * @route POST /auth/login
   * @param req Oggetto della richiesta HTTP (contiene `email` e `password`)
   * @param res Oggetto della risposta HTTP
   * @param next Funzione per propagare eventuali errori ai middleware di gestione errori
   * @returns JSON con il token JWT generato
   *
   * @example
   * Request body:
   * {
   *   "email": "utente@example.com",
   *   "password": "password123"
   * }
   *
   * Response:
   * {
   *   "token": "eyJhbGciOiJSUzI1NiIsInR5cCI..."
   * }
   */
  loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {email, password} = req.body;
  
      // Invoca il servizio per autenticare l’utente e generare il token
      const token : string = await this.authService.loginUser(email,password);

      // Restituisce il token con status 201 Created
      res.status(StatusCodes.CREATED).json({ token });
    } catch (error) {
      // Inoltra eventuali errori al middleware centralizzato
      next(error);
    }
  };
}
