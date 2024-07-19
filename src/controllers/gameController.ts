import {NextFunction, Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import ResponseFactory from "../factories/responseFactory";
import * as gameService from "../services/gameService";
import {IExportStrategy, JSONExportStrategy, PdfExportStrategy} from "../strategies/exportStrategies";
import {AiLevel} from "../utils/aiLevels";
import {abandon, getGameMoves, move} from "../services/moveService";

/**
 * This function is used in the /games/create route.
 * It creates a new game between two players. The first player is the one who is logged in.
 * The second player can be another player or an AI. Either the email of the second player or the AI difficulty
 * must be provided in the request body.
 *
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @param {NextFunction} next - The next function
 *
 * @returns {Promise<void>} - A promise that resolves when the game is created. The response contains a success message.
 */
export const createGame = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const player_1_id = req.player!.id; // The player is guaranteed to be logged in because of the middleware

        const player_2_email = req.body.player_2_email;
        const AI_difficulty: AiLevel | undefined = req.body.AI_difficulty as AiLevel | undefined;

        const newGame = await gameService.createGame(player_1_id, player_2_email, AI_difficulty);

        res.status(StatusCodes.CREATED).json(ResponseFactory.successCreated('Game created successfully', {
            game_id: newGame.game_id,
            player_1_id: newGame.player_1_id,
            player_2_id: newGame.player_2_id,
            AI_difficulty: newGame.AI_difficulty,
            game_status: newGame.game_status,
            start_date: newGame.start_date
        }));
    } catch (err) {
        next(err);
    }
}

/**
 * This function is used in the /games/history route.
 * It retrieves the games history of the player who is logged in.
 * The games history is returned in the response.
 *
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @param {NextFunction} next - The next function
 *
 * @returns {Promise<void>} - A promise that resolves when the games history is retrieved. The response contains the games history.
 */
export const gamesHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const player_id = req.player!.id;
        const startDate = req.startDate!;
        const order = req.query.order as string;
        const games = await gameService.getGamesHistory(player_id, startDate, order);

        res.status(StatusCodes.OK).json(ResponseFactory.success("Games history retrieved successfully", games));
    } catch (err) {
        next(err);
    }
}

/**
 * This function is used in the /games/win-certificate/:gameId route.
 * It generates a win certificate for the player who is logged in.
 * The win certificate is generated for the game with the ID provided in the request parameters.
 * The win certificate is returned in the response as a PDF file.
 *
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @param {NextFunction} next - The next function
 *
 * @returns {Promise<void>} - A promise that resolves when the win certificate is generated. The response contains the win certificate as a PDF file.
 */
export const getWinCertificate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const playerId = req.player!.id;
        const game_id = req.params.gameId;

        const pdfBuffer = await gameService.getWinCertificate(playerId, parseInt(game_id));

        const pdfResponse = ResponseFactory.pdf(pdfBuffer, 'winCertificate.pdf');

        res.status(pdfResponse.statusCode)
            .setHeader('Content-Type', 'application/pdf')
            .setHeader('Content-Disposition', `attachment; filename=${pdfResponse.filename}`)
            .send(pdfResponse.data);
    } catch (err) {
        next(err);
    }
};

/**
 * This function is used in the /games/status/:gameId route.
 * It retrieves the status of the game with the ID provided in the request parameters.
 * The status of the game is returned in the response.
 *
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @param {NextFunction} next - The next function
 *
 * @returns {Promise<void>} - A promise that resolves when the game status is retrieved. The response contains the game status.
 */
export const gameStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const playerId = req.player!.id;
        const gameId = req.params.gameId;

        const gameStatus = gameId ? await gameService.getGameStatus(playerId, parseInt(gameId)) : await gameService.getGameStatus(playerId);

        res.status(StatusCodes.OK).json(ResponseFactory.success("Game status retrieved successfully", gameStatus));
    } catch (err) {
        next(err);
    }
}

/**
 * This function is used in the /games/move/:gameId route.
 * It makes a move in the game with the ID provided in the request parameters.
 * The move is made by the player who is logged in. The move is made from the position provided in the request body
 * to the position provided in the request body. The move details is returned in the response.
 *
 * If the opponent is an AI, the AI will make a move after the player makes a move and the response will contain also the AI's move.
 *
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @param {NextFunction} next - The next function
 *
 * @returns {Promise<void>} - A promise that resolves when the move is made. The response contains the move.
 */
export const makeMove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const playerId = req.player!.id;
        const from = req.body.from;
        const to = req.body.to;

        const moveString = await move(from, to, playerId);

        res.status(StatusCodes.CREATED).json(ResponseFactory.successCreated('Move made successfully', {move: moveString}));
    } catch (err) {
        next(err);
    }
}

/**
 * This function is used in the /games/chessboard/:gameId route.
 * It retrieves the chessboard of the game with the ID provided in the request parameters.
 * The chessboard is returned in the response as an SVG file.
 *
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @param {NextFunction} next - The next function
 *
 * @returns {Promise<void>} - A promise that resolves when the chessboard is retrieved. The response contains the chessboard as an SVG file.
 */
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

/**
 * This function is used in the /games/details/:gameId/:format? route.
 * It retrieves the game history of the game with the ID provided in the request parameters.
 * The game history is returned in the response. The format of the response can be either JSON or PDF.
 * If the format is PDF, the game history is returned as a PDF file. If the format is JSON, the game history is returned as a JSON object.
 *
 * The game history is the list of moves made in the game. Each move contains the move number,
 * the position the piece moved from, the position the piece moved to, the player who made the move and more.
 *
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @param {NextFunction} next - The next function
 *
 * @returns {Promise<void>} - A promise that resolves when the game history is retrieved. The response contains the game history.
 */
export const getGameDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const gameId = req.params.gameId;
        const playerId = req.player!.id;
        const format = req.query.format;

        const moves = await getGameMoves(playerId, parseInt(gameId)); // Get the moves of the game
        let exportStrategy: IExportStrategy;

        if (format === 'pdf') {
            exportStrategy = new PdfExportStrategy();
        } else {
            exportStrategy = new JSONExportStrategy();
        }

        const exportedData = await exportStrategy.export(moves);

        const response = format === 'pdf' ? ResponseFactory.pdf(exportedData, 'gameHistory.pdf') : ResponseFactory.success('Game details retrieved successfully', JSON.parse(exportedData));

        if (format === 'pdf') {
            res.status(response.statusCode)
                .setHeader('Content-Type', 'application/pdf')
                .setHeader('Content-Disposition', `attachment; filename=gameHistory.pdf`)
                .send(response.data);
        } else {
            res.status(response.statusCode).json(response);
        }
    } catch (error) {
        next(error);
    }
};

/**
 * This function is used in the /games/abandon/:gameId route.
 * It abandons the game with the ID provided in the request parameters.
 * The player who is logged in abandons the game. The response contains a success message.
 *
 * Abandoning a game means that the player who abandons the game loses the game.
 * The opponent wins the game.
 *
 * If the player abandons the game, they lose 0.5 points.
 *
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @param {NextFunction} next - The next function
 *
 * @returns {Promise<void>} - A promise that resolves when the game is abandoned. The response contains a success message.
 */
export const abandonGame = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const playerId = req.player!.id;

        await abandon(playerId);

        res.status(StatusCodes.CREATED).json(ResponseFactory.successCreated(`Game abandoned. You lost.`));
    } catch (err) {
        next(err);
    }
}