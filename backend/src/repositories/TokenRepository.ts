import { eq, and, gt } from 'drizzle-orm';
import { db } from '../database/connection';
import { passwordResetTokens, emailVerificationTokens } from '../database/schema';
import {
  ITokenRepository,
  PasswordResetTokenRecord,
  EmailVerificationTokenRecord,
} from './interfaces/ITokenRepository';

export class TokenRepository implements ITokenRepository {
  public async createPasswordResetToken(
    userId: string,
    tokenHash: string,
    expiresAt: Date,
  ): Promise<PasswordResetTokenRecord> {
    const [token] = await db
      .insert(passwordResetTokens)
      .values({
        userId,
        tokenHash,
        expiresAt,
        isUsed: false,
      })
      .returning();

    return token;
  }

  public async findValidPasswordResetToken(
    tokenHash: string,
  ): Promise<PasswordResetTokenRecord | null> {
    const [token] = await db
      .select()
      .from(passwordResetTokens)
      .where(
        and(
          eq(passwordResetTokens.tokenHash, tokenHash),
          eq(passwordResetTokens.isUsed, false),
          gt(passwordResetTokens.expiresAt, new Date()),
        ),
      )
      .limit(1);

    return token || null;
  }

  public async markPasswordResetTokenUsed(tokenId: string): Promise<void> {
    await db
      .update(passwordResetTokens)
      .set({ isUsed: true })
      .where(eq(passwordResetTokens.id, tokenId));
  }

  public async createEmailVerificationToken(
    userId: string,
    tokenHash: string,
    expiresAt: Date,
  ): Promise<EmailVerificationTokenRecord> {
    const [token] = await db
      .insert(emailVerificationTokens)
      .values({
        userId,
        tokenHash,
        expiresAt,
        isUsed: false,
      })
      .returning();

    return token;
  }

  public async findValidEmailVerificationToken(
    tokenHash: string,
  ): Promise<EmailVerificationTokenRecord | null> {
    const [token] = await db
      .select()
      .from(emailVerificationTokens)
      .where(
        and(
          eq(emailVerificationTokens.tokenHash, tokenHash),
          eq(emailVerificationTokens.isUsed, false),
          gt(emailVerificationTokens.expiresAt, new Date()),
        ),
      )
      .limit(1);

    return token || null;
  }

  public async markEmailVerificationTokenUsed(tokenId: string): Promise<void> {
    await db
      .update(emailVerificationTokens)
      .set({ isUsed: true })
      .where(eq(emailVerificationTokens.id, tokenId));
  }
}
