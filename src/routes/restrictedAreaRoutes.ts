import { Router } from "express";
import { RestrictedAreaDao } from "../dao/restricted_area_dao";
import { RestrictedAreaRepository } from "../repository/restrictedArea_repository";
import { RestrictedAreaService } from "../services/restrictedArea_service";
import { RestrictedAreaController } from "../controllers/restricted_area_controllers";
import { Auth } from "../middlewares/middlware_chain";
import { authorizeRole } from "../middlewares/middleware_auth";
import { UserRole } from "../model/user.interface";
import { restrictedAreaSchema } from "../middlewares/validateSchema/restricted_area.schema";
import { objectIdSchema } from "../middlewares/validateSchema/objectId.schema";
import { validateWithSchema } from "../middlewares/validate";
import { ValidateReq } from "../enum/validateReq";

const router = Router();
const restrictedAreaDao = new RestrictedAreaDao();
const restrictedAreaRepository = new RestrictedAreaRepository(restrictedAreaDao);
const restrictedAreaService = new RestrictedAreaService(restrictedAreaRepository);
const restrictedAreaController = new RestrictedAreaController(restrictedAreaService);

router.get("/restricted-areas",restrictedAreaController.getAllRestrictedArea)
router.post("/restricted-areas/",Auth,authorizeRole(UserRole.OPERATOR),validateWithSchema(restrictedAreaSchema,ValidateReq.BODY),restrictedAreaController.createRestrictedArea)
router.delete("/restricted-areas/:id",Auth,authorizeRole(UserRole.OPERATOR),validateWithSchema(objectIdSchema,ValidateReq.PARAMS),restrictedAreaController.deleteRestrictedArea)
router.put("/restricted-areas/:id",Auth,authorizeRole(UserRole.OPERATOR),validateWithSchema(objectIdSchema,ValidateReq.PARAMS),restrictedAreaController.updateRestrictedArea)

export default router