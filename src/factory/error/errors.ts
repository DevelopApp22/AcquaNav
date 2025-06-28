/**
 * Modulo `httpErrors`
 * 
 * Questo modulo contiene le classi che rappresentano gli errori HTTP standardizzati
 * restituibili dall'API. Ogni classe implementa l'interfaccia `ErrorResponse` e
 * rappresenta un tipo specifico di errore (es. 400 Bad Request, 401 Unauthorized, 404 Not Found).
 * 
 * Ogni classe definisce un metodo `getErrorResponse()` che restituisce un oggetto
 * contenente:
 * 
 * - `status`: codice di stato HTTP,
 * - `msg`: messaggio associato, definito in `ErrorMessages`.
 * 
 * L'utilizzo di queste classi consente:
 * - una gestione centralizzata e coerente degli errori,
 * - una facile estendibilità del sistema di risposta,
 * - l'integrazione con factory di errori (es. `ErrorFactory`) o middleware.
 * 
 */

import { ErrorMessages } from "./errorMessages";
import { StatusCodes } from "http-status-codes";

/**
 * Errore per header di autorizzazione mancante.
 */

export class MissingAuthHeaderError implements ErrorResponse {
    getErrorResponse(): { status: number, msg: string } {
        return {
            status: StatusCodes.BAD_REQUEST,
            msg: ErrorMessages.NO_AUTH_HEADER
        };
    }
}

/**
 * Errore per header del payload JSON mancante.
 */

export class MissingPayloadHeaderError implements ErrorResponse {
    getErrorResponse(): { status: number, msg: string } {
        return {
            status: StatusCodes.BAD_REQUEST,
            msg: ErrorMessages.NO_PAYLOAD_HEADER
        };
    }
}

/**
 * Errore per token JWT mancante.
 */

export class MissingToken implements ErrorResponse {
    getErrorResponse(): { status: number, msg: string } {
        return {
            status: StatusCodes.BAD_REQUEST,
            msg: ErrorMessages.MISSING_TOKEN
        };
    }
}

/**
 * Errore per token JWT non valido.
 */

export class InvalidTokenError implements ErrorResponse {
    getErrorResponse(): { status: number, msg: string } {
        return {
            status: StatusCodes.FORBIDDEN,
            msg: ErrorMessages.INVALID_TOKEN
        };
    }
}

/**
 * Errore per payload JSON malformato.
 */
export class MalformedPayloadError implements ErrorResponse {
    getErrorResponse(): { status: number, msg: string } {
        return {
            status: StatusCodes.BAD_REQUEST,
            msg: ErrorMessages.MALFORMED_PAYLOAD
        };
    }
}

/**
 * Errore per rotta non trovata.
 */
export class RouteNotFoundError implements ErrorResponse {
    getErrorResponse(): { status: number, msg: string } {
        return {
            status: StatusCodes.NOT_FOUND,
            msg: ErrorMessages.ROUTE_NOT_FOUND
        };
    }
}

/**
 * Errore per accesso non autorizzato.
 */
export class UnauthorizedError implements ErrorResponse {
    getErrorResponse(): { status: number, msg: string } {
        return {
            status: StatusCodes.UNAUTHORIZED,
            msg: ErrorMessages.UNAUTHORIZED
        };
    }
}

/**
 * Errore per accesso vietato.
 */
export class ForbiddenError implements ErrorResponse {
    getErrorResponse(): { status: number, msg: string } {
        return {
            status: StatusCodes.FORBIDDEN,
            msg: ErrorMessages.FORBIDDEN
        };
    }
}

/**
 * Errore per risorsa non trovata.
 */
export class NotFoundError implements ErrorResponse {
    getErrorResponse(): { status: number, msg: string } {
        return {
            status: StatusCodes.NOT_FOUND,
            msg: ErrorMessages.NOT_FOUND
        };
    }
}

/**
 * Errore interno del server.
 */
export class InternalServerError implements ErrorResponse {
    getErrorResponse(): { status: number, msg: string } {
        return {
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            msg:ErrorMessages.INTERNAL_SERVER_ERROR
        };
    }
}

/**
 * Errore per servizio non disponibile.
 */
export class ServiceUnavailableError implements ErrorResponse {
    getErrorResponse(): { status: number, msg: string } {
        return {
            status: StatusCodes.SERVICE_UNAVAILABLE,
            msg: ErrorMessages.SERVICE_UNAVAILABLE
        };
    }
}

/**
 * Errore per richiesta non valida.
 */

export class BadRequestError implements ErrorResponse {
    getErrorResponse(): { status: number, msg: string } {
        return {
            status: StatusCodes.BAD_REQUEST,
            msg: ErrorMessages.BAD_REQUEST
        };
    }
}

