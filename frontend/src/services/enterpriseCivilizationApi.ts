import { apiClient } from './apiClient';
import {
  OrganizationCivilizationDto,
  CivilizationDepartmentDto,
  CivilizationTeamDto,
  DigitalEmployeeDto,
  CompanyBlueprintDto,
  EnterpriseFederationDto,
  ProductPortfolioDto,
  EconomicSimulationDto,
  InvestmentRecordDto,
  ExecutionNetworkTaskDto,
  EnterpriseCommandCenterOverviewDto,
  DigitalEmployeeRole,
  EnterpriseFederationType,
  InvestmentReadinessTier,
  ExecutionNetworkTaskPriority,
  ExecutionNetworkTaskStatus,
  EconomicSimulationScenario,
  OrganizationCivilizationType,
} from '@codeforge/shared';

export const enterpriseCivilizationApi = {
  // Command Center Overview
  async getOverview(): Promise<EnterpriseCommandCenterOverviewDto> {
    const res = await apiClient.get('/enterprise-civilization/overview');
    return res.data.data;
  },

  // Organization Engine
  async listOrganizations(): Promise<OrganizationCivilizationDto[]> {
    const res = await apiClient.get('/enterprise-civilization/organizations');
    return res.data.data;
  },

  async getOrganization(id: string): Promise<OrganizationCivilizationDto> {
    const res = await apiClient.get(`/enterprise-civilization/organizations/${id}`);
    return res.data.data;
  },

  async createOrganization(data: {
    name: string;
    organizationType?: OrganizationCivilizationType;
    missionStatement?: string;
    headquartersRegion?: string;
    seedDepartments?: Array<{ name: string; charter: string }>;
  }): Promise<{
    organization: OrganizationCivilizationDto;
    departments: CivilizationDepartmentDto[];
    teams: CivilizationTeamDto[];
  }> {
    const res = await apiClient.post('/enterprise-civilization/organizations', data);
    return res.data.data;
  },

  async listDepartments(orgId: string): Promise<CivilizationDepartmentDto[]> {
    const res = await apiClient.get(`/enterprise-civilization/organizations/${orgId}/departments`);
    return res.data.data;
  },

  async listTeams(deptId: string): Promise<CivilizationTeamDto[]> {
    const res = await apiClient.get(`/enterprise-civilization/departments/${deptId}/teams`);
    return res.data.data;
  },

  async getWorkforcePlan(orgId: string): Promise<{
    currentHeadcount: number;
    optimalHeadcount: number;
    utilizationRate: number;
    recommendedHires: Array<{ role: DigitalEmployeeRole; count: number; urgency: string; rationale: string }>;
  }> {
    const res = await apiClient.get(`/enterprise-civilization/organizations/${orgId}/workforce-plan`);
    return res.data.data;
  },

  // Digital Employees & Workforce
  async listEmployees(params?: { organizationId?: string; role?: DigitalEmployeeRole }): Promise<DigitalEmployeeDto[]> {
    const res = await apiClient.get('/enterprise-civilization/employees', { params });
    return res.data.data;
  },

  async createEmployee(data: {
    organizationId?: string;
    departmentId?: string;
    teamId?: string;
    name?: string;
    role?: DigitalEmployeeRole;
    seniorityTier?: string;
    primarySpecialization?: string;
    capabilities?: string[];
  }): Promise<DigitalEmployeeDto> {
    const res = await apiClient.post('/enterprise-civilization/employees', data);
    return res.data.data;
  },

  async getEmployeePerformance(employeeId: string): Promise<{
    employeeId: string;
    velocityScore: number;
    accuracyScore: number;
    collaborationIndex: number;
    totalTasksCompleted: number;
    performanceRating: 'EXCEPTIONAL' | 'OPTIMAL' | 'ACCEPTABLE' | 'NEEDS_OPTIMIZATION';
    recommendedSkillUpskill: string[];
  }> {
    const res = await apiClient.get(`/enterprise-civilization/employees/${employeeId}/performance`);
    return res.data.data;
  },

  // Company Builder
  async listBlueprints(): Promise<CompanyBlueprintDto[]> {
    const res = await apiClient.get('/enterprise-civilization/company-blueprints');
    return res.data.data;
  },

  async createBlueprint(data: {
    companyName: string;
    targetMarket?: string;
    domainFocus?: string;
  }): Promise<CompanyBlueprintDto> {
    const res = await apiClient.post('/enterprise-civilization/company-blueprints', data);
    return res.data.data;
  },

  async getBusinessPlan(blueprintId: string): Promise<{
    companyName: string;
    executiveSummary: string;
    targetMarket: string;
    valueProposition: string;
    go_to_market_strategy: string[];
    projectedFiveYearARR: Array<{ year: number; arrUsd: number; growthRatePercent: number }>;
    riskFactorsAndMitigations: Array<{ risk: string; mitigation: string }>;
  }> {
    const res = await apiClient.get(`/enterprise-civilization/company-blueprints/${blueprintId}/business-plan`);
    return res.data.data;
  },

  async getInvestmentReadiness(blueprintId: string): Promise<{
    companyId: string;
    readinessScore: number;
    tier: InvestmentReadinessTier;
    valuationEstimateUsd: number;
    recommendedPitchHighlights: string[];
    gapAnalysis: string[];
  }> {
    const res = await apiClient.get(`/enterprise-civilization/company-blueprints/${blueprintId}/investment-readiness`);
    return res.data.data;
  },

  // Enterprise Federations
  async listFederations(orgId?: string): Promise<EnterpriseFederationDto[]> {
    const res = await apiClient.get('/enterprise-civilization/federations', { params: { organizationId: orgId } });
    return res.data.data;
  },

  async createFederation(data: {
    initiatorOrgId?: string;
    partnerOrgId?: string;
    federationType?: EnterpriseFederationType;
    treatyTitle?: string;
    sharedResourcesDescription?: string;
    governanceTerms?: string;
  }): Promise<EnterpriseFederationDto> {
    const res = await apiClient.post('/enterprise-civilization/federations', data);
    return res.data.data;
  },

  // Product Factory
  async listProducts(orgId?: string): Promise<ProductPortfolioDto[]> {
    const res = await apiClient.get('/enterprise-civilization/products', { params: { organizationId: orgId } });
    return res.data.data;
  },

  async createProduct(data: {
    organizationId?: string;
    productName: string;
    targetPersona?: string;
    coreDifferentiator?: string;
    featuresRoadmap?: Array<{ title: string; releaseTarget: string; status: string }>;
  }): Promise<ProductPortfolioDto> {
    const res = await apiClient.post('/enterprise-civilization/products', data);
    return res.data.data;
  },

  // Economic Simulations
  async listEconomicSimulations(orgId?: string): Promise<EconomicSimulationDto[]> {
    const res = await apiClient.get('/enterprise-civilization/economic-simulations', { params: { organizationId: orgId } });
    return res.data.data;
  },

  async runEconomicSimulation(data: {
    organizationId?: string;
    scenario?: EconomicSimulationScenario;
  }): Promise<EconomicSimulationDto> {
    const res = await apiClient.post('/enterprise-civilization/economic-simulations', data);
    return res.data.data;
  },

  // Capital & Investment Intelligence
  async listInvestments(blueprintId?: string): Promise<InvestmentRecordDto[]> {
    const res = await apiClient.get('/enterprise-civilization/investments', { params: { companyBlueprintId: blueprintId } });
    return res.data.data;
  },

  async createInvestment(data: {
    companyBlueprintId?: string;
    fundingRound?: string;
    targetAmountUsd?: number;
    committedAmountUsd?: number;
    preMoneyValuationUsd?: number;
    leadInvestorEntity?: string;
    investorPitchDeckSummary?: string;
    readinessTier?: InvestmentReadinessTier;
  }): Promise<InvestmentRecordDto> {
    const res = await apiClient.post('/enterprise-civilization/investments', data);
    return res.data.data;
  },

  // Autonomous Execution Network
  async listTasks(params?: { organizationId?: string; status?: ExecutionNetworkTaskStatus }): Promise<ExecutionNetworkTaskDto[]> {
    const res = await apiClient.get('/enterprise-civilization/tasks', { params });
    return res.data.data;
  },

  async delegateTask(data: {
    organizationId?: string;
    projectId?: string;
    taskTitle: string;
    assignedEmployeeId?: string;
    priority?: ExecutionNetworkTaskPriority;
    payloadSpec?: Record<string, any>;
    dependencyTaskIds?: string[];
  }): Promise<ExecutionNetworkTaskDto> {
    const res = await apiClient.post('/enterprise-civilization/tasks', data);
    return res.data.data;
  },

  async executeTask(taskId: string): Promise<ExecutionNetworkTaskDto> {
    const res = await apiClient.post(`/enterprise-civilization/tasks/${taskId}/execute`);
    return res.data.data;
  },
};
