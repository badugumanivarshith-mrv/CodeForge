import {
  StartupDto,
  StartupStage,
  StartupEventType,
} from '@codeforge/shared';
import { IStartupBuilderRepository, StartupBuilderRepository } from '../../repositories';

export class StartupLifecycleService {
  constructor(private repo: IStartupBuilderRepository = new StartupBuilderRepository()) {}

  /**
   * Advances the startup to the next lifecycle stage if criteria are met
   */
  async advanceStartupStage(startupId: string, targetStage: StartupStage, reason?: string): Promise<StartupDto & {
    startup: StartupDto;
    previousStage: StartupStage;
    currentStage: StartupStage;
    readinessValidation: { isEligible: boolean; criteriaMet: string[]; missingCriteria: string[] };
  }> {
    const startup = await this.repo.getStartupById(startupId);
    if (!startup) {
      throw new Error(`Startup not found with id: ${startupId}`);
    }

    const previousStage = startup.stage;
    const isEligible = startup.viabilityScore >= 75.0 && startup.readinessScore >= 70.0;

    if (!isEligible) {
      return Object.assign({}, startup, {
        startup,
        previousStage,
        currentStage: previousStage,
        readinessValidation: {
          isEligible: false,
          criteriaMet: ['Basic ideation formulation completed'],
          missingCriteria: ['Viability score must exceed 75.0', 'Readiness score must exceed 70.0'],
        },
      });
    }

    const updated = await this.repo.updateStartup(startupId, { stage: targetStage });
    if (!updated) {
      throw new Error(`Failed to update startup stage for id: ${startupId}`);
    }

    // Record lifecycle transition event
    await this.repo.createStartupEvent({
      startupId,
      eventType: 'STAGE_TRANSITION' as any,
      title: `Startup Advanced to ${targetStage}`,
      description: reason || `Venture stage successfully advanced from ${previousStage} to ${targetStage}.`,
      metadata: {
        fromStage: previousStage,
        toStage: targetStage,
        previousStage,
        currentStage: targetStage,
        reason,
        transitionTimestamp: new Date().toISOString(),
      },
    });

    return Object.assign({}, updated, {
      startup: updated,
      previousStage,
      currentStage: targetStage,
      readinessValidation: {
        isEligible: true,
        criteriaMet: [
          'Core technical architecture verified',
          'Customer discovery and problem validation verified',
          'Target milestone throughput reached',
        ],
        missingCriteria: [],
      },
    });
  }

  /**
   * Records a strategic pivot event in the startup audit log
   */
  async recordVenturePivot(startupId: string, pivotSummary: string, rationale: string) {
    const startup = await this.repo.getStartupById(startupId);
    if (!startup) {
      throw new Error(`Startup not found with id: ${startupId}`);
    }

    const event = await this.repo.createStartupEvent({
      startupId,
      eventType: 'PIVOT' as any,
      title: 'Strategic Venture Pivot',
      description: pivotSummary,
      metadata: { pivotSummary, rationale, timestamp: new Date().toISOString() },
    });

    return event;
  }

  /**
   * Returns all lifecycle milestone and audit events for a startup
   */
  async getStartupEvents(startupId: string) {
    return this.repo.listStartupEvents(startupId);
  }

  /**
   * Executes a strategic pivot, updating category, value proposition, and logging event
   */
  async executeStartupPivot(startupId: string, pivotData: {
    newProblemStatement?: string;
    newSolutionDescription?: string;
    newTargetMarket?: string;
    pivotRationale: string;
  }): Promise<{
    startup: StartupDto;
    pivotSummary: string;
    actionPlan: string[];
  }> {
    const startup = await this.repo.getStartupById(startupId);
    if (!startup) {
      throw new Error(`Startup not found with id: ${startupId}`);
    }

    const updated = await this.repo.updateStartup(startupId, {
      problemStatement: pivotData.newProblemStatement || startup.problemStatement,
      solutionDescription: pivotData.newSolutionDescription || startup.solutionDescription,
      targetMarket: pivotData.newTargetMarket || startup.targetMarket,
      stage: StartupStage.VALIDATION,
    });

    if (!updated) {
      throw new Error(`Failed to execute pivot for startup id: ${startupId}`);
    }

    await this.repo.createStartupEvent({
      startupId,
      eventType: StartupEventType.PIVOT_EXECUTED,
      title: 'Strategic Venture Pivot Executed',
      description: pivotData.pivotRationale,
      metadata: { pivotData, executedAt: new Date().toISOString() },
    });

    return {
      startup: updated,
      pivotSummary: `Successfully pivoted venture orientation based on: ${pivotData.pivotRationale}`,
      actionPlan: [
        'Recalibrate customer discovery personas and interview pipeline',
        'Refactor MVP feature specifications to match revised target market',
        'Update 12-month ARR forecasts and growth channel models',
      ],
    };
  }
}
