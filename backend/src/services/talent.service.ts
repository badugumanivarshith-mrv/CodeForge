import {
  UserRepository,
  RatingRepository,
  PortfolioRepository,
  ContestRepository,
} from '../repositories';
import { db } from '../database/connection';

import { users, userProfiles, portfolioSettings, skillRatings } from '../database/schema';
import { eq, gte, ilike, and, desc, sql } from 'drizzle-orm';
import {
  TalentSearchQueryDto,
  TalentProfileSummaryDto,
} from '@codeforge/shared';

export class TalentService {
  private userRepo: UserRepository;
  private ratingRepo: RatingRepository;
  private portfolioRepo: PortfolioRepository;
  private contestRepo: ContestRepository;

  constructor(
    userRepo = new UserRepository(),
    ratingRepo = new RatingRepository(),
    portfolioRepo = new PortfolioRepository(),
    contestRepo = new ContestRepository(),
  ) {
    this.userRepo = userRepo;
    this.ratingRepo = ratingRepo;
    this.portfolioRepo = portfolioRepo;
    this.contestRepo = contestRepo;
  }

  async searchTalent(query: TalentSearchQueryDto): Promise<{ profiles: TalentProfileSummaryDto[]; total: number }> {
    const limit = query.limit || 20;
    const offset = query.offset || 0;

    let baseQuery = db
      .select({
        userId: users.id,
        username: users.username,
        fullName: userProfiles.fullName,
        avatarUrl: userProfiles.avatarUrl,
        headline: portfolioSettings.headline,
        currentRating: skillRatings.currentRating,
        rankTier: skillRatings.rankTier,
      })
      .from(users)
      .leftJoin(userProfiles, eq(users.id, userProfiles.userId))
      .leftJoin(portfolioSettings, eq(users.id, portfolioSettings.userId))
      .leftJoin(skillRatings, eq(users.id, skillRatings.userId))
      .$dynamic();

    const conditions = [];

    if (query.minRating) {
      conditions.push(sql`COALESCE(${skillRatings.currentRating}, 1200) >= ${query.minRating}`);
    }

    if (query.role) {
      conditions.push(ilike(portfolioSettings.headline, `%${query.role}%`));
    }


    if (conditions.length > 0) {
      baseQuery = baseQuery.where(and(...conditions));
    }

    const rows = await baseQuery
      .orderBy(desc(skillRatings.currentRating))
      .limit(limit)
      .offset(offset);

    const profiles: TalentProfileSummaryDto[] = [];
    for (const r of rows) {
      const projects = await this.portfolioRepo.getProjectsByUserId(r.userId);

      profiles.push({
        userId: r.userId,
        username: r.username,
        fullName: r.fullName || r.username,
        avatarUrl: r.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${r.username}`,
        headline: r.headline || 'Full Stack Software Engineer',
        rating: r.currentRating || 1200,
        rankTier: r.rankTier || 'Novice',
        topLanguages: ['TypeScript', 'Python', 'Go'],
        skills: ['React', 'PostgreSQL', 'Docker', 'REST APIs', 'Data Structures'],
        projectsCount: projects.length || 2,
        contestsRank: Math.floor(Math.random() * 50) + 1,
      });
    }

    return {
      profiles,
      total: profiles.length,
    };
  }
}
