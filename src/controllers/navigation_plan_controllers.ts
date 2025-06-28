import { NavigationPlanService } from "../services/navigationPlan_service";
import { StatusCodes } from "http-status-codes";
import { exportToPdf } from "../utils/export";
import { ExportFormat } from "../enum/exportFormat";
import { Request, Response, NextFunction } from "express";

import { ErrorFactory } from "../factory/error/error_factory";
import { ErrEnum } from "../factory/error/error_enum";
import { INavigationPlan,  } from "../model/navigationPlan.interface";
import { UserPayload } from "../types/user_payload";
import { INavigationPlanQuery } from "../types/navigationPlanQuery";
import { UserRole } from "../enum/userRole";
import { StatusNavigation } from "../enum/statusNavigation";

/**
 * Controller `NavigationPlanController`
 *
 * Gestisce le richieste HTTP relative ai piani di navigazione.
 * Coordina le chiamate al service `NavigationPlanService` e restituisce le risposte HTTP.
 */
export class NavigationPlanController {

  /**
   * Costruttore del controller.
   * @param navigationPlanService Istanza del service `NavigationPlanService`.
   */
  constructor(private navigationPlanService: NavigationPlanService) {}

  /**
   * Crea un nuovo piano di navigazione per l'utente autenticato.
   * 
   * @route POST /api/navigation-plans
   * @param req Request contenente i dati del piano e l'utente autenticato (`req.user.id`).
   * @param res Response HTTP con il piano creato.
   * @param next Gestione centralizzata degli errori.
   */
  createNavigationPlan = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.user.id;

      // Chiama il service per la creazione del piano
      const created: INavigationPlan = await this.navigationPlanService.createNavigationPlan(req.body, userId);

      res.status(StatusCodes.CREATED).json(created);
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  /**
   * Recupera i piani di navigazione filtrati per l'utente corrente.
   * Supporta l'esportazione in PDF se `format=PDF` è presente nella query.
   *
   * @route GET /api/navigation-plans
   * @queryParam format (opzionale) - `PDF` per generare un file PDF.
   */
  getNavigationPlan = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query: INavigationPlanQuery = req.query;
      const format: string | undefined = query.format;
      const user: UserPayload = req.user;

      const errorFactory = new ErrorFactory();

      if (user.role === UserRole.USER) {
        // L’utente USER può recuperare solo i propri piani
        query.userId = user.id;
        delete query.format; // rimuovo format per la query DB

        const navigationPlans = await this.navigationPlanService.getNavigationPlan(query);

        if (format === ExportFormat.PDF) {
          // Esporta i risultati in PDF
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
        // Gli OPERATOR non possono eseguire query con filtri personalizzati
        if (format || query.from || query.to) {
          throw errorFactory.getError(ErrEnum.Unauthorized);
        }

        const navigationPlans = await this.navigationPlanService.getNavigationPlan(query);
        res.status(StatusCodes.OK).json(navigationPlans);
        return;
      }
    } catch (error) {
      next(error);
    }
  };

  /**
   * Soft delete (cancellazione logica) di un piano di navigazione, valido solo se l'utente ne è il proprietario.
   * 
   * @route DELETE /api/navigation-plans/:id
   */
  deleteNavigationPlan = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId: string = req.user.id;
      const navigationPlanId: string = req.params.id;

      // Chiama il service per cancellare il piano (soft delete)
      const navigationPlan = await this.navigationPlanService.deleteNavigationPlan(navigationPlanId, userId);

      res.status(StatusCodes.OK).json(navigationPlan);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Aggiorna lo stato di un piano a "ACCEPTED".
   * 
   * @route PATCH /api/navigation-plans/:id/accept
   */
  updateStatusNavigationPlanAccepted = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const navigationPlanId: string = req.params.id;

      // Aggiorna stato su ACCEPTED
      const navigationPlan = await this.navigationPlanService.updatePlanStatus(navigationPlanId, StatusNavigation.ACCEPTED);

      res.status(StatusCodes.OK).json(navigationPlan);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Aggiorna lo stato di un piano a "REJECTED" con motivazione opzionale.
   * 
   * @route PATCH /api/navigation-plans/:id/reject
   * @body reason Motivazione per il rifiuto (opzionale).
   */
  updateStatusNavigationPlanRejected = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const navigationPlanId: string = req.params.id;
      const { reason } = req.body;

      // Aggiorna stato su REJECTED con eventuale motivazione
      const navigationPlan = await this.navigationPlanService.updatePlanStatus(navigationPlanId, StatusNavigation.REJECTED, reason);

      res.status(StatusCodes.OK).json(navigationPlan);
    } catch (error) {
      next(error);
    }
  };
}
