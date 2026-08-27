import { Request, Response, NextFunction } from 'express';
import { UserRole } from '@codeforge/shared';
import { ForbiddenError, UnauthorizedError } from '../core/errors';

export const requireRole = (allowedRoles: UserRole | UserRole[]) => {
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new UnauthorizedError('Authentication is required');
    }

    if (!roles.includes(req.user.role)) {
      throw new ForbiddenError(
        'You do not have permission to access this resource',
        'FORBIDDEN_ROLE',
      );
    }

    next();
  };
};

export const requireAdmin = requireRole([UserRole.ADMIN]);
