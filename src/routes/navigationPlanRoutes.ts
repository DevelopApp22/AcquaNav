import { Router } from 'express';
import { UserDao } from '../dao/user_dao';
import { UserRepository } from '../repository/user_repository';
import { authorizeRole } from '../middlewares/middleware_auth';
import { NavigationPlanDao } from '../dao/navigation_plan_dao';
import { NavigationPlanRepository } from '../repository/navigationPlan_repository';
import { NavigationPlanService } from '../services/navigationPlan_service';
import { RestrictedAreaDao } from '../dao/restricted_area_dao';
import { RestrictedAreaRepository } from '../repository/restrictedArea_repository';
import { NavigationPlanController } from '../controllers/navigation_plan_controllers';
import {validateFilterNavigationPlan, validateWithSchema } from '../middlewares/validate';
import { Auth } from '../middlewares/middlware_chain';
import { UserRole } from '../model/user.interface';
import { objectIdSchema } from '../middlewares/validateSchema/objectId.schema';
import { navigationPlanSchema } from '../middlewares/validateSchema/navigationPlan.schema';
import { ValidateReq } from "../enum/validateReq";
import { rejectedNavigationPlan } from '../middlewares/validateSchema/rejetedNavigationPlan.schema';

const router = Router();

const user_dao= new UserDao();
const user_repository= new UserRepository(user_dao);

const restricted_area_dao = new RestrictedAreaDao();
const restricted_area_repository = new RestrictedAreaRepository(restricted_area_dao);

const navigatio_plan_dao= new NavigationPlanDao();
const navigation_plan_repository= new NavigationPlanRepository(navigatio_plan_dao);
const navigation_plan_service= new NavigationPlanService(navigation_plan_repository,user_repository,restricted_area_repository);
const navigation_plan_controller= new NavigationPlanController(navigation_plan_service);

router.get("/navigation-plans",Auth,authorizeRole(UserRole.OPERATOR,UserRole.USER),validateFilterNavigationPlan,navigation_plan_controller.getNavigationPlan)

router.post("/navigation-plans",Auth,authorizeRole(UserRole.USER),validateWithSchema(navigationPlanSchema,ValidateReq.BODY),navigation_plan_controller.createNavigationPlan)

router.delete("/navigation-plans/:id",Auth,authorizeRole(UserRole.USER),validateWithSchema(objectIdSchema,ValidateReq.PARAMS),navigation_plan_controller.deleteNavigationPlan)

router.patch("/navigation-plans/:id/accepted",Auth,authorizeRole(UserRole.OPERATOR),validateWithSchema(objectIdSchema,ValidateReq.PARAMS),navigation_plan_controller.updateStusNavigationPlanAcceted)

router.patch("/navigation-plans/:id/rejected",Auth,authorizeRole(UserRole.OPERATOR),validateWithSchema(objectIdSchema,ValidateReq.PARAMS),validateWithSchema(rejectedNavigationPlan,ValidateReq.BODY),navigation_plan_controller.updateStusNavigationPlanRejected)


export default router