import { Request, Response } from 'express';
import { EnterpriseCivilizationRepository } from '../repositories/EnterpriseCivilizationRepository';
import {
  OrganizationEngineService,
  OrganizationalDesignService,
  WorkforcePlanningService,
  DigitalEmployeeService,
  CompanyBuilderService,
  EnterpriseFederationService,
  ProductFactoryService,
  EconomicSimulationService,
  InvestmentIntelligenceService,
  ExecutionNetworkService,
} from '../modules/organization-engine';

export class EnterpriseCivilizationController {
  private repo = new EnterpriseCivilizationRepository();
  private orgEngine = new OrganizationEngineService(this.repo);
  private orgDesign = new OrganizationalDesignService(this.repo);
  private workforcePlan = new WorkforcePlanningService(this.repo);
  private digitalEmployee = new DigitalEmployeeService(this.repo);
  private companyBuilder = new CompanyBuilderService(this.repo);
  private federation = new EnterpriseFederationService(this.repo);
  private productFactory = new ProductFactoryService(this.repo);
  private economicSim = new EconomicSimulationService(this.repo);
  private investmentIntel = new InvestmentIntelligenceService(this.repo);
  private executionNet = new ExecutionNetworkService(this.repo);

  getOverview = async (req: Request, res: Response): Promise<void> => {
    try {
      const overview = await this.repo.getCommandCenterOverview(req.user?.userId);
      res.json({ success: true, data: overview });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  };

  createOrganization = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId || '00000000-0000-0000-0000-000000000001';
      const result = await this.orgEngine.createOrganizationWithTopology({
        ...req.body,
        creatorUserId: userId,
      });
      res.status(201).json({ success: true, data: result });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  };

