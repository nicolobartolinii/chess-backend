import { Request, Response, NextFunction } from 'express';
import { orderPlayers } from '../models/player';
import { StatusCodes } from 'http-status-codes';
import ResponseFactory from "../factories/responseFactory";
import { ErrorFactory } from "../factories/errorFactory";
import {createGame} from "../services/gameService";

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