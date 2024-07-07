import {NextFunction, Request, Response} from 'express';
import {verifyToken} from '../services/authService';
import {StatusCodes} from 'http-status-codes';

export interface JwtPayload {
    email: string;
    role: string;
}

declare global {
    namespace Express {
        interface Request {
            player?: JwtPayload;
        }
    }
}

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1]; // Bearer <token>
        try {
            req.player = verifyToken(token) as JwtPayload;
            next();
        } catch (err) {
            return res.status(StatusCodes.FORBIDDEN).json({message: 'Invalid or expired token'});
        }
    } else {
        res.status(StatusCodes.UNAUTHORIZED).json({message: 'Authentication token is missing'});
    }
}

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    const role = req.player?.role;

    console.log("req.player?.role", role);
    console.log(typeof role);

    if (typeof role === 'number' && role === 0) {
        next();
    } else {
        res.status(StatusCodes.FORBIDDEN).json({ message: 'You do not have the necessary permissions' });
    }
};