  listOrganizations = async (req: Request, res: Response): Promise<void> => {
    try {
      const list = await this.repo.listOrganizations(req.user?.userId);
      res.json({ success: true, data: list });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  };

  getOrganization = async (req: Request, res: Response): Promise<void> => {
    try {
      const org = await this.repo.getOrganizationById(req.params.id);
      if (!org) {
        res.status(404).json({ success: false, error: { message: 'Organization not found' } });
        return;
      }
      res.json({ success: true, data: org });
    } catch (err: any) {
      res.status(500).json({ success: false, error: { message: err.message } });
    }
  };

  listDepartments = async (req: Request, res: Response): Promise<void> => {
    try {
      const list = await this.repo.listDepartments(req.params.id);
      res.json({ success: true, data: list });
    } catch (err: any) {
      res.status(500).json({ success: false, error: { message: err.message } });
    }
  };

  listTeams = async (req: Request, res: Response): Promise<void> => {
    try {
      const list = await this.repo.listTeams(req.params.id);
      res.json({ success: true, data: list });
    } catch (err: any) {
      res.status(500).json({ success: false, error: { message: err.message } });
    }
  };

  getWorkforcePlan = async (req: Request, res: Response): Promise<void> => {
    try {
      const plan = await this.workforcePlan.analyzeWorkforceCapacity(req.params.id);
      res.json({ success: true, data: plan });
    } catch (err: any) {
      res.status(500).json({ success: false, error: { message: err.message } });
    }
  };

  createEmployee = async (req: Request, res: Response): Promise<void> => {
    try {
      const emp = await this.digitalEmployee.provisionDigitalEmployee(req.body);
      res.status(201).json({ success: true, data: emp });
    } catch (err: any) {
      res.status(500).json({ success: false, error: { message: err.message } });
    }
  };

  listEmployees = async (req: Request, res: Response): Promise<void> => {
    try {
      const orgId = req.query.organizationId as string | undefined;
      const role = req.query.role as any;
      const list = await this.repo.listDigitalEmployees(orgId, role);
      res.json({ success: true, data: list });
    } catch (err: any) {
      res.status(500).json({ success: false, error: { message: err.message } });
    }
  };

  getEmployeePerformance = async (req: Request, res: Response): Promise<void> => {
    try {
      const perf = await this.digitalEmployee.evaluateEmployeePerformance(req.params.id);
      res.json({ success: true, data: perf });
    } catch (err: any) {
      res.status(500).json({ success: false, error: { message: err.message } });
    }
  };

  createBlueprint = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId || '00000000-0000-0000-0000-000000000001';
      const bp = await this.companyBuilder.generateStartupBlueprint({
        creatorUserId: userId,
        companyName: req.body.companyName,
        targetMarket: req.body.targetMarket,
        domainFocus: req.body.domainFocus,
      });
      res.status(201).json({ success: true, data: bp });
    } catch (err: any) {
      res.status(500).json({ success: false, error: { message: err.message } });
    }
  };

  listBlueprints = async (req: Request, res: Response): Promise<void> => {
    try {
      const list = await this.repo.listCompanyBlueprints(req.user?.userId);
      res.json({ success: true, data: list });
    } catch (err: any) {
      res.status(500).json({ success: false, error: { message: err.message } });
    }
  };

  getBusinessPlan = async (req: Request, res: Response): Promise<void> => {
    try {
      const plan = await this.companyBuilder.generateBusinessPlan(req.params.id);
      res.json({ success: true, data: plan });
    } catch (err: any) {
      res.status(500).json({ success: false, error: { message: err.message } });
    }
  };

  getInvestmentReadiness = async (req: Request, res: Response): Promise<void> => {
    try {
      const readiness = await this.companyBuilder.evaluateInvestmentReadiness(req.params.id);
      res.json({ success: true, data: readiness });
    } catch (err: any) {
      res.status(500).json({ success: false, error: { message: err.message } });
    }
  };

  createFederation = async (req: Request, res: Response): Promise<void> => {
    try {
      const fed = await this.federation.proposeFederation(req.body);
      res.status(201).json({ success: true, data: fed });
    } catch (err: any) {
      res.status(500).json({ success: false, error: { message: err.message } });
    }
  };

  listFederations = async (req: Request, res: Response): Promise<void> => {
    try {
      const orgId = req.query.organizationId as string | undefined;
      const list = await this.repo.listFederations(orgId);
      res.json({ success: true, data: list });
    } catch (err: any) {
      res.status(500).json({ success: false, error: { message: err.message } });
    }
  };

  createProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const prod = await this.productFactory.discoverProductOpportunity(req.body);
      res.status(201).json({ success: true, data: prod });
    } catch (err: any) {
      res.status(500).json({ success: false, error: { message: err.message } });
    }
  };

  listProducts = async (req: Request, res: Response): Promise<void> => {
    try {
      const orgId = req.query.organizationId as string | undefined;
      const list = await this.repo.listProductPortfolios(orgId);
      res.json({ success: true, data: list });
    } catch (err: any) {
      res.status(500).json({ success: false, error: { message: err.message } });
    }
  };

  runEconomicSimulation = async (req: Request, res: Response): Promise<void> => {
    try {
      const sim = await this.economicSim.runScenarioSimulation(req.body);
      res.status(201).json({ success: true, data: sim });
    } catch (err: any) {
      res.status(500).json({ success: false, error: { message: err.message } });
    }
  };

  listEconomicSimulations = async (req: Request, res: Response): Promise<void> => {
    try {
      const orgId = req.query.organizationId as string | undefined;
      const list = await this.repo.listEconomicSimulations(orgId);
      res.json({ success: true, data: list });
    } catch (err: any) {
      res.status(500).json({ success: false, error: { message: err.message } });
    }
  };

  recordInvestment = async (req: Request, res: Response): Promise<void> => {
    try {
      const inv = await this.investmentIntel.recordInvestmentRound(req.body);
      res.status(201).json({ success: true, data: inv });
    } catch (err: any) {
      res.status(500).json({ success: false, error: { message: err.message } });
    }
  };

  listInvestments = async (req: Request, res: Response): Promise<void> => {
    try {
      const bpId = req.query.companyBlueprintId as string | undefined;
      const list = await this.repo.listInvestmentRecords(bpId);
      res.json({ success: true, data: list });
    } catch (err: any) {
      res.status(500).json({ success: false, error: { message: err.message } });
    }
  };

  delegateTask = async (req: Request, res: Response): Promise<void> => {
    try {
      const task = await this.executionNet.delegateTask(req.body);
      res.status(201).json({ success: true, data: task });
    } catch (err: any) {
      res.status(500).json({ success: false, error: { message: err.message } });
    }
  };

  listTasks = async (req: Request, res: Response): Promise<void> => {
    try {
      const orgId = req.query.organizationId as string | undefined;
      const status = req.query.status as any;
      const list = await this.repo.listExecutionTasks(orgId, status);
      res.json({ success: true, data: list });
    } catch (err: any) {
      res.status(500).json({ success: false, error: { message: err.message } });
    }
  };

  executeTask = async (req: Request, res: Response): Promise<void> => {
    try {
      const completed = await this.executionNet.executeTaskThroughPipeline(req.params.id);
      res.json({ success: true, data: completed });
    } catch (err: any) {
      res.status(500).json({ success: false, error: { message: err.message } });
    }
  };
}
