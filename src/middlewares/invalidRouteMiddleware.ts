import {ErrorFactory} from "../factories/errorFactory";
import {NextFunction, Request, Response} from "express";

/**
 * Middleware to handle requests to undefined routes.
 *
 * This middleware is executed when a request does not match any of the defined routes in the server.
 * It creates a standardized error using the ErrorFactory with a 'not found' message indicating that
 * the requested route is not available. This error is then passed to the next error handling middleware
 * in the stack to handle the response appropriately.
 *
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @param {NextFunction} next - The next function
 *
 * @returns {void} - It does not return a value but calls the next function with the created error.
 */
export const invalidRouteMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const error = ErrorFactory.notFound('Route not found');
    next(error);
};