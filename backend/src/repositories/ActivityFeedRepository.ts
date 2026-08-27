import { eq, desc } from 'drizzle-orm';
import { db } from '../database/connection';
import { activityFeedEvents, users, userProfiles } from '../database/schema';
import { IActivityFeedRepository } from './interfaces/IActivityFeedRepository';
import {
  ActivityFeedEventDto,
  ActivityType,
} from '@codeforge/shared';


export class ActivityFeedRepository implements IActivityFeedRepository {
  async createEvent(
    userId: string,
    activityType: ActivityType,
    title: string,
    description: string,
    metadata: Record<string, unknown> = {},
    isPublic: boolean = true,
  ): Promise<ActivityFeedEventDto> {
    const [inserted] = await db
      .insert(activityFeedEvents)
      .values({
        userId,
        activityType,
        title,
        description,
        metadataJson: metadata,
        isPublic,
        createdAt: new Date(),
      })
      .returning();

    const userRows = await db
      .select({
        username: users.username,
        fullName: userProfiles.fullName,
        avatarUrl: userProfiles.avatarUrl,
      })
      .from(users)
      .leftJoin(userProfiles, eq(users.id, userProfiles.userId))
      .where(eq(users.id, userId))
      .limit(1);

    const u = userRows[0];

    return {
      id: inserted.id,
      userId: inserted.userId,
      username: u ? u.username : 'User',
      fullName: u ? u.fullName || u.username : 'User',
      avatarUrl: u?.avatarUrl || undefined,
      activityType: inserted.activityType as ActivityType,
      title: inserted.title,
      description: inserted.description,
      metadata: (inserted.metadataJson as Record<string, unknown>) || {},
      isPublic: inserted.isPublic,
      createdAt: inserted.createdAt.toISOString(),
    };
  }

  async getPublicFeed(limit: number = 50, offset: number = 0): Promise<ActivityFeedEventDto[]> {
    const rows = await db
      .select({
        id: activityFeedEvents.id,
        userId: activityFeedEvents.userId,
        activityType: activityFeedEvents.activityType,
        title: activityFeedEvents.title,
        description: activityFeedEvents.description,
        metadataJson: activityFeedEvents.metadataJson,
        isPublic: activityFeedEvents.isPublic,
        createdAt: activityFeedEvents.createdAt,
        username: users.username,
        fullName: userProfiles.fullName,
        avatarUrl: userProfiles.avatarUrl,
      })
      .from(activityFeedEvents)
      .innerJoin(users, eq(activityFeedEvents.userId, users.id))
      .leftJoin(userProfiles, eq(users.id, userProfiles.userId))
      .where(eq(activityFeedEvents.isPublic, true))
      .orderBy(desc(activityFeedEvents.createdAt))
      .limit(limit)
      .offset(offset);

    return rows.map(r => ({
      id: r.id,
      userId: r.userId,
      username: r.username,
      fullName: r.fullName || r.username,
      avatarUrl: r.avatarUrl || undefined,
      activityType: r.activityType as ActivityType,
      title: r.title,
      description: r.description,
      metadata: (r.metadataJson as Record<string, unknown>) || {},
      isPublic: r.isPublic,
      createdAt: r.createdAt.toISOString(),
    }));
  }

  async getUserFeed(userId: string, limit: number = 50, offset: number = 0): Promise<ActivityFeedEventDto[]> {
    const rows = await db
      .select({
        id: activityFeedEvents.id,
        userId: activityFeedEvents.userId,
        activityType: activityFeedEvents.activityType,
        title: activityFeedEvents.title,
        description: activityFeedEvents.description,
        metadataJson: activityFeedEvents.metadataJson,
        isPublic: activityFeedEvents.isPublic,
        createdAt: activityFeedEvents.createdAt,
        username: users.username,
        fullName: userProfiles.fullName,
        avatarUrl: userProfiles.avatarUrl,
      })
      .from(activityFeedEvents)
      .innerJoin(users, eq(activityFeedEvents.userId, users.id))
      .leftJoin(userProfiles, eq(users.id, userProfiles.userId))
      .where(eq(activityFeedEvents.userId, userId))
      .orderBy(desc(activityFeedEvents.createdAt))
      .limit(limit)
      .offset(offset);

    return rows.map(r => ({
      id: r.id,
      userId: r.userId,
      username: r.username,
      fullName: r.fullName || r.username,
      avatarUrl: r.avatarUrl || undefined,
      activityType: r.activityType as ActivityType,
      title: r.title,
      description: r.description,
      metadata: (r.metadataJson as Record<string, unknown>) || {},
      isPublic: r.isPublic,
      createdAt: r.createdAt.toISOString(),
    }));
  }
}
