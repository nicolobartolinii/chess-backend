import {Request, Response} from 'express';
import {Player} from '../models/player';
import {StatusCodes, ReasonPhrases} from 'http-status-codes';

export const getPlayerRanking = async (req: Request, res: Response): Promise<void> => {
    try {
        const order: string = req.query.order as string;
        if (!order || !['asc', 'desc'].includes(order.toLowerCase())) {
            res.status(400).json({error: "Please specify 'order' as 'asc' or 'desc'."});
            return;
        }
        const players = await Player.findAll({
            order: [['points', order.toUpperCase()]]
        });
        res.json(players);
    } catch (error: any) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: ReasonPhrases.INTERNAL_SERVER_ERROR});
    }
};
