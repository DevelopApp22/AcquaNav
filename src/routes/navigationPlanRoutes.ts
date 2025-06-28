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
import {validateWithSchema } from '../middlewares/validate';
import { Auth } from '../middlewares/middlware_chain';

import { objectIdSchema } from '../middlewares/validateSchema/objectId.schema';
import { navigationPlanSchema } from '../middlewares/validateSchema/navigationPlan.schema';
import { ValidateReq } from "../enum/validateReq";
import { rejectedNavigationPlan } from '../middlewares/validateSchema/rejetedNavigationPlan.schema';
import { UserRole } from '../enum/userRole';
import { filterNavigationSchema } from '../middlewares/validateSchema/filterNavigationPlan.schema';

const router = Router();

const user_dao= new UserDao();
const user_repository= new UserRepository(user_dao);

const restricted_area_dao = new RestrictedAreaDao();
const restricted_area_repository = new RestrictedAreaRepository(restricted_area_dao);

const navigatio_plan_dao= new NavigationPlanDao();
const navigation_plan_repository= new NavigationPlanRepository(navigatio_plan_dao);
const navigation_plan_service= new NavigationPlanService(navigation_plan_repository,user_repository,restricted_area_repository);
const navigation_plan_controller= new NavigationPlanController(navigation_plan_service);


// GET /navigation-plans
// Recupera i piani di navigazione, filtrati dinamicamente in base al ruolo e ai query params
router.get(
  "/navigation-plans",
  Auth,  // Middleware autenticazione JWT
  authorizeRole(UserRole.OPERATOR, UserRole.USER), // Middleware autorizzazione ruoli
  validateWithSchema(filterNavigationSchema,ValidateReq.QUERY), // Middleware di validazione query string (filtri di ricerca)
  navigation_plan_controller.getNavigationPlan
);

// POST /navigation-plans
// Crea un nuovo piano di navigazione (solo utenti USER autorizzati)
router.post(
  "/navigation-plans",
  Auth,
  authorizeRole(UserRole.USER),
  validateWithSchema(navigationPlanSchema, ValidateReq.BODY), // Validazione schema del body
  navigation_plan_controller.createNavigationPlan
);

// PATCH /navigation-plans/:id/cancelled
// Annulla (soft delete) un piano esistente, disponibile solo all’utente proprietario
router.patch(
  "/navigation-plans/:id/cancelled",
  Auth,
  authorizeRole(UserRole.USER),
  validateWithSchema(objectIdSchema, ValidateReq.PARAMS), // Validazione id piano
  navigation_plan_controller.deleteNavigationPlan
);

// PATCH /navigation-plans/:id/accepted
// Approva un piano (solo per operatori)
router.patch(
  "/navigation-plans/:id/accepted",
  Auth,
  authorizeRole(UserRole.OPERATOR),
  validateWithSchema(objectIdSchema, ValidateReq.PARAMS),
  navigation_plan_controller.updateStatusNavigationPlanAccepted
);

// PATCH /navigation-plans/:id/rejected
// Rifiuta un piano con motivazione (solo per operatori)
router.patch(
  "/navigation-plans/:id/rejected",
  Auth,
  authorizeRole(UserRole.OPERATOR),
  validateWithSchema(objectIdSchema, ValidateReq.PARAMS),
  validateWithSchema(rejectedNavigationPlan, ValidateReq.BODY), // Qui validiamo il body con il motivo del rifiuto
  navigation_plan_controller.updateStatusNavigationPlanRejected
);

// Esporta il router pronto per essere importato nell’applicazione principale
export default router;