import {NextFunction, Request, Response} from 'express';
import * as playerService from '../services/playerService';
import {StatusCodes} from 'http-status-codes';
import ResponseFactory from "../factories/responseFactory";

export const updatePlayerTokens = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const {email, tokens} = req.body;

        const updatedPlayer = await playerService.updatePlayerTokens(email, tokens);
        res.status(StatusCodes.OK).json(ResponseFactory.success('Player tokens updated successfully', updatedPlayer));
    } catch (err) {
        next(err);
    }
};