import {NextFunction, Request, Response} from 'express';
import * as playerService from '../services/playerService';
import {StatusCodes} from 'http-status-codes';
import ResponseFactory from "../factories/responseFactory";

/**
 * This function is used in the /admin/update-tokens route.
 * It updates the token count of a player by its email address
 * provided in the request body.
 *
 * Specifically, it replaces the current token count of the player
 * with the new token count provided in the request body.
 *
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @param {NextFunction} next - The next function
 *
 * @returns {Promise<void>} - A promise that resolves when the player's tokens are updated
 */
export const updatePlayerTokens = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const {email, tokens} = req.body;

        const updatedPlayer = await playerService.updatePlayerTokens(email, tokens);
        const mappedPlayer = {
            player_id: updatedPlayer.player_id,
            username: updatedPlayer.username,
            email: updatedPlayer.email,
            tokens: updatedPlayer.tokens,
            role: updatedPlayer.role
        };

        res.status(StatusCodes.CREATED).json(ResponseFactory.successCreated('Player tokens updated successfully', mappedPlayer));
    } catch (err) {
        next(err);
    }
};