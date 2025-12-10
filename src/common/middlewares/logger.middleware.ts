import { NextFunction, Request, Response } from 'express';
import { logger } from '../logger.service';

const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const logMessage = JSON.stringify({
        path: req.originalUrl,
        method: req.method,
        user: req.user,
        body: req.body,
    });
    logger.info(logMessage);
    next();
};
export default loggerMiddleware;
