import { ICareerOsRepository } from '../../repositories/interfaces/ICareerOsRepository';
import { careerOsRepository } from '../../repositories/CareerOsRepository';
import {
  PersonalBrandProfileDto,
  PersonalBrandScoreDto,
  ContentPlanDto,
} from '@codeforge/shared';

export class PersonalBrandService {
  constructor(private repo: ICareerOsRepository = careerOsRepository) {}

  /**
   * Calculates overall brand score and tier based on vector inputs
   */
  calculateBrandScore(
    githubScore = 72,
    portfolioScore = 65,
    linkedinScore = 70,
    contentScore = 55,
    ossScore = 60
  ): PersonalBrandScoreDto {
    const clamp = (v: number) => Math.max(10, Math.min(100, Math.round(v)));

    const gh = clamp(githubScore);
    const pf = clamp(portfolioScore);
    const li = clamp(linkedinScore);
    const ct = clamp(contentScore);
    const os = clamp(ossScore);

    // Weighted composite Brand Score:
    // GitHub (25%) + Portfolio (20%) + LinkedIn (20%) + Content (20%) + OSS (15%)
    const brandScore = clamp(
      gh * 0.25 +
      pf * 0.20 +
      li * 0.20 +
      ct * 0.20 +
      os * 0.15
    );

    let brandTier: 'AUTHORITY' | 'STRONG' | 'DEVELOPING' | 'EMERGING' = 'DEVELOPING';
    if (brandScore >= 85) brandTier = 'AUTHORITY';
    else if (brandScore >= 70) brandTier = 'STRONG';
    else if (brandScore >= 50) brandTier = 'DEVELOPING';
    else brandTier = 'EMERGING';

    return {
      brandScore,
      githubScore: gh,
      portfolioScore: pf,
      linkedinScore: li,
      contentScore: ct,
      ossScore: os,
      brandTier,
    };
  }

  /**
   * Generates actionable content plan recommendations
   */
  generateContentPlans(primarySkills: string[] = ['Rust', 'Distributed Systems', 'TypeScript']): ContentPlanDto[] {
    const skillA = primarySkills[0] || 'Distributed Systems';
    const skillB = primarySkills[1] || 'Modern Architecture';

    return [
      {
        title: `Building Resilient Key-Value Stores in ${skillA}: Consensus, WAL, and LSM-Trees`,
        platform: 'BLOG',
        targetAudience: 'Senior & Staff Backend Engineers',
        recommendedKeywords: ['LSM Trees', 'Write-Ahead Log', skillA, 'Distributed Systems'],
        estimatedReachScore: 88,
      },
      {
        title: `How We Optimized Database p99 Latency by 40% with Connection Pooling in ${skillB}`,
        platform: 'LINKEDIN',
        targetAudience: 'Engineering Managers & Tech Leads',
        recommendedKeywords: ['Database Performance', 'p99 Latency', 'System Architecture'],
        estimatedReachScore: 92,
      },
      {
        title: `Open Sourcing a High-Throughput Stream Processor in ${skillA}`,
        platform: 'GITHUB',
        targetAudience: 'Open Source Contributors & Infrastructure Teams',
        recommendedKeywords: ['Open Source', 'Concurrency', 'Benchmarking'],
        estimatedReachScore: 84,
      },
      {
        title: 'Zero-Downtime Microservice Migrations in Cloud Environments',
        platform: 'TALK',
        targetAudience: 'Conference Attendees & Meetup Communities',
        recommendedKeywords: ['Microservices', 'Zero Downtime', 'DevOps'],
        estimatedReachScore: 78,
      },
    ];
  }

  /**
   * Retrieves or creates user personal brand profile
   */
  async getPersonalBrandProfile(userId: string): Promise<PersonalBrandProfileDto> {
    const existing = await this.repo.getPersonalBrandProfile(userId);
    if (existing) return existing;

    const brandScore = this.calculateBrandScore();
    const contentPlans = this.generateContentPlans();

    const recommendations = [
      'Pin 3 showcase GitHub repositories with detailed architecture diagrams in README.md',
      'Add live interactive demo links to all top portfolio project cards',
      'Publish at least one in-depth technical post per month to establish domain authority',
      'Contribute upstream bug fixes to a tier-1 open-source repository',
    ];

    const speakingOpportunities = [
      { eventName: 'Cloud Native & Distributed Systems Summit 2027', topic: 'Modern Consensus Protocols in Rust', deadline: '2027-02-15' },
      { eventName: 'Global Backend Architecture Meetup', topic: 'High-Throughput Vector Indexing', deadline: '2026-11-30' },
    ];

    const openSourceRecommendations = [
      { repoName: 'tokio-rs/tokio', tech: 'Rust', difficulty: 'Intermediate' },
      { repoName: 'drizzle-team/drizzle-orm', tech: 'TypeScript', difficulty: 'Beginner-Friendly' },
      { repoName: 'vectordb/qdrant', tech: 'Rust', difficulty: 'Advanced' },
    ];

    return this.repo.upsertPersonalBrandProfile(userId, {
      userId,
      brandScore,
      recommendations,
      contentPlans,
      speakingOpportunities,
      openSourceRecommendations,
      updatedAt: new Date().toISOString(),
    });
  }

  /**
   * Updates brand profile with new scores
   */
  async updateBrandProfile(userId: string, profile: Partial<PersonalBrandProfileDto>): Promise<PersonalBrandProfileDto> {
    return this.repo.upsertPersonalBrandProfile(userId, profile);
  }
}

export const personalBrandService = new PersonalBrandService();
