import express from 'express';
import * as authController from '../controllers/authController';
import {emailValidationMiddleware, passwordValidationMiddleware} from "../middlewares/authMiddlewares";

const router = express.Router();

router.get('/login', emailValidationMiddleware, passwordValidationMiddleware, authController.login);

export default router;