import {
  UserRepository,
  SessionRepository,
  TokenRepository,
} from '../repositories';
import { PasswordUtils } from '../core/utils/password';
import { JwtUtils } from '../core/utils/jwt';
import { EmailService } from './email.service';
import { AuditService, AuditEventType } from './audit.service';
import {
  BadRequestError,
  UnauthorizedError,
  ConflictError,
  NotFoundError,
} from '../core/errors';
import {
  RegisterDto,
  LoginDto,
  UserDto,
  UserProfileDto,
  UserPreferencesDto,
} from '@codeforge/shared';

export interface AuthResult {
  user: UserDto;
  profile: UserProfileDto;
  preferences: UserPreferencesDto;
  accessToken: string;
  refreshToken: string;
}

export class AuthService {
  constructor(
    private userRepo = new UserRepository(),
    private sessionRepo = new SessionRepository(),
    private tokenRepo = new TokenRepository(),
    private emailService = new EmailService(),
  ) {}

  public async register(
    data: RegisterDto,
    userAgent?: string,
    ipAddress?: string,
  ): Promise<AuthResult> {
    const normalizedEmail = data.email.toLowerCase().trim();
    const normalizedUsername = data.username.toLowerCase().trim();

    // 1. Validate Username Format
    if (!/^[a-zA-Z0-9_-]{3,30}$/.test(normalizedUsername)) {
      throw new BadRequestError(
        'Username must be between 3 and 30 characters and contain only letters, numbers, underscores, and hyphens',
      );
    }

    // 2. Validate Password Strength
    const strength = PasswordUtils.validateStrength(data.password);
    if (!strength.isValid) {
      throw new BadRequestError(strength.message || 'Password does not meet complexity requirements');
    }

    // 3. Check for Duplicate Email
    const existingEmail = await this.userRepo.findByEmail(normalizedEmail);
    if (existingEmail) {
      throw new ConflictError('An account with this email address already exists');
    }

    // 4. Check for Duplicate Username
    const existingUsername = await this.userRepo.findByUsername(normalizedUsername);
    if (existingUsername) {
      throw new ConflictError('This username is already taken');
    }

    // 5. Hash Password with Argon2id
    const passwordHash = await PasswordUtils.hash(data.password);

    // 6. Create User, Profile, and Preferences
    const created = await this.userRepo.create({
      email: normalizedEmail,
      username: normalizedUsername,
      passwordHash,
      fullName: data.displayName || normalizedUsername,
    });

    // 7. Initialize User Session
    const rawRefreshToken = JwtUtils.generateSecureToken(32);
    const refreshTokenHash = JwtUtils.hashToken(rawRefreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const session = await this.sessionRepo.createSession({
      userId: created.user.id,
      refreshTokenHash,
      userAgent,
      ipAddress,
      expiresAt,
    });

    // 8. Sign JWT Access and Refresh Tokens
    const accessToken = JwtUtils.signAccessToken({
      userId: created.user.id,
      email: created.user.email,
      role: created.user.role,
      sessionId: session.id,
    });

    const refreshToken = JwtUtils.signRefreshToken({
      userId: created.user.id,
      sessionId: session.id,
    });

    // 9. Update Session with Signed Token Hash
    await this.sessionRepo.updateRefreshTokenHash(
      session.id,
      JwtUtils.hashToken(refreshToken),
      expiresAt,
    );

    // 10. Send Initial Verification Email Stub
    const rawVerifyToken = JwtUtils.generateSecureToken(32);
    await this.tokenRepo.createEmailVerificationToken(
      created.user.id,
      JwtUtils.hashToken(rawVerifyToken),
      new Date(Date.now() + 24 * 60 * 60 * 1000),
    );
    await this.emailService.sendEmailVerificationEmail(normalizedEmail, rawVerifyToken);

    // 11. Audit Log
    await AuditService.recordEvent(AuditEventType.USER_REGISTERED, created.user.id, {
      email: normalizedEmail,
      username: normalizedUsername,
      ipAddress,
    });

    return {
      user: created.user,
      profile: created.profile,
      preferences: created.preferences,
      accessToken,
      refreshToken,
    };
  }

  public async login(
    data: LoginDto,
    userAgent?: string,
    ipAddress?: string,
  ): Promise<AuthResult> {
    const normalizedEmail = data.email.toLowerCase().trim();

    // 1. Fetch User Record
    const userWithPassword = await this.userRepo.findFullByEmail(normalizedEmail);
    if (!userWithPassword) {
      await AuditService.recordEvent(AuditEventType.USER_LOGIN_FAILED, null, {
        email: normalizedEmail,
        reason: 'USER_NOT_FOUND',
        ipAddress,
      });
      throw new UnauthorizedError('Invalid email or password', 'INVALID_CREDENTIALS');
    }

    // 2. Check Suspended Status
    if (userWithPassword.status === 'suspended') {
      throw new UnauthorizedError('Your account has been suspended. Please contact support.', 'ACCOUNT_SUSPENDED');
    }

    // 3. Verify Password using Argon2id
    const isPasswordValid = await PasswordUtils.verify(
      userWithPassword.passwordHash,
      data.password,
    );

    if (!isPasswordValid) {
      await AuditService.recordEvent(AuditEventType.USER_LOGIN_FAILED, userWithPassword.id, {
        email: normalizedEmail,
        reason: 'INVALID_PASSWORD',
        ipAddress,
      });
      throw new UnauthorizedError('Invalid email or password', 'INVALID_CREDENTIALS');
    }

    // 4. Create Session
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const rawRefreshToken = JwtUtils.generateSecureToken(32);
    const session = await this.sessionRepo.createSession({
      userId: userWithPassword.id,
      refreshTokenHash: JwtUtils.hashToken(rawRefreshToken),
      userAgent,
      ipAddress,
      expiresAt,
    });

    // 5. Sign Tokens
    const accessToken = JwtUtils.signAccessToken({
      userId: userWithPassword.id,
      email: userWithPassword.email,
      role: userWithPassword.role,
      sessionId: session.id,
    });

    const refreshToken = JwtUtils.signRefreshToken({
      userId: userWithPassword.id,
      sessionId: session.id,
    });

    await this.sessionRepo.updateRefreshTokenHash(
      session.id,
      JwtUtils.hashToken(refreshToken),
      expiresAt,
    );

    // 6. Update Last Login Timestamp
    await this.userRepo.updateLastLogin(userWithPassword.id);

    // 7. Record Audit Event
    await AuditService.recordEvent(AuditEventType.USER_LOGIN_SUCCESS, userWithPassword.id, {
      sessionId: session.id,
      ipAddress,
    });

    // 8. Fetch Profile and Preferences
    const profile = (await this.userRepo.getProfile(userWithPassword.id))!;
    const preferences = (await this.userRepo.getPreferences(userWithPassword.id))!;

    const safeUser: UserDto = {
      id: userWithPassword.id,
      email: userWithPassword.email,
      username: userWithPassword.username,
      role: userWithPassword.role,
      status: userWithPassword.status,
      isVerified: userWithPassword.isVerified,
      lastLoginAt: new Date().toISOString(),
      createdAt: userWithPassword.createdAt,
      updatedAt: userWithPassword.updatedAt,
    };

    return {
      user: safeUser,
      profile,
      preferences,
      accessToken,
      refreshToken,
    };
  }

  public async refresh(
    rawRefreshToken: string,
    userAgent?: string,
    ipAddress?: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    // 1. Verify Refresh Token
    let payload;
    try {
      payload = JwtUtils.verifyRefreshToken(rawRefreshToken);
    } catch {
      throw new UnauthorizedError('Invalid or expired refresh token', 'TOKEN_EXPIRED');
    }

    // 2. Fetch Session from Database
    const session = await this.sessionRepo.findSessionById(payload.sessionId);
    if (!session || new Date(session.expiresAt) < new Date()) {
      throw new UnauthorizedError('Session has expired or was revoked', 'SESSION_REVOKED');
    }

    // 3. Verify Refresh Token Hash (Token Rotation & Reuse Detection)
    const incomingHash = JwtUtils.hashToken(rawRefreshToken);
    if (session.refreshTokenHash !== incomingHash) {
      // Possible token reuse attempt: Revoke all sessions for security
      await this.sessionRepo.deleteAllUserSessions(payload.userId);
      await AuditService.recordEvent(AuditEventType.SESSION_REVOKED, payload.userId, {
        reason: 'REFRESH_TOKEN_REUSE_DETECTED',
        sessionId: payload.sessionId,
      });
      throw new UnauthorizedError(
        'Token reuse detected. All active sessions have been revoked for your security.',
        'SECURITY_ALERT',
      );
    }

    // 4. Fetch User for Updated Role & Email
    const user = await this.userRepo.findById(payload.userId);
    if (!user || user.status === 'suspended') {
      throw new UnauthorizedError('User account not active', 'ACCOUNT_INACTIVE');
    }

    // 5. Rotate Refresh Token
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const newAccessToken = JwtUtils.signAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      sessionId: session.id,
    });

