import { Request, Response, NextFunction } from 'express';
import { ErrorFactory } from "../factories/errorFactory";

/**
 * Middleware to validate query parameters used for sorting player rankings.
 *
 * Validates the 'field' and 'order' query parameters. 'field' determines which
 * attribute of the player to sort by and defaults to 'points' if not specified.
 * Valid fields include 'points', 'gamesPlayed', and 'gamesWon'. 'order' specifies
 * the sorting direction and defaults to 'DESC' if not specified. It must be either
 * 'ASC' or 'DESC'. If any parameter is invalid, a bad request error is returned.
 *
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @param {NextFunction} next - The next function
 *
 * @returns {void} - Calls the next middleware or error handler.
 */
export const validatePlayerRanking = (req: Request, res: Response, next: NextFunction): void => {
    const field = req.query.field as string || 'points';
    const order = req.query.order as string || 'DESC';

    if (!['points', 'gamesPlayed', 'gamesWon'].includes(field)) {
        return next(ErrorFactory.badRequest('Invalid field for ordering'));
    }

    if (!['ASC', 'DESC'].includes(order.toUpperCase())) {
        return next(ErrorFactory.badRequest('Invalid order direction'));
    }
    next();
};