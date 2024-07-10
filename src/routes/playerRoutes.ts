import express from 'express';
import * as playerController from '../controllers/playerController';
import {validatePlayerRanking} from "../middlewares/playerMiddlewares";

const router = express.Router();

router.get('/ranking',validatePlayerRanking,playerController.getPlayerRanking);

export default router;