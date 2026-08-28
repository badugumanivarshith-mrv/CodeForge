import { Request, Response } from 'express';
import {
  agentOrchestratorService,
  agentMemoryService,
  projectExecutionService,
  researchCopilotService,
  knowledgeGraphService,
  workspaceAutomationService,
  documentIntelligenceService,
  executiveDecisionEngineService,
  productivityAnalyticsService,
} from '../modules/agents';
import { AgentType } from '@codeforge/shared';

export class AgenticWorkspaceController {
  // 1. Command Center Overview
  async getCommandCenterOverview(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id || 'anonymous';
      const overview = await productivityAnalyticsService.getCommandCenterOverview(userId);
      res.json({ success: true, data: overview });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  // 2. Agents
  async listAgents(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id || 'anonymous';
      const filterType = req.query.type as AgentType | undefined;
      const agents = await agentOrchestratorService.listAgents(userId, filterType);
      res.json({ success: true, data: agents });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async decomposeGoal(req: Request, res: Response): Promise<void> {
    try {
      const { goal, agentType } = req.body;
      if (!goal) {
        res.status(400).json({ success: false, error: 'Goal description is required.' });
        return;
      }
      const plan = agentOrchestratorService.decomposeGoal(goal, agentType);
      res.json({ success: true, data: plan });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async dispatchAgentMessage(req: Request, res: Response): Promise<void> {
    try {
      const { fromAgent, toAgent, message } = req.body;
      if (!fromAgent || !toAgent || !message) {
        res.status(400).json({ success: false, error: 'fromAgent, toAgent, and message are required.' });
        return;
      }
      const dispatchResult = agentOrchestratorService.dispatchAgentMessage(fromAgent, toAgent, message);
      res.json({ success: true, data: dispatchResult });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  // 3. Tasks
  async listTasks(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id || 'anonymous';
      const agentId = req.query.agentId as string | undefined;
      const tasks = await agentOrchestratorService.listTasks(userId, agentId);
      res.json({ success: true, data: tasks });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async createTask(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id || 'anonymous';
      const task = await agentOrchestratorService.createTask(userId, req.body);
      res.status(201).json({ success: true, data: task });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async executeTask(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id || 'anonymous';
      const taskId = req.params.id;
      const completed = await agentOrchestratorService.executeTask(taskId, userId);
      res.json({ success: true, data: completed });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async getTask(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id || 'anonymous';
      const taskId = req.params.id;
      const task = await agentOrchestratorService.getTask(taskId, userId);
      if (!task) {
        res.status(404).json({ success: false, error: 'Task not found' });
        return;
      }
      res.json({ success: true, data: task });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  // 4. Workflows
  async listWorkflows(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id || 'anonymous';
      const workflows = await workspaceAutomationService.listWorkflows(userId);
      res.json({ success: true, data: workflows });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async createWorkflow(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id || 'anonymous';
      const workflow = await workspaceAutomationService.createWorkflow(userId, req.body);
      res.status(201).json({ success: true, data: workflow });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async triggerWorkflow(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id || 'anonymous';
      const workflowId = req.params.id;
      const executed = await workspaceAutomationService.triggerWorkflow(workflowId, userId);
      res.json({ success: true, data: executed });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  // 5. Memory
  async listMemories(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id || 'anonymous';
      const memories = await agentMemoryService.listMemories(userId);
      res.json({ success: true, data: memories });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async storeMemory(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id || 'anonymous';
      const { memoryType, contextKey, content, importanceScore, agentId, metadata } = req.body;
      const memory = await agentMemoryService.storeMemory(
        userId,
        memoryType,
        contextKey,
        content,
        importanceScore,
        agentId,
        metadata
      );
      res.status(201).json({ success: true, data: memory });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async searchMemories(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id || 'anonymous';
      const query = (req.query.q as string) || '';
      const memories = await agentMemoryService.retrieveContext(userId, query);
      res.json({ success: true, data: memories });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async summarizeMemories(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id || 'anonymous';
      const summary = await agentMemoryService.summarizeMemories(userId);
      res.json({ success: true, data: summary });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  // 6. Autonomous Projects
  async listProjects(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id || 'anonymous';
      const projects = await projectExecutionService.listProjects(userId);
      res.json({ success: true, data: projects });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async createProject(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id || 'anonymous';
      const project = await projectExecutionService.generateProjectPlan(userId, req.body);
      res.status(201).json({ success: true, data: project });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async completeProjectObjective(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id || 'anonymous';
      const projectId = req.params.id;
      const weekNumber = Number(req.params.week);
      const updated = await projectExecutionService.completeWeeklyObjective(projectId, userId, weekNumber);
      res.json({ success: true, data: updated });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  // 7. Research Copilot
  async listResearchReports(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id || 'anonymous';
      const category = req.query.category as string | undefined;
      const reports = await researchCopilotService.listReports(userId, category);
      res.json({ success: true, data: reports });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async conductResearch(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id || 'anonymous';
      const report = await researchCopilotService.conductResearch(userId, req.body);
      res.status(201).json({ success: true, data: report });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  // 8. Knowledge Graph
  async getKnowledgeGraph(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id || 'anonymous';
      const graph = await knowledgeGraphService.getGraph(userId);
      res.json({ success: true, data: graph });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async extractAndLinkEntities(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id || 'anonymous';
      const { textContent } = req.body;
      const result = await knowledgeGraphService.extractAndLinkEntities(userId, textContent || '');
      res.json({ success: true, data: result });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async findSkillGaps(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id || 'anonymous';
      const targetRole = req.query.targetRole as string | undefined;
      const gaps = await knowledgeGraphService.findSkillGaps(userId, targetRole);
      res.json({ success: true, data: gaps });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  // 9. Document Intelligence
  async listDocuments(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id || 'anonymous';
      const docs = await documentIntelligenceService.listDocuments(userId);
      res.json({ success: true, data: docs });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async analyzeDocument(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id || 'anonymous';
      const doc = await documentIntelligenceService.analyzeDocument(userId, req.body);
      res.status(201).json({ success: true, data: doc });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  // 10. Executive Decisions
  async listDecisions(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id || 'anonymous';
      const decisions = await executiveDecisionEngineService.listDecisions(userId);
      res.json({ success: true, data: decisions });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  async evaluateDecision(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id || 'anonymous';
      const decision = await executiveDecisionEngineService.evaluateDecision(userId, req.body);
      res.status(201).json({ success: true, data: decision });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  // 11. Productivity Analytics
  async getProductivityAnalytics(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id || 'anonymous';
      const timeframe = (req.query.timeframe as string) || 'weekly';
      const analytics = await productivityAnalyticsService.getLatestAnalytics(userId, timeframe);
      res.json({ success: true, data: analytics });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
}

export const agenticWorkspaceController = new AgenticWorkspaceController();
