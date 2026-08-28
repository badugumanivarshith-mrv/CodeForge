import { ICareerOsRepository } from '../../repositories/interfaces/ICareerOsRepository';
import { careerOsRepository } from '../../repositories/CareerOsRepository';
import { careerTwinService, CareerTwinService } from './careerTwinService';
import {
  CareerCoachingReportDto,
  CareerRiskAlertDto,
  CareerRiskAlertLevel,
  CoachingFrequency,
  PromotionPlanDto,
  JobSwitchPlanDto,
} from '@codeforge/shared';

export class CareerCoachService {
  constructor(
    private repo: ICareerOsRepository = careerOsRepository,
    private twinService: CareerTwinService = careerTwinService
  ) {}

  /**
   * Evaluates burnout risk score (0 - 100) based on pace, velocity, and streak patterns
   */
  calculateBurnoutRisk(weeklyHours: number, learningVelocity: number, streakDays: number): number {
    let score = 15; // baseline healthy
    if (weeklyHours > 35) score += 35;
    else if (weeklyHours > 25) score += 20;

    if (learningVelocity > 92 && streakDays > 45) score += 25;
    if (weeklyHours > 40 && streakDays > 60) score += 30;

    return Math.max(5, Math.min(100, Math.round(score)));
  }

  /**
   * Analyzes risk alerts across severity levels (LOW, MEDIUM, HIGH, CRITICAL)
   */
  detectCareerRisks(healthScore: number, interviewReadiness: number, primarySkills: string[], burnoutScore: number): CareerRiskAlertDto[] {
    const alerts: CareerRiskAlertDto[] = [];

    if (healthScore < 50 || interviewReadiness < 40) {
      alerts.push({
        id: 'alert-crit-readiness',
        level: CareerRiskAlertLevel.CRITICAL,
        category: 'INTERVIEW_READINESS',
        title: 'Critical Gap in Technical Interview Readiness',
        description: 'Your current interview readiness vector is below minimum baseline for tier-1 tech hiring standards.',
        suggestedAction: 'Schedule 3 mock system design loops and complete the Hard Dynamic Programming practice track.',
        identifiedAt: new Date().toISOString(),
      });
    }

    if (burnoutScore >= 65) {
      alerts.push({
        id: 'alert-high-burnout',
        level: CareerRiskAlertLevel.HIGH,
        category: 'WELLBEING_BURNOUT',
        title: 'Elevated Fatigue & Burnout Probability',
        description: 'Consecutive high-velocity study and contest streaks without rest intervals are dampening retention efficiency.',
        suggestedAction: 'Take 2 rest days and transition to low-intensity concept review.',
        identifiedAt: new Date().toISOString(),
      });
    }

    if (!primarySkills.some(s => s.toLowerCase().includes('distributed') || s.toLowerCase().includes('system') || s.toLowerCase().includes('cloud'))) {
      alerts.push({
        id: 'alert-med-systems',
        level: CareerRiskAlertLevel.MEDIUM,
        category: 'SKILL_DEFICIT',
        title: 'Modern Architecture Competency Gap',
        description: 'Target roles heavily favor engineers with proven distributed consensus, caching, and cloud-native experience.',
        suggestedAction: 'Complete the Scalable Microservices & Raft Consensus learning path.',
        identifiedAt: new Date().toISOString(),
      });
    }

    if (alerts.length === 0) {
      alerts.push({
        id: 'alert-low-momentum',
        level: CareerRiskAlertLevel.LOW,
        category: 'OPTIMIZATION',
        title: 'Strong Career Trajectory — Minor Visibility Optimization',
        description: 'Your core metrics are solid. Focus on increasing open-source technical writing reach.',
        suggestedAction: 'Publish a technical breakdown of your latest microservices project on LinkedIn.',
        identifiedAt: new Date().toISOString(),
      });
    }

    return alerts;
  }

