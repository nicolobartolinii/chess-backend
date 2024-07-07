import {Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import {rechargePlayerTokensmodel}  from "../models/player";

// recharge player by email and amount
export const rechargePlayerTokens = async (req: Request, res: Response) => {
    const { email, tokens } = req.body;

    if (!email || tokens == null || tokens <= 0) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid email or token amount' });
    }

    try {
        const success = await rechargePlayerTokensmodel(email, tokens);
        if (success) {
            res.status(StatusCodes.OK).json({ message: 'Tokens updated successfully' });
        } else {
            res.status(StatusCodes.NOT_FOUND).json({ message: 'Player not found or error occurred' });
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error updating tokens', error: error });
    }
};