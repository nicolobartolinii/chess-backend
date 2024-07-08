import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import ResponseFactory from "../factories/responseFactory";
import { ErrorFactory } from "../factories/errorFactory";
import * as gameService from "../services/gameService";


export const createGame = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try{
        if (!req.player) {
            return next(ErrorFactory.unauthorized('Not logged in'));
        }

        const player_1_id = req.player.id;

        const player_2_email = req.body.player_2_email;
        const AI_difficulty = req.body.AI_difficulty;

        if (!player_2_email && !AI_difficulty) {
            return next(ErrorFactory.badRequest('Player 2 email or AI difficulty is required'));
        }

        if (typeof player_2_email !== 'string' && typeof AI_difficulty !== "number") {
            return next(ErrorFactory.badRequest('Invalid player 2 email or AI difficulty'));
        }

        await gameService.createGame(player_1_id, player_2_email, AI_difficulty);

        res.status(StatusCodes.OK).json(ResponseFactory.success('Game created successfully'));
    } catch (err) {
        next(err);
    }
}

export const gamesHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try{
        if (!req.player) {
            return next(ErrorFactory.unauthorized('Not logged in'));
        }

        if (!req.startDate) {
            return next(ErrorFactory.internalServerError('Start date not validated'));
        }

        const player_id = req.player.id;
        const startDate = req.startDate;

        // TODO: Add ordering for games history by start_date or end_date

        const games = await gameService.getGamesHistory(player_id, startDate);

        res.status(StatusCodes.OK).json(ResponseFactory.success("Games history retrieved successfully", games));
    } catch (err) {
        next(err);
    }
}