import { Router } from 'express';
import { agenticWorkspaceController } from '../../controllers/agenticWorkspace.controller';
import { authGuard } from '../../middleware/authMiddleware';

export const agenticWorkspaceRouter = Router();

// 1. Command Center Overview
agenticWorkspaceRouter.get('/overview', authGuard, (req, res) => agenticWorkspaceController.getCommandCenterOverview(req, res));

// 2. Agents
agenticWorkspaceRouter.get('/agents', authGuard, (req, res) => agenticWorkspaceController.listAgents(req, res));
agenticWorkspaceRouter.post('/agents/decompose', authGuard, (req, res) => agenticWorkspaceController.decomposeGoal(req, res));
agenticWorkspaceRouter.post('/agents/dispatch', authGuard, (req, res) => agenticWorkspaceController.dispatchAgentMessage(req, res));

// 3. Tasks
agenticWorkspaceRouter.get('/tasks', authGuard, (req, res) => agenticWorkspaceController.listTasks(req, res));
agenticWorkspaceRouter.post('/tasks', authGuard, (req, res) => agenticWorkspaceController.createTask(req, res));
agenticWorkspaceRouter.get('/tasks/:id', authGuard, (req, res) => agenticWorkspaceController.getTask(req, res));
agenticWorkspaceRouter.post('/tasks/:id/execute', authGuard, (req, res) => agenticWorkspaceController.executeTask(req, res));

// 4. Workflows
agenticWorkspaceRouter.get('/workflows', authGuard, (req, res) => agenticWorkspaceController.listWorkflows(req, res));
agenticWorkspaceRouter.post('/workflows', authGuard, (req, res) => agenticWorkspaceController.createWorkflow(req, res));
agenticWorkspaceRouter.post('/workflows/:id/trigger', authGuard, (req, res) => agenticWorkspaceController.triggerWorkflow(req, res));

// 5. Memory
agenticWorkspaceRouter.get('/memories', authGuard, (req, res) => agenticWorkspaceController.listMemories(req, res));
agenticWorkspaceRouter.post('/memories', authGuard, (req, res) => agenticWorkspaceController.storeMemory(req, res));
agenticWorkspaceRouter.get('/memories/search', authGuard, (req, res) => agenticWorkspaceController.searchMemories(req, res));
agenticWorkspaceRouter.get('/memories/summary', authGuard, (req, res) => agenticWorkspaceController.summarizeMemories(req, res));

// 6. Autonomous Projects
agenticWorkspaceRouter.get('/projects', authGuard, (req, res) => agenticWorkspaceController.listProjects(req, res));
agenticWorkspaceRouter.post('/projects', authGuard, (req, res) => agenticWorkspaceController.createProject(req, res));
agenticWorkspaceRouter.post('/projects/:id/weeks/:week/complete', authGuard, (req, res) => agenticWorkspaceController.completeProjectObjective(req, res));

// 7. Research Copilot
agenticWorkspaceRouter.get('/research', authGuard, (req, res) => agenticWorkspaceController.listResearchReports(req, res));
agenticWorkspaceRouter.post('/research', authGuard, (req, res) => agenticWorkspaceController.conductResearch(req, res));

// 8. Knowledge Graph
agenticWorkspaceRouter.get('/knowledge-graph', authGuard, (req, res) => agenticWorkspaceController.getKnowledgeGraph(req, res));
agenticWorkspaceRouter.post('/knowledge-graph/extract', authGuard, (req, res) => agenticWorkspaceController.extractAndLinkEntities(req, res));
agenticWorkspaceRouter.get('/knowledge-graph/skill-gaps', authGuard, (req, res) => agenticWorkspaceController.findSkillGaps(req, res));

// 9. Document Intelligence
agenticWorkspaceRouter.get('/documents', authGuard, (req, res) => agenticWorkspaceController.listDocuments(req, res));
agenticWorkspaceRouter.post('/documents', authGuard, (req, res) => agenticWorkspaceController.analyzeDocument(req, res));

// 10. Executive Decisions
agenticWorkspaceRouter.get('/decisions', authGuard, (req, res) => agenticWorkspaceController.listDecisions(req, res));
agenticWorkspaceRouter.post('/decisions', authGuard, (req, res) => agenticWorkspaceController.evaluateDecision(req, res));

// 11. Productivity Analytics
agenticWorkspaceRouter.get('/analytics', authGuard, (req, res) => agenticWorkspaceController.getProductivityAnalytics(req, res));
