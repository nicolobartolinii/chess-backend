import {NextFunction, Request, Response} from 'express';
import {verifyToken} from '../services/authService';
import {JwtPayload} from "../utils/jwt";
import {ErrorFactory} from "../factories/errorFactory";

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
        } catch {
            return next(ErrorFactory.forbidden('Invalid or expired token'));
        }
    } else {
        return next(ErrorFactory.forbidden('Token not provided'));
    }
}

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    const role = req.player?.role;

    console.log("req.player?.role", role);
    console.log(typeof role);

    if (typeof role === 'number' && role === 0) {
        next();
    } else {
        return next(ErrorFactory.forbidden());
    }
};