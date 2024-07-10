import express from 'express';
import * as gameController from '../controllers/gameController';
import {authenticateJWT} from "../middlewares/authMiddlewares";
import {dateValidationMiddleware} from "../middlewares/dateValidationMiddleware";
import {
    exportFormatValidationMiddleware,
    gameIdValidationMiddleware,
    gameValidationMiddleware,
    moveValidationMiddleware
} from "../middlewares/gameMiddlewares";

/** Express router to handle game-related actions and endpoints. */
const router = express.Router();
/** Authentication middleware. Checks for JWT in the request headers and verifies it */
router.use(authenticateJWT); // Authentication middleware
/** POST /create - Creates a new game */
router.post('/create', gameValidationMiddleware, gameController.createGame);
//** GET /history - Retrieves the game history */
router.get('/history', dateValidationMiddleware, gameController.gamesHistory);
/** GET /status/:gameId - Retrieves the status of a game */
router.get('/status/:gameId', gameIdValidationMiddleware, gameController.gameStatus);
/** GET /win-certificate/:gameId - Retrieves a win certificate for a game */
router.get('/win-certificate/:gameId', gameIdValidationMiddleware, gameController.getWinCertificate);
/** POST /move/:gameId - Makes a move in a game */
router.post('/move/:gameId', gameIdValidationMiddleware, moveValidationMiddleware, gameController.makeMove);
/** GET /chessboard/:gameId - Retrieves the chessboard for a game */
router.get('/chessboard/:gameId', gameIdValidationMiddleware, gameController.getChessboard);
/** GET /details/:gameId - Retrieves the game history in a specific format */
router.get('/details/:gameId/:format?', gameIdValidationMiddleware, exportFormatValidationMiddleware, gameController.getGameHistory);
/** POST /abandon/:gameId - Abandons a game */
router.post('/abandon/:gameId', gameIdValidationMiddleware, gameController.abandonGame);

export default router;