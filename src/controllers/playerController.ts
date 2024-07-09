import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import ResponseFactory from "../factories/responseFactory";
import { ErrorFactory } from "../factories/errorFactory";
import {repositories} from "../repositories";

export const getPlayerRanking = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const field = req.query.field as string || 'points';
    const order = req.query.order as string || 'DESC';

    try {
        // input parameters validation
        if (!['points', 'gamesPlayed', 'gamesWon'].includes(field)) {
            return next(ErrorFactory.badRequest('Invalid field for ordering'));
        }
        if (!['ASC', 'DESC'].includes(order.toUpperCase())) {
            return next(ErrorFactory.badRequest('Invalid order direction'));
        }

        const players = await repositories.player.findAllOrdering(field, order);

        res.status(StatusCodes.OK).json(ResponseFactory.success('Players retrieved successfully', players));
    } catch (error) {
        // error handling middleware will catch this error
        next(error);
    }
}