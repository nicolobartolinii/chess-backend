import express from 'express';
import * as playerController from '../controllers/playerController';

const router = express.Router();

router.get('/rank', playerController.getPlayerRanking);

export default router;