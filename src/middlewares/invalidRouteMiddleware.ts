import {ErrorFactory} from "../factories/errorFactory";
import {NextFunction, Request, Response} from "express";

export const invalidRouteMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const error = ErrorFactory.notFound('Route not found');
    next(error);
};