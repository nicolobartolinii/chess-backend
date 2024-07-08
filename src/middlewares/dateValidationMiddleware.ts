import {Request, Response, NextFunction} from 'express';
import {ErrorFactory} from '../factories/errorFactory';

declare global {
    namespace Express {
        interface Request {
            startDate: Date;
        }
    }
}

export const dateValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const start_date = req.query.start_date;

    if (!start_date) {
        req.startDate = new Date("1970-01-01");
        return next();
    }

    if (typeof start_date !== 'string') {
        return next(ErrorFactory.badRequest('Start date must be a string'));
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/; // Format YYYY-MM-DD
    if (!dateRegex.test(start_date)) {
        return next(ErrorFactory.badRequest('Invalid date format. Use YYYY-MM-DD'));
    }

    const parsedDate = new Date(start_date);
    if (isNaN(parsedDate.getTime())) {
        return next(ErrorFactory.badRequest('Invalid date'));
    }

    req.startDate = parsedDate;

    next();
}