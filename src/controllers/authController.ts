import {Request, Response, NextFunction} from 'express';
import * as authService from '../services/authService';
import {StatusCodes} from 'http-status-codes';
import ResponseFactory from '../factories/responseFactory';
import {ErrorFactory} from '../factories/errorFactory';

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const {email, password} = req.body;

        const token = await authService.loginPlayer(email, password);

        if (!token) {
            return next(ErrorFactory.unauthorized('Invalid credentials'));
        }

        res.status(StatusCodes.OK).json(ResponseFactory.success('Login successful', {token}));
    } catch (error) {
        next(error);
    }
};