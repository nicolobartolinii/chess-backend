import {NextFunction, Request, Response} from 'express';
import {verifyToken} from '../services/authService';
import {JwtPayload} from "../utils/jwt";
import {ErrorFactory} from "../factories/errorFactory";
import {Roles} from "../utils/roles";

declare global {
    namespace Express {
        interface Request {
            player?: JwtPayload;
        }
    }
}

/**
 * Middleware to authenticate a JWT and append the decoded payload to the Request object.
 *
 * This middleware extracts the JWT from the 'Authorization' header of the request. If the token
 * is valid, the decoded payload is stored in req.player; otherwise, an error is generated.
 *
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @param {NextFunction} next - The next function
 *
 * @returns {void} - Calls the next middleware or error handler
 */
export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1]; // Bearer <token>
        try {
            req.player = verifyToken(token) as JwtPayload;
            next();
        } catch {
            return next(ErrorFactory.unauthorized('Invalid or expired token'));
        }
    } else {
        return next(ErrorFactory.unauthorized('Token not provided'));
    }
}

/**
 * Middleware to verify if the authenticated user is an administrator.
 *
 * Checks if the 'role' field in the JWT payload (stored in req.player) is equal to 0,
 * indicating an administrator. If not, an authorization error is generated.
 *
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @param {NextFunction} next - The next function
 *
 * @returns {void} - Calls the next middleware or error handler
 */
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    const role = req.player?.role;

    if (typeof role === 'number' && role === Roles.ADMIN) {
        next();
    } else {
        return next(ErrorFactory.forbidden('This route is only accessible to administrators'));
    }
};

/**
 * Middleware to validate the presence and format of the email in the request.
 *
 * Ensures that the email is present and that it is a string. If these checks fail,
 * a bad request error is generated.
 *
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @param {NextFunction} next - The next function
 *
 * @returns {void} - Calls the next middleware or error handler
 */
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

/**
 * Middleware to validate the presence and format of the password in the request.
 *
 * Checks that the password is present and that it is a string. If not, a bad request error is generated.
 *
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @param {NextFunction} next - The next function
 *
 * @returns {void} - Calls the next middleware or error handler
 */
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
/**
 * Middleware to validate the presence and validity of the token count in an administrator's request.
 *
 * Ensures the tokens are present, are a number, and are greater than zero. Otherwise, a bad request error is generated.
 *
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @param {NextFunction} next - The next function
 *
 * @returns {void} - Calls the next middleware or error handler
 */
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