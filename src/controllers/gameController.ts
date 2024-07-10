import {NextFunction, Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import ResponseFactory from "../factories/responseFactory";
import * as gameService from "../services/gameService";
import {ExportStrategy, JSONExportStrategy, PdfExportStrategy} from "../strategies/exportStrategies";
import {AiLevel} from "../utils/aiLevels";


export const createGame = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const player_1_id = req.player!.id; // The player is guaranteed to be logged in because of the middleware

        const player_2_email = req.body.player_2_email;
        const AI_difficulty: AiLevel | undefined = req.body.AI_difficulty as AiLevel | undefined;

        await gameService.createGame(player_1_id, player_2_email, AI_difficulty);

        res.status(StatusCodes.OK).json(ResponseFactory.success('Game created successfully'));
    } catch (err) {
        next(err);
    }
}

export const gamesHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const player_id = req.player!.id;
        const startDate = req.startDate!;

        const games = await gameService.getGamesHistory(player_id, startDate);

        res.status(StatusCodes.OK).json(ResponseFactory.success("Games history retrieved successfully", games));
    } catch (err) {
        next(err);
    }
}

export const getWinCertificate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const playerId = req.player!.id;
        const gameId = req.params.gameId;

        const pdfBuffer = await gameService.getWinCertificate(playerId, parseInt(gameId));

        const pdfResponse = ResponseFactory.pdf(pdfBuffer, 'winCertificate.pdf');

        res.status(pdfResponse.statusCode)
            .setHeader('Content-Type', 'application/pdf')
            .setHeader('Content-Disposition', `attachment; filename=${pdfResponse.filename}`)
            .send(pdfResponse.data);
    } catch (err) {
        next(err);
    }
};

export const gameStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const playerId = req.player!.id;
        const gameId = req.params.gameId;

        const gameStatus = await gameService.getGameStatus(playerId, parseInt(gameId));

        res.status(StatusCodes.OK).json(ResponseFactory.success("Game status retrieved successfully", gameStatus));
    } catch (err) {
        next(err);
    }
}

export const makeMove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const playerId = req.player!.id;
        const gameId = req.params.gameId;
        const from = req.body.from;
        const to = req.body.to;

        const moveString = await gameService.move(from, to, playerId, parseInt(gameId));

        res.status(StatusCodes.OK).json(ResponseFactory.success('Move made successfully', {move: moveString}));
    } catch (err) {
        next(err);
    }
}

export const getChessboard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const playerId = req.player!.id;
        const gameId = req.params.gameId;

        const chessboard = await gameService.getChessboard(playerId, parseInt(gameId));

        const svgResponse = ResponseFactory.svg(chessboard, 'chessboard.svg');

        res.status(svgResponse.statusCode)
            .setHeader('Content-Type', 'image/svg+xml')
            .setHeader('Content-Disposition', `attachment; filename=${svgResponse.filename}`)
            .send(svgResponse.data);
    } catch (err) {
        next(err);
    }
}

export const getGameHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const gameId = req.params.gameId;
        const playerId = req.player!.id;
        const format = req.params.format;

        const moves = await gameService.getGameMoves(playerId, parseInt(gameId)); // Get the moves of the game
        let exportStrategy: ExportStrategy;

        if (format === 'pdf') {
            exportStrategy = new PdfExportStrategy();
        } else {
            exportStrategy = new JSONExportStrategy();
        }

        const exportedData = await exportStrategy.export(moves);

        const response = format === 'pdf' ? ResponseFactory.pdf(exportedData, 'gameHistory.pdf') : ResponseFactory.success('Game history retrieved successfully', exportedData);

        res.status(response.statusCode)
            .setHeader('Content-Type', format === 'pdf' ? 'application/pdf' : 'application/json')
            .setHeader('Content-Disposition', `attachment; filename=${format === 'pdf' ? 'gameHistory.pdf' : 'gameHistory.json'}`)
            .send(response.data);
    } catch (error) {
        next(error);
    }
};

export const abandonGame = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const playerId = req.player!.id;
        const gameId = req.params.gameId;

        await gameService.abandon(playerId, parseInt(gameId));

        res.status(StatusCodes.OK).json(ResponseFactory.success('Game abandoned. You lost!'));
    } catch (err) {
        next(err);
    }
}