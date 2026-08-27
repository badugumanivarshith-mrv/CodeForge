import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';
import { AuthService } from '../../src/services/auth.service';
import { ResumeService } from '../../src/services/resume.service';
import { PortfolioService } from '../../src/services/portfolio.service';
import {
  UserRepository,
  SessionRepository,
  TokenRepository,
  ResumeRepository,
  PortfolioRepository,
  RatingRepository,
  ContestRepository,
  GamificationRepository,
  ActivityFeedRepository,
} from '../../src/repositories';

describe('AI Resume Generator & ATS Optimization Integration Tests', () => {
  const userRepo = new UserRepository();
  const sessionRepo = new SessionRepository();
  const tokenRepo = new TokenRepository();
  const resumeRepo = new ResumeRepository();
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
  const resumeService = new ResumeService(
    resumeRepo,
    userRepo,
    portfolioRepo,
    ratingRepo,
  );

  let user1Id = '';
  let user2Id = '';
  let createdResumeId = '';

  before(async () => {
    const unique = Date.now();
    const user1 = await authService.register({
      email: `resume_author_${unique}@codeforge.dev`,
      username: `resume_author_${unique}`,
      password: 'StrongPassword123!',
      fullName: 'Resume Author User',
    });
    user1Id = user1.user.id;

    const user2 = await authService.register({
      email: `resume_hacker_${unique}@codeforge.dev`,
      username: `resume_hacker_${unique}`,
      password: 'StrongPassword123!',
      fullName: 'Resume Hacker User',
    });
    user2Id = user2.user.id;

    // Seed a portfolio project
    await portfolioService.createProject(user1Id, {
      title: 'E-Commerce Microservices Engine',
      description: 'Built event-driven microservices architecture using Node.js, TypeScript, and Kafka.',
      technologies: ['TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'Redis'],
    });

  });

  it('should create an ATS resume with automated CodeForge data import', async () => {
    const resume = await resumeService.createResume(user1Id, {
      title: 'Fullstack Software Engineer Resume',
      templateName: 'executive-dark',
      targetRole: 'Fullstack Developer',
      importCodeforgeData: true,
      skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'REST', 'Git', 'Cloud'],
      experience: [
        {
          company: 'Acme Technologies',
          position: 'Software Engineering Intern',
          startDate: '2024-01',
          endDate: '2024-08',
          highlights: ['Built responsive React dashboards and reduced API latency by 25%'],
        },
      ],
      education: [
        {
          institution: 'State University of Technology',
          degree: 'B.S. Computer Science',
          graduationYear: '2025',
        },
      ],
    });

    assert.ok(resume.id, 'Resume ID should exist');
    assert.strictEqual(resume.userId, user1Id);
    assert.strictEqual(resume.targetRole, 'Fullstack Developer');
    assert.ok(resume.projects.length >= 1, 'Imported CodeForge project should be populated');
    assert.strictEqual(resume.projects[0].name, 'E-Commerce Microservices Engine');
    createdResumeId = resume.id;
  });

  it('should analyze ATS score, identify matched vs missing keywords, and produce suggestions', async () => {
    const atsResult = await resumeService.analyzeAtsScore(createdResumeId, user1Id);

    assert.ok(atsResult.score >= 50 && atsResult.score <= 100);
    assert.ok(atsResult.strengths.length > 0);
    assert.ok(Array.isArray(atsResult.missingKeywords));
    assert.ok(atsResult.suggestions.length > 0);
  });

  it('should enforce user ownership isolation (User B cannot update or delete User A resume)', async () => {
    await assert.rejects(
      async () => {
        await resumeService.updateResume(createdResumeId, user2Id, {
          title: 'Tampered Resume',
        });
      },
      (err: any) => {
        assert.strictEqual(err.statusCode, 404);
        return true;
      },
    );

    await assert.rejects(
      async () => {
        await resumeService.deleteResume(createdResumeId, user2Id);
      },
      (err: any) => {
        assert.strictEqual(err.statusCode, 404);
        return true;
      },
    );
  });

  it('should allow author to update and delete their resume', async () => {
    const updated = await resumeService.updateResume(createdResumeId, user1Id, {
      title: 'Senior Fullstack Software Engineer Resume',
    });
    assert.strictEqual(updated.title, 'Senior Fullstack Software Engineer Resume');

    await resumeService.deleteResume(createdResumeId, user1Id);
    const resumes = await resumeService.getUserResumes(user1Id);
    assert.strictEqual(resumes.length, 0);
  });
});
