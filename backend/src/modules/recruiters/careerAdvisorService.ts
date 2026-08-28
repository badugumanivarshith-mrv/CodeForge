import { eq } from 'drizzle-orm';
import { db } from '../../database/connection';
import {
  skillRatings,
  assessmentResults,
  careerGoals,
  portfolioProjects,
  topicMastery,
  topics,
  problems,
} from '../../database/schema';
import { CareerAdvisorAnalysisDto } from '@codeforge/shared';

export interface CandidateStats {
  solvedProblemsCount?: number;
  hardProblemsCount?: number;
  contestRating?: number;
  assessmentAverage?: number;
  interviewSessionsCount?: number;
  interviewAvgScore?: number;
  projectsCount?: number;
  masteriesCount?: number;
}

export class CareerAdvisorService {
  /**
   * Calculates Interview Readiness Score (0-100)
   */
  public calculateInterviewReadiness(stats: CandidateStats): number {
    const rating = stats.contestRating || 1200;
    const ratingNorm = Math.min(100, Math.round((rating / 2000) * 100));
    const assessmentNorm = Math.min(100, stats.assessmentAverage || 70);
    const projectsNorm = Math.min(100, (stats.projectsCount || 0) * 30 || 50);
    const problemsNorm = Math.min(100, ((stats.solvedProblemsCount || 0) / 50) * 100);

    const score = Math.round(
      ratingNorm * 0.35 +
        assessmentNorm * 0.3 +
        problemsNorm * 0.2 +
        projectsNorm * 0.15,
    );

    return Math.min(98, Math.max(25, score));
  }

  /**
   * Calculates Placement Probability (10-98%)
   */
  public calculatePlacementProbability(
    rating: number,
    assessmentAvg: number,
    readiness: number,
  ): number {
    const eloBonus = rating >= 1800 ? 15 : rating >= 1500 ? 8 : 2;
    const raw = readiness * 0.8 + (assessmentAvg / 100) * 15 + eloBonus;
    return Math.min(98, Math.max(10, Math.round(raw)));
  }

  /**
   * Estimates market annual compensation range & percentile rank
   */
  public estimateSalary(targetRole: string, rating: number) {
    let baseMedian = 100000;
    const roleLower = targetRole.toLowerCase();

    if (roleLower.includes('architect') || roleLower.includes('principal') || roleLower.includes('lead')) {
      baseMedian = 175000;
    } else if (roleLower.includes('systems') || roleLower.includes('infrastructure') || roleLower.includes('machine learning')) {
      baseMedian = 140000;
    } else if (roleLower.includes('senior')) {
      baseMedian = 135000;
    } else if (roleLower.includes('backend') || roleLower.includes('full stack')) {
      baseMedian = 110000;
    }

    const ratingMultiplier = 1 + (rating - 1200) / 1600;
    const medianAnnual = Math.round(baseMedian * Math.max(0.8, ratingMultiplier));
    const minAnnual = Math.round(medianAnnual * 0.82);
    const maxAnnual = Math.round(medianAnnual * 1.25);
    const percentileRank = Math.min(99, Math.max(20, Math.round((rating / 2200) * 100)));

    return {
      minAnnual,
      maxAnnual,
      medianAnnual,
      currency: 'USD',
      percentileRank,
    };
  }

  /**
   * Analyzes skill gaps and orders by criticality
   */
  public analyzeSkillGaps(
    userSkills: { name: string; proficiency: number }[],
    targetRole: string,
  ) {
    const roleLower = targetRole.toLowerCase();

    const standardGaps = [
      {
        skill: 'Distributed Systems & Microservices Architecture',
        importance: (roleLower.includes('architect') || roleLower.includes('systems') ? 'critical' : 'important') as 'critical' | 'important' | 'nice_to_have',
        currentProficiency: 45,
        targetProficiency: 90,
      },
      {
        skill: 'Dynamic Programming & Graph Algorithmic Mastery',
        importance: 'critical' as const,
        currentProficiency: 55,
        targetProficiency: 92,
      },
      {
        skill: 'Database Indexing & Query Tuning',
        importance: 'important' as const,
        currentProficiency: 60,
        targetProficiency: 85,
      },
      {
        skill: 'Cloud Native Infrastructure & Containers',
        importance: 'nice_to_have' as const,
        currentProficiency: 65,
        targetProficiency: 80,
      },
    ];

    // Adjust proficiency if user has matching skills
    for (const gap of standardGaps) {
      const match = userSkills.find(s =>
        gap.skill.toLowerCase().includes(s.name.toLowerCase()) ||
        s.name.toLowerCase().includes(gap.skill.toLowerCase()),
      );
      if (match) {
        gap.currentProficiency = match.proficiency;
      }
    }

    // Sort by importance: critical > important > nice_to_have
    const importanceWeight = { critical: 3, important: 2, nice_to_have: 1 };
    return standardGaps.sort((a, b) => importanceWeight[b.importance] - importanceWeight[a.importance]);
  }

  /**
   * Generates 3-Stage Career Trajectory Horizon
   */
  public generateCareerTrajectory(targetRole: string) {
    return [
      {
        stage: 'Immediate Horizon (0-1 Year)',
        timeline: '0-12 Months',
        targetRoles: [targetRole, 'Software Engineer II'],
        milestones: [
          'Master advanced algorithmic design and solve 100+ LeetCode-hard equivalent problems',
          'Attain 1700+ Contest Rating on CodeForge Arena',
          'Deploy modular microservices project with automated CI/CD and metrics',
        ],
      },
      {
        stage: 'Mid-Level Mastery (1-3 Years)',
        timeline: '1-3 Years',
        targetRoles: ['Senior Software Engineer', 'Core Backend Specialist'],
        milestones: [
          'Lead feature design, database schema migrations, and cross-service APIs',
          'Optimize database queries scaling to 10k+ req/sec',
          'Mentor junior engineers and conduct technical code reviews',
        ],
      },
      {
        stage: 'Principal / Leadership (3-5+ Years)',
        timeline: '3-5+ Years',
        targetRoles: ['Staff Engineer', 'Engineering Manager / Tech Lead'],
        milestones: [
          'Architect enterprise distributed platforms and fault-tolerant storage systems',
          'Set high-leverage technical vision and engineering roadmap',
          'Drive engineering excellence, security audits, and reliability SLAs',
        ],
      },
    ];
  }

