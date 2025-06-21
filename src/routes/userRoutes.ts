import { Router} from 'express';
import { UserDao } from '../dao/user_dao';
import { UserRepository } from '../repository/user_repository';
import { UserService } from '../services/user_service';
import { UserController } from '../controllers/user_controller';
import { authorizeRole } from '../middlewares/middleware_auth';
import { Auth } from '../middlewares/middlware_chain';
import { UserRole } from '../model/user.interface';
import { objectIdSchema } from '../middlewares/validateSchema/objectId.schema';
import { updateSchemaToken } from '../middlewares/validateSchema/validateUpdateToken.schema';
import { validateWithSchema } from '../middlewares/validate';
import { ValidateReq } from '../enum/validateReq';

const router = Router();
const userDao = new UserDao();
const userRepository = new UserRepository(userDao);
const userService = new UserService(userRepository);
const userController = new UserController(userService);

router.put("/users/:id",Auth,authorizeRole(UserRole.ADMIN),validateWithSchema(objectIdSchema,ValidateReq.PARAMS),validateWithSchema(updateSchemaToken,ValidateReq.BODY),userController.updateUser)
export default router