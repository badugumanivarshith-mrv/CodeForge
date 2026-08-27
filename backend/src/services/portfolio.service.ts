import {
  PortfolioRepository,
  UserRepository,
  RatingRepository,
  ContestRepository,
  GamificationRepository,
  ActivityFeedRepository,
} from '../repositories';
import { db } from '../database/connection';
import {
  submissions,
  quizAttempts,
  userLessonProgress,
  assessmentSessions,
  contestSubmissions,
  contestParticipants,
  topicMastery,
  topics,
  userAchievements,
  achievements,
} from '../database/schema';
import { eq, desc } from 'drizzle-orm';
import {
  FullPortfolioDto,
  PortfolioSettingsDto,
  PortfolioProjectDto,
  CreatePortfolioProjectDto,
  UpdatePortfolioProjectDto,
  UpdatePortfolioSettingsDto,
  ActivityType,
} from '@codeforge/shared';
import {
  NotFoundError,
  ForbiddenError,
} from '../core/errors';



export class PortfolioService {
  private portfolioRepo: PortfolioRepository;
  private userRepo: UserRepository;
  private ratingRepo: RatingRepository;
  private contestRepo: ContestRepository;
  private gamificationRepo: GamificationRepository;
  private feedRepo: ActivityFeedRepository;

  constructor(
    portfolioRepo = new PortfolioRepository(),
    userRepo = new UserRepository(),
    ratingRepo = new RatingRepository(),
    contestRepo = new ContestRepository(),
    gamificationRepo = new GamificationRepository(),
    feedRepo = new ActivityFeedRepository(),
  ) {
    this.portfolioRepo = portfolioRepo;
    this.userRepo = userRepo;
    this.ratingRepo = ratingRepo;
    this.contestRepo = contestRepo;
    this.gamificationRepo = gamificationRepo;
    this.feedRepo = feedRepo;
  }

  async getMyPortfolio(userId: string): Promise<FullPortfolioDto> {
    return this.buildPortfolio(userId, true);
  }

  async getPublicPortfolioByUsername(username: string): Promise<FullPortfolioDto> {
    const user = await this.userRepo.findByUsername(username);
    if (!user) {
      throw new NotFoundError('User portfolio not found', 'PORTFOLIO_NOT_FOUND');
    }

    const portfolio = await this.buildPortfolio(user.id, false);
    if (!portfolio.settings.isPublic) {
      throw new ForbiddenError('This developer portfolio is private', 'PORTFOLIO_PRIVATE');
    }

    return portfolio;
  }

  async updatePortfolioSettings(userId: string, data: UpdatePortfolioSettingsDto): Promise<PortfolioSettingsDto> {
    return this.portfolioRepo.upsertSettings(userId, data);
  }

  async createProject(userId: string, data: CreatePortfolioProjectDto): Promise<PortfolioProjectDto> {
    const project = await this.portfolioRepo.createProject(userId, data);

    await this.feedRepo.createEvent(
      userId,
      ActivityType.PROJECT_PUBLISHED,
      `Published Project: ${project.title}`,
      `Showcased project "${project.title}" on their public developer portfolio.`,
      { projectId: project.id, technologies: project.technologies },
      true,
    );


    return project;
  }

  async updateProject(
    id: string,
    userId: string,
    data: UpdatePortfolioProjectDto,
  ): Promise<PortfolioProjectDto> {
    const updated = await this.portfolioRepo.updateProject(id, userId, data);
    if (!updated) {
      throw new NotFoundError('Portfolio project not found or access denied', 'PROJECT_NOT_FOUND');
    }
    return updated;
  }

  async deleteProject(id: string, userId: string): Promise<void> {
    const success = await this.portfolioRepo.deleteProject(id, userId);
    if (!success) {
      throw new NotFoundError('Portfolio project not found or access denied', 'PROJECT_NOT_FOUND');
    }
  }

