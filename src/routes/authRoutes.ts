import { Router } from "express";
import { UserDao } from "../dao/user_dao";
import { UserRepository } from "../repository/user_repository";
import { AuthService } from "../services/auth_service";
import { AuthController } from "../controllers/auth_controller";
import { loginSchema } from "../middlewares/validateSchema/login.schema";
import { validateWithSchema } from "../middlewares/validate";
import { ValidateReq } from "../enum/validateReq";

const router = Router();
const userDao = new UserDao();
const userRepository = new UserRepository(userDao);
const authService= new AuthService(userRepository);
const authController = new AuthController(authService);

router.post("/auth/login",validateWithSchema(loginSchema,ValidateReq.BODY),authController.loginUser)
export default router


