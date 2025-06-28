import { ErrEnum } from "./error_enum";
import * as Errors from "./errors";
/**
 * Classe `ErrorFactory`
 * 
 * Factory centralizzata per la creazione di oggetti di errore standardizzati,
 * basata su un tipo di errore fornito tramite l'enum `ErrEnum`.
 * 
 * Ogni valore dell'enum corrisponde a una specifica classe di errore che
 * implementa l'interfaccia `ErrorResponse`, contenente:
 * - `status`: codice HTTP associato all'errore,
 * - `msg`: messaggio da restituire al client.
 * 
 * Questa factory consente di gestire in modo coerente e centralizzato la generazione
 * delle risposte di errore all'interno dell'applicazione.
 * 
 * @method getError
 * @param type - Valore dell'enum `ErrEnum` che identifica il tipo di errore da generare
 * @returns Un oggetto che implementa `ErrorResponse`, pronto per essere restituito nella risposta HTTP
 */
export class ErrorFactory {
    constructor() {}

    public getError(type: ErrEnum): ErrorResponse {
        let retval: ErrorResponse

        switch (type) {
            case ErrEnum.MissingAuthHeader:
                retval = new Errors.MissingAuthHeaderError();
                break;
            case ErrEnum.MissingPayloadHeader:
                retval = new Errors.MissingPayloadHeaderError();
                break;
            case ErrEnum.MissingToken:
                retval = new Errors.MissingToken();
                break;
            case ErrEnum.InvalidToken:
                retval = new Errors.InvalidTokenError();
                break;
            case ErrEnum.MalformedPayload:
                retval = new Errors.MalformedPayloadError();
                break;
            case ErrEnum.RouteNotFound:
                retval = new Errors.RouteNotFoundError();
                break;
            case ErrEnum.Unauthorized:
                retval = new Errors.UnauthorizedError();
                break;
            case ErrEnum.Forbidden:
                retval = new Errors.ForbiddenError();
                break;
            case ErrEnum.NotFound:
                retval = new Errors.NotFoundError();
                break;
            case ErrEnum.InternalServerError:
                retval = new Errors.InternalServerError();
                break;
            case ErrEnum.ServiceUnavailable:
                retval = new Errors.ServiceUnavailableError();
                break;
            case ErrEnum.BadRequest:
                retval = new Errors.BadRequestError();
                break;
            case ErrEnum.UserNotFound:
                retval = new Errors.UserNotFoundError();
                break;
            case ErrEnum.InsufficientTokens:
                retval = new Errors.InsufficientTokensError();
                break;
            case ErrEnum.InvalidStartDate:
                retval = new Errors.InvalidStartDateError();
                break;
            case ErrEnum.RouteRestricted:
                retval = new Errors.RouteRestrictedError();
                break;
            case ErrEnum.PlanAlreadyCancelled:
                retval = new Errors.PlanNotUpdateStatus();
                break;
            case ErrEnum.PlanNotFound:
                retval = new Errors.PlanNotFoundError();
                break;
            case ErrEnum.CannotCancelPlan:
                retval = new Errors.CannotCancelPlanError();
                break;
            case ErrEnum.InvalidDataFormat:
                retval = new Errors.InavlidDateError();
                break;
            case ErrEnum.ForbiddenRole:
                retval = new Errors.ForbiddenRoleError();
                break;
             case ErrEnum.RestrictedAreaNotFound:
                retval = new Errors.RestrictedAreaNotFoundError();
                break;
            case ErrEnum.InvalidCredenzial:
                retval = new Errors.InvalidCredenzialError();
                break;
            case ErrEnum.RestrictedAreaAlreadyExists:
                retval = new Errors.InavalidRestrictedArea();
                break;
            case ErrEnum.NoNavigationPlansFound:
                retval = new Errors.PlansNotFoundError();
                break;
            case ErrEnum.NoRestrictedAreasFound:
                retval = new Errors.RestricreAreasNotFoundError();
                break;
             case ErrEnum.PlanNotEditableStatus:
                retval = new Errors.PlanNotEditableStatus();
                break;
            default:
                retval = new Errors.InternalServerError();
                break;
            
        }

        return retval;
    }
}
