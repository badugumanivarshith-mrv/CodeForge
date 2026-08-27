import { logger } from '../core/utils/logger';

export interface IEmailService {
  sendPasswordResetEmail(email: string, token: string): Promise<void>;
  sendEmailVerificationEmail(email: string, token: string): Promise<void>;
}

export class EmailService implements IEmailService {
  public async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    // Development fallback: Log the password reset URL without crashing
    logger.info(
      {
        recipient: email,
        resetUrl: `http://localhost:5173/auth/reset-password?token=${token}`,
      },
      '📧 [Email Service] Password Reset link generated',
    );
  }

  public async sendEmailVerificationEmail(email: string, token: string): Promise<void> {
    // Development fallback: Log the email verification URL without crashing
    logger.info(
      {
        recipient: email,
        verifyUrl: `http://localhost:5173/auth/verify-email?token=${token}`,
      },
      '📧 [Email Service] Email Verification link generated',
    );
  }
}
