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

const router = express.Router();

router.use(authenticateJWT); // Authentication middleware

router.post('/create', gameValidationMiddleware, gameController.createGame);
router.get('/history', dateValidationMiddleware, gameController.gamesHistory);
router.get('/status/:gameId', gameIdValidationMiddleware, gameController.gameStatus);
router.get('/win-certificate/:gameId', gameIdValidationMiddleware, gameController.getWinCertificate);
router.post('/move/:gameId', gameIdValidationMiddleware, moveValidationMiddleware, gameController.makeMove);
router.get('/chessboard/:gameId', gameIdValidationMiddleware, gameController.getChessboard);
router.get('/history_game/:gameId/:format?', gameIdValidationMiddleware, exportFormatValidationMiddleware, gameController.getGameHistory);
router.post('/abandon/:gameId', gameIdValidationMiddleware, gameController.abandonGame);

export default router;