/**
 * Errore utente non trovato
 */

export class UserNotFoundError implements ErrorResponse {
    getErrorResponse(): { status: number, msg: string } {
        return {
            status: StatusCodes.NOT_FOUND,
            msg: ErrorMessages.USER_NOT_FOUND
        };
    }
}


/**
 * Errore utente non ha abbastanza token
 */

export class InsufficientTokensError implements ErrorResponse {
    getErrorResponse(): { status: number, msg: string } {
        return {
            status: StatusCodes.UNAUTHORIZED,
            msg: ErrorMessages.INSUFFICIENT_TOKENS
        };
    }
}

/**
 * Errore utente non ha abbastanza token
 */

export class InvalidStartDateError implements ErrorResponse {
    getErrorResponse(): { status: number, msg: string } {
        return {
            status: StatusCodes.BAD_REQUEST,
            msg: ErrorMessages.INVALID_START_DATE
        };
    }

}

/**
 * Errore utente non ha abbastanza token
 */

export class PlanNotFoundError implements ErrorResponse {
    getErrorResponse(): { status: number, msg: string } {
        return {
            status: StatusCodes.NOT_FOUND,
            msg: ErrorMessages.PLAN_NOT_FOUND
        };
    }

}

/**
 * Errore utente non ha abbastanza token
 */

export class PlansNotFoundError implements ErrorResponse {
    getErrorResponse(): { status: number, msg: string } {
        return {
            status: StatusCodes.NOT_FOUND,
            msg: ErrorMessages.NO_NAVIGATION_PLANS_FOUND
        };
    }

}

/**
 * Errore utente non ha abbastanza token
 */

export class PlanNotUpdateStatus implements ErrorResponse {
    getErrorResponse(): { status: number, msg: string } {
        return {
            status: StatusCodes.CONFLICT,
            msg: ErrorMessages.PLAN_ALREADY_CANCELLED
        };
    }

}
/**
 * Errore utente non ha abbastanza token
 */

export class PlanNotEditableStatus implements ErrorResponse {
    getErrorResponse(): { status: number, msg: string } {
        return {
            status: StatusCodes.CONFLICT,
            msg: ErrorMessages.PLAN_STATUS_NOT_EDITABLE
        };
    }

}

/**
 * Errore utente non ha abbastanza token
 */

export class RouteRestrictedError implements ErrorResponse {
    getErrorResponse(): { status: number, msg: string } {
        return {
            status: StatusCodes.FORBIDDEN,
            msg: ErrorMessages.ROUTE_RESTRICTED
        };
    }

}

/**
 * Errore utente non ha abbastanza token
 */

export class RestricreAreasNotFoundError implements ErrorResponse {
    getErrorResponse(): { status: number, msg: string } {
        return {
            status: StatusCodes.FORBIDDEN,
            msg: ErrorMessages.ROUTE_RESTRICTED
        };
    }

}


/**
 * Errore utente non ha abbastanza token
 */

export class CannotCancelPlanError implements ErrorResponse {
    getErrorResponse(): { status: number, msg: string } {
        return {
            status: StatusCodes.CONFLICT,
            msg: ErrorMessages.CANNOT_CANCEL_PLAN
        };
    }

}

/**
 * Errore utente non ha abbastanza token
 */

export class InavlidDateError implements ErrorResponse {
    getErrorResponse(): { status: number, msg: string } {
        return {
            status: StatusCodes.BAD_REQUEST,
            msg: ErrorMessages.INVALID_DATE_FORMAT
        };
    }

}

/**
 * Errore utente non ha abbastanza token
 */

export class ForbiddenRoleError implements ErrorResponse {
    getErrorResponse(): { status: number, msg: string } {
        return {
            status: StatusCodes.FORBIDDEN,
            msg: ErrorMessages.FORBIDDEN_ROLE
        };
    }
}

/**
 * Errore utente non ha abbastanza token
 */

export class RestrictedAreaNotFoundError implements ErrorResponse {
    getErrorResponse(): { status: number, msg: string } {
        return {
            status: StatusCodes.NOT_FOUND,
            msg: ErrorMessages.RESTRICTED_AREA_NOT_FOUND
        };
    }

}


export class InvalidCredenzialError implements ErrorResponse {
    getErrorResponse(): { status: number, msg: string } {
        return {
            status: StatusCodes.BAD_REQUEST,
            msg: ErrorMessages.INVALID_CREDENTIALS
        };
    }

}

export class InavalidRestrictedArea implements ErrorResponse {
    getErrorResponse(): { status: number, msg: string } {
        return {
            status: StatusCodes.BAD_REQUEST,
            msg: ErrorMessages.RESTRICTED_AREA_ALREADY_EXISTS
        };
    }

}


