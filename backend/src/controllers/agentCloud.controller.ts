import { Request, Response } from 'express';
import { AgentCloudRepository } from '../repositories/AgentCloudRepository';
import {
  AgentCloudService,
  WorkflowEngineService,
  EventBusService,
  AutomationEngine,
  ExecutionFabricService,
  WorkforceService,
  TaskOperatingSystemService,
  MemoryFabricService,
  KnowledgeFabricService,
  DecisionCenterService,
  CollaborationPlatformService,
  TelemetryService,
  GovernanceService,
} from '../modules/agent-cloud';
import { ApiResponse, WorkforceAgentRole, AgentCloudState, KnowledgeGraphDomain } from '@codeforge/shared';

const agentCloudRepo = new AgentCloudRepository();

const agentCloudService = new AgentCloudService(agentCloudRepo);
const workflowEngineService = new WorkflowEngineService(agentCloudRepo);
const eventBusService = new EventBusService(agentCloudRepo);
const automationEngine = new AutomationEngine(agentCloudRepo, eventBusService, workflowEngineService, agentCloudService);
const executionFabricService = new ExecutionFabricService(agentCloudRepo);
const workforceService = new WorkforceService(agentCloudRepo);
const taskOSService = new TaskOperatingSystemService(agentCloudRepo);
const memoryFabricService = new MemoryFabricService(agentCloudRepo);
const knowledgeFabricService = new KnowledgeFabricService(agentCloudRepo);
const decisionCenterService = new DecisionCenterService(agentCloudRepo);
const collaborationService = new CollaborationPlatformService();
const telemetryService = new TelemetryService(agentCloudRepo);
const governanceService = new GovernanceService(agentCloudRepo);

