import { NextFunction, Response, Request } from 'express';
import { z, ZodError } from 'zod';
import { formatZodValidationErrors } from './error.middleware';

export function validateBody<T extends z.ZodTypeAny>(schema: T) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body) as z.infer<T>;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationErrors = formatZodValidationErrors(error.issues);
        res.status(422).json({ success: false, statusCode: 422, message: 'Validation Error', error: validationErrors });
      } else {
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  };
}

export function validateQuery<T extends z.ZodTypeAny>(schema: T) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.query) as z.infer<T>;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationErrors = formatZodValidationErrors(error.issues);
        res.status(422).json({ success: false, statusCode: 422, message: 'Validation Error', error: validationErrors });
      } else {
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  };
}

export function validateParam<T extends z.ZodTypeAny>(schema: T) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.params) as z.infer<T>;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationErrors = formatZodValidationErrors(error.issues);
        res.status(422).json({ success: false, statusCode: 422, message: 'Validation Error', error: validationErrors });
      } else {
        res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  };
}
