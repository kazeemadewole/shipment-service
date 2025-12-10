import { withMiddleware } from 'inversify-express-utils';

export function authorizeRoles(roles: string[]) {
  return withMiddleware((req, res, next) => {
    if (!roles.includes(req.user.role.slug)) {
      return res.status(403).json({ success: false, statusCode: 403, message: 'User role not permitted' });
    }
    next();
  });
}

export function authorizePermissions(permissions: string[]) {
  return withMiddleware((req, res, next) => {
    const hasPermission = permissions.some((permission) => req.user.user_permissions.includes(permission));

    if (!hasPermission) {
      return res.status(403).json({ success: false, statusCode: 403, message: 'User does not have permission' });
    }
    next();
  });
}
