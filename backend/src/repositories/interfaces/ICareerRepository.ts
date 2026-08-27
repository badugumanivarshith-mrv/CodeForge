import {
  CareerGoalDto,
  SetCareerGoalDto,
  CareerRole,
} from '@codeforge/shared';

export interface ICareerRepository {
  getGoal(userId: string): Promise<CareerGoalDto | null>;
  upsertGoal(userId: string, data: SetCareerGoalDto): Promise<CareerGoalDto>;
  saveReadinessHistory(
    userId: string,
    targetRole: CareerRole,
    readinessScore: number,
    skillGaps: unknown[],
    recommendations: unknown[],
  ): Promise<void>;
  getLatestReadiness(userId: string): Promise<{
    targetRole: CareerRole;
    readinessScore: number;
    skillGaps: unknown[];
    recommendations: unknown[];
    computedAt: string;
  } | null>;
}
