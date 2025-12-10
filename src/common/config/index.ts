import dotenv from 'dotenv';
import { stringToBoolean } from '../helpers';
import { ENVIRONMENTS } from '../types';

dotenv.config();

export const config = {
  MONGO_URI: process.env.MONGO_URI,
  PORT: Number(process.env.PORT) || 3000,
  DEFAULT_PER_PAGE: 30,
  DEFAULT_PAGE_NO: 1,
  NODE_ENV: process.env.NODE_ENV || 'local',
  LOG_LEVEL: process.env.LOG_LEVEL || 'debug',
  ENABLE_DOCUMENTATION: process.env.ENABLE_DOCUMENTATION || true,
  DISABLE_CACHING: stringToBoolean(String(process.env.DISABLE_CACHING)) || false,
  JWT_SECRET: process.env.JWT_SECRET,
  CORS_ALLOWED_ORIGINS: process.env.CORS_ALLOWED_ORIGINS,
  ENABLE_DB_SYNC: stringToBoolean(String(process.env.ENABLE_DB_SYNC)) || false,
};

export const isProduction = config.NODE_ENV === ENVIRONMENTS.PRODUCTION;
export const isDevelopment = config.NODE_ENV === ENVIRONMENTS.DEVELOPMENT;
export const isLocal = config.NODE_ENV === ENVIRONMENTS.LOCAL;
