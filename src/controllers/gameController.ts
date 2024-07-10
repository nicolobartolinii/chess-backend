import {Request, Response, NextFunction} from 'express';
import {StatusCodes} from 'http-status-codes';
import ResponseFactory from "../factories/responseFactory";
import {ErrorFactory} from "../factories/errorFactory";
import * as gameService from "../services/gameService";
import {ExportStrategy, JSONExportStrategy, PdfExportStrategy} from "../strategies/exportStrategies";
import {AiLevel, AI_LEVELS} from "../utils/aiLevels";


export const createGame = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.player) {
            return next(ErrorFactory.unauthorized('Not logged in'));
        }

        const player_1_id = req.player.id;

        const player_2_email = req.body.player_2_email;
        const AI_difficulty: AiLevel | undefined = req.body.AI_difficulty as AiLevel | undefined;

        if (!player_2_email && !AI_difficulty) {
            return next(ErrorFactory.badRequest('Player 2 email or AI difficulty is required'));
        }

        if (typeof player_2_email !== 'string' && player_2_email !== undefined) {
            return next(ErrorFactory.badRequest('Invalid player 2 email'));
        }

        if (AI_difficulty !== undefined && !(AI_LEVELS.includes(AI_difficulty))) {
            return next(ErrorFactory.badRequest('Invalid AI difficulty'));
        }

        await gameService.createGame(player_1_id, player_2_email, AI_difficulty);

        res.status(StatusCodes.OK).json(ResponseFactory.success('Game created successfully'));
    } catch (err) {
        next(err);
    }
}

export const gamesHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.player) {
            return next(ErrorFactory.unauthorized('Not logged in'));
        }

        if (!req.startDate) {
            return next(ErrorFactory.internalServerError('Start date not validated'));
        }

        const player_id = req.player.id;
        const startDate = req.startDate;


        const games = await gameService.getGamesHistory(player_id, startDate);

        res.status(StatusCodes.OK).json(ResponseFactory.success("Games history retrieved successfully", games));
    } catch (err) {
        next(err);
    }
}

// create a pdf about the winnery of the match

export const getGameWinner = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.player) {
            return next(ErrorFactory.unauthorized('Not logged in'));
        }

        const player_id = req.player.id;
        const game_id = req.params.gameId;
        const numericGameId = parseInt(game_id, 10);
        if (isNaN(numericGameId)) {
            return next(ErrorFactory.badRequest('Invalid game ID'));
        }

        const pdfBuffer = await gameService.winnerGame(player_id, numericGameId);

        res.setHeader('Content-Disposition', 'attachment; filename=gameDetails.pdf');
        res.setHeader('Content-Type', 'application/pdf');
        res.status(StatusCodes.OK).send(pdfBuffer);
    } catch (err) {
        next(err);
    }
};

export const gameStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.player) {
            return next(ErrorFactory.unauthorized('Not logged in'));
        }

        const player_id = req.player.id;
        const gameId = req.params.gameId;

        if (typeof gameId !== "string") {
            return next(ErrorFactory.badRequest('Invalid game id'));
        }

        const gameStatus = await gameService.getGameStatus(player_id, parseInt(gameId));

        res.status(StatusCodes.OK).json(ResponseFactory.success("Game status retrieved successfully", gameStatus));
    } catch (err) {
        next(err);
    }
}

export const makeMove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.player) {
            return next(ErrorFactory.unauthorized('Not logged in'));
        }

        const playerId = req.player.id;
        const gameId = req.params.gameId;
        const from = req.body.from;
        const to = req.body.to;

        if (typeof gameId !== "string") {
            return next(ErrorFactory.badRequest('Invalid game id'));
        }

        if (!from || !to) {
            return next(ErrorFactory.badRequest('Move parameters are required'));
        }

        if (typeof from !== "string" || typeof to !== "string") {
            return next(ErrorFactory.badRequest('Invalid move'));
        }

        const moveString = await gameService.move(from, to, playerId, parseInt(gameId));

        res.status(StatusCodes.OK).json(ResponseFactory.success('Move made successfully', {move: moveString}));
    } catch (err) {
        next(err);
    }
}

export const getChessboard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if (!req.player) {
            return next(ErrorFactory.unauthorized('Not logged in'));
        }

        const playerId = req.player.id;
        const gameId = req.params.gameId;

        if (typeof gameId !== "string") {
            return next(ErrorFactory.badRequest('Invalid game id'));
        }

        const chessboard = await gameService.getChessboard(playerId, parseInt(gameId));

        const svgResponse = ResponseFactory.svg(chessboard, 'chessboard.svg');

        res.status(svgResponse.statusCode)
            .setHeader('Content-Type', 'image/svg+xml')
            .setHeader('Content-Disposition', `attachment; filename=${svgResponse.filename}`)
            .send(svgResponse.content);
    } catch (err) {
        next(err);
    }
}

export const getGameHistory = async (req: Request, res: Response, next: NextFunction)    => {
    try {
        if (!req.player) {
            return next(ErrorFactory.unauthorized('Not logged in'));
        }
        const gameId = req.params.gameId;
        const player_id = req.player.id;
        const format = req.params.format;

        //check if the format is valid
        if (format !== 'pdf' && format !== 'json') {
            return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid format' });
        }

        const moves = await gameService.getGameMoves(player_id, parseInt(gameId)); // Get the moves of the game

        let exportStrategy: ExportStrategy;
        if (format === 'pdf') {
            exportStrategy = new PdfExportStrategy();
        } else {
            exportStrategy = new JSONExportStrategy();
        }

        const exportedData = await exportStrategy.export(moves);

        res.setHeader('Content-Type', format === 'pdf' ? 'application/pdf' : 'application/json');
        res.send(exportedData);
    } catch (error) {
        next(error);
    }
};
