import {
  ActivityFeedEventDto,
  ActivityType,
} from '@codeforge/shared';

export interface IActivityFeedRepository {
  createEvent(
    userId: string,
    activityType: ActivityType,
    title: string,
    description: string,
    metadata?: Record<string, unknown>,
    isPublic?: boolean,
  ): Promise<ActivityFeedEventDto>;
  getPublicFeed(limit?: number, offset?: number): Promise<ActivityFeedEventDto[]>;
  getUserFeed(userId: string, limit?: number, offset?: number): Promise<ActivityFeedEventDto[]>;
}
