import {NextFunction, Request, Response} from 'express';
import {ErrorFactory} from "../factories/errorFactory";
import {AI_LEVELS} from "../utils/aiLevels";

/**
 * Middleware to validate the presence and correctness of player 2's email or AI difficulty level.
 *
 * Checks if either 'player_2_email' or 'AI_difficulty' is provided in the request body.
 * Validates that 'player_2_email' is a string if provided, and 'AI_difficulty' is a valid
 * difficulty level defined in AI_LEVELS array. Returns a bad request error if validations fail.
 *
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @param {NextFunction} next - The next function
 *
 * @returns {void} - Calls the next middleware or error handler
 */
export const gameValidationMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const {player_2_email, AI_difficulty} = req.body;

    if (!player_2_email && !AI_difficulty) {
        return next(ErrorFactory.badRequest('Player 2 email or AI difficulty must be provided'));
    }

    if (typeof player_2_email !== 'string' && player_2_email !== undefined) {
        return next(ErrorFactory.badRequest('Invalid player 2 email'));
    }

    if (AI_difficulty !== undefined && !(AI_LEVELS.includes(AI_difficulty))) {
        return next(ErrorFactory.badRequest(`Invalid AI difficulty. Choose from: ${AI_LEVELS.join(', ')}.`));
    }

    next();
}

/**
 * Middleware to validate the format of the game ID parameter in the URL.
 *
 * Ensures the 'gameId' is a string. If not, it generates a bad request error.
 * This is important for routing parameters to conform to expected formats
 * for subsequent database queries or logic.
 *
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @param {NextFunction} next - The next function
 *
 * @returns {void} - Calls the next middleware or error handler.
 */
export const gameIdValidationMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const gameId = req.params.gameId;
    if (!gameId) {
        return next();
    }

    if (typeof gameId !== "string" || isNaN(parseInt(gameId)) || parseInt(gameId) < 1) {
        return next(ErrorFactory.badRequest('Invalid game ID'));
    }

    next();
}
/**
 * Middleware to validate the parameters for a game move.
 *
 * Checks that 'from' and 'to' parameters are present and are strings.
 * These parameters are crucial for game logic to process moves correctly.
 * If validations fail, a bad request error is returned.
 *
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @param {NextFunction} next - The next function
 *
 * @returns {void} - Calls the next middleware or error handler
 */
export const moveValidationMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const from = req.body.from;
    const to = req.body.to;

    if (!from || !to) {
        return next(ErrorFactory.badRequest('Both move parameters are required'));
    }

    if (typeof from !== "string" || typeof to !== "string") {
        return next(ErrorFactory.badRequest('Invalid move'));
    }

    next();
}

/**
 * Middleware to validate the export format parameter in the URL.
 *
 * Ensures the 'format' parameter matches allowed values ('pdf' or 'json').
 * This validation is essential for generating the correct file type in response.
 * If the format is not valid, a bad request error is generated.
 *
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @param {NextFunction} next - The next function
 *
 * @returns {void} - Calls the next middleware or error handler
 */
export const exportFormatValidationMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    if (!req.query.format) {
        req.query.format = 'json';
    }

    const format = req.query.format;

    if (format !== 'pdf' && format !== 'json') {
        return next(ErrorFactory.badRequest('Invalid format'));
    }

    next();
}