import { eq, desc } from 'drizzle-orm';
import { db } from '../database/connection';
import {
  careerGoals,
  careerReadinessHistory,
} from '../database/schema';

import { ICareerRepository } from './interfaces/ICareerRepository';
import {
  CareerGoalDto,
  SetCareerGoalDto,
  CareerRole,
} from '@codeforge/shared';

export class CareerRepository implements ICareerRepository {
  async getGoal(userId: string): Promise<CareerGoalDto | null> {
    const rows = await db
      .select()
      .from(careerGoals)
      .where(eq(careerGoals.userId, userId))
      .limit(1);

    if (rows.length === 0) return null;
    const r = rows[0];

    return {
      id: r.id,
      userId: r.userId,
      targetRole: r.targetRole as CareerRole,
      targetLevel: r.targetLevel,
      targetTimelineMonths: r.targetTimelineMonths,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    };
  }

  async upsertGoal(userId: string, data: SetCareerGoalDto): Promise<CareerGoalDto> {
    const existing = await this.getGoal(userId);

    if (!existing) {
      const [inserted] = await db
        .insert(careerGoals)
        .values({
          userId,
          targetRole: data.targetRole,
          targetLevel: data.targetLevel || 'Mid-Level',
          targetTimelineMonths: data.targetTimelineMonths || 6,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      return {
        id: inserted.id,
        userId: inserted.userId,
        targetRole: inserted.targetRole as CareerRole,
        targetLevel: inserted.targetLevel,
        targetTimelineMonths: inserted.targetTimelineMonths,
        createdAt: inserted.createdAt.toISOString(),
        updatedAt: inserted.updatedAt.toISOString(),
      };
    }

    const [updated] = await db
      .update(careerGoals)
      .set({
        targetRole: data.targetRole,
        targetLevel: data.targetLevel || existing.targetLevel,
        targetTimelineMonths: data.targetTimelineMonths || existing.targetTimelineMonths,
        updatedAt: new Date(),
      })
      .where(eq(careerGoals.userId, userId))
      .returning();

    return {
      id: updated.id,
      userId: updated.userId,
      targetRole: updated.targetRole as CareerRole,
      targetLevel: updated.targetLevel,
      targetTimelineMonths: updated.targetTimelineMonths,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    };
  }

  async saveReadinessHistory(
    userId: string,
    targetRole: CareerRole,
    readinessScore: number,
    skillGaps: unknown[],
    recommendations: unknown[],
  ): Promise<void> {
    await db.insert(careerReadinessHistory).values({
      userId,
      targetRole,
      readinessScore,
      skillGapsJson: skillGaps,
      recommendationsJson: recommendations,
      computedAt: new Date(),
    });
  }

  async getLatestReadiness(userId: string): Promise<{
    targetRole: CareerRole;
    readinessScore: number;
    skillGaps: unknown[];
    recommendations: unknown[];
    computedAt: string;
  } | null> {
    const rows = await db
      .select()
      .from(careerReadinessHistory)
      .where(eq(careerReadinessHistory.userId, userId))
      .orderBy(desc(careerReadinessHistory.computedAt))
      .limit(1);

    if (rows.length === 0) return null;
    const r = rows[0];

    return {
      targetRole: r.targetRole as CareerRole,
      readinessScore: r.readinessScore,
      skillGaps: (r.skillGapsJson as unknown[]) || [],
      recommendations: (r.recommendationsJson as unknown[]) || [],
      computedAt: r.computedAt.toISOString(),
    };
  }
}
