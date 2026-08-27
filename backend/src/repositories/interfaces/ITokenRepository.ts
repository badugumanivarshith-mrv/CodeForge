export interface PasswordResetTokenRecord {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  isUsed: boolean;
  createdAt: Date;
}

export interface EmailVerificationTokenRecord {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  isUsed: boolean;
  createdAt: Date;
}

export interface ITokenRepository {
  createPasswordResetToken(userId: string, tokenHash: string, expiresAt: Date): Promise<PasswordResetTokenRecord>;
  findValidPasswordResetToken(tokenHash: string): Promise<PasswordResetTokenRecord | null>;
  markPasswordResetTokenUsed(tokenId: string): Promise<void>;

  createEmailVerificationToken(userId: string, tokenHash: string, expiresAt: Date): Promise<EmailVerificationTokenRecord>;
  findValidEmailVerificationToken(tokenHash: string): Promise<EmailVerificationTokenRecord | null>;
  markEmailVerificationTokenUsed(tokenId: string): Promise<void>;
}
