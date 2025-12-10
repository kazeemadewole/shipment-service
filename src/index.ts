import 'reflect-metadata';
import { createApp } from './app';
import { config } from './common/config';
import { container } from './common/config/di';
import { logger } from './common/logger.service';
import { connectDB, } from './common/config/database';
import { createServer } from 'http';

const bootstrapServer = async (): Promise<void> => {
  try {
    connectDB();

    const app = createApp(container);

    const server = createServer(app);

    const startServer = (port: number) => {
      try {
        server.listen(port, () => {
          logger.info(`App listening on port ${port}`);
        });

        const shutdown = async () => {
          logger.info('Shutting down server...');

          server.close(() => {
            logger.info('Server shut down successfully');
            process.exit(0);
          });
        };

        process.on('SIGTERM', shutdown);
        process.on('SIGINT', shutdown);
      } catch (error) {
        logger.error(`Failed to start server: ${error.message}`);
        process.exit(1);
      }
    };

    startServer(+config.PORT);
  } catch (error) {
    logger.error('Failed to bootstrap server:', error);
    process.exit(1);
  }
};

bootstrapServer();
