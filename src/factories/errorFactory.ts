import {StatusCodes, ReasonPhrases} from 'http-status-codes';

class CustomError extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

class ErrorFactory {
    static badRequest(message: string = ReasonPhrases.BAD_REQUEST): CustomError {
        return new CustomError(message, StatusCodes.BAD_REQUEST);
    }

    static unauthorized(message: string = ReasonPhrases.UNAUTHORIZED): CustomError {
        return new CustomError(message, StatusCodes.UNAUTHORIZED);
    }

    static forbidden(message: string = ReasonPhrases.FORBIDDEN): CustomError {
        return new CustomError(message, StatusCodes.FORBIDDEN);
    }

    static notFound(message: string = ReasonPhrases.NOT_FOUND): CustomError {
        return new CustomError(message, StatusCodes.NOT_FOUND);
    }

    static conflict(message: string = ReasonPhrases.CONFLICT): CustomError {
        return new CustomError(message, StatusCodes.CONFLICT);
    }

    static internalServerError(message: string = ReasonPhrases.INTERNAL_SERVER_ERROR): CustomError {
        return new CustomError(message, StatusCodes.INTERNAL_SERVER_ERROR);
    }

    static customError(message: string, statusCode: number): CustomError {
        return new CustomError(message, statusCode);
    }
}

export { ErrorFactory, CustomError };