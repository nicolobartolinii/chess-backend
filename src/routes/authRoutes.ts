import express from 'express';
import * as authController from '../controllers/authController';
import {emailValidationMiddleware, passwordValidationMiddleware} from "../middlewares/authMiddlewares";
/** Express router to handle authentication-related actions and endpoints. */
const router = express.Router();

/**
 * GET /login - Handles the login process.
 * This route applies middleware to validate the email and password provided in the request.
 * After validation, it passes control to the login controller which processes the login.
 */
router.get('/login', emailValidationMiddleware, passwordValidationMiddleware, authController.login);

export default router;