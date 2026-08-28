import {
  CognitiveGoalDto,
  CognitiveSubgoalDto,
  CognitiveGoalStatus,
  StrategicPriority,
  PredictionHorizon,
} from '@codeforge/shared';
import { ICognitiveCoreRepository } from '../../repositories/interfaces/ICognitiveCoreRepository';

export class GoalManagementService {
  constructor(private cognitiveRepo: ICognitiveCoreRepository) {}

  /**
   * Creates and decomposes a high-level cognitive goal into structured subgoals
   */
  async createAndDecomposeGoal(data: {
    userId: string;
    title: string;
    description: string;
    priority?: StrategicPriority;
    targetHorizon?: PredictionHorizon;
    subgoalTitles?: string[];
  }): Promise<{ goal: CognitiveGoalDto; subgoals: CognitiveSubgoalDto[] }> {
    const goal = await this.cognitiveRepo.createGoal({
      userId: data.userId,
      title: data.title,
      description: data.description,
      priority: data.priority || StrategicPriority.HIGH,
      targetHorizon: data.targetHorizon || PredictionHorizon.THIRTY_DAYS,
      status: CognitiveGoalStatus.PLANNING,
      completionScore: 0.0,
      subgoalsCount: (data.subgoalTitles?.length || 3),
      activeTracesCount: 0,
    });

    const titles = data.subgoalTitles && data.subgoalTitles.length > 0
      ? data.subgoalTitles
      : [
          `Phase 1: Architectural Formulation for ${data.title}`,
          `Phase 2: Execution & Validation Mesh for ${data.title}`,
          `Phase 3: Synthesis & Verification Sign-off for ${data.title}`,
        ];

    const subgoals: CognitiveSubgoalDto[] = [];
    for (let i = 0; i < titles.length; i++) {
      const sub = await this.cognitiveRepo.createSubgoal({
        goalId: goal.id,
        title: titles[i],
        description: `Automated decomposition task ${i + 1} for ${data.title}`,
        sequenceOrder: i + 1,
        status: CognitiveGoalStatus.PENDING,
        estimatedComplexity: i + 2,
      });
      subgoals.push(sub);
    }

    return { goal, subgoals };
  }

  async listGoals(userId: string): Promise<CognitiveGoalDto[]> {
    return this.cognitiveRepo.listGoals(userId);
  }

  async getGoal(id: string): Promise<{ goal: CognitiveGoalDto; subgoals: CognitiveSubgoalDto[] } | null> {
    const goal = await this.cognitiveRepo.getGoal(id);
    if (!goal) return null;
    const subgoals = await this.cognitiveRepo.listSubgoals(id);
    return { goal, subgoals };
  }

  async updateGoalProgress(id: string, completionScore: number, status?: CognitiveGoalStatus): Promise<CognitiveGoalDto | null> {
    return this.cognitiveRepo.updateGoal(id, {
      completionScore,
      ...(status ? { status } : {}),
    });
  }
}
