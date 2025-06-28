import { Router } from "express";
import { UserDao } from "../dao/user_dao";
import { UserRepository } from "../repository/user_repository";
import { AuthService } from "../services/auth_service";
import { AuthController } from "../controllers/auth_controller";
import { loginSchema } from "../middlewares/validateSchema/login.schema";
import { validateWithSchema } from "../middlewares/validate";
import { ValidateReq } from "../enum/validateReq";

// Creazione del router Express per la gestione delle route di autenticazione
const router = Router();

// Instanziazione del DAO per l'utente (data access layer)
const userDao = new UserDao();

// Creazione del repository che incapsula il DAO e gestisce il data layer applicativo
const userRepository = new UserRepository(userDao);

// Creazione del servizio di autenticazione, con dependency injection del repository
const authService = new AuthService(userRepository);

// Creazione del controller per l'autenticazione, che gestisce le richieste HTTP
const authController = new AuthController(authService);

// Definizione della route POST /auth/login
// - Si applica il middleware di validazione dello schema `loginSchema` sul corpo della richiesta (BODY)
// - Se la validazione passa, viene eseguito il metodo `loginUser` del controller
router.post("/auth/login",validateWithSchema(loginSchema, ValidateReq.BODY),authController.loginUser);

// Esporta il router configurato per essere importato nell’app principale
export default router;
