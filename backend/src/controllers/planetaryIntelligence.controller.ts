import { Request, Response } from 'express';
import { PlanetaryIntelligenceRepository } from '../repositories/PlanetaryIntelligenceRepository';
import {
  PlanetaryNetworkService,
  CivilizationEngineService,
  AutonomousGovernanceService,
  PlanetaryTwinService,
  InnovationNetworkService,
  ResearchCivilizationService,
  EconomicIntelligenceService,
  AgentFederationService,
  StrategicForesightService,
} from '../modules/planetary-network';
import {
  PlanetaryTwinType,
  CivilizationHealthTier,
  GovernanceCouncilType,
  PolicyStatus,
  InnovationDomain,
  AgentFederationStatus,
  EconomicSignalType,
  ForesightHorizon,
} from '@codeforge/shared';

const repo = new PlanetaryIntelligenceRepository();
const networkService = new PlanetaryNetworkService(repo);
const civilizationService = new CivilizationEngineService(repo);
const governanceService = new AutonomousGovernanceService(repo);
const twinService = new PlanetaryTwinService(repo);
const innovationService = new InnovationNetworkService(repo);
const researchService = new ResearchCivilizationService(repo);
const economicService = new EconomicIntelligenceService(repo);
const federationService = new AgentFederationService(repo);
const foresightService = new StrategicForesightService(repo);

export class PlanetaryIntelligenceController {
  // Command Center Overview
  static async getCommandCenterOverview(req: Request, res: Response): Promise<void> {
    try {
      const overview = await repo.getCommandCenterOverview();
      res.json({ success: true, data: overview });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  // Planetary Clusters & Mesh
  static async listClusters(req: Request, res: Response): Promise<void> {
    try {
      const clusters = await networkService.listClusters();
      res.json({ success: true, data: clusters });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  static async getCollaborationMesh(req: Request, res: Response): Promise<void> {
    try {
      const mesh = await networkService.getCollaborationMesh();
      res.json({ success: true, data: mesh });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  // Civilization Engine
  static async getCivilizationHealth(req: Request, res: Response): Promise<void> {
    try {
      const health = await civilizationService.computeCivilizationHealth();
      res.json({ success: true, data: health });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  static async generateCivilizationReport(req: Request, res: Response): Promise<void> {
    try {
      const report = await civilizationService.generateCivilizationReport();
      res.json({ success: true, data: report });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  static async listCivilizationReports(req: Request, res: Response): Promise<void> {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
      const reports = await civilizationService.listReports(limit);
      res.json({ success: true, data: reports });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  // Governance Platform
  static async listPolicies(req: Request, res: Response): Promise<void> {
    try {
      const councilType = req.query.councilType as GovernanceCouncilType | undefined;
      const status = req.query.status as PolicyStatus | undefined;
      const policies = await governanceService.listPolicies(councilType, status);
      res.json({ success: true, data: policies });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  static async proposePolicy(req: Request, res: Response): Promise<void> {
    try {
      const policy = await governanceService.proposePolicy(req.body);
      res.status(201).json({ success: true, data: policy });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  static async simulatePolicy(req: Request, res: Response): Promise<void> {
    try {
      const simulation = await governanceService.simulatePolicyImpact(req.params.id, req.body.simulationName);
      res.json({ success: true, data: simulation });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  static async enactPolicy(req: Request, res: Response): Promise<void> {
    try {
      const policy = await governanceService.enactPolicy(req.params.id);
      res.json({ success: true, data: policy });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  // Planetary Digital Twins
  static async listTwins(req: Request, res: Response): Promise<void> {
    try {
      const twinType = req.query.twinType as PlanetaryTwinType | undefined;
      const twins = await twinService.listTwins(twinType);
      res.json({ success: true, data: twins });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  static async createTwin(req: Request, res: Response): Promise<void> {
    try {
      const twin = await twinService.createTwin(req.body);
      res.status(201).json({ success: true, data: twin });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  static async simulateTwin(req: Request, res: Response): Promise<void> {
    try {
      const simulation = await twinService.runScenarioSimulation(
        req.params.id,
        req.body.scenarioName,
        req.body.horizonDays,
        req.body.parameters
      );
      res.json({ success: true, data: simulation });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  // Innovation Network
  static async listInnovations(req: Request, res: Response): Promise<void> {
    try {
      const domain = req.query.domain as InnovationDomain | undefined;
      const innovations = await innovationService.listInnovations(domain);
      res.json({ success: true, data: innovations });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  static async recordInnovation(req: Request, res: Response): Promise<void> {
    try {
      const record = await innovationService.recordInnovation(req.body);
      res.status(201).json({ success: true, data: record });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  static async rankInnovations(req: Request, res: Response): Promise<void> {
    try {
      const domain = req.params.domain as InnovationDomain;
      const ranking = await innovationService.rankInnovationsByDomain(domain);
      res.json({ success: true, data: ranking });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  // Research Civilization
  static async listResearchFederations(req: Request, res: Response): Promise<void> {
    try {
      const federations = await researchService.listFederations();
      res.json({ success: true, data: federations });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  static async createResearchFederation(req: Request, res: Response): Promise<void> {
    try {
      const fed = await researchService.createFederation(req.body);
      res.status(201).json({ success: true, data: fed });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  static async launchCollaboration(req: Request, res: Response): Promise<void> {
    try {
      const collab = await researchService.launchCollaboration({
        federationId: req.params.id,
        ...req.body,
      });
      res.status(201).json({ success: true, data: collab });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  // Economic Intelligence
  static async listEconomicSignals(req: Request, res: Response): Promise<void> {
    try {
      const signalType = req.query.signalType as EconomicSignalType | undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
      const signals = await economicService.listSignals(signalType, limit);
      res.json({ success: true, data: signals });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  static async generateEconomicForecast(req: Request, res: Response): Promise<void> {
    try {
      const horizonMonths = req.body.horizonMonths || 12;
      const forecast = await economicService.generateMacroForecast(horizonMonths);
      res.json({ success: true, data: forecast });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  // Agent Federation
  static async listAgentFederations(req: Request, res: Response): Promise<void> {
    try {
      const status = req.query.status as AgentFederationStatus | undefined;
      const federations = await federationService.listFederations(status);
      res.json({ success: true, data: federations });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  static async formAgentFederation(req: Request, res: Response): Promise<void> {
    try {
      const federation = await federationService.formFederation(req.body);
      res.status(201).json({ success: true, data: federation });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  static async delegateTask(req: Request, res: Response): Promise<void> {
    try {
      const plan = await federationService.negotiateAndDelegateTask(req.body);
      res.status(201).json({ success: true, data: plan });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  // Strategic Foresight
  static async listStrategicForecasts(req: Request, res: Response): Promise<void> {
    try {
      const horizon = req.query.horizon as ForesightHorizon | undefined;
      const domain = req.query.domain as InnovationDomain | undefined;
      const forecasts = await foresightService.listForecasts(horizon, domain);
      res.json({ success: true, data: forecasts });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  static async generateStrategicForecast(req: Request, res: Response): Promise<void> {
    try {
      const forecast = await foresightService.generateForecast(req.body);
      res.status(201).json({ success: true, data: forecast });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }
}
