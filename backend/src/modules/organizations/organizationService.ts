import { IEnterpriseRepository, EnterpriseRepository } from '../../repositories';
import {
  OrganizationDto,
  CreateOrganizationDto,
  UpdateOrganizationDto,
  OrganizationMemberDto,
  AddOrgMemberDto,
  DepartmentDto,
  CreateDepartmentDto,
  TeamDto,
  CreateTeamDto,
  CohortDto,
  CreateCohortDto,
  OrgMemberRole,
} from '@codeforge/shared';
import { logger } from '../../core/utils/logger';

export class OrganizationService {
  constructor(private enterpriseRepo: IEnterpriseRepository = new EnterpriseRepository()) {}

  async createOrganization(data: CreateOrganizationDto, creatorUserId?: string): Promise<OrganizationDto> {
    if (!data.name || data.name.trim().length === 0) {
      throw new Error('Organization name is required.');
    }

    const org = await this.enterpriseRepo.createOrganization(data);

    // If creatorUserId is provided, assign them as OWNER
    if (creatorUserId) {
      await this.enterpriseRepo.addOrganizationMember(org.id, {
        userId: creatorUserId,
        role: OrgMemberRole.OWNER,
        title: 'Organization Creator',
      });
    }

    logger.info({ orgId: org.id, name: org.name }, 'Organization created successfully');
    return org;
  }

  async getOrganization(idOrSlug: string): Promise<OrganizationDto | null> {
    const org = await this.enterpriseRepo.getOrganizationById(idOrSlug);
    if (org) return org;
    return this.enterpriseRepo.getOrganizationBySlug(idOrSlug);
  }

  async listOrganizations(): Promise<OrganizationDto[]> {
    return this.enterpriseRepo.listOrganizations();
  }

  async updateOrganization(orgId: string, data: UpdateOrganizationDto): Promise<OrganizationDto | null> {
    return this.enterpriseRepo.updateOrganization(orgId, data);
  }

  async addMember(orgId: string, data: AddOrgMemberDto): Promise<OrganizationMemberDto> {
    return this.enterpriseRepo.addOrganizationMember(orgId, data);
  }

  async listMembers(orgId: string): Promise<OrganizationMemberDto[]> {
    return this.enterpriseRepo.listOrganizationMembers(orgId);
  }

  async getMemberRole(orgId: string, userId: string): Promise<OrgMemberRole | null> {
    return this.enterpriseRepo.getMemberRole(orgId, userId);
  }

  async createDepartment(orgId: string, data: CreateDepartmentDto): Promise<DepartmentDto> {
    if (!data.name || !data.code) {
      throw new Error('Department name and code are required.');
    }
    return this.enterpriseRepo.createDepartment(orgId, data);
  }

  async listDepartments(orgId: string): Promise<DepartmentDto[]> {
    return this.enterpriseRepo.listDepartments(orgId);
  }

  async createTeam(orgId: string, data: CreateTeamDto): Promise<TeamDto> {
    if (!data.name) {
      throw new Error('Team name is required.');
    }
    return this.enterpriseRepo.createTeam(orgId, data);
  }

  async listTeams(orgId: string): Promise<TeamDto[]> {
    return this.enterpriseRepo.listTeams(orgId);
  }

  async createCohort(orgId: string, data: CreateCohortDto): Promise<CohortDto> {
    if (!data.name || !data.code || !data.startDate || !data.endDate) {
      throw new Error('Cohort name, code, start date, and end date are required.');
    }
    return this.enterpriseRepo.createCohort(orgId, data);
  }

  async listCohorts(orgId: string): Promise<CohortDto[]> {
    return this.enterpriseRepo.listCohorts(orgId);
  }

  async checkUserAccess(orgId: string, userId: string, requiredRoles?: OrgMemberRole[]): Promise<boolean> {
    const role = await this.enterpriseRepo.getMemberRole(orgId, userId);
    if (!role) return false;
    if (!requiredRoles || requiredRoles.length === 0) return true;
    return requiredRoles.includes(role);
  }
}

export const organizationService = new OrganizationService();
