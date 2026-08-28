import { ICareerOsRepository } from '../../repositories/interfaces/ICareerOsRepository';
import { careerOsRepository } from '../../repositories/CareerOsRepository';
import {
  CareerTwinDto,
  CreateCareerTwinDto,
  UpdateCareerTwinDto,
  CareerHealthMetricsDto,
  CareerSnapshotDto,
  CareerEventDto,
  CreateCareerEventDto,
} from '@codeforge/shared';

export class CareerTwinService {
  constructor(private repo: ICareerOsRepository = careerOsRepository) {}

  /**
   * Calculates composite health score and 6 momentum vectors clamped between 10 and 100
   */
  calculateHealthMetrics(
    learningVelocity = 80,
    careerMomentum = 78,
    marketCompetitiveness = 82,
    interviewReadiness = 74,
    salaryPositioning = 76,
    leadershipPotential = 68
  ): CareerHealthMetricsDto {
    const clamp = (val: number) => Math.max(10, Math.min(100, Math.round(val)));

    const lv = clamp(learningVelocity);
    const cm = clamp(careerMomentum);
    const mc = clamp(marketCompetitiveness);
    const ir = clamp(interviewReadiness);
    const sp = clamp(salaryPositioning);
    const lp = clamp(leadershipPotential);

    // Weighted composite Health Score (100% total)
    // Learning (20%) + Momentum (20%) + Market Competitiveness (20%) + Interview (15%) + Salary (15%) + Leadership (10%)
    const healthScore = clamp(
      lv * 0.20 +
      cm * 0.20 +
      mc * 0.20 +
      ir * 0.15 +
      sp * 0.15 +
      lp * 0.10
    );

    return {
      healthScore,
      learningVelocity: lv,
      careerMomentum: cm,
      marketCompetitiveness: mc,
      interviewReadiness: ir,
      salaryPositioning: sp,
      leadershipPotential: lp,
    };
  }

  /**
   * Retrieves or provisions the user's digital twin
   */
  async getOrCreateTwin(userId: string, defaultData?: Partial<CreateCareerTwinDto>): Promise<CareerTwinDto> {
    const existing = await this.repo.getTwinByUserId(userId);
    if (existing) return existing;

    const metrics = this.calculateHealthMetrics();
    const created = await this.repo.createTwin(userId, {
      currentRole: defaultData?.currentRole || 'Software Engineer',
      targetRole: defaultData?.targetRole || 'Senior Distributed Systems Engineer',
      currentLevel: defaultData?.currentLevel || 'L4 / Mid-Level',
      targetLevel: defaultData?.targetLevel || 'L5 / Senior',
      currentSalaryUsd: defaultData?.currentSalaryUsd || 120000,
      targetSalaryUsd: defaultData?.targetSalaryUsd || 185000,
      yearsOfExperience: defaultData?.yearsOfExperience || 3.0,
      primarySkills: defaultData?.primarySkills || ['TypeScript', 'Node.js', 'PostgreSQL', 'Go', 'System Design'],
    });

    // Save initial snapshot
    await this.repo.saveSnapshot(created.id, userId, metrics.healthScore, {
      learningVelocity: metrics.learningVelocity,
      careerMomentum: metrics.careerMomentum,
      marketCompetitiveness: metrics.marketCompetitiveness,
      interviewReadiness: metrics.interviewReadiness,
      salaryPositioning: metrics.salaryPositioning,
      leadershipPotential: metrics.leadershipPotential,
    });

    return created;
  }

  /**
   * Updates digital twin and records a snapshot if health scores changed
   */
  async updateTwin(userId: string, data: UpdateCareerTwinDto): Promise<CareerTwinDto> {
    const twin = await this.getOrCreateTwin(userId);
    const updated = await this.repo.updateTwin(userId, data);

    // Save historical snapshot
    await this.repo.saveSnapshot(twin.id, userId, updated.healthScore, {
      learningVelocity: updated.learningVelocity,
      careerMomentum: updated.careerMomentum,
      marketCompetitiveness: updated.marketCompetitiveness,
      interviewReadiness: updated.interviewReadiness,
      salaryPositioning: updated.salaryPositioning,
      leadershipPotential: updated.leadershipPotential,
    });

    return updated;
  }

  /**
   * Retrieves historical health score snapshots
   */
  async getSnapshots(userId: string, limit = 12): Promise<CareerSnapshotDto[]> {
    return this.repo.getSnapshots(userId, limit);
  }

  /**
   * Records a career event (promotion, certification, job switch)
   */
  async recordCareerEvent(userId: string, data: CreateCareerEventDto): Promise<CareerEventDto> {
    const twin = await this.getOrCreateTwin(userId);
    const event = await this.repo.createEvent(twin.id, userId, data);

    // If event is a promotion or salary update, reflect on twin
    if (data.role || data.salaryUsd) {
      await this.repo.updateTwin(userId, {
        currentRole: data.role || undefined,
        currentSalaryUsd: data.salaryUsd || undefined,
      });
    }

    return event;
  }

  /**
   * Lists all recorded career events
   */
  async listEvents(userId: string): Promise<CareerEventDto[]> {
    return this.repo.listEvents(userId);
  }
}

export const careerTwinService = new CareerTwinService();
