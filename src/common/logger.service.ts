import winston from 'winston';
import { config } from './config';
const { combine, timestamp, json, colorize, printf } = winston.format;

// Custom formatter for error objects
const errorFormatter = winston.format((info) => {
  if (info.meta && info.meta instanceof Error) {
    info.message = `${info.message}: ${info.meta.stack}`;
    delete info.meta;
  }
  return info;
});

export const logger = winston.createLogger({
  level: config.LOG_LEVEL || 'info',
  format: combine(
    errorFormatter(),
    timestamp({
      format: 'MMM-DD-YYYY HH:mm:ss'
    }),
    json(),
    colorize({
      level: true,
      message: true,
      colors: {
        error: 'red',
        warn: 'yellow', // Changed from orange to yellow which is better supported
        data: 'grey',
        info: 'green',
        debug: 'blue',
        verbose: 'cyan',
        silly: 'magenta',
        custom: 'blue'
      }
    }),
    printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
  ),
  defaultMeta: { service: 'maxone-config-service' },
  transports: [new winston.transports.Console()],
  exceptionHandlers: [new winston.transports.Console()],
  rejectionHandlers: [new winston.transports.Console()]
});
