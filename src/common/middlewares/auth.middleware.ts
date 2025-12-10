import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { tokenPayload } from '../types';
import { config } from '../config';

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const allowedRoutes = [
    '/health',
  ];

  // Check for specific battery SOC endpoint pattern
  const batterySOCPattern = /^\/batteries\/[^/]+\/soc$/;
  const isBatterySOCEndpoint = batterySOCPattern.test(req.path);

  if (allowedRoutes.some((route) => req.path.startsWith(route)) || isBatterySOCEndpoint) {
    return next();
  }

  const authorizationHeader = req.header('Authorization');

  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      statusCode: 401,
      message: 'Invalid authorization header. Provide either Authorization: Bearer <token> or X-Internal-API-Key: <key>'
    });
  }

  const token = authorizationHeader.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ success: false, statusCode: 401, message: 'Authorization token not found' });
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET!) as tokenPayload;
    req.user = decoded.user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, statusCode: 401, message: 'Invalid token' });
  }
};
export default authMiddleware;