  /**
   * Generates Personalized Learning & Problem-Solving Roadmap
   */
  public generatePersonalizedRoadmap(
    skillGaps: { skill: string; importance: string; currentProficiency: number; targetProficiency: number }[],
    recommendedProblemIds: string[] = [],
  ) {
    return [
      {
        step: 1,
        title: 'Algorithmic Optimization & Advanced Data Structures',
        description: 'Master Two Pointers, Sliding Window, Monotonic Stacks, and Tree Traversal optimizations.',
        recommendedProblemIds: recommendedProblemIds.slice(0, 2),
        recommendedTopics: ['Algorithms', 'Data Structures'],
        estimatedWeeks: 2,
      },
      {
        step: 2,
        title: 'High-Concurrency & Relational Query Architecture',
        description: 'Deep dive into database transaction isolation levels, connection pooling, and B-Tree indexes.',
        recommendedProblemIds: recommendedProblemIds.slice(2, 4),
        recommendedTopics: ['Databases', 'Backend Engineering'],
        estimatedWeeks: 3,
      },
      {
        step: 3,
        title: 'System Design & Mock Recruiter Screenings',
        description: 'Practice architectural trade-offs: CAP theorem, caching strategies (Redis), and event streaming.',
        recommendedProblemIds: [],
        recommendedTopics: ['System Design', 'Cloud Architecture'],
        estimatedWeeks: 2,
      },
    ];
  }

  /**
   * Generates comprehensive AI placement advisor recommendations & analysis from database
   */
  public async generateCareerAdvice(
    candidateId: string,
    customTargetRole?: string,
  ): Promise<CareerAdvisorAnalysisDto> {
    // 1. Fetch Candidate Rating & Goals
    const [ratingRow] = await db
      .select()
      .from(skillRatings)
      .where(eq(skillRatings.userId, candidateId))
      .limit(1);

    const rating = ratingRow?.currentRating || 1200;

    const [goalRow] = await db
      .select()
      .from(careerGoals)
      .where(eq(careerGoals.userId, candidateId))
      .limit(1);

    const targetRole = customTargetRole || goalRow?.targetRole?.replace(/_/g, ' ') || 'Full Stack Engineer';

    // 2. Fetch Assessments
    const assessments = await db
      .select()
      .from(assessmentResults)
      .where(eq(assessmentResults.userId, candidateId));

    let avgAssessment = 70;
    if (assessments.length > 0) {
      const sum = assessments.reduce((acc, a) => {
        const pct = a.maxScore > 0 ? (a.score / a.maxScore) * 100 : a.score;
        return acc + pct;
      }, 0);
      avgAssessment = Math.round(sum / assessments.length);
    }

    // 3. Fetch Masteries
    const masteries = await db
      .select({
        score: topicMastery.masteryScore,
        topicTitle: topics.title,
      })
      .from(topicMastery)
      .leftJoin(topics, eq(topicMastery.topicId, topics.id))
      .where(eq(topicMastery.userId, candidateId));

    const projects = await db
      .select()
      .from(portfolioProjects)
      .where(eq(portfolioProjects.userId, candidateId));

    // Calculate Interview Readiness Score (0-100)
    const interviewReadinessScore = this.calculateInterviewReadiness({
      contestRating: rating,
      assessmentAverage: avgAssessment,
      projectsCount: projects.length,
      masteriesCount: masteries.length,
    });

    // Calculate Placement Probability (0-100%)
    const placementProbability = this.calculatePlacementProbability(
      rating,
      avgAssessment,
      interviewReadinessScore,
    );

    // Current Level Determination
    let currentLevel = 'Entry-Level Developer';
    if (rating >= 1800 || interviewReadinessScore >= 85) {
      currentLevel = 'Senior / Lead Engineer';
    } else if (rating >= 1400 || interviewReadinessScore >= 65) {
      currentLevel = 'Mid-Level Software Engineer';
    } else if (rating >= 1250 || interviewReadinessScore >= 50) {
      currentLevel = 'Junior Software Engineer';
    }

    // Salary Estimation Engine
    const salaryEstimation = this.estimateSalary(targetRole, rating);

    // User skills for gap analysis
    const userSkills = masteries.map(m => ({
      name: m.topicTitle || '',
      proficiency: typeof m.score === 'number' ? m.score : Number(m.score) || 50,
    }));

    const skillGaps = this.analyzeSkillGaps(userSkills, targetRole);
    const careerTrajectory = this.generateCareerTrajectory(targetRole);

    const arenaProblems = await db.select({ id: problems.id }).from(problems).limit(4);
    const recommendedProblemIds = arenaProblems.map(p => p.id);
    const personalizedRoadmap = this.generatePersonalizedRoadmap(skillGaps, recommendedProblemIds);

    return {
      candidateId,
      targetRole,
      currentLevel,
      interviewReadinessScore,
      placementProbability,
      salaryEstimation,
      skillGaps,
      careerTrajectory,
      personalizedRoadmap,
    };
  }
}
