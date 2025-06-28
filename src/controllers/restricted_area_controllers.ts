import { Request, Response, NextFunction } from "express";
import { RestrictedAreaService } from "../services/restrictedArea_service";
import { StatusCodes } from "http-status-codes";
import { IRestrictedArea } from "../model/restrictedArea.interface";

/**
 * Classe `RestrictedAreaController`
 * 
 * Gestisce le richieste HTTP relative alle aree ristrette.
 * Riceve le richieste dal client, chiama il service layer per applicare la logica di business
 * e restituisce le risposte HTTP.
 */
export class RestrictedAreaController {

    /**
     * Costruttore del controller.
     * @param restrictedAreaService Istanza del servizio `RestrictedAreaService`.
     */
    constructor(private restrictedAreaService: RestrictedAreaService) {}

    /**
     * Crea una nuova area ristretta.
     * 
     * Endpoint REST: POST `/restricted-areas`
     * 
     * @param req Request di Express (contiene i dati dell'area nel body).
     * @param res Response di Express.
     * @param next Funzione Next di Express per la gestione centralizzata degli errori.
     */
    createRestrictedArea = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Chiama il service per creare la nuova area ristretta
            const newRestrictedArea: IRestrictedArea = await this.restrictedAreaService.createRestrictedArea(req.body);

            // Restituisce HTTP 201 (Created) con l'oggetto appena creato
            res.status(StatusCodes.CREATED).json(newRestrictedArea);
        } catch (error) {
            next(error);
        }
    };

    /**
     * Recupera l'elenco completo di tutte le aree ristrette.
     * 
     * Endpoint REST: GET `/restricted-areas`
     * 
     * @param req Request di Express.
     * @param res Response di Express.
     * @param next Funzione Next di Express.
     */
    getAllRestrictedArea = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Recupera tutte le aree tramite il service
            const restrictedAreas: IRestrictedArea[] = await this.restrictedAreaService.getAllRestrictedAreas();

            // Restituisce HTTP 200 con la lista
            res.status(StatusCodes.OK).json(restrictedAreas);
        } catch (error) {
            next(error);
        }
    };

    /**
     * Elimina un'area ristretta specifica tramite ID.
     * 
     * Endpoint REST: DELETE `/restricted-areas/:id`
     * 
     * @param req Request di Express (parametro `id` dalla URL).
     * @param res Response di Express.
     * @param next Funzione Next di Express.
     */
    deleteRestrictedArea = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Estrae l'ID area dai parametri della route
            const restrictedAreaId: string = req.params.id;

            // Chiama il service per cancellare l'area
            await this.restrictedAreaService.deleteRestrictedArea(restrictedAreaId);

            // Restituisce HTTP 200 senza contenuto
            res.status(StatusCodes.OK).json();
        } catch (error) {
            next(error);
        }
    };

    /**
     * Aggiorna un'area ristretta esistente.
     * 
     * Endpoint REST: PUT/PATCH `/restricted-areas/:id`
     * 
     * @param req Request di Express (contiene ID e i nuovi dati).
     * @param res Response di Express.
     * @param next Funzione Next di Express.
     */
    updateRestrictedArea = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Estrae ID e body dalla richiesta
            const restrictedAreaId: string = req.params.id;

            // Chiama il service per aggiornare l'area
            const restrictedArea = await this.restrictedAreaService.updateRestrictedArea(restrictedAreaId, req.body);

            // Restituisce HTTP 200 con l'area aggiornata
            res.status(StatusCodes.OK).json(restrictedArea);
        } catch (error) {
            next(error);
        }
    };
}
