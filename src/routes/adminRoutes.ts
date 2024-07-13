import express from 'express';
import * as adminController from '../controllers/adminController';
import {
    adminTokensValidationMiddleware,
    authenticateJWT,
    emailValidationMiddleware,
    isAdmin
} from "../middlewares/authMiddlewares";

/** Express router to mount admin related functions on. */
const router = express.Router();

/** Authentication middleware. Checks for JWT in the request headers and verifies it */
router.use(authenticateJWT);
/** Middleware to check if the user role is admin */
router.use(isAdmin);
/** Middlewares to validate the email and tokens in the request body */
router.use(emailValidationMiddleware);
router.use(adminTokensValidationMiddleware);

/** POST /admin/update-tokens - Updates the token count of a player by its email address */
router.post('/update-tokens', adminController.updatePlayerTokens);

export default router;