import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { sendSuccess } from '../core/utils/response';
import { env } from '../config/env';
import { UnauthorizedError } from '../core/errors';

export class AuthController {
  constructor(private authService = new AuthService()) {}

  private setAuthCookies(res: Response, accessToken: string, refreshToken: string): void {
    const isProduction = env.NODE_ENV === 'production';

    res.cookie('cf_access_token', accessToken, {
      httpOnly: true,
      secure: env.AUTH_COOKIE_SECURE || isProduction,
      sameSite: env.AUTH_COOKIE_SAME_SITE,
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie('cf_refresh_token', refreshToken, {
      httpOnly: true,
      secure: env.AUTH_COOKIE_SECURE || isProduction,
      sameSite: env.AUTH_COOKIE_SAME_SITE,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }

  private clearAuthCookies(res: Response): void {
    res.clearCookie('cf_access_token');
    res.clearCookie('cf_refresh_token');
  }

  public register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userAgent = req.headers['user-agent'];
      const ipAddress = req.ip || req.socket.remoteAddress;

      const result = await this.authService.register(req.body, userAgent, ipAddress);
      this.setAuthCookies(res, result.accessToken, result.refreshToken);

      sendSuccess(
        res,
        {
          user: result.user,
          profile: result.profile,
          preferences: result.preferences,
          accessToken: result.accessToken,
        },
        201,
      );
    } catch (error) {
      next(error);
    }
  };

  public login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userAgent = req.headers['user-agent'];
      const ipAddress = req.ip || req.socket.remoteAddress;

      const result = await this.authService.login(req.body, userAgent, ipAddress);
      this.setAuthCookies(res, result.accessToken, result.refreshToken);

      sendSuccess(res, {
        user: result.user,
        profile: result.profile,
        preferences: result.preferences,
        accessToken: result.accessToken,
      });
    } catch (error) {
      next(error);
    }
  };

  public refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userAgent = req.headers['user-agent'];
      const ipAddress = req.ip || req.socket.remoteAddress;

      const rawRefreshToken =
        req.body.refreshToken || req.cookies?.cf_refresh_token;

      if (!rawRefreshToken) {
        throw new UnauthorizedError('Refresh token is required', 'MISSING_TOKEN');
      }

      const result = await this.authService.refresh(rawRefreshToken, userAgent, ipAddress);
      this.setAuthCookies(res, result.accessToken, result.refreshToken);

      sendSuccess(res, {
        accessToken: result.accessToken,
      });
    } catch (error) {
      next(error);
    }
  };

  public logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (req.user?.sessionId) {
        await this.authService.logout(req.user.sessionId, req.user.userId);
      }
      this.clearAuthCookies(res);
      sendSuccess(res, { message: 'Logged out successfully' });
    } catch (error) {
      next(error);
    }
  };

  public logoutAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (req.user?.userId) {
        await this.authService.logoutAll(req.user.userId);
      }
      this.clearAuthCookies(res);
      sendSuccess(res, { message: 'All active sessions revoked successfully' });
    } catch (error) {
      next(error);
    }
  };

  public getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.authService.getMe(req.user!.userId);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  };

  public changePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { currentPassword, newPassword } = req.body;
      await this.authService.changePassword(req.user!.userId, currentPassword, newPassword);
      this.clearAuthCookies(res);
      sendSuccess(res, { message: 'Password changed successfully. Please log in again.' });
    } catch (error) {
      next(error);
    }
  };

  public forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.authService.forgotPassword(req.body.email);
      sendSuccess(res, {
        message: 'If an account with that email exists, a password reset link has been sent.',
      });
    } catch (error) {
      next(error);
    }
  };

  public resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { token, newPassword } = req.body;
      await this.authService.resetPassword(token, newPassword);
      sendSuccess(res, {
        message: 'Password reset successfully. You can now log in with your new password.',
      });
    } catch (error) {
      next(error);
    }
  };

  public verifyEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.authService.verifyEmail(req.body.token);
      sendSuccess(res, { message: 'Email verified successfully' });
    } catch (error) {
      next(error);
    }
  };

  public resendVerification = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.authService.resendVerification(req.user!.userId);
      sendSuccess(res, { message: 'Verification email sent' });
    } catch (error) {
      next(error);
    }
  };
}
