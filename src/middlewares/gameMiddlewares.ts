import {Request, Response, NextFunction} from 'express';
import {ErrorFactory} from "../factories/errorFactory";
import {AI_LEVELS} from "../utils/aiLevels";

export const gameValidationMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const {player_2_email, AI_difficulty} = req.body;

    if (!player_2_email && !AI_difficulty) {
        return next(ErrorFactory.badRequest('Player 2 email or AI difficulty is required'));
    }

    if (typeof player_2_email !== 'string' && player_2_email !== undefined) {
        return next(ErrorFactory.badRequest('Invalid player 2 email'));
    }

    if (AI_difficulty !== undefined && !(AI_LEVELS.includes(AI_difficulty))) {
        return next(ErrorFactory.badRequest('Invalid AI difficulty'));
    }

    next();
}

export const gameIdValidationMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const gameId = req.params.gameId;
    if (typeof gameId !== "string") {
        return next(ErrorFactory.badRequest('Invalid game ID'));
    }

    next();
}

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

export const exportFormatValidationMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const format = req.params.format;

    if (format !== 'pdf' && format !== 'json') {
        return next(ErrorFactory.badRequest('Invalid format'));
    }

    next();
}