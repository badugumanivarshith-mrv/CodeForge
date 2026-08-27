import { ActivityFeedRepository } from '../repositories';
import { ActivityFeedEventDto, ActivityType } from '@codeforge/shared';

export class ActivityFeedService {
  private feedRepo: ActivityFeedRepository;

  constructor(feedRepo = new ActivityFeedRepository()) {
    this.feedRepo = feedRepo;
  }

  async getPublicFeed(limit?: number, offset?: number): Promise<ActivityFeedEventDto[]> {
    return this.feedRepo.getPublicFeed(limit, offset);
  }

  async getUserFeed(userId: string, limit?: number, offset?: number): Promise<ActivityFeedEventDto[]> {
    return this.feedRepo.getUserFeed(userId, limit, offset);
  }

  async recordActivity(
    userId: string,
    activityType: ActivityType,
    title: string,
    description: string,
    metadata?: Record<string, unknown>,
    isPublic?: boolean,
  ): Promise<ActivityFeedEventDto> {
    return this.feedRepo.createEvent(userId, activityType, title, description, metadata, isPublic);
  }
}
