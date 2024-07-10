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

    if (typeof role === 'number' && role === 0) {
        next();
    } else {
        return next(ErrorFactory.forbidden());
    }
};

export const emailValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const email = req.body.email;

    if (!email) {
        return next(ErrorFactory.badRequest('Email is required'));
    }

    if (typeof email !== 'string') {
        return next(ErrorFactory.badRequest('Email must be a string'));
    }

    next();
}

export const passwordValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const password = req.body.password;

    if (!password) {
        return next(ErrorFactory.badRequest('Password is required'));
    }

    if (typeof password !== 'string') {
        return next(ErrorFactory.badRequest('Password must be a string'));
    }

    next();
}

export const adminTokensValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const tokens = req.body.tokens;

    if (!tokens) {
        return next(ErrorFactory.badRequest('Tokens are required'));
    }

    if (typeof tokens !== 'number' || tokens <= 0) {
        return next(ErrorFactory.badRequest('Invalid token amount'));
    }

    next();
}