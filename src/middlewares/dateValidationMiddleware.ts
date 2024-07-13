import {NextFunction, Request, Response} from 'express';
import {ErrorFactory} from '../factories/errorFactory';

declare global {
    namespace Express {
        interface Request {
            startDate: Date;
        }
    }
}

/**
 * Middleware to validate and parse a start date provided in the query parameters.
 *
 * This middleware checks if a start date is provided in the request's query parameters.
 * If no start date is provided, it defaults to January 1, 1970. It validates the format
 * of the provided date string (YYYY-MM-DD) and parses it to a Date object, storing it in
 * req.startDate. If any validations fail, a bad request error is generated.
 *
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @param {NextFunction} next - The next function
 *
 * @returns {void} - Calls the next middleware or error handler
 */
export const dateValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const start_date = req.query.start_date;
    if (!start_date) {
        req.startDate = new Date("1970-01-01");
        return next();
    }

    if (typeof start_date !== 'string') {
        return next(ErrorFactory.badRequest('Start date must be a string'));
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/; // Format YYYY-MM-DD
    if (!dateRegex.test(start_date)) {
        return next(ErrorFactory.badRequest('Invalid date format. Use YYYY-MM-DD'));
    }

    const parsedDate = new Date(start_date);
    if (isNaN(parsedDate.getTime())) {
        return next(ErrorFactory.badRequest('Invalid date'));
    }

    req.startDate = parsedDate;
    next();
}
/**
 * Middleware to validate the order parameter provided in the query parameters.
 *
 * This middleware checks if an order parameter is provided in the request's query parameters
 * and verifies that it is a string. It further checks if the value of the order parameter
 * is either 'ASC' or 'DESC', case-insensitively. If the order parameter is missing, not a string,
 * or not one of the specified valid values, a bad request error is generated and the processing
 * is halted.If the order parameter passes all checks, processing moves to the next middleware.
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @param {NextFunction} next - The next function
 *
 * @returns {void} - Calls the next middleware or error handler
 */
export const orderValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const order = req.query.order;

    if (typeof order !== 'string') {
        return next(ErrorFactory.badRequest('Order must be strings'));
    }
    if (!['ASC', 'DESC'].includes(order.toUpperCase())) {
        return next(ErrorFactory.badRequest('Invalid order direction'));
    }
    next();
}