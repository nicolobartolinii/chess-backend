import {ReasonPhrases, StatusCodes} from 'http-status-codes';

/**
 * Class for creating custom errors.
 *
 * @class CustomError
 * @extends {Error}
 *
 * @property {number} statusCode - The status code of the error
 */
class CustomError extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Factory class for creating errors. Implementation of the Factory Method pattern.
 *
 * @class ErrorFactory
 */
class ErrorFactory {
    /**
     * Creates a bad request (400) error.
     *
     * @param {string} [message=ReasonPhrases.BAD_REQUEST] - The error message
     *
     * @returns {CustomError} - The bad request error
     */
    static badRequest(message: string = ReasonPhrases.BAD_REQUEST): CustomError {
        return new CustomError(message, StatusCodes.BAD_REQUEST);
    }

    /**
     * Creates an unauthorized (401) error.
     *
     * @param {string} [message=ReasonPhrases.UNAUTHORIZED] - The error message
     *
     * @returns {CustomError} - The unauthorized error
     */
    static unauthorized(message: string = ReasonPhrases.UNAUTHORIZED): CustomError {
        return new CustomError(message, StatusCodes.UNAUTHORIZED);
    }

    /**
     * Creates a forbidden (403) error.
     *
     * @param {string} [message=ReasonPhrases.FORBIDDEN] - The error message
     *
     * @returns {CustomError} - The forbidden error
     */
    static forbidden(message: string = ReasonPhrases.FORBIDDEN): CustomError {
        return new CustomError(message, StatusCodes.FORBIDDEN);
    }

    /**
     * Creates a not found (404) error.
     *
     * @param {string} [message=ReasonPhrases.NOT_FOUND] - The error message
     *
     * @returns {CustomError} - The not found error
     */
    static notFound(message: string = ReasonPhrases.NOT_FOUND): CustomError {
        return new CustomError(message, StatusCodes.NOT_FOUND);
    }

    /**
     * Creates a Internal Server Error (500) error.
     *
     * @param message
     */
    static internalServerError(message: string = ReasonPhrases.INTERNAL_SERVER_ERROR): CustomError {
        return new CustomError(message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

export {ErrorFactory, CustomError};