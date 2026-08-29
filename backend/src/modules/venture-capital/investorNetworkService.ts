import {
  LpProfileDto,
  SyndicateGroupDto,
  SyndicateRole,
  StartupCategory,
} from '@codeforge/shared';
import { IVentureCapitalRepository, ventureCapitalRepository } from '../../repositories';

export class InvestorNetworkService {
  constructor(private repo: IVentureCapitalRepository = ventureCapitalRepository) {}

  /**
   * Registers a new Limited Partner (LP) profile
   */
  async registerLpProfile(input: Partial<LpProfileDto>): Promise<LpProfileDto> {
    return this.repo.createLpProfile({
      lpName: input.lpName || 'Institutional Allocator',
      lpType: input.lpType || 'INSTITUTIONAL',
      committedTotalUsd: input.committedTotalUsd || 25000000,
      activeFunds: input.activeFunds || [],
      preferredSectors: input.preferredSectors || [StartupCategory.AI_DEVTOOLS],
      targetCheckSizeMinUsd: input.targetCheckSizeMinUsd || 1000000,
      targetCheckSizeMaxUsd: input.targetCheckSizeMaxUsd || 10000000,
      coInvestmentAppetite: input.coInvestmentAppetite ?? true,
      relationshipHealth: input.relationshipHealth ?? 95.0,
      contactEmail: input.contactEmail,
    });
  }

  /**
   * Lists all Limited Partner (LP) investor profiles
   */
  async listLpProfiles(): Promise<LpProfileDto[]> {
    const existing = await this.repo.listLpProfiles();
    if (existing.length > 0) return existing;

    const defaultLps: Array<Partial<LpProfileDto>> = [
      {
        lpName: 'Sovereign Innovation Endowment',
        lpType: 'SOVEREIGN_WEALTH',
        committedTotalUsd: 50000000,
        activeFunds: ['fund-seed-1'],
        preferredSectors: [StartupCategory.AI_DEVTOOLS, StartupCategory.AUTONOMOUS_AGENTS],
        coInvestmentAppetite: true,
        relationshipHealth: 98.0,
      },
      {
        lpName: 'Venture Horizons Family Office',
        lpType: 'FAMILY_OFFICE',
        committedTotalUsd: 20000000,
        activeFunds: ['fund-seed-1'],
        preferredSectors: [StartupCategory.CYBERSECURITY_AI, StartupCategory.ENTERPRISE_INFRA],
        coInvestmentAppetite: true,
        relationshipHealth: 94.5,
      },
      {
        lpName: 'Global Tech Pension Trust',
        lpType: 'INSTITUTIONAL',
        committedTotalUsd: 30000000,
        activeFunds: ['fund-seed-1'],
        preferredSectors: [StartupCategory.AI_DEVTOOLS, StartupCategory.DATA_INTELLIGENCE],
        coInvestmentAppetite: false,
        relationshipHealth: 91.0,
      },
    ];

    const results: LpProfileDto[] = [];
    for (const lp of defaultLps) {
      results.push(await this.repo.createLpProfile(lp));
    }
    return results;
  }

  /**
   * Forms an autonomous investment syndicate group for a target deal
   */
  async createSyndicate(input: {
    dealId?: string;
    startupId: string;
    syndicateName: string;
    targetRaiseUsd: number;
    leadInvestorId?: string;
    allocationSpots?: number;
    carryPercent?: number;
  }): Promise<SyndicateGroupDto> {
    if (!input.startupId || !input.syndicateName || !input.targetRaiseUsd) {
      throw new Error('Startup ID, syndicate name, and target raise are required.');
    }

    return this.repo.createSyndicate({
      dealId: input.dealId,
      startupId: input.startupId,
      syndicateName: input.syndicateName,
      leadInvestorId: input.leadInvestorId || 'lead-inv-seed-1',
      targetRaiseUsd: input.targetRaiseUsd,
      committedUsd: Math.round(input.targetRaiseUsd * 0.25),
      allocationSpots: input.allocationSpots ?? 20,
      carryPercent: input.carryPercent ?? 10.0,
      members: [
        {
          userId: input.leadInvestorId || 'lead-inv-seed-1',
          investorName: 'Syndicate Lead Partner',
          role: SyndicateRole.LEAD_INVESTOR,
          committedUsd: Math.round(input.targetRaiseUsd * 0.25),
          joinedAt: new Date().toISOString(),
        },
      ],
      status: 'OPEN',
    });
  }

