import { db } from '../database/connection';
import { analyticsEvents, userActivityLogs } from '../database/schema';
import { logger } from '../core/utils/logger';

export enum AuditEventType {
  USER_REGISTERED = 'USER_REGISTERED',
  USER_LOGIN_SUCCESS = 'USER_LOGIN_SUCCESS',
  USER_LOGIN_FAILED = 'USER_LOGIN_FAILED',
  USER_LOGOUT = 'USER_LOGOUT',
  USER_LOGOUT_ALL = 'USER_LOGOUT_ALL',
  TOKEN_REFRESHED = 'TOKEN_REFRESHED',
  PASSWORD_CHANGED = 'PASSWORD_CHANGED',
  PASSWORD_RESET_REQUESTED = 'PASSWORD_RESET_REQUESTED',
  PASSWORD_RESET_COMPLETED = 'PASSWORD_RESET_COMPLETED',
  EMAIL_VERIFIED = 'EMAIL_VERIFIED',
  SESSION_REVOKED = 'SESSION_REVOKED',
}

export class AuditService {
  public static async recordEvent(
    eventType: AuditEventType,
    userId?: string | null,
    metadata: Record<string, unknown> = {},
  ): Promise<void> {
    try {
      // 1. Log structured event without leaking sensitive fields
      logger.info(
        {
          eventType,
          userId: userId || 'anonymous',
          metadata,
        },
        `[Audit] ${eventType}`,
      );

      // 2. Persist to analytics_events
      await db.insert(analyticsEvents).values({
        userId: userId || null,
        eventName: eventType,
        category: 'auth_security',
        propertiesJson: metadata,
      });

      // 3. If user is authenticated, also write to user_activity_logs
      if (userId) {
        const today = new Date().toISOString().split('T')[0];
        await db.insert(userActivityLogs).values({
          userId,
          activityDate: today,
          actionType: eventType,
          metadataJson: metadata,
        });
      }
    } catch (error) {
      // Non-blocking log
      logger.warn({ error, eventType }, 'Failed to record audit event to database');
    }
  }
}
