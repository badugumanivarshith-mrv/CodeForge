import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import { AuthService } from '../../src/services/auth.service';
import { TalentService } from '../../src/services/talent.service';
import { ActivityFeedService } from '../../src/services/activityFeed.service';
import { PortfolioService } from '../../src/services/portfolio.service';
import {
  UserRepository,
  SessionRepository,
  TokenRepository,
  PortfolioRepository,
  RatingRepository,
  ContestRepository,
  GamificationRepository,
  ActivityFeedRepository,
} from '../../src/repositories';
import { ActivityType } from '@codeforge/shared';

describe('Talent Discovery & Activity Feed Integration Tests', () => {
  const userRepo = new UserRepository();
  const sessionRepo = new SessionRepository();
  const tokenRepo = new TokenRepository();
  const portfolioRepo = new PortfolioRepository();
  const ratingRepo = new RatingRepository();
  const contestRepo = new ContestRepository();
  const gamificationRepo = new GamificationRepository();
  const feedRepo = new ActivityFeedRepository();

  const authService = new AuthService(userRepo, sessionRepo, tokenRepo);
  const talentService = new TalentService(
    userRepo,
    ratingRepo,
    portfolioRepo,
    contestRepo,
  );
  const feedService = new ActivityFeedService(feedRepo);
  const portfolioService = new PortfolioService(
    portfolioRepo,
    userRepo,
    ratingRepo,
    contestRepo,
    gamificationRepo,
    feedRepo,
  );

  let candidateId = '';
  let candidateUsername = '';

  before(async () => {
    const unique = Date.now();
    candidateUsername = `talent_star_${unique}`;
    const user = await authService.register({
      email: `talent_star_${unique}@codeforge.dev`,
      username: candidateUsername,
      password: 'StrongPassword123!',
      fullName: 'Star Talent Engineer',
    });
    candidateId = user.user.id;

    // Set portfolio headline and publish project
    await portfolioService.updatePortfolioSettings(candidateId, {
      headline: 'Full-Stack Distributed Systems Engineer',
      isPublic: true,
    });

    await portfolioService.createProject(candidateId, {
      title: 'Real-time WebSocket Collaborative Whiteboard',
      description: 'Canvas collaboration engine with CRDTs and WebSockets.',
      technologies: ['TypeScript', 'React', 'WebSocket', 'Node.js'],
    });

  });

  it('should search and discover public developer talent', async () => {
    const results = await talentService.searchTalent({
      role: 'Full-Stack',
      minRating: 1000,
    });

    assert.ok(results.total > 0, 'Should find candidates');
    const match = results.profiles.find(p => p.userId === candidateId);
    assert.ok(match, 'Created candidate should be discovered in talent directory');
    assert.strictEqual(match.username, candidateUsername);
    assert.ok(match.rating >= 1200);
    assert.ok(match.projectsCount >= 1);
  });

  it('should publish activity feed events and retrieve public & personal feed', async () => {
    await feedService.recordActivity(
      candidateId,
      ActivityType.ACHIEVEMENT_UNLOCKED,
      'Unlocked Speed Demon Badge',
      'Solved 5 algorithmic problems within 1 hour.',
      { badgeSlug: 'speed-demon' },
      true,
    );

    const publicFeed = await feedService.getPublicFeed(10);
    assert.ok(publicFeed.length > 0, 'Public feed should contain events');

    const personalFeed = await feedService.getUserFeed(candidateId, 10);
    assert.ok(personalFeed.length > 0, 'User feed should contain personal events');
    assert.ok(personalFeed.some(e => e.userId === candidateId));
  });
});

