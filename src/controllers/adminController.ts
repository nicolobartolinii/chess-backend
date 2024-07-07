import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { rechargePlayerTokensmodel } from "../models/player";
import ResponseFactory from "../factories/responseFactory";
import { ErrorFactory } from "../factories/errorFactory";

export const rechargePlayerTokens = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { email, tokens } = req.body;

    try {
        if (!email || tokens == null || tokens <= 0) {
            throw ErrorFactory.badRequest('Invalid email or token amount');
        }

        const success = await rechargePlayerTokensmodel(email, tokens);

        if (success) {
            res.status(StatusCodes.OK).json(ResponseFactory.success('Tokens updated successfully'));
        } else {
            throw ErrorFactory.notFound('Player not found or error occurred');
        }
    } catch (error) {
        next(error);
    }
};