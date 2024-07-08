import express from 'express';
import * as gameController from '../controllers/gameController';
import {authenticateJWT} from "../middlewares/authMiddleware";
const router = express.Router();

router.use(authenticateJWT); // This middleware will be executed before the route handlers
router.post('/create',gameController.newGame);
router.get('/history',gameController.getGames);

export default router;