  private async buildPortfolio(userId: string, isOwner: boolean): Promise<FullPortfolioDto> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found', 'USER_NOT_FOUND');
    }


    const profile = await this.userRepo.getProfile(userId);
    let settings = await this.portfolioRepo.getSettingsByUserId(userId);
    if (!settings) {
      settings = await this.portfolioRepo.upsertSettings(userId, {
        isPublic: true,
        themePreference: 'modern-dark',
        headline: 'Full-Stack Software Engineer',
        aboutMdx: profile?.bio || 'Building scalable applications and exploring computer science algorithms.',
      });
    }

    const projects = await this.portfolioRepo.getProjectsByUserId(userId);
    const ratingData = await this.ratingRepo.getUserRating(userId);

    const participantRows = await db
      .select()
      .from(contestParticipants)
      .where(eq(contestParticipants.userId, userId));

    const achievementRows = await db
      .select({
        id: achievements.id,
        title: achievements.title,
        badgeIcon: achievements.badgeIconUrl,
        unlockedAt: userAchievements.unlockedAt,
      })
      .from(userAchievements)
      .innerJoin(achievements, eq(userAchievements.achievementId, achievements.id))
      .where(eq(userAchievements.userId, userId));

    // Calculate skills from topic mastery
    const masteryRows = await db
      .select({
        topicTitle: topics.title,
        masteryScore: topicMastery.masteryScore,
      })
      .from(topicMastery)
      .innerJoin(topics, eq(topicMastery.topicId, topics.id))
      .where(eq(topicMastery.userId, userId))
      .orderBy(desc(topicMastery.masteryScore))
      .limit(10);

    const skills = masteryRows.map((m: { topicTitle: string; masteryScore: string }) => {
      const score = Math.round(Number(m.masteryScore) || 0);
      let level = 'Beginner';
      if (score >= 80) level = 'Expert';
      else if (score >= 50) level = 'Proficient';
      else if (score >= 20) level = 'Intermediate';

      return {
        skillName: m.topicTitle,
        level,
        score,
      };
    });

    if (skills.length === 0) {
      skills.push(
        { skillName: 'Algorithms & Data Structures', level: 'Intermediate', score: 65 },
        { skillName: 'Python Programming', level: 'Proficient', score: 75 },
        { skillName: 'System Design', level: 'Intermediate', score: 55 },
      );
    }

    // Build Activity Heatmap (past 30 days)
    const heatmap = await this.generateHeatmap(userId);

    return {
      user: {
        id: user.id,
        username: user.username,
        fullName: profile?.fullName || user.username,
        avatarUrl: profile?.avatarUrl || undefined,
        bio: profile?.bio || settings.aboutMdx || undefined,
      },
      settings,
      projects,
      skills,
      rating: {
        currentRating: ratingData?.currentRating || 1200,
        peakRating: ratingData?.peakRating || 1200,
        rankTier: ratingData?.rankTier || 'Novice',
        percentile: ratingData?.percentile ? Number(ratingData.percentile) : 50,
      },
      contests: {
        participatedCount: participantRows.length,
      },
      achievements: achievementRows.map((a: { id: string; title: string; badgeIcon: string; unlockedAt: Date }) => ({
        id: a.id,
        title: a.title,
        badgeIcon: a.badgeIcon,
        unlockedAt: a.unlockedAt.toISOString(),
      })),
      heatmap,
    };
  }


  private async generateHeatmap(userId: string): Promise<{ date: string; count: number; level: number }[]> {
    const datesMap: Record<string, number> = {};
    const now = new Date();

    // Initialize past 30 days
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      datesMap[key] = 0;
    }

    // Aggregations from submissions
    const subRows = await db
      .select({ createdAt: submissions.createdAt })
      .from(submissions)
      .where(eq(submissions.userId, userId));

    for (const r of subRows) {
      const k = r.createdAt.toISOString().split('T')[0];
      if (datesMap[k] !== undefined) datesMap[k]++;
    }

    // Aggregations from lessons
    const lessonRows = await db
      .select({ completedAt: userLessonProgress.completedAt })
      .from(userLessonProgress)
      .where(eq(userLessonProgress.userId, userId));

    for (const r of lessonRows) {
      const k = r.completedAt.toISOString().split('T')[0];
      if (datesMap[k] !== undefined) datesMap[k]++;
    }

    // Format output with level (0-4)
    return Object.entries(datesMap).map(([date, count]) => {
      let level = 0;
      if (count >= 5) level = 4;
      else if (count >= 3) level = 3;
      else if (count >= 2) level = 2;
      else if (count >= 1) level = 1;

      return { date, count, level };
    });
  }
}
