import { Router } from "express";
import { RestrictedAreaDao } from "../dao/restricted_area_dao";
import { RestrictedAreaRepository } from "../repository/restrictedArea_repository";
import { RestrictedAreaService } from "../services/restrictedArea_service";
import { RestrictedAreaController } from "../controllers/restricted_area_controllers";
import { Auth } from "../middlewares/middlware_chain";
import { authorizeRole } from "../middlewares/middleware_auth";
import { restrictedAreaSchema } from "../middlewares/validateSchema/restricted_area.schema";
import { objectIdSchema } from "../middlewares/validateSchema/objectId.schema";
import { validateWithSchema } from "../middlewares/validate";
import { ValidateReq } from "../enum/validateReq";
import { UserRole } from "../enum/userRole";

const router = Router();
const restrictedAreaDao = new RestrictedAreaDao();
const restrictedAreaRepository = new RestrictedAreaRepository(restrictedAreaDao);
const restrictedAreaService = new RestrictedAreaService(restrictedAreaRepository);
const restrictedAreaController = new RestrictedAreaController(restrictedAreaService);

// GET /restricted-areas
// Recupera tutte le aree ristrette.
// In questo caso la route è pubblica (senza autenticazione), valutare se serva proteggerla.
router.get(
  "/restricted-areas",
  restrictedAreaController.getAllRestrictedArea
);

// POST /restricted-areas
// Crea una nuova area ristretta (solo OPERATOR autorizzati).
router.post(
  "/restricted-areas",
  Auth, // Middleware autenticazione (richiede token JWT valido)
  authorizeRole(UserRole.OPERATOR), // Solo gli operatori possono creare nuove aree
  validateWithSchema(restrictedAreaSchema, ValidateReq.BODY), // Validazione schema del body richiesta
  restrictedAreaController.createRestrictedArea
);

// DELETE /restricted-areas/:id
// Elimina un'area ristretta esistente (solo OPERATOR autorizzati).
router.delete(
  "/restricted-areas/:id",
  Auth, // Autenticazione obbligatoria
  authorizeRole(UserRole.OPERATOR),
  validateWithSchema(objectIdSchema, ValidateReq.PARAMS), // Validazione del parametro id nella route
  restrictedAreaController.deleteRestrictedArea
);

// PUT /restricted-areas/:id
// Aggiorna completamente un'area ristretta esistente (solo OPERATOR).
router.put(
  "/restricted-areas/:id",
  Auth, // Autenticazione obbligatoria
  authorizeRole(UserRole.OPERATOR),
  validateWithSchema(objectIdSchema, ValidateReq.PARAMS), // Validazione id nell'URL
  validateWithSchema(restrictedAreaSchema, ValidateReq.BODY), // Validazione corpo richiesta completo
  restrictedAreaController.updateRestrictedArea
);
export default router