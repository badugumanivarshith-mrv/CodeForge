import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../core/errors';
import { JwtUtils, AccessTokenPayload } from '../core/utils/jwt';
import { SessionRepository } from '../repositories/SessionRepository';

declare global {
  namespace Express {
    interface Request {
      user?: AccessTokenPayload;
    }
  }
}

const sessionRepository = new SessionRepository();

export const authGuard = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    let token: string | undefined;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.cf_access_token) {
      token = req.cookies.cf_access_token;
    }

    if (!token) {
      throw new UnauthorizedError('Authentication token is required');
    }

    let payload: AccessTokenPayload;
    try {
      payload = JwtUtils.verifyAccessToken(token);
    } catch (error) {
      if (error instanceof Error && error.name === 'TokenExpiredError') {
        throw new UnauthorizedError('Access token has expired', 'TOKEN_EXPIRED');
      }
      throw new UnauthorizedError('Invalid or malformed authentication token', 'INVALID_TOKEN');
    }

    // 1. Validate presence of sessionId in token payload
    if (!payload.sessionId) {
      throw new UnauthorizedError(
        'Session identifier missing from authentication token',
        'INVALID_SESSION',
      );
    }

    // 2. Query session table in database to confirm session is active
    const session = await sessionRepository.findSessionById(payload.sessionId);
    if (!session) {
      throw new UnauthorizedError('Session has expired or was revoked', 'SESSION_REVOKED');
    }

    // 3. Confirm session has not expired
    if (new Date(session.expiresAt) < new Date()) {
      throw new UnauthorizedError('Session has expired', 'SESSION_EXPIRED');
    }

    // 4. Confirm session belongs to the authenticated user
    if (session.userId !== payload.userId) {
      throw new UnauthorizedError(
        'Session does not belong to authenticated user',
        'INVALID_SESSION',
      );
    }

    req.user = payload;
    next();
  } catch (error) {
    next(error);
  }
};

export const optionalAuthGuard = async (
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    let token: string | undefined;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.cf_access_token) {
      token = req.cookies.cf_access_token;
    }

    if (!token) {
      return next();
    }

    try {
      const payload = JwtUtils.verifyAccessToken(token);
      if (payload.sessionId) {
        const session = await sessionRepository.findSessionById(payload.sessionId);
        if (
          session &&
          new Date(session.expiresAt) >= new Date() &&
          session.userId === payload.userId
        ) {
          req.user = payload;
        }
      }
    } catch {
      // In optional mode, proceed without req.user if verification fails
    }

    next();
  } catch (error) {
    next(error);
  }
};
