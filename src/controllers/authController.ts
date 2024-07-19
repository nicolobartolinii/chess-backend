import {NextFunction, Request, Response} from 'express';
import * as authService from '../services/authService';
import {StatusCodes} from 'http-status-codes';
import ResponseFactory from '../factories/responseFactory';
import {ErrorFactory} from '../factories/errorFactory';

/**
 * This function is used in the /login route.
 * It logs in a player by their email and password.
 *
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @param {NextFunction} next - The next function
 *
 * @returns {Promise<void>} - A promise that resolves when the player is logged in. The response contains a JWT token.
 */
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