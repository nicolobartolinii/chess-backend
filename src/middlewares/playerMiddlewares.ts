import { Request, Response, NextFunction } from 'express';
import { ErrorFactory } from "../factories/errorFactory";

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