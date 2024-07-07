import express from 'express';
import * as adminController from '../controllers/adminController';
import {authenticateJWT, isAdmin} from "../middlewares/authMiddleware";
const router = express.Router();

router.use(authenticateJWT); // This middleware will be executed before the route handlers
router.use(isAdmin); // This middleware will be executed before the route handlers
console.log(" authenticateJWT" ,authenticateJWT);
console.log(" isAdmin" ,isAdmin);
router.post('/recharge',adminController.rechargePlayerTokens);

export default router;
