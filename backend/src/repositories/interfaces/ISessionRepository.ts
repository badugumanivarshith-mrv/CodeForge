export interface UserSessionRecord {
  id: string;
  userId: string;
  refreshTokenHash: string;
  userAgent: string | null;
  ipAddress: string | null;
  expiresAt: Date;
  createdAt: Date;
}

export interface ISessionRepository {
  createSession(data: {
    userId: string;
    refreshTokenHash: string;
    userAgent?: string;
    ipAddress?: string;
    expiresAt: Date;
  }): Promise<UserSessionRecord>;
  findSessionById(sessionId: string): Promise<UserSessionRecord | null>;
  updateRefreshTokenHash(sessionId: string, newHash: string, newExpiresAt: Date): Promise<void>;
  deleteSession(sessionId: string): Promise<void>;
  deleteAllUserSessions(userId: string): Promise<void>;
  deleteExpiredSessions(): Promise<number>;
}
