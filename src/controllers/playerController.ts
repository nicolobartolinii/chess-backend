import {Request, Response} from 'express';
import {orderPlayers, Player} from '../models/player';
import {StatusCodes, ReasonPhrases} from 'http-status-codes';

export const getPlayerRanking = async (req: Request, res: Response): Promise<void> => {
    const field = req.query.field as string || 'points'; // Default 'points' if not specified
    const order  = req.query.order as string   || 'DESC'; // Default 'DESC' if not specified

    try {
        const players = await orderPlayers(field, order);
        res.status(StatusCodes.OK).json(players);
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(ReasonPhrases.INTERNAL_SERVER_ERROR);
    }
}
