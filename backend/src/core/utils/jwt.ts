import jwt, { SignOptions } from 'jsonwebtoken';
import crypto from 'crypto';
import { UserRole } from '@codeforge/shared';
import { env } from '../../config/env';

export interface AccessTokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  sessionId: string;
}

export interface RefreshTokenPayload {
  userId: string;
  sessionId: string;
  tokenId?: string;
}

export class JwtUtils {
  public static signAccessToken(payload: AccessTokenPayload): string {
    const options: SignOptions = {
      expiresIn: env.JWT_EXPIRES_IN as unknown as number | `${number}${'m' | 'h' | 'd'}`,
    };
    return jwt.sign(payload, env.JWT_SECRET, options);
  }

  public static signRefreshToken(payload: RefreshTokenPayload): string {
    const options: SignOptions = {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN as unknown as number | `${number}${'m' | 'h' | 'd'}`,
    };
    return jwt.sign(
      {
        ...payload,
        tokenId: payload.tokenId || crypto.randomUUID(),
      },
      env.JWT_REFRESH_SECRET,
      options,
    );
  }

  public static verifyAccessToken(token: string): AccessTokenPayload {
    return jwt.verify(token, env.JWT_SECRET) as AccessTokenPayload;
  }

  public static verifyRefreshToken(token: string): RefreshTokenPayload {
    return jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshTokenPayload;
  }

  /**
   * Hashes a token using SHA-256 for secure database session storage
   */
  public static hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  /**
   * Generates a secure random hex token for password reset / email verification
   */
  public static generateSecureToken(bytes = 32): string {
    return crypto.randomBytes(bytes).toString('hex');
  }
}
