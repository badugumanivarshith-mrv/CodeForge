import { Router } from 'express';
import { AgentCloudController } from '../../controllers/agentCloud.controller';
import { authGuard } from '../../middleware/authMiddleware';

const router = Router();

// Module 1: Persistent Agent Cloud
router.post('/agents', authGuard, AgentCloudController.createAgent);
router.get('/agents', authGuard, AgentCloudController.listAgents);
router.get('/agents/:id', authGuard, AgentCloudController.getAgent);
router.post('/agents/:id/start', authGuard, AgentCloudController.startAgent);
router.post('/agents/:id/pause', authGuard, AgentCloudController.pauseAgent);
router.post('/agents/:id/terminate', authGuard, AgentCloudController.terminateAgent);
router.post('/agents/:id/run', authGuard, AgentCloudController.runAgent);
router.get('/agents/:id/health', authGuard, AgentCloudController.getHealthStatus);

// Module 2: Distributed Workflow Engine
router.post('/workflows', authGuard, AgentCloudController.createWorkflow);
router.get('/workflows', authGuard, AgentCloudController.listWorkflows);
router.post('/workflows/:id/execute', authGuard, AgentCloudController.executeWorkflow);
router.get('/workflows/runs/:runId', authGuard, AgentCloudController.getWorkflowRun);

// Module 3: Event Bus & Automation
router.post('/events/publish', authGuard, AgentCloudController.publishEvent);
router.get('/events', authGuard, AgentCloudController.listEvents);
router.post('/automation/rules', authGuard, AgentCloudController.createAutomationRule);
router.get('/automation/rules', authGuard, AgentCloudController.listAutomationRules);

// Module 4: Execution Fabric
router.get('/execution/tools', authGuard, AgentCloudController.listTools);
router.post('/execution/invoke', authGuard, AgentCloudController.invokeTool);
router.get('/execution/quota', authGuard, AgentCloudController.getQuota);

// Module 5: Organizational Workforces
router.get('/workforce/teams/:teamId/agents', authGuard, AgentCloudController.listTeamAgents);
router.get('/workforce/reports/:scopeId', authGuard, AgentCloudController.getWorkforceReport);

// Module 6: Task Operating System
router.post('/task-os/nodes', authGuard, AgentCloudController.createTaskNode);
router.get('/task-os/graph', authGuard, AgentCloudController.getTaskGraph);
router.get('/task-os/plan', authGuard, AgentCloudController.generateSmartPlan);

// Module 7: Memory Fabric 2.0
router.post('/memory', authGuard, AgentCloudController.storeMemory);
router.post('/memory/search', authGuard, AgentCloudController.searchMemory);

// Module 8: Knowledge Fabric
router.get('/knowledge/graph', authGuard, AgentCloudController.getKnowledgeGraph);
router.get('/knowledge/discover', authGuard, AgentCloudController.discoverConcepts);

// Module 9: AI Decision Center
router.post('/decisions', authGuard, AgentCloudController.createDecision);
router.get('/decisions', authGuard, AgentCloudController.listDecisions);
router.post('/decisions/:id/execute', authGuard, AgentCloudController.executeDecision);

// Module 10: Real-Time Collaboration
router.post('/collaboration/workspaces', authGuard, AgentCloudController.createWorkspace);
router.get('/collaboration/workspaces/:id', authGuard, AgentCloudController.getWorkspace);

// Module 11: Telemetry & Observability
router.get('/telemetry/dashboard', authGuard, AgentCloudController.getTelemetryDashboard);

// Module 12: Governance & Security
router.get('/governance/compliance', authGuard, AgentCloudController.getComplianceReport);
router.get('/governance/audit/:agentId', authGuard, AgentCloudController.getAuditLogs);

export default router;
