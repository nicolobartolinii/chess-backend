import {NextFunction, Request, Response} from 'express';
import {ErrorFactory} from "../factories/errorFactory";

/**
 * Middleware to validate query parameters used for sorting player rankings.
 *
 * Validates the 'field' and 'order' query parameters. 'field' determines which
 * attribute of the player to sort by, and 'order' specifies the sorting direction.
 * Valid fields include 'points', 'gamesPlayed', and 'gamesWon'. It must be either
 * 'ASC' or 'DESC'. If any parameter is invalid, a bad request error is returned.
 *
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @param {NextFunction} next - The next function
 *
 * @returns {void} - Calls the next middleware or error handler.
 */
export const validatePlayerRanking = (req: Request, res: Response, next: NextFunction): void => {
    const field = req.query.field as string;
    const order = req.query.order as string;
    if (!field || !order) {
        return next(ErrorFactory.badRequest('Both field and order parameters must be provided'));
    }

    if (!['points'].includes(field)) {
        return next(ErrorFactory.badRequest('Invalid field for ordering'));
    }

    if (!['ASC', 'DESC'].includes(order.toUpperCase())) {
        return next(ErrorFactory.badRequest('Invalid order direction'));
    }
    next();
};