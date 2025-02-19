import express from 'express';
import * as gameController from '../controllers/gameController';
import {authenticateJWT} from "../middlewares/authMiddlewares";
import {dateValidationMiddleware, orderValidationMiddleware} from "../middlewares/dateValidationMiddleware";
import {
    exportFormatValidationMiddleware,
    gameIdValidationMiddleware,
    gameValidationMiddleware,
    moveValidationMiddleware
} from "../middlewares/gameMiddlewares";

/** Express router to handle game-related actions and endpoints. */
const router = express.Router();
/** Authentication middleware. Checks for JWT in the request headers and verifies it */
router.use(authenticateJWT);

/** POST /create - Creates a new game */
router.post('/', gameValidationMiddleware, gameController.createGame);
/** GET /history - Retrieves the game history */
router.get('/', dateValidationMiddleware, orderValidationMiddleware, gameController.gamesHistory);
/** GET /status/:gameId - Retrieves the status of a game */
router.get('/:gameId?/status', gameIdValidationMiddleware, gameController.gameStatus);
/** GET /win-certificate/:gameId - Retrieves a win certificate for a game */
router.get('/:gameId/win-certificate', gameIdValidationMiddleware, gameController.getWinCertificate);
/** POST /move/:gameId - Makes a move in a game */
router.post('/move', moveValidationMiddleware, gameController.makeMove);
/** GET /chessboard/:gameId - Retrieves the chessboard for a game */
router.get('/:gameId/chessboard', gameIdValidationMiddleware, gameController.getChessboard);
/** GET /details/:gameId - Retrieves the game history in a specific format */
router.get('/:gameId/details/:format?', gameIdValidationMiddleware, exportFormatValidationMiddleware, gameController.getGameDetails);
/** POST /abandon/:gameId - Abandons a game */
router.post('/move/abandon', gameController.abandonGame);

export default router;