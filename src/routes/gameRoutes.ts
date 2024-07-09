import express from 'express';
import * as gameController from '../controllers/gameController';
import {authenticateJWT} from "../middlewares/authMiddleware";
import {dateValidationMiddleware} from "../middlewares/dateValidationMiddleware";
const router = express.Router();

router.use(authenticateJWT); // Authentication middleware

router.post('/create', gameController.createGame);
router.get('/history', dateValidationMiddleware, gameController.gamesHistory);
router.get('/status/:gameId', gameController.gameStatus);
router.get('/winner/:gameId', gameController.getGameWinner);
router.post('/move/:gameId', gameController.makeMove);

export default router;