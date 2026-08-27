import { eq, lt } from 'drizzle-orm';
import { db } from '../database/connection';
import { userSessions } from '../database/schema';
import { ISessionRepository, UserSessionRecord } from './interfaces/ISessionRepository';

export class SessionRepository implements ISessionRepository {
  public async createSession(data: {
    userId: string;
    refreshTokenHash: string;
    userAgent?: string;
    ipAddress?: string;
    expiresAt: Date;
  }): Promise<UserSessionRecord> {
    const [session] = await db
      .insert(userSessions)
      .values({
        userId: data.userId,
        refreshTokenHash: data.refreshTokenHash,
        userAgent: data.userAgent || null,
        ipAddress: data.ipAddress || null,
        expiresAt: data.expiresAt,
      })
      .returning();

    return session;
  }

  public async findSessionById(sessionId: string): Promise<UserSessionRecord | null> {
    const [session] = await db
      .select()
      .from(userSessions)
      .where(eq(userSessions.id, sessionId))
      .limit(1);

    return session || null;
  }

  public async updateRefreshTokenHash(
    sessionId: string,
    newHash: string,
    newExpiresAt: Date,
  ): Promise<void> {
    await db
      .update(userSessions)
      .set({
        refreshTokenHash: newHash,
        expiresAt: newExpiresAt,
      })
      .where(eq(userSessions.id, sessionId));
  }

  public async deleteSession(sessionId: string): Promise<void> {
    await db.delete(userSessions).where(eq(userSessions.id, sessionId));
  }

  public async deleteAllUserSessions(userId: string): Promise<void> {
    await db.delete(userSessions).where(eq(userSessions.userId, userId));
  }

  public async deleteExpiredSessions(): Promise<number> {
    const deleted = await db
      .delete(userSessions)
      .where(lt(userSessions.expiresAt, new Date()))
      .returning({ id: userSessions.id });

    return deleted.length;
  }
}
