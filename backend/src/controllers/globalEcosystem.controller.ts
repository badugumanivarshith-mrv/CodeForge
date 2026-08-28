import { Request, Response } from 'express';
import {
  globalNetworkService,
  collectiveIntelligenceService,
  autonomousEnterpriseService,
  talentCloudService,
  startupBuilderService,
  researchNetworkService,
  digitalTwinService,
  ecosystemEconomyService,
  selfImprovingEcosystemService,
  superIntelligenceService,
} from '../modules/global-network';
import { ApiResponse, GlobalNodeType, DigitalTwinType, SuperintelligenceScope } from '@codeforge/shared';

export class GlobalEcosystemController {
  // Module 1: Global AI Network
  static async registerNode(req: Request, res: Response): Promise<void> {
    try {
      const node = await globalNetworkService.registerNode(req.body);
      const response: ApiResponse<typeof node> = { success: true, data: node };
      res.status(201).json(response);
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  static async connectNodes(req: Request, res: Response): Promise<void> {
    try {
      const edge = await globalNetworkService.connectNodes(req.body);
      const response: ApiResponse<typeof edge> = { success: true, data: edge };
      res.status(201).json(response);
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  static async getGraph(req: Request, res: Response): Promise<void> {
    try {
      const graph = await globalNetworkService.getGraphTopology();
      const response: ApiResponse<typeof graph> = { success: true, data: graph };
      res.json(response);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getRecommendations(req: Request, res: Response): Promise<void> {
    try {
      const recommendations = await globalNetworkService.getCrossNetworkRecommendations(req.params.nodeId);
      const response: ApiResponse<typeof recommendations> = { success: true, data: recommendations };
      res.json(response);
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  static async getRankings(req: Request, res: Response): Promise<void> {
    try {
      const nodeType = req.query.type as GlobalNodeType | undefined;
      const rankings = await globalNetworkService.getGlobalRankings(nodeType);
      const response: ApiResponse<typeof rankings> = { success: true, data: rankings };
      res.json(response);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // Module 2: Collective Intelligence Engine
  static async submitCrowdKnowledge(req: Request, res: Response): Promise<void> {
    try {
      const result = await collectiveIntelligenceService.submitCrowdKnowledge(req.body);
      const response: ApiResponse<typeof result> = { success: true, data: result };
      res.json(response);
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  static async getConsensus(req: Request, res: Response): Promise<void> {
    try {
      const topic = (req.query.topic as string) || 'Distributed Multi-Agent Consensus';
      const consensus = await collectiveIntelligenceService.getConsensusByTopic(topic);
      const response: ApiResponse<typeof consensus> = { success: true, data: consensus };
      res.json(response);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getEmergingTrends(_req: Request, res: Response): Promise<void> {
    try {
      const trends = await collectiveIntelligenceService.identifyEmergingTrends();
      const response: ApiResponse<typeof trends> = { success: true, data: trends };
      res.json(response);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // Module 3: Autonomous Enterprise Platform
  static async createDepartment(req: Request, res: Response): Promise<void> {
    try {
      const department = await autonomousEnterpriseService.createDepartment(req.body);
      const response: ApiResponse<typeof department> = { success: true, data: department };
      res.status(201).json(response);
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  static async listDepartments(req: Request, res: Response): Promise<void> {
    try {
      const orgId = req.params.orgId || (req as any).user?.organizationId || 'org-1';
      const depts = await autonomousEnterpriseService.listDepartments(orgId);
      const response: ApiResponse<typeof depts> = { success: true, data: depts };
      res.json(response);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async createEnterpriseProject(req: Request, res: Response): Promise<void> {
    try {
      const project = await autonomousEnterpriseService.createAutonomousProject(req.body);
      const response: ApiResponse<typeof project> = { success: true, data: project };
      res.status(201).json(response);
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  static async getEnterpriseOptimization(req: Request, res: Response): Promise<void> {
    try {
      const orgId = req.params.orgId || 'org-1';
      const report = await autonomousEnterpriseService.generateOptimizationReport(orgId);
      const response: ApiResponse<typeof report> = { success: true, data: report };
      res.json(response);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // Module 4: Global Talent Cloud
  static async createOrUpdateTalentProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id || 'demo-user';
      const profile = await talentCloudService.createOrUpdateProfile(userId, req.body);
      const response: ApiResponse<typeof profile> = { success: true, data: profile };
      res.json(response);
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  static async getTalentProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId || (req as any).user?.id;
      const profile = await talentCloudService.getProfile(userId);
      const response: ApiResponse<typeof profile> = { success: true, data: profile };
      res.json(response);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async searchTalent(req: Request, res: Response): Promise<void> {
    try {
      const results = await talentCloudService.searchTalent(req.query as any);
      const response: ApiResponse<typeof results> = { success: true, data: results };
      res.json(response);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async requestSkillVerification(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id || 'demo-user';
      const result = await talentCloudService.requestSkillVerification(userId, req.body);
      const response: ApiResponse<typeof result> = { success: true, data: result };
      res.json(response);
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  static async matchTalent(req: Request, res: Response): Promise<void> {
    try {
      const { roleTitle, requiredSkills } = req.body;
      const matches = await talentCloudService.matchTalentForRole(roleTitle || 'AI Engineer', requiredSkills || ['TypeScript', 'Python']);
      const response: ApiResponse<typeof matches> = { success: true, data: matches };
      res.json(response);
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // Module 5: AI Entrepreneurship Platform
  static async launchStartup(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id || 'demo-user';
      const startup = await startupBuilderService.launchStartup(userId, req.body);
      const response: ApiResponse<typeof startup> = { success: true, data: startup };
      res.status(201).json(response);
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  static async listStartups(req: Request, res: Response): Promise<void> {
    try {
      const startups = await startupBuilderService.listStartups(req.query.stage as any, req.query.industry as string);
      const response: ApiResponse<typeof startups> = { success: true, data: startups };
      res.json(response);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getVentureIntelligence(req: Request, res: Response): Promise<void> {
    try {
      const report = await startupBuilderService.generateVentureIntelligence(req.params.startupId);
      const response: ApiResponse<typeof report> = { success: true, data: report };
      res.json(response);
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // Module 6: Global Research Network
  static async publishPaper(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id || 'demo-user';
      const paper = await researchNetworkService.publishPaper(userId, req.body);
      const response: ApiResponse<typeof paper> = { success: true, data: paper };
      res.status(201).json(response);
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  static async listPapers(req: Request, res: Response): Promise<void> {
    try {
      const papers = await researchNetworkService.listPapers(req.query.domain as string);
      const response: ApiResponse<typeof papers> = { success: true, data: papers };
      res.json(response);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // Module 7: Digital Twin Ecosystem
  static async createTwin(req: Request, res: Response): Promise<void> {
    try {
      const { entityId, twinType, name, stateSnapshot, behavioralModel } = req.body;
      const twin = await digitalTwinService.createTwin(entityId, twinType || DigitalTwinType.USER_TWIN, name, stateSnapshot, behavioralModel);
      const response: ApiResponse<typeof twin> = { success: true, data: twin };
      res.status(201).json(response);
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  static async listTwins(req: Request, res: Response): Promise<void> {
    try {
      const twins = await digitalTwinService.listTwins(req.query.type as any);
      const response: ApiResponse<typeof twins> = { success: true, data: twins };
      res.json(response);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async runTwinSimulation(req: Request, res: Response): Promise<void> {
    try {
      const { scenarioTitle, inputParameters } = req.body;
      const result = await digitalTwinService.runSimulation(req.params.twinId, scenarioTitle || 'Quarterly Forecast', inputParameters || {});
      const response: ApiResponse<typeof result> = { success: true, data: result };
      res.json(response);
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // Module 8: AI Economy & Token System
  static async getReputation(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId || (req as any).user?.id || 'demo-user';
      const rep = await ecosystemEconomyService.getUserReputation(userId);
      const response: ApiResponse<typeof rep> = { success: true, data: rep };
      res.json(response);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async rewardContribution(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id || 'demo-user';
      const { credits, reason } = req.body;
      const reward = await ecosystemEconomyService.grantContributionReward(userId, credits || 10, reason || 'Knowledge Sharing');
      const response: ApiResponse<typeof reward> = { success: true, data: reward };
      res.json(response);
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // Module 9: Self-Improving AI Ecosystem
  static async getLearningMetrics(_req: Request, res: Response): Promise<void> {
    try {
      const metrics = await selfImprovingEcosystemService.getLearningMetrics();
      const response: ApiResponse<typeof metrics> = { success: true, data: metrics };
      res.json(response);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async triggerSelfImprovement(req: Request, res: Response): Promise<void> {
    try {
      const { moduleName } = req.body;
      const result = await selfImprovingEcosystemService.triggerSelfImprovementCycle(moduleName || 'CodeReviewEngine');
      const response: ApiResponse<typeof result> = { success: true, data: result };
      res.json(response);
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // Module 10: Global Command Center & Superintelligence
  static async getCommandCenterOverview(_req: Request, res: Response): Promise<void> {
    try {
      const overview = await superIntelligenceService.getCommandCenterOverview();
      const response: ApiResponse<typeof overview> = { success: true, data: overview };
      res.json(response);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getStrategicInsights(req: Request, res: Response): Promise<void> {
    try {
      const scope = req.query.scope as SuperintelligenceScope | undefined;
      const insights = await superIntelligenceService.generateStrategicInsights(scope);
      const response: ApiResponse<typeof insights> = { success: true, data: insights };
      res.json(response);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}
