import {Request, Response, NextFunction} from 'express';
import {StatusCodes} from 'http-status-codes';
import ResponseFactory from "../factories/responseFactory";
import {repositories} from "../repositories";

/**
 * This function is used in the /player/ranking route.
 * It retrieves the ranking of all players in the database.
 * The ranking is based on the field and order provided in the request query.
 *
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @param {NextFunction} next - The next function
 *
 * @returns {Promise<void>} - A promise that resolves when the players are retrieved.
 * The response contains the ranking of all players.
 */
export const getPlayerRanking = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const field = req.query.field as string || 'points';
    const order = req.query.order as string || 'DESC';

    try {
        const players = await repositories.player.findAllOrdering(field, order);
        res.status(StatusCodes.OK).json(ResponseFactory.success('Players retrieved successfully', players));
    } catch (error) {
        next(error);
    }
}