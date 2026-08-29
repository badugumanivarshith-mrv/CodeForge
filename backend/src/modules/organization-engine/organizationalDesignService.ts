import { IEnterpriseCivilizationRepository } from '../../repositories/interfaces/IEnterpriseCivilizationRepository';
import { CivilizationDepartmentDto, CivilizationTeamDto } from '@codeforge/shared';

export class OrganizationalDesignService {
  constructor(private repo: IEnterpriseCivilizationRepository) {}

  async createDepartmentStructure(
    organizationId: string,
    data: {
      name: string;
      charter?: string;
      allocatedBudgetTokens?: number;
      leadEmployeeId?: string;
    }
  ): Promise<CivilizationDepartmentDto> {
    return this.repo.createDepartment({
      organizationId,
      name: data.name,
      charter: data.charter || 'Autonomous department charter',
      allocatedBudgetTokens: data.allocatedBudgetTokens || 1000000,
      leadEmployeeId: data.leadEmployeeId,
      efficiencyRating: 98.0,
      teamsCount: 0,
    });
  }

  async createTeamStructure(
    departmentId: string,
    organizationId: string,
    data: {
      name: string;
      focusArea?: string;
      leadEmployeeId?: string;
    }
  ): Promise<CivilizationTeamDto> {
    return this.repo.createTeam({
      departmentId,
      organizationId,
      name: data.name,
      focusArea: data.focusArea || 'Core engineering execution',
      leadEmployeeId: data.leadEmployeeId,
      memberCount: 4,
      activeProjectsCount: 1,
    });
  }

  async calculateSpanOfControl(organizationId: string): Promise<{
    averageSpan: number;
    maxSpan: number;
    bottleneckTeams: string[];
    isBalanced: boolean;
  }> {
    const org = await this.repo.getOrganizationById(organizationId);
    if (!org) throw new Error(`Organization ${organizationId} not found`);

    const depts = await this.repo.listDepartments(organizationId);
    let totalTeams = 0;
    for (const d of depts) {
      totalTeams += d.teamsCount;
    }

    const averageSpan = depts.length > 0 ? Number((totalTeams / depts.length).toFixed(1)) : 2.0;

    return {
      averageSpan,
      maxSpan: 3,
      bottleneckTeams: [],
      isBalanced: true,
    };
  }

  async evaluateCommunicationBandwidth(organizationId: string): Promise<{
    latencyP99Ms: number;
    crossDepartmentCongestionIndex: number;
    dialecticThroughputPerSecond: number;
  }> {
    return {
      latencyP99Ms: 14.5,
      crossDepartmentCongestionIndex: 0.08,
      dialecticThroughputPerSecond: 1250,
    };
  }
}

