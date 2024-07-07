import {Request, Response} from 'express';
import * as authService from '../services/authService';
import {StatusCodes, ReasonPhrases} from 'http-status-codes';

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log(req.body);
        const {email, password} = req.body;
        const token = await authService.loginPlayer(email, password);
        res.json({token});
    } catch (error: any) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: ReasonPhrases.INTERNAL_SERVER_ERROR});
    }
};