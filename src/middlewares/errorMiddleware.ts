import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../factories/errorFactory';
import ResponseFactory from '../factories/responseFactory';
import { StatusCodes } from 'http-status-codes';

/**
 * Express middleware to handle errors that occur during request processing.
 * This middleware handles custom errors and falls back to a generic 500 Internal Server Error
 * for any other types of errors.
 *
 * It uses the CustomError class to check if the error is an instance of CustomError, which
 * contains a status code and a message. For such errors, it sends a response with the
 * respective status code and a JSON object created by ResponseFactory.error.
 *
 * For all other types of errors, it logs the error and sends a 500 Internal Server Error
 * response.
 *
 * @param {Error} err - The error object
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @param {NextFunction} next - The next function
 *
 * @returns {Response} - Sends a JSON response with the error message and status code.
 */
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err);

    if (err instanceof CustomError) {
        return res.status(err.statusCode).json(
            ResponseFactory.error(err.message, err.statusCode)
        );
    }

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
        ResponseFactory.error('Internal Server Error', StatusCodes.INTERNAL_SERVER_ERROR)
    );
};