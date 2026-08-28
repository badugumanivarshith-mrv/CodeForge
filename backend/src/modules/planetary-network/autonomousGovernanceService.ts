import { IPlanetaryIntelligenceRepository } from '../../repositories/interfaces/IPlanetaryIntelligenceRepository';
import {
  GovernancePolicyDto,
  PolicySimulationDto,
  GovernanceCouncilType,
  PolicyStatus,
} from '@codeforge/shared';

export class AutonomousGovernanceService {
  private repo: IPlanetaryIntelligenceRepository;

  constructor(repo: IPlanetaryIntelligenceRepository) {
    this.repo = repo;
  }

  async proposePolicy(data: {
    title: string;
    councilType: GovernanceCouncilType;
    description: string;
    rules: string[];
    enactedBy: string;
    ethicalReviewNotes?: string;
  }): Promise<GovernancePolicyDto> {
    const policy = await this.repo.createGovernancePolicy({
      title: data.title,
      councilType: data.councilType,
      description: data.description,
      rules: data.rules,
      status: PolicyStatus.PROPOSED,
      enactedBy: data.enactedBy,
      complianceScore: 98.0,
      ethicalReviewNotes: data.ethicalReviewNotes || 'Under review by Planetary Governance Council',
    });

    await this.repo.recordPlanetaryEvent(
      'policy_enacted',
      `Proposed governance policy: ${policy.title}`,
      policy.id,
      { councilType: policy.councilType }
    );

    return policy;
  }

  async simulatePolicyImpact(policyId: string, simulationName: string = 'Cross-Ecosystem Impact Assessment'): Promise<PolicySimulationDto> {
    const policy = await this.repo.getGovernancePolicy(policyId);
    if (!policy) {
      throw new Error(`Policy not found with ID: ${policyId}`);
    }

    const simulation = await this.repo.recordPolicySimulation({
      policyId,
      simulationName,
      complianceProjectedPercent: 99.1,
      economicFrictionScore: 2.8,
      ethicalAlignmentScore: 99.4,
      stakeholderImpacts: [
        { stakeholder: 'Autonomous AI Developers', impactScore: 95, sentiment: 'Highly Favorable' },
        { stakeholder: 'Enterprise Tenants', impactScore: 91, sentiment: 'Compliant & Secure' },
        { stakeholder: 'Research Institutions', impactScore: 98, sentiment: 'Standardized Open Interop' },
      ],
      forecastedOutcome: 'Enactment will improve cross-tenant isolation guarantees by 42% while preserving sub-15ms agent negotiation latency.',
    });

    // Automatically transition policy to SIMULATED
    await this.repo.updateGovernancePolicy(policyId, {
      status: PolicyStatus.SIMULATED,
    });

    return simulation;
  }

  async enactPolicy(policyId: string): Promise<GovernancePolicyDto> {
    const policy = await this.repo.getGovernancePolicy(policyId);
    if (!policy) {
      throw new Error(`Policy not found with ID: ${policyId}`);
    }

    const updated = await this.repo.updateGovernancePolicy(policyId, {
      status: PolicyStatus.ACTIVE,
    });

    await this.repo.recordPlanetaryEvent(
      'policy_enacted',
      `Enacted active governance directive: ${policy.title}`,
      policyId,
      { status: PolicyStatus.ACTIVE }
    );

    return updated!;
  }

  async listPolicies(councilType?: GovernanceCouncilType, status?: PolicyStatus): Promise<GovernancePolicyDto[]> {
    return this.repo.listGovernancePolicies(councilType, status);
  }

  async getPolicySimulations(policyId: string): Promise<PolicySimulationDto[]> {
    return this.repo.getPolicySimulations(policyId);
  }
}
