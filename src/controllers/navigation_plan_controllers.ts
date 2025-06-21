import { NavigationPlanService } from "../services/navigationPlan_service";
import { StatusCodes } from "http-status-codes";
import { exportToPdf } from "../utils/export";
import { ExportFormat } from "../enum/exportFormat";
import { Request, Response, NextFunction } from "express";
import { UserRole } from "../model/user.interface";
import { ErrorFactory } from "../factory/error/error_factory";
import { ErrEnum } from "../factory/error/error_enum";
import { INavigationPlan, StatusNavigation } from "../model/navigationPlan.interface";
import { UserPayload } from "../types/user_payload";
import { INavigationPlanQuery } from "../types/navigationPlanQuery";



/**
 * Controller `NavigationPlanController`
 *
 * Gestisce le richieste HTTP relative ai piani di navigazione.
 * Coordina le chiamate al service `NavigationPlanService` e restituisce le risposte al client.
 */
export class NavigationPlanController {

  constructor(private navigationPlanService: NavigationPlanService) {}

  /**
   * Crea un nuovo piano di navigazione per l'utente autenticato.
   *
   * @route POST /api/navigation-plans
   * @param req Contiene il corpo della richiesta e `req.user.id` come ID utente.
   * @param res Risposta HTTP con il piano creato o errore.
   * @param next Middleware per la gestione centralizzata degli errori.
   */
  createNavigationPlan = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId : string = req.user.id;
      const created : INavigationPlan = await this.navigationPlanService.createNavigationPlan(req.body, userId);
      res.status(StatusCodes.CREATED).json(created);
    } catch (error) {
      console.log(error)
      next(error);
    }
  };

  /**
   * Recupera i piani di navigazione filtrati per l'utente corrente.
   * Supporta l'esportazione in PDF se `format=PDF` è presente nella query.
   *
   * @route GET /api/navigation-plans
   * @queryParam format (opzionale) - `PDF` per scaricare il risultato in formato PDF.
   * @param req Contiene i parametri query e `req.user.id`.
   * @param res Risposta HTTP con i piani o il file PDF.
   * @param next Middleware per la gestione centralizzata degli errori.
   */
getNavigationPlan = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query : INavigationPlanQuery = req.query; 
    const format: string|undefined = query.format;
    const user : UserPayload = req.user;
  
    const errorFactory = new ErrorFactory();

    if (user.role === UserRole.USER) {
      query.userId = user.id;
      delete query.format;

      const navigationPlans = await this.navigationPlanService.getNavigationPlan(query);

      if (format === ExportFormat.PDF) {
        const pdf = await exportToPdf(navigationPlans);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="navigation_plans.pdf"');
        res.send(pdf);   
        return;          
      }

      res.status(StatusCodes.OK).json(navigationPlans);
      return;
    }

    if (user.role === UserRole.OPERATOR) {
      if (format || query.from || query.to) {
        throw errorFactory.getError(ErrEnum.Unauthorized)
      }

      const navigationPlans  = await this.navigationPlanService.getNavigationPlan(query);
      res.status(StatusCodes.OK).json(navigationPlans);
      return;
    }
  } catch (error) {
    next(error);
  }
};

  /**
   * Elimina un piano di navigazione (soft delete aggiorna lo status in CANCELLED) se l'utente ne è il proprietario.
   *
   * @route DELETE /api/navigation-plans/:id
   * @param req Parametri della richiesta (`req.params.id`) e `req.user.id`.
   * @param res Risposta HTTP 200 OK se l'operazione va a buon fine.
   * @param next Middleware per la gestione degli errori.
   */
  deleteNavigationPlan = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId : string= req.user.id;
      const navigationPlanId :string = req.params.id;
      const navigationPlan = await this.navigationPlanService.deleteNavigationPlan(navigationPlanId, userId);
      res.status(StatusCodes.OK).json(navigationPlan);
    } catch (error) {
      next(error);
    }
  };

  updateStusNavigationPlanAcceted = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const navigationPlanId :string = req.params.id;
      const navigationPlan= await this.navigationPlanService.updatePlanStatus(navigationPlanId,StatusNavigation.ACCEPTED);
      res.status(StatusCodes.OK).json(navigationPlan);
    } catch (error) {
      next(error);
    }
  };

  updateStusNavigationPlanRejected = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const navigationPlanId :string = req.params.id;
      const {reason}=req.body;
      const navigationPlan= await this.navigationPlanService.updatePlanStatus(navigationPlanId,StatusNavigation.REJECTED,reason);
      res.status(StatusCodes.OK).json(navigationPlan);
    } catch (error) {
      next(error);
    }
  };
}
