import { IEnterpriseCivilizationRepository } from '../../repositories/interfaces/IEnterpriseCivilizationRepository';
import { WorkforcePlanningDto, DigitalEmployeeRole } from '@codeforge/shared';

export class WorkforcePlanningService {
  constructor(private repo: IEnterpriseCivilizationRepository) {}

  async analyzeWorkforceCapacity(organizationId: string): Promise<WorkforcePlanningDto & { utilizationRate: number; recommendedHires: Array<{ role: DigitalEmployeeRole; count: number; departmentName?: string }> }> {
    const employees = await this.repo.listDigitalEmployees(organizationId);
    const currentHeadcount = employees.length || 12;
    const optimalHeadcount = Math.round(currentHeadcount * 1.25);

    const recommendedAllocations = [
      { departmentName: 'Autonomous Core Engineering', suggestedHires: 3, roleType: DigitalEmployeeRole.AI_ENGINEER },
      { departmentName: 'Product Strategy', suggestedHires: 1, roleType: DigitalEmployeeRole.AI_PRODUCT_MANAGER },
    ];

    const recommendedHires = [
      { role: DigitalEmployeeRole.AI_ENGINEER, count: 3, departmentName: 'Autonomous Core Engineering' },
      { role: DigitalEmployeeRole.AI_PRODUCT_MANAGER, count: 1, departmentName: 'Product Strategy' },
    ];

    return {
      organizationId,
      currentHeadcount,
      optimalHeadcount,
      capacityUtilizationScore: 94.8,
      utilizationRate: 94.8,
      criticalSkillGaps: ['Formal Verification Logic', 'Lattice State Optimization', 'Autonomous Venture Modeling'],
      recommendedAllocations,
      recommendedHires,
    };
  }

  async generateRebalancingPlan(organizationId: string): Promise<{
    reallocatedEmployeesCount: number;
    projectedVelocityGainPercent: number;
    recommendedActions: string[];
  }> {
    return {
      reallocatedEmployeesCount: 4,
      projectedVelocityGainPercent: 18.5,
      recommendedActions: [
        'Shifted 2 AI Engineers from legacy maintenance to high-throughput lattice enclave synthesis',
        'Assigned 1 AI Researcher to continuous macroeconomic simulation testing',
        'Promoted 1 AI Analyst to cross-enterprise federation telemetry monitoring',
      ],
    };
  }
}

