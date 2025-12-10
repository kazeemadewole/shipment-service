import { Request, Response, NextFunction } from 'express';
import { HttpError } from 'http-errors';
import { ZodError, ZodIssue } from 'zod';
import { validationErrorMessages } from '../types';
import { logger } from '../logger.service';

export const errorHandler = (err: HttpError, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ZodError) {
    const validationErrors = formatZodValidationErrors(err.issues);
    logger.error(validationErrors);
    return res
      .status(422)
      .json({ success: false, statusCode: 422, message: 'Validation Error', error: validationErrors });
  }
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Something went wrong';
  logger.error(message);
  return res.status(statusCode).json({ success: false, statusCode, message, path: req.path });
};

export const invalidPathHandler = (req: Request, res: Response, next: NextFunction) => {
  return res.status(404).json({ success: false, statusCode: 404, message: 'Invalid Path', path: req.path });
};

export function formatZodValidationErrors(issues: ZodIssue[]): validationErrorMessages[] {
  let errors = [];
  let details: validationErrorMessages[] = [];

  if (!issues) return errors;
  issues.map((issue: ZodIssue) => {
    details.push({ field: issue?.path.join('.'), message: issue.message });
  });

  return details;
}
