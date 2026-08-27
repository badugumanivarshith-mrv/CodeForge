import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import { AuthService } from '../../src/services/auth.service';
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

describe('Developer Portfolio Platform Integration Tests', () => {
  const userRepo = new UserRepository();
  const sessionRepo = new SessionRepository();
  const tokenRepo = new TokenRepository();
  const portfolioRepo = new PortfolioRepository();
  const ratingRepo = new RatingRepository();
  const contestRepo = new ContestRepository();
  const gamificationRepo = new GamificationRepository();
  const feedRepo = new ActivityFeedRepository();

  const authService = new AuthService(userRepo, sessionRepo, tokenRepo);
  const portfolioService = new PortfolioService(
    portfolioRepo,
    userRepo,
    ratingRepo,
    contestRepo,
    gamificationRepo,
    feedRepo,
  );

  let user1Id = '';
  let user1Username = '';
  let user2Id = '';
  let createdProjectId = '';

  before(async () => {
    const unique = Date.now();
    user1Username = `port_dev1_${unique}`;
    const user1 = await authService.register({
      email: `portfolio_user1_${unique}@codeforge.dev`,
      username: user1Username,
      password: 'StrongPassword123!',
      fullName: 'Portfolio Engineer One',
    });
    user1Id = user1.user.id;

    const user2 = await authService.register({
      email: `portfolio_user2_${unique}@codeforge.dev`,
      username: `port_dev2_${unique}`,
      password: 'StrongPassword123!',
      fullName: 'Portfolio Engineer Two',
    });
    user2Id = user2.user.id;
  });

  it('should fetch personal portfolio with default settings, rating, and heatmap', async () => {
    const portfolio = await portfolioService.getMyPortfolio(user1Id);
    assert.ok(portfolio, 'Portfolio should exist');
    assert.strictEqual(portfolio.user.id, user1Id);
    assert.strictEqual(portfolio.settings.isPublic, true);
    assert.ok(Array.isArray(portfolio.projects), 'Projects should be an array');
    assert.ok(Array.isArray(portfolio.skills), 'Skills should be an array');
    assert.ok(portfolio.skills.length > 0, 'Should contain baseline skills');
    assert.ok(Array.isArray(portfolio.heatmap), 'Heatmap should be an array');
    assert.strictEqual(portfolio.heatmap.length, 30, 'Heatmap should contain 30 days');
  });

  it('should create and publish a new portfolio project', async () => {
    const project = await portfolioService.createProject(user1Id, {
      title: 'Distributed KV Store',
      description: 'A high-throughput distributed key-value store in Rust with Raft consensus.',
      repositoryUrl: 'https://github.com/codeforge/raft-kv',
      demoUrl: 'https://kv.codeforge.dev',
      technologies: ['Rust', 'Raft', 'gRPC', 'RocksDB'],
      isFeatured: true,
    });

    assert.ok(project.id, 'Project ID should exist');
    assert.strictEqual(project.userId, user1Id);
    assert.strictEqual(project.title, 'Distributed KV Store');
    assert.strictEqual(project.isFeatured, true);
    assert.deepStrictEqual(project.technologies, ['Rust', 'Raft', 'gRPC', 'RocksDB']);
    createdProjectId = project.id;
  });


  it('should retrieve public portfolio by username', async () => {
    const publicPort = await portfolioService.getPublicPortfolioByUsername(user1Username);
    assert.strictEqual(publicPort.user.username, user1Username);
    assert.strictEqual(publicPort.projects.length, 1);
    assert.strictEqual(publicPort.projects[0].id, createdProjectId);
  });

  it('should update portfolio privacy settings and block public access when private', async () => {
    await portfolioService.updatePortfolioSettings(user1Id, {
      isPublic: false,
      headline: 'Senior Distributed Systems Architect',
    });

    await assert.rejects(
      async () => {
        await portfolioService.getPublicPortfolioByUsername(user1Username);
      },
      (err: any) => {
        assert.strictEqual(err.statusCode, 403);
        assert.strictEqual(err.code, 'PORTFOLIO_PRIVATE');
        return true;
      },
    );

    // Restore to public
    await portfolioService.updatePortfolioSettings(user1Id, { isPublic: true });
  });

  it('should prevent User B from updating or deleting User A project (Multi-user Isolation)', async () => {
    await assert.rejects(
      async () => {
        await portfolioService.updateProject(createdProjectId, user2Id, {
          title: 'Hacked Project Title',
        });
      },
      (err: any) => {
        assert.strictEqual(err.statusCode, 404);
        return true;
      },
    );

    await assert.rejects(
      async () => {
        await portfolioService.deleteProject(createdProjectId, user2Id);
      },
      (err: any) => {
        assert.strictEqual(err.statusCode, 404);
        return true;
      },
    );
  });

  it('should allow author to delete their project', async () => {
    await portfolioService.deleteProject(createdProjectId, user1Id);
    const myPort = await portfolioService.getMyPortfolio(user1Id);
    assert.strictEqual(myPort.projects.length, 0);
  });
});