  /**
   * Generates tailored promotion plan towards L5/Staff
   */
  generatePromotionPlan(targetRole: string, leadershipPotential: number): PromotionPlanDto {
    const readiness = Math.max(20, Math.min(95, Math.round(leadershipPotential * 0.9 + 15)));
    return {
      targetRole: targetRole || 'Senior Staff Engineer',
      currentReadinessScore: readiness,
      estimatedHorizonMonths: readiness >= 80 ? 4 : 8,
      keyCompetencyGaps: [
        'End-to-end technical project driving across multiple squads',
        'Architecture RFC drafting and alignment with principal engineers',
        'Formal mentoring of 2+ junior and mid-level engineers',
      ],
      leadershipProofPoints: [
        'Delivered distributed caching migration reducing p99 latency by 45%',
        'Mentored 3 engineers through successful promotion cycles',
        'Authored and presented zero-downtime database failover runbook',
      ],
      recommendedSponsors: [
        'Engineering Director — Infrastructure',
        'Staff Architect — Core Platforms',
      ],
    };
  }

  /**
   * Generates job-switch plan with target compensation ranges
   */
  generateJobSwitchPlan(targetRole: string, marketCompetitiveness: number, currentSalaryUsd = 125000): JobSwitchPlanDto {
    const medianBump = Math.round(currentSalaryUsd * 1.30);
    return {
      targetRole: targetRole || 'Senior Distributed Systems Engineer',
      marketDemandScore: 92,
      targetSalaryRange: {
        min: Math.round(currentSalaryUsd * 1.15),
        median: medianBump,
        max: Math.round(currentSalaryUsd * 1.48),
      },
      interviewReadiness: Math.max(50, Math.min(95, Math.round(marketCompetitiveness * 0.9 + 10))),
      recommendedPrepTimeWeeks: 6,
      targetCompanies: ['Stripe', 'Vercel', 'Datadog', 'Google Cloud', 'OpenAI', 'Uber'],
    };
  }

  /**
   * Generates complete AI Career Coaching Report
   */
  async generateCoachingReport(userId: string, frequency: CoachingFrequency = CoachingFrequency.WEEKLY): Promise<CareerCoachingReportDto> {
    const twin = await this.twinService.getOrCreateTwin(userId);

    const burnoutScore = this.calculateBurnoutRisk(28, twin.learningVelocity, 21);
    const riskAlerts = this.detectCareerRisks(twin.healthScore, twin.interviewReadiness, twin.primarySkills, burnoutScore);
    const promotionPlan = this.generatePromotionPlan(twin.targetRole, twin.leadershipPotential);
    const jobSwitchPlan = this.generateJobSwitchPlan(twin.targetRole, twin.marketCompetitiveness, twin.currentSalaryUsd || 120000);

    const strengths = [
      'High algorithmic problem-solving accuracy in contest arenas',
      'Consistent weekly commit frequency across core repositories',
      'Proven mastery in typed systems and backend concurrency',
    ];

    const actionItems: { priority: 'HIGH' | 'MEDIUM' | 'LOW'; action: string; category: string }[] = [
      { priority: 'HIGH', action: 'Lead technical RFC review for distributed cache invalidation', category: 'LEADERSHIP' },
      { priority: 'MEDIUM', action: 'Complete 2 timed live coding simulations on graph algorithms', category: 'INTERVIEW' },
      { priority: 'LOW', action: 'Publish architecture benchmark comparison on personal tech blog', category: 'BRAND' },
    ];

    const reportData = {
      frequency,
      summary: `Your Career Health Index is performing strongly at ${twin.healthScore}/100. Learning velocity remains high (+${twin.learningVelocity}th percentile). Focus on closing leadership proof points for target role '${twin.targetRole}'.`,
      healthMetrics: {
        healthScore: twin.healthScore,
        learningVelocity: twin.learningVelocity,
        careerMomentum: twin.careerMomentum,
        marketCompetitiveness: twin.marketCompetitiveness,
        interviewReadiness: twin.interviewReadiness,
        salaryPositioning: twin.salaryPositioning,
        leadershipPotential: twin.leadershipPotential,
      },
      strengths,
      riskAlerts,
      actionItems,
      promotionReadiness: promotionPlan.currentReadinessScore,
      burnoutRiskScore: burnoutScore,
      promotionPlan,
      jobSwitchPlan,
    };

    return this.repo.saveCoachingReport(twin.id, userId, reportData);
  }

  async getLatestReport(userId: string): Promise<CareerCoachingReportDto | null> {
    return this.repo.getLatestCoachingReport(userId);
  }

  async listReports(userId: string): Promise<CareerCoachingReportDto[]> {
    return this.repo.listCoachingReports(userId);
  }
}

export const careerCoachService = new CareerCoachService();