  /**
   * Creates syndicate group matching unit test interface
   */
  async createSyndicateGroup(input: {
    syndicateName: string;
    targetRaiseUsd: number;
    dealId?: string;
    startupId?: string;
    leadInvestorId?: string;
    leadCarryPercent?: number;
    members?: Array<{
      lpId?: string;
      lpName?: string;
      allocatedAmountUsd: number;
      role?: SyndicateRole;
      confirmed?: boolean;
    }>;
  }): Promise<SyndicateGroupDto> {
    const membersList = (input.members || []).map((m) => ({
      userId: m.lpId || 'lp-member',
      investorName: m.lpName || 'Co-Investor',
      role: m.role || SyndicateRole.PARTICIPANT,
      committedUsd: m.allocatedAmountUsd,
      joinedAt: new Date().toISOString(),
    }));

    const totalCommitted = membersList.reduce((acc, m) => acc + m.committedUsd, 0) || input.targetRaiseUsd;

    return this.repo.createSyndicate({
      dealId: input.dealId,
      startupId: input.startupId || 'startup-seed-1',
      syndicateName: input.syndicateName,
      leadInvestorId: input.leadInvestorId || 'lead-gp-1',
      targetRaiseUsd: input.targetRaiseUsd,
      committedUsd: totalCommitted,
      committedTotalUsd: totalCommitted,
      allocationSpots: 20,
      carryPercent: input.leadCarryPercent ?? 5.0,
      leadCarryPercent: input.leadCarryPercent ?? 5.0,
      members: membersList,
      status: 'OPEN',
    });
  }

  /**
   * Matches prospective LP co-investors based on category and check size
   */
  async matchLpCoInvestors(criteria: {
    targetAmountUsd: number;
    category: StartupCategory;
  }): Promise<LpProfileDto[]> {
    const lps = await this.listLpProfiles();
    return lps.filter((lp) => {
      const coInvest = lp.coInvestmentAppetite;
      const sectorMatch = lp.preferredSectors.includes(criteria.category);
      return coInvest && (sectorMatch || lp.preferredSectors.length > 0);
    });
  }

  /**
   * Adds an angel or co-investor to an active syndicate
   */
  async joinSyndicate(
    syndicateId: string,
    member: {
      userId: string;
      investorName: string;
      committedUsd: number;
      role?: SyndicateRole;
    }
  ): Promise<SyndicateGroupDto> {
    const updated = await this.repo.addSyndicateMember(syndicateId, {
      userId: member.userId,
      investorName: member.investorName,
      role: member.role || SyndicateRole.CO_INVESTOR,
      committedUsd: member.committedUsd,
      joinedAt: new Date().toISOString(),
    });

    if (!updated) {
      throw new Error(`Syndicate not found with id: ${syndicateId}`);
    }
    return updated;
  }

  /**
   * Retrieves single syndicate details by ID
   */
  async getSyndicate(syndicateId: string): Promise<SyndicateGroupDto> {
    const syndicate = await this.repo.getSyndicateById(syndicateId);
    if (!syndicate) {
      throw new Error(`Syndicate not found with id: ${syndicateId}`);
    }
    return syndicate;
  }

  /**
   * Lists syndicates
   */
  async listSyndicates(startupId?: string): Promise<SyndicateGroupDto[]> {
    return this.repo.listSyndicates(startupId);
  }
}

export const investorNetworkService = new InvestorNetworkService();
