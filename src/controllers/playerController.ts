import { Request, Response } from 'express';
import { Player } from '../models/player';

export const getPlayerRanking = async (req: Request, res: Response): Promise<void> => {
    try {
        const order: string = req.query.order as string;
        if (!order || !['asc', 'desc'].includes(order.toLowerCase())) {
            res.status(400).json({ error: "Please specify 'order' as 'asc' or 'desc'." });
            return;
        }
        const players = await Player.findAll({
            order: [['points', order.toUpperCase()]]
        });
        res.json(players);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
