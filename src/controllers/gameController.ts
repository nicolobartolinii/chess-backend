import { Request, Response, NextFunction } from 'express';
import { orderPlayers } from '../models/player';
import { StatusCodes } from 'http-status-codes';
import ResponseFactory from "../factories/responseFactory";
import { ErrorFactory } from "../factories/errorFactory";
import {createGame, getGamesPlayer} from "../services/gameService";


export const newGame = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try{
        const player1_email = req.body.player1_email;
        console.log(player1_email)
        const player2_email = req.body.player2_email;
        const AI_difficulty = req.body.AI_difficulty;
        await createGame(player1_email, player2_email, AI_difficulty);
        res.status(StatusCodes.OK).json(ResponseFactory.success('Game created successfully'));
    } catch (err) {
        next(err);
    }
}

export const getGames = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try{
        const player1_email = typeof req.query.player1_email === 'string' ? req.query.player1_email : undefined;
        const start_date = typeof req.query.start_date === 'string' ? req.query.start_date : undefined;
        if (!player1_email) {
            throw ErrorFactory.badRequest('Player 1 email is required');
        }
        const games = await getGamesPlayer(player1_email, start_date)
        console.log(games);
        const response = games.map(Game => {
            return {
                game_id: Game.game_id,
            }

        })
        res.json(response);

    } catch (err) {
        next(err);
    }
}