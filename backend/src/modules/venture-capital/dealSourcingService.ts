import {
  DealFlowDto,
  CreateDealFlowDto,
  DealStage,
  DealPriority,
  StartupCategory,
} from '@codeforge/shared';
import { IVentureCapitalRepository, ventureCapitalRepository } from '../../repositories';

export class DealSourcingService {
  constructor(private repo: IVentureCapitalRepository = ventureCapitalRepository) {}

  /**
   * Discovers high-conviction startups across autonomous incubators, developer networks, and GitHub telemetry
   */
  async discoverDeals(filters?: { minFitScore?: number; category?: StartupCategory }): Promise<DealFlowDto[]> {
    const existing = await this.repo.listDealFlow();

    if (existing.length <= 1) {
      // Seed initial autonomous discoveries
      const seeds: CreateDealFlowDto[] = [
        {
          startupName: 'NeuroMatrix AI',
          tagline: 'Autonomous formal synthesis engines for chiplet hardware verifiers',
          category: StartupCategory.AI_DEVTOOLS,
          stage: DealStage.SCREENING,
          priority: DealPriority.HYPER_PRIORITY,
          source: 'GitHub AST Crawler',
          initialValuationUsd: 14000000,
          targetRaiseUsd: 3000000,
          tractionSummary: '820 stars/week, 18 Tier-1 semiconductor POCs',
          fitScore: 96.5,
          tags: ['Hardware Synthesis', 'Autonomous Verifier', 'Semiconductors'],
        },
        {
          startupName: 'ZeroTrust Agent Mesh',
          tagline: 'Autonomous cryptographic enclave isolation for multi-agent workflows',
          category: StartupCategory.CYBERSECURITY_AI,
          stage: DealStage.INBOX,
          priority: DealPriority.HIGH,
          source: 'Autonomous Network Beacon',
          initialValuationUsd: 10000000,
          targetRaiseUsd: 2000000,
          tractionSummary: '3,400 daily active agent verifications, $35k MRR',
          fitScore: 92.0,
          tags: ['Zero-Trust', 'Agent Security', 'ZK-Proofs'],
        },
        {
          startupName: 'QuantScale Infrastructure',
          tagline: 'Sub-millisecond distributed state consensus for sovereign AI clusters',
          category: StartupCategory.ENTERPRISE_INFRA,
          stage: DealStage.FIRST_CALL,
          priority: DealPriority.MEDIUM,
          source: 'Founder Direct Referral',
          initialValuationUsd: 16000000,
          targetRaiseUsd: 3500000,
          tractionSummary: '$90k MRR, 16 enterprise contracts, 380% YoY growth',
          fitScore: 90.5,
          tags: ['Distributed Systems', 'GPU Mesh', 'Sovereign Cloud'],
        },
      ];

      for (const seed of seeds) {
        await this.repo.createDealFlow(seed);
      }
    }

    let all = await this.repo.listDealFlow(undefined, filters?.category);
    if (filters?.minFitScore) {
      all = all.filter((d) => d.fitScore >= filters.minFitScore!);
    }

    return all;
  }

  /**
   * Registers a new startup deal in the deal flow pipeline
   */
  async createDeal(input: CreateDealFlowDto): Promise<DealFlowDto> {
    if (!input.startupName) {
      throw new Error('Startup name is required for deal creation.');
    }
    return this.repo.createDealFlow(input);
  }

  /**
   * Retrieves single deal details by ID
   */
  async getDeal(dealId: string): Promise<DealFlowDto> {
    const deal = await this.repo.getDealFlowById(dealId);
    if (!deal) {
      throw new Error(`Deal not found with id: ${dealId}`);
    }
    return deal;
  }

  /**
   * Lists deal flow with optional stage and category filtering
   */
  async listDeals(stage?: DealStage, category?: StartupCategory): Promise<DealFlowDto[]> {
    return this.repo.listDealFlow(stage, category);
  }

  /**
   * Transitions a deal through Kanban pipeline stages (INBOX -> DUE_DILIGENCE -> INVESTED)
   */
  async advanceDealStage(dealId: string, targetStage: DealStage, notes?: string): Promise<DealFlowDto> {
    const updated = await this.repo.updateDealFlowStage(dealId, targetStage, notes);
    if (!updated) {
      throw new Error(`Failed to advance deal stage for id: ${dealId}`);
    }
    return updated;
  }

  /**
   * Updates deal priority rating
   */
  async updateDealPriority(dealId: string, priority: DealPriority): Promise<DealFlowDto> {
    const updated = await this.repo.updateDealFlowPriority(dealId, priority);
    if (!updated) {
      throw new Error(`Failed to update deal priority for id: ${dealId}`);
    }
    return updated;
  }

  /**
   * Generates comprehensive deal pipeline stage distribution and capital metrics
   */
  async getDealPipelineSummary(): Promise<{
    totalDeals: number;
    activePipelineCount: number;
    averageFitScore: number;
    totalTargetCapitalUsd: number;
    stageBreakdown: Record<DealStage, number>;
    categoryBreakdown: Record<StartupCategory, number>;
  }> {
    const all = await this.repo.listDealFlow();

    const stageBreakdown: Record<DealStage, number> = {
      [DealStage.INBOX]: 0,
      [DealStage.SCREENING]: 0,
      [DealStage.FIRST_CALL]: 0,
      [DealStage.DUE_DILIGENCE]: 0,
      [DealStage.PARTNER_MEETING]: 0,
      [DealStage.TERM_SHEET]: 0,
      [DealStage.LEGAL_CLOSING]: 0,
      [DealStage.INVESTED]: 0,
      [DealStage.PASSED]: 0,
      [DealStage.LOST]: 0,
    };

    const categoryBreakdown: Record<StartupCategory, number> = {
      [StartupCategory.AI_DEVTOOLS]: 0,
      [StartupCategory.AUTONOMOUS_AGENTS]: 0,
      [StartupCategory.ENTERPRISE_INFRA]: 0,
      [StartupCategory.FINTECH]: 0,
      [StartupCategory.CYBERSECURITY]: 0,
      [StartupCategory.CYBERSECURITY_AI]: 0,
      [StartupCategory.HEALTH_AI]: 0,
      [StartupCategory.DEVELOPER_PLATFORM]: 0,
      [StartupCategory.KNOWLEDGE_TECH]: 0,
      [StartupCategory.DATA_INTELLIGENCE]: 0,
    };

    let totalScore = 0;
    let totalTargetCapital = 0;

    for (const deal of all) {
      if (stageBreakdown[deal.stage] !== undefined) {
        stageBreakdown[deal.stage]++;
      }
      if (categoryBreakdown[deal.category] !== undefined) {
        categoryBreakdown[deal.category]++;
      }
      totalScore += deal.fitScore;
      totalTargetCapital += deal.targetRaiseUsd;
    }

    const activeStages = [
      DealStage.INBOX,
      DealStage.SCREENING,
      DealStage.FIRST_CALL,
      DealStage.DUE_DILIGENCE,
      DealStage.PARTNER_MEETING,
      DealStage.TERM_SHEET,
      DealStage.LEGAL_CLOSING,
    ];

    const activePipelineCount = all.filter((d) => activeStages.includes(d.stage)).length;

    return {
      totalDeals: all.length,
      activePipelineCount,
      averageFitScore: all.length > 0 ? Number((totalScore / all.length).toFixed(1)) : 0,
      totalTargetCapitalUsd: totalTargetCapital,
      stageBreakdown,
      categoryBreakdown,
    };
  }
}

export const dealSourcingService = new DealSourcingService();
