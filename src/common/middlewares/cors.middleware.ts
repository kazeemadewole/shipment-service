import { Request, Response, NextFunction } from 'express';
import { config } from '../config';

export const corsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Get allowed origins from config
  const allowedOrigins = config.CORS_ALLOWED_ORIGINS ?? '*';

  // Handle different types correctly with better type checking
  const origins = Array.isArray(allowedOrigins)
    ? allowedOrigins
    : allowedOrigins === '*'
      ? ['*']
      : String(allowedOrigins)
          .split(',')
          .map((origin) => origin.trim());

  const origin = req.headers.origin;

  // Handle Access-Control-Allow-Origin
  if (origins.includes('*')) {
    // Allow any origin
    res.header('Access-Control-Allow-Origin', '*');
  } else if (origin && origins.includes(origin)) {
    // Allow specific origin from the allowed list
    res.header('Access-Control-Allow-Origin', origin);
    // When specifying an origin, we must also specify 'vary: origin'
    res.header('Vary', 'Origin');
  }

  // Allow credentials only when specific origins are set
  if (!origins.includes('*')) {
    res.header('Access-Control-Allow-Credentials', 'true');
  }

  // Allow specific headers
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-access-token'
  );

  // Allow specific methods
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');

  // Add max age for preflight results caching
  res.header('Access-Control-Max-Age', '86400'); // 24 hours

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  next();
};
