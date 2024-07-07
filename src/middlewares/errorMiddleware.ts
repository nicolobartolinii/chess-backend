import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../factories/errorFactory';
import ResponseFactory from '../factories/responseFactory';
import { StatusCodes } from 'http-status-codes';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err);

    if (err instanceof CustomError) {
        return res.status(err.statusCode).json(
            ResponseFactory.error(err.message, err.statusCode)
        );
    }

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
        ResponseFactory.error('Internal Server Error', StatusCodes.INTERNAL_SERVER_ERROR)
    );
};