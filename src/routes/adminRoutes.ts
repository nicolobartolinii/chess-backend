import express from 'express';
import * as adminController from '../controllers/adminController';
import {authenticateJWT, isAdmin} from "../middlewares/authMiddleware";

const router = express.Router();

router.use(authenticateJWT); // Authentication middleware. Checks for JWT in the request headers and verifies it
router.use(isAdmin); // Middleware to check if the user is an admin

router.post('/updateTokens', adminController.updatePlayerTokens);

export default router;