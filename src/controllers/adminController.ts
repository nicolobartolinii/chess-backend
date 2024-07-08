import {NextFunction, Request, Response} from 'express';
import * as playerService from '../services/playerService';
import {StatusCodes} from 'http-status-codes';
import ResponseFactory from "../factories/responseFactory";
import {ErrorFactory} from "../factories/errorFactory";

export const updatePlayerTokens = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const {email, tokens} = req.body;

        if (!email || !tokens) {
            return next(ErrorFactory.badRequest('Email and tokens are required'));
        }

        if (typeof email !== 'string' || typeof tokens !== 'number' || tokens <= 0) {
            return next(ErrorFactory.badRequest('Invalid email or token amount'));
        }

        const updatedPlayer = await playerService.updatePlayerTokens(email, tokens);
        res.status(StatusCodes.OK).json(ResponseFactory.success('Player tokens updated successfully', updatedPlayer));
    } catch (err) {
        next(err);
    }
};