export class AgentCloudController {
  // Module 1: Persistent AI Agent Cloud
  static async createAgent(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id || 'system';
      const agent = await agentCloudService.createAgent(userId, req.body);
      const response: ApiResponse<typeof agent> = { success: true, data: agent };
      res.status(201).json(response);
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  static async getAgent(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const agent = await agentCloudService.getAgent(req.params.id, userId);
      if (!agent) {
        res.status(404).json({ success: false, message: 'Agent instance not found' });
        return;
      }
      const response: ApiResponse<typeof agent> = { success: true, data: agent };
      res.json(response);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async listAgents(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id || 'system';
      const { role, state } = req.query;
      const agents = await agentCloudService.listAgents(userId, role as WorkforceAgentRole, state as AgentCloudState);
      const response: ApiResponse<typeof agents> = { success: true, data: agents };
      res.json(response);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async startAgent(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id || 'system';
      const agent = await agentCloudService.startAgent(req.params.id, userId);
      const response: ApiResponse<typeof agent> = { success: true, data: agent };
      res.json(response);
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  static async pauseAgent(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id || 'system';
      const agent = await agentCloudService.pauseAgent(req.params.id, userId);
      const response: ApiResponse<typeof agent> = { success: true, data: agent };
      res.json(response);
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  static async terminateAgent(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id || 'system';
      const agent = await agentCloudService.terminateAgent(req.params.id, userId);
      const response: ApiResponse<typeof agent> = { success: true, data: agent };
      res.json(response);
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  static async runAgent(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id || 'system';
      const run = await agentCloudService.runAgent(req.params.id, userId, req.body.inputPayload || {});
      const response: ApiResponse<typeof run> = { success: true, data: run };
      res.json(response);
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  static async getHealthStatus(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id || 'system';
      const status = await agentCloudService.getHealthStatus(req.params.id, userId);
      const response: ApiResponse<typeof status> = { success: true, data: status };
      res.json(response);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // Module 2: Distributed Workflow Engine
  static async createWorkflow(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id || 'system';
      const wf = await workflowEngineService.createDefinition(userId, req.body);
      const response: ApiResponse<typeof wf> = { success: true, data: wf };
      res.status(201).json(response);
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  static async listWorkflows(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id || 'system';
      const workflows = await workflowEngineService.listDefinitions(userId, req.query.type as any);
      const response: ApiResponse<typeof workflows> = { success: true, data: workflows };
      res.json(response);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async executeWorkflow(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id || 'system';
      const run = await workflowEngineService.executeWorkflow(req.params.id, userId, req.body.initialContext || {});
      const response: ApiResponse<typeof run> = { success: true, data: run };
      res.json(response);
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  static async getWorkflowRun(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id || 'system';
      const run = await workflowEngineService.getRun(req.params.runId, userId);
      if (!run) {
        res.status(404).json({ success: false, message: 'Workflow run not found' });
        return;
      }
      const response: ApiResponse<typeof run> = { success: true, data: run };
      res.json(response);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // Module 3: Event Bus & Automation Engine
  static async publishEvent(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id || null;
      const event = await eventBusService.publish(userId, req.body);
      const response: ApiResponse<typeof event> = { success: true, data: event };
      res.status(201).json(response);
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  static async listEvents(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id || null;
      const events = await eventBusService.getRecentEvents(userId, req.query.limit ? Number(req.query.limit) : 50);
      const response: ApiResponse<typeof events> = { success: true, data: events };
      res.json(response);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async createAutomationRule(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id || 'system';
      const rule = await automationEngine.createRule(userId, req.body);
      const response: ApiResponse<typeof rule> = { success: true, data: rule };
      res.status(201).json(response);
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  static async listAutomationRules(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id || 'system';
      const rules = await automationEngine.listRules(userId, req.query.triggerEvent as any);
      const response: ApiResponse<typeof rules> = { success: true, data: rules };
      res.json(response);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // Module 4: Execution Fabric
  static async listTools(req: Request, res: Response): Promise<void> {
    try {
      const tools = executionFabricService.listAvailableTools();
      const response: ApiResponse<typeof tools> = { success: true, data: tools };
      res.json(response);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async invokeTool(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id || 'system';
      const result = await executionFabricService.invokeTool(userId, req.body);
      const response: ApiResponse<typeof result> = { success: true, data: result };
      res.json(response);
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  static async getQuota(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id || 'system';
      const quota = await executionFabricService.getOrCreateQuota(userId);
      const response: ApiResponse<typeof quota> = { success: true, data: quota };
      res.json(response);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // Module 5: Organizational AI Workforces
  static async listTeamAgents(req: Request, res: Response): Promise<void> {
    try {
      const teamId = req.params.teamId;
      const agents = await workforceService.listTeamAgents(teamId);
      const response: ApiResponse<typeof agents> = { success: true, data: agents };
      res.json(response);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getWorkforceReport(req: Request, res: Response): Promise<void> {
    try {
      const scopeId = req.params.scopeId;
      const report = await workforceService.getWorkforceOptimizationReport(scopeId);
      const response: ApiResponse<typeof report> = { success: true, data: report };
      res.json(response);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // Module 6: Task Operating System
  static async createTaskNode(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id || 'system';
      const node = await taskOSService.createTaskNode(userId, req.body);
      const response: ApiResponse<typeof node> = { success: true, data: node };
      res.status(201).json(response);
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  static async getTaskGraph(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id || 'system';
      const graph = await taskOSService.getTaskGraph(userId);
      const response: ApiResponse<typeof graph> = { success: true, data: graph };
      res.json(response);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async generateSmartPlan(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id || 'system';
      const plan = await taskOSService.generateSmartPlan(userId);
      const response: ApiResponse<typeof plan> = { success: true, data: plan };
      res.json(response);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // Module 7: Memory Fabric 2.0
  static async storeMemory(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id || 'system';
      const memory = await memoryFabricService.storeMemory(userId, req.body);
      const response: ApiResponse<typeof memory> = { success: true, data: memory };
      res.status(201).json(response);
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  static async searchMemory(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id || 'system';
      const results = await memoryFabricService.semanticSearch(userId, req.body);
      const response: ApiResponse<typeof results> = { success: true, data: results };
      res.json(response);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // Module 8: Knowledge Fabric
  static async getKnowledgeGraph(req: Request, res: Response): Promise<void> {
    try {
      const domain = (req.query.domain as KnowledgeGraphDomain) || KnowledgeGraphDomain.GLOBAL;
      const graph = await knowledgeFabricService.getDomainGraph(domain);
      const response: ApiResponse<typeof graph> = { success: true, data: graph };
      res.json(response);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async discoverConcepts(req: Request, res: Response): Promise<void> {
    try {
      const domain = (req.query.domain as KnowledgeGraphDomain) || KnowledgeGraphDomain.GLOBAL;
      const query = (req.query.query as string) || '';
      const discovery = await knowledgeFabricService.discoverConcepts(domain, query);
      const response: ApiResponse<typeof discovery> = { success: true, data: discovery };
      res.json(response);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // Module 9: AI Decision Center
  static async createDecision(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id || 'system';
      const decision = await decisionCenterService.createDecision(userId, req.body);
      const response: ApiResponse<typeof decision> = { success: true, data: decision };
      res.status(201).json(response);
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  static async listDecisions(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id || 'system';
      const decisions = await decisionCenterService.listDecisions(userId);
      const response: ApiResponse<typeof decisions> = { success: true, data: decisions };
      res.json(response);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async executeDecision(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id || 'system';
      const decision = await decisionCenterService.executeDecision(req.params.id, userId, req.body.optionId);
      const response: ApiResponse<typeof decision> = { success: true, data: decision };
      res.json(response);
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // Module 10: Real-Time Collaboration
  static async createWorkspace(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id || 'system';
      const ws = await collaborationService.createWorkspace(userId, req.body.name || 'AI Shared Workspace');
      const response: ApiResponse<typeof ws> = { success: true, data: ws };
      res.status(201).json(response);
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  static async getWorkspace(req: Request, res: Response): Promise<void> {
    try {
      const ws = await collaborationService.getWorkspace(req.params.id);
      if (!ws) {
        res.status(404).json({ success: false, message: 'Workspace not found' });
        return;
      }
      const response: ApiResponse<typeof ws> = { success: true, data: ws };
      res.json(response);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // Module 11: Telemetry & Observability
  static async getTelemetryDashboard(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const dashboard = await telemetryService.getDashboardSummary(userId);
      const response: ApiResponse<typeof dashboard> = { success: true, data: dashboard };
      res.json(response);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // Module 12: Governance, Security & Compliance
  static async getComplianceReport(req: Request, res: Response): Promise<void> {
    try {
      const report = await governanceService.generateComplianceReport();
      const response: ApiResponse<typeof report> = { success: true, data: report };
      res.json(response);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getAuditLogs(req: Request, res: Response): Promise<void> {
    try {
      const agentId = req.params.agentId;
      const logs = await governanceService.getAuditLogs(agentId, req.query.limit ? Number(req.query.limit) : 50);
      const response: ApiResponse<typeof logs> = { success: true, data: logs };
      res.json(response);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}
