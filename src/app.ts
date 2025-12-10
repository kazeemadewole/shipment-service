import { InversifyExpressServer } from 'inversify-express-utils';
import express from 'express';
import compression from 'compression';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { errorHandler, invalidPathHandler } from './common/middlewares/error.middleware';
import morganMiddleware from './common/middlewares/logger.middleware';
import { trim_all } from './common/middlewares/trim.middleware';
import { Container } from 'inversify';
import { corsMiddleware } from './common/middlewares/cors.middleware';

export const createApp = (container: Container) => {
  const server = new InversifyExpressServer(container);

  server.setConfig((app) => {
    // Trust proxy - this is required when running behind a reverse proxy (like Nginx, AWS ELB, Heroku)
    app.set('trust proxy', 1);

    // IMPORTANT: Apply CORS middleware first before any other middleware
    // This ensures CORS headers are properly set for all responses including errors
    app.use(corsMiddleware);

    // Rate limiter middleware
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
      standardHeaders: true, 
      legacyHeaders: false,
      message: 'Too many requests from this IP, please try again later',
    });

    // Apply rate limiting to all requests
    app.use(limiter);
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(compression());
    app.use(
      helmet({
        contentSecurityPolicy: {
          directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net', 'https://cdnjs.cloudflare.com'],
            scriptSrc: [
              "'self'",
              "'unsafe-inline'",
              "'unsafe-eval'",
              "'unsafe-hashes'",
              'https://unpkg.com',
              'https://cdn.jsdelivr.net',
              'https://cdnjs.cloudflare.com',
            ],
            imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
            fontSrc: ["'self'", 'https://cdnjs.cloudflare.com'],
            connectSrc: ["'self'", 'https:'],
            mediaSrc: ["'self'", 'blob:', 'data:'],
            workerSrc: ["'self'", 'blob:'],
          },
        },
        crossOriginResourcePolicy: { policy: 'cross-origin' },
      }),
    );
    app.use(
      express.urlencoded({
        extended: true,
        limit: '20mb',
      }),
    );
    app.use(express.text({ limit: '20mb' }));
    app.use(
      express.json({
        type: 'application/vnd.api+json',
        limit: '20mb',
      }),
    );
    app.use(trim_all);
    app.disable('x-powered-by');

    // Serve static files from public directory with proper MIME types
    app.use(
      '/public',
      express.static(path.join(process.cwd(), 'public'), {
        setHeaders: (res, filePath) => {
          // Ensure files are served with the correct MIME types
          if (filePath.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
          } else if (filePath.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
          } else if (filePath.endsWith('.html')) {
            res.setHeader('Content-Type', 'text/html');
          }
        },
      }),
    );

    // Legacy static file serving (for backwards compatibility)
    app.use(
      express.static(process.cwd(), {
        setHeaders: (res, path) => {
          // Ensure files are served with the correct MIME types
          if (path.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
          } else if (path.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
          }
        },
      }),
    );

    // Main public tools index page
    app.get('/', (req, res) => {
      res.sendFile('public/index.html', { root: process.cwd() });
    });

    // app.use(authMiddleware); // commented out since we are not doing user authentication at the moment
    app.use(morganMiddleware);
  });

  server.setErrorConfig((app) => {
    app.use(errorHandler);
    app.use(invalidPathHandler);
  });

  const app = server.build();

  return app;
};
