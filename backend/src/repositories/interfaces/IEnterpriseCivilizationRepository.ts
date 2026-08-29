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
  ProductLifecycleStage,
  ExecutionNetworkTaskStatus,
} from '@codeforge/shared';

export interface IEnterpriseCivilizationRepository {
  // Organizations
  createOrganization(data: Partial<OrganizationCivilizationDto>): Promise<OrganizationCivilizationDto>;
  getOrganizationById(id: string): Promise<OrganizationCivilizationDto | null>;
  getOrganizationBySlug(slug: string): Promise<OrganizationCivilizationDto | null>;
  listOrganizations(creatorUserId?: string): Promise<OrganizationCivilizationDto[]>;
  updateOrganization(id: string, updates: Partial<OrganizationCivilizationDto>): Promise<OrganizationCivilizationDto | null>;

  // Departments & Teams
  createDepartment(data: Partial<CivilizationDepartmentDto>): Promise<CivilizationDepartmentDto>;
  listDepartments(organizationId: string): Promise<CivilizationDepartmentDto[]>;
  createTeam(data: Partial<CivilizationTeamDto>): Promise<CivilizationTeamDto>;
  listTeams(departmentId: string): Promise<CivilizationTeamDto[]>;

  // Digital Employees
  createDigitalEmployee(data: Partial<DigitalEmployeeDto>): Promise<DigitalEmployeeDto>;
  getDigitalEmployeeById(id: string): Promise<DigitalEmployeeDto | null>;
  listDigitalEmployees(organizationId?: string, role?: DigitalEmployeeRole): Promise<DigitalEmployeeDto[]>;
  updateDigitalEmployee(id: string, updates: Partial<DigitalEmployeeDto>): Promise<DigitalEmployeeDto | null>;

  // Company Blueprints
  createCompanyBlueprint(data: Partial<CompanyBlueprintDto>): Promise<CompanyBlueprintDto>;
  getCompanyBlueprintById(id: string): Promise<CompanyBlueprintDto | null>;
  listCompanyBlueprints(creatorUserId?: string): Promise<CompanyBlueprintDto[]>;

  // Enterprise Federations
  createFederation(data: Partial<EnterpriseFederationDto>): Promise<EnterpriseFederationDto>;
  listFederations(organizationId?: string): Promise<EnterpriseFederationDto[]>;

  // Product Portfolios
  createProductPortfolio(data: Partial<ProductPortfolioDto>): Promise<ProductPortfolioDto>;
  listProductPortfolios(organizationId?: string): Promise<ProductPortfolioDto[]>;
  updateProductStage(id: string, stage: ProductLifecycleStage): Promise<ProductPortfolioDto | null>;

  // Economic Simulations
  createEconomicSimulation(data: Partial<EconomicSimulationDto>): Promise<EconomicSimulationDto>;
  listEconomicSimulations(organizationId?: string): Promise<EconomicSimulationDto[]>;

  // Investment Records
  createInvestmentRecord(data: Partial<InvestmentRecordDto>): Promise<InvestmentRecordDto>;
  listInvestmentRecords(companyBlueprintId?: string): Promise<InvestmentRecordDto[]>;

  // Execution Networks
  createExecutionTask(data: Partial<ExecutionNetworkTaskDto>): Promise<ExecutionNetworkTaskDto>;
  getExecutionTaskById(id: string): Promise<ExecutionNetworkTaskDto | null>;
  listExecutionTasks(organizationId?: string, status?: ExecutionNetworkTaskStatus): Promise<ExecutionNetworkTaskDto[]>;
  updateExecutionTask(id: string, updates: Partial<ExecutionNetworkTaskDto>): Promise<ExecutionNetworkTaskDto | null>;

  // Overview Aggregations
  getCommandCenterOverview(userId?: string): Promise<EnterpriseCommandCenterOverviewDto>;
}
