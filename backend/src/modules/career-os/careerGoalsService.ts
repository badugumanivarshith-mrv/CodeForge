import { ICareerOsRepository } from '../../repositories/interfaces/ICareerOsRepository';
import { careerOsRepository } from '../../repositories/CareerOsRepository';
import { careerTwinService, CareerTwinService } from './careerTwinService';
import {
  CareerOsGoalDto,
  CreateCareerOsGoalDto,
  UpdateCareerOsGoalDto,
  CareerOsRoadmapDto,
  CareerGoalType,
  CareerGoalStatus,
} from '@codeforge/shared';

export class CareerGoalsService {
  constructor(
    private repo: ICareerOsRepository = careerOsRepository,
    private twinService: CareerTwinService = careerTwinService
  ) {}

  async createGoal(userId: string, data: CreateCareerOsGoalDto): Promise<CareerOsGoalDto> {
    if (!data.title) {
      throw new Error('Goal title is required.');
    }
    const twin = await this.twinService.getOrCreateTwin(userId);
    return this.repo.createGoal(twin.id, userId, data);
  }

  async listGoals(userId: string): Promise<CareerOsGoalDto[]> {
    const existing = await this.repo.listGoals(userId);
    if (existing.length > 0) return existing;

    // Seed default starter goals if none exist yet
    const twin = await this.twinService.getOrCreateTwin(userId);
    const defaultGoal = await this.repo.createGoal(twin.id, userId, {
      type: CareerGoalType.PROMOTION,
      title: `Achieve Promotion to ${twin.targetRole}`,
      description: `Complete all core competencies, leadership proof points, and architecture RFCs required for ${twin.targetRole}.`,
      targetRole: twin.targetRole,
      targetSalaryUsd: twin.targetSalaryUsd || 185000,
      targetDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
      milestones: [
        { title: 'Publish Raft Consensus Microservice Project', completed: true },
        { title: 'Complete Staff Level Mock System Design Loop', completed: false },
        { title: 'Submit 5 Production Pull Requests to Core Backend', completed: false },
      ],
    });

    return [defaultGoal];
  }

  async updateGoal(userId: string, goalId: string, data: UpdateCareerOsGoalDto): Promise<CareerOsGoalDto | null> {
    // If all milestones are completed, auto-mark goal as achieved
    if (data.milestones && data.milestones.length > 0) {
      const allDone = data.milestones.every(m => m.completed);
      if (allDone && data.status !== CareerGoalStatus.ACHIEVED) {
        data.status = CareerGoalStatus.ACHIEVED;
        data.progressPercentage = 100;
        data.achievedDate = new Date().toISOString();
      } else if (!allDone && data.progressPercentage === undefined) {
        const doneCount = data.milestones.filter(m => m.completed).length;
        data.progressPercentage = Math.round((doneCount / data.milestones.length) * 100);
      }
    }

    return this.repo.updateGoal(goalId, userId, data);
  }

  async deleteGoal(userId: string, goalId: string): Promise<boolean> {
    return this.repo.deleteGoal(goalId, userId);
  }

  /**
   * Generates comprehensive AI Career Roadmap combining goals, critical path, and ETA
   */
  async generateRoadmap(userId: string): Promise<CareerOsRoadmapDto> {
    const twin = await this.twinService.getOrCreateTwin(userId);
    const goals = await this.listGoals(userId);

    const activeGoals = goals.filter(g => g.status !== CareerGoalStatus.ABANDONED);
    const overallProgress = activeGoals.length > 0
      ? Math.round(activeGoals.reduce((acc, g) => acc + (g.progressPercentage || 0), 0) / activeGoals.length)
      : 0;

    const remainingPercentage = Math.max(0, 100 - overallProgress);
    const estimatedMonthsToTarget = Math.max(2, Math.round((remainingPercentage / 100) * 10));

    const criticalPath = [
      'Phase 1: Advanced Concurrent Systems & Memory Architecture in Rust',
      'Phase 2: Lead End-to-End Database Sharding and Caching Migration',
      'Phase 3: Formal Mentorship & Staff Architecture Peer Review Loop',
      'Phase 4: Executive Promotion Review & Compensation Alignment',
    ];

    const riskMitigationTips = [
      'Break high-level goals into 2-week actionable micro-milestones to preserve momentum.',
      'Schedule quarterly compensation syncs with hiring managers or sponsors to ensure KPI transparency.',
      'Engage with senior mentors on CodeForge for feedback on technical RFC writing.',
    ];

    return {
      userId,
      currentRole: twin.currentRole,
      targetRole: twin.targetRole,
      overallProgress,
      estimatedMonthsToTarget,
      goals,
      criticalPath,
      riskMitigationTips,
    };
  }
}

export const careerGoalsService = new CareerGoalsService();
