import {
  AIFounderDecisionDto,
  StrategicPlanReportDto,
  MarketRiskLevel,
} from '@codeforge/shared';
import { IStartupBuilderRepository, StartupBuilderRepository } from '../../repositories';

export class AIFounderService {
  constructor(private repo: IStartupBuilderRepository = new StartupBuilderRepository()) {}

  /**
   * Generates simulated founder reasoning and strategic decision support
   */
  async generateDecisionSupport(startupId: string, decisionContext: {
    decisionTitle: string;
    context: string;
    options: string[];
  }): Promise<AIFounderDecisionDto> {
    const startup = await this.repo.getStartupById(startupId);
    if (!startup) {
      throw new Error(`Startup not found with id: ${startupId}`);
    }

    const simulatedScenarios = decisionContext.options.map((option, idx) => {
      const riskFactor = Number((15 + idx * 12 + Math.random() * 8).toFixed(1));
      const projectedImpact = Number((95 - idx * 8 + Math.random() * 5).toFixed(1));
      return {
        option,
        riskFactor,
        projectedImpactScore: projectedImpact,
        outcomeNarrative: `Executing "${option}" yields an expected ${projectedImpact}% velocity uplift with controlled risk of ${riskFactor}%.`,
      };
    });

    const bestOption = simulatedScenarios.reduce((prev, current) =>
      prev.projectedImpactScore / (prev.riskFactor || 1) > current.projectedImpactScore / (current.riskFactor || 1)
        ? prev
        : current
    );

    return {
      id: `decision-${Date.now()}`,
      startupId,
      decisionTitle: decisionContext.decisionTitle,
      context: decisionContext.context,
      simulatedScenarios,
      recommendedOption: bestOption.option,
      strategicRationale: `Option "${bestOption.option}" maximizes risk-adjusted velocity and aligns with current venture runway of ${startup.runwayMonths} months.`,
      confidenceScore: 93.5,
      createdAt: new Date().toISOString(),
    };
  }

  /**
   * Formulates a comprehensive multi-horizon strategic plan for the startup
   */
  async formulateStrategicPlan(startupId: string): Promise<StrategicPlanReportDto> {
    const startup = await this.repo.getStartupById(startupId);
    if (!startup) {
      throw new Error(`Startup not found with id: ${startupId}`);
    }

    return {
      startupId,
      visionStatement: `Establish ${startup.name} as the undisputed category leader in autonomous verification and high-reliability systems.`,
      topPriorities: [
        {
          priorityTitle: 'Autonomous Dialectic Verification Alpha Launch',
          horizonMonths: 3,
          ownerRole: 'Chief Technology Officer',
          impactWeight: 95.0,
        },
        {
          priorityTitle: 'Developer Community Ecosystem Expansion',
          horizonMonths: 6,
          ownerRole: 'Head of Growth',
          impactWeight: 88.0,
        },
        {
          priorityTitle: 'Enterprise Security Compliance Enclave Packaging',
          horizonMonths: 12,
          ownerRole: 'VP of Security & Governance',
          impactWeight: 92.0,
        },
      ],
      resourceAllocations: {
        'Engineering & AI Agent Synthesis': 55.0,
        'Developer Relations & Product-Led Growth': 25.0,
        'Compliance, Security & Cloud GPU Mesh': 20.0,
      },
      riskMitigationMatrix: [
        {
          risk: 'GPU Compute Cost Inflation',
          severity: MarketRiskLevel.MODERATE,
          mitigationStrategy: 'Deploy speculative zero-knowledge compilation caches to reduce inference passes by 60%.',
        },
        {
          risk: 'Enterprise Sales Cycle Friction',
          severity: MarketRiskLevel.HIGH,
          mitigationStrategy: 'Introduce self-serve automated pilot environments with instantaneous proof audit generation.',
        },
      ],
      createdAt: new Date().toISOString(),
    };
  }
}
