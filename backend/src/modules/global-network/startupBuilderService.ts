import { IGlobalEcosystemRepository, globalEcosystemRepository } from '../../repositories';
import {
  StartupProfileDto,
  FounderMatchDto,
  VentureIntelligenceReportDto,
  VentureStage,
  EcosystemEventCategory,
} from '@codeforge/shared';

export class StartupBuilderService {
  constructor(private repo: IGlobalEcosystemRepository = globalEcosystemRepository) {}

  async launchStartup(founderUserId: string, data: Partial<StartupProfileDto>): Promise<StartupProfileDto> {
    if (!data.name) {
      throw new Error('Startup name is required.');
    }
    const cleanData = {
      ...data,
      description: data.description || data.tagline || 'Autonomous venture in incubator.',
    };
    const startup = await this.repo.createStartupProfile(founderUserId, cleanData);

    await this.repo.recordEvent(
      EcosystemEventCategory.VENTURE_LAUNCHED,
      `Venture Launched: ${startup.name}`,
      `Founder launched ${startup.name} in the ${startup.industry} industry at stage ${startup.stage}.`,
      { startupId: startup.id, name: startup.name }
    );

    return startup;
  }

  async getStartup(id: string): Promise<StartupProfileDto | null> {
    return this.repo.getStartupProfileById(id);
  }

  async listStartups(stage?: VentureStage, industry?: string): Promise<StartupProfileDto[]> {
    return this.repo.listStartupProfiles(stage, industry);
  }

  async matchCoFounders(startupId: string, matchedUserId: string, complementarySkills: string[]): Promise<FounderMatchDto> {
    const startup = await this.repo.getStartupProfileById(startupId);
    if (!startup) {
      throw new Error(`Startup with ID ${startupId} not found.`);
    }

    const matchScore = Math.min(98, 70 + complementarySkills.length * 8);
    return this.repo.createFounderMatch(
      startupId,
      matchedUserId,
      matchScore,
      complementarySkills,
      'Technical Co-Founder'
    );
  }

  async findCoFounders(startupId: string): Promise<FounderMatchDto[]> {
    const m1 = await this.matchCoFounders(startupId, 'user-cf-1', ['Distributed Systems', 'Agent Protocols']);
    const m2 = await this.matchCoFounders(startupId, 'user-cf-2', ['Go', 'Kubernetes', 'FinOps']);
    return [m1, m2];
  }

  async generateVentureIntelligence(startupId: string): Promise<VentureIntelligenceReportDto> {
    const startup = await this.repo.getStartupProfileById(startupId);
    const viability = startup ? Math.min(96, startup.marketValidationScore + 5) : 85;

    return {
      startupId,
      marketViabilityScore: viability,
      competitionRiskScore: 28.5,
      growthTrajectory: 'High Exponential (Projected 4.2x YoY ARR Growth)',
      strategicRoadmapSteps: [
        'Deploy autonomous agent customer onboarding pipeline.',
        'Integrate CodeForge Talent Cloud for on-demand contractor swarms.',
        'Launch community-driven ecosystem plugin marketplace.',
      ],
      unitEconomicsModel: {
        cacUsd: 140,
        ltvUsd: 2200,
        grossMarginPercent: 88.5,
      },
    };
  }
}

export const startupBuilderService = new StartupBuilderService();
