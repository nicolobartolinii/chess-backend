import express from 'express';
import * as adminController from '../controllers/adminController';
import {authenticateJWT, emailValidationMiddleware, isAdmin, adminTokensValidationMiddleware} from "../middlewares/authMiddlewares";

const router = express.Router();

router.use(authenticateJWT); // Authentication middleware. Checks for JWT in the request headers and verifies it
router.use(isAdmin); // Middleware to check if the user is an admin
router.use(emailValidationMiddleware);
router.use(adminTokensValidationMiddleware);

router.post('/updateTokens', adminController.updatePlayerTokens);

export default router;