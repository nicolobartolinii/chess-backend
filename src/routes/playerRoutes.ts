import express from 'express';
import * as playerController from '../controllers/playerController';
import {validatePlayerRanking} from "../middlewares/playerMiddlewares";
/** Express router to handle player-related actions and endpoints. */
const router = express.Router();
/**
 * GET /ranking - Retrieves the player ranking.
 * It is the only route in this router that does not require authentication, making the rankings publicly accessible.
 */
router.get('/ranking',validatePlayerRanking,playerController.getPlayerRanking);

export default router;