    const newRefreshToken = JwtUtils.signRefreshToken({
      userId: user.id,
      sessionId: session.id,
    });

    await this.sessionRepo.updateRefreshTokenHash(
      session.id,
      JwtUtils.hashToken(newRefreshToken),
      expiresAt,
    );

    // 6. Record Audit
    await AuditService.recordEvent(AuditEventType.TOKEN_REFRESHED, user.id, {
      sessionId: session.id,
      ipAddress,
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  public async logout(sessionId: string, userId?: string): Promise<void> {
    await this.sessionRepo.deleteSession(sessionId);
    if (userId) {
      await AuditService.recordEvent(AuditEventType.USER_LOGOUT, userId, { sessionId });
    }
  }

  public async logoutAll(userId: string): Promise<void> {
    await this.sessionRepo.deleteAllUserSessions(userId);
    await AuditService.recordEvent(AuditEventType.USER_LOGOUT_ALL, userId);
  }

  public async getMe(
    userId: string,
  ): Promise<{ user: UserDto; profile: UserProfileDto; preferences: UserPreferencesDto }> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const profile = (await this.userRepo.getProfile(userId))!;
    const preferences = (await this.userRepo.getPreferences(userId))!;

    return { user, profile, preferences };
  }

  public async changePassword(
    userId: string,
    currentPass: string,
    newPass: string,
  ): Promise<void> {
    const user = await this.userRepo.findFullById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const isValid = await PasswordUtils.verify(user.passwordHash, currentPass);
    if (!isValid) {
      throw new UnauthorizedError('Current password is incorrect', 'INVALID_CREDENTIALS');
    }

    const strength = PasswordUtils.validateStrength(newPass);
    if (!strength.isValid) {
      throw new BadRequestError(strength.message || 'New password does not meet requirements');
    }

    const newHash = await PasswordUtils.hash(newPass);
    await this.userRepo.updatePassword(userId, newHash);

    // Invalidate all active sessions for security
    await this.sessionRepo.deleteAllUserSessions(userId);

    await AuditService.recordEvent(AuditEventType.PASSWORD_CHANGED, userId);
  }

  public async forgotPassword(email: string): Promise<void> {
    const normalizedEmail = email.toLowerCase().trim();
    const user = await this.userRepo.findByEmail(normalizedEmail);

    // Timing-safe response: Never expose whether email exists
    if (!user) {
      return;
    }

    const rawToken = JwtUtils.generateSecureToken(32);
    const tokenHash = JwtUtils.hashToken(rawToken);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await this.tokenRepo.createPasswordResetToken(user.id, tokenHash, expiresAt);
    await this.emailService.sendPasswordResetEmail(normalizedEmail, rawToken);

    await AuditService.recordEvent(AuditEventType.PASSWORD_RESET_REQUESTED, user.id);
  }

  public async resetPassword(rawToken: string, newPass: string): Promise<void> {
    const strength = PasswordUtils.validateStrength(newPass);
    if (!strength.isValid) {
      throw new BadRequestError(strength.message || 'Password does not meet requirements');
    }

    const tokenHash = JwtUtils.hashToken(rawToken);
    const tokenRecord = await this.tokenRepo.findValidPasswordResetToken(tokenHash);
    if (!tokenRecord) {
      throw new BadRequestError('Password reset link is invalid or has expired');
    }

    const newHash = await PasswordUtils.hash(newPass);
    await this.userRepo.updatePassword(tokenRecord.userId, newHash);
    await this.tokenRepo.markPasswordResetTokenUsed(tokenRecord.id);

    // Revoke all existing sessions
    await this.sessionRepo.deleteAllUserSessions(tokenRecord.userId);

    await AuditService.recordEvent(AuditEventType.PASSWORD_RESET_COMPLETED, tokenRecord.userId);
  }

  public async verifyEmail(rawToken: string): Promise<void> {
    const tokenHash = JwtUtils.hashToken(rawToken);
    const tokenRecord = await this.tokenRepo.findValidEmailVerificationToken(tokenHash);
    if (!tokenRecord) {
      throw new BadRequestError('Verification token is invalid or has expired');
    }

    await this.userRepo.verifyEmail(tokenRecord.userId);
    await this.tokenRepo.markEmailVerificationTokenUsed(tokenRecord.id);

    await AuditService.recordEvent(AuditEventType.EMAIL_VERIFIED, tokenRecord.userId);
  }

  public async resendVerification(userId: string): Promise<void> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (user.isVerified) {
      throw new BadRequestError('Email is already verified');
    }

    const rawVerifyToken = JwtUtils.generateSecureToken(32);
    await this.tokenRepo.createEmailVerificationToken(
      user.id,
      JwtUtils.hashToken(rawVerifyToken),
      new Date(Date.now() + 24 * 60 * 60 * 1000),
    );
    await this.emailService.sendEmailVerificationEmail(user.email, rawVerifyToken);
  }
}
