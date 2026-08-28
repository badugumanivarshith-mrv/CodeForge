import { test, describe } from 'node:test';
import assert from 'node:assert';
import { agenticWorkspaceRepository } from '../../src/repositories/AgenticWorkspaceRepository';
import { UserRepository } from '../../src/repositories/UserRepository';
import {
  AgentType,
  AgentStatus,
  WorkflowTriggerType,
  MemoryType,
  KnowledgeNodeType,
} from '@codeforge/shared';

describe('Agentic Workspace Security & Multi-Tenant Governance Tests', () => {
  const userRepo = new UserRepository();
  let userAId: string;
  let userBId: string;
  let userAAgentId: string;
  let userATaskId: string;
  let userAWorkflowId: string;
  let userAMemoryId: string;
  let userAProjectId: string;
  let userAReportId: string;
  let userANodeId: string;

  test('1. Setup: Create separate User A and User B with isolated entities', async () => {
    const { user: userA } = await userRepo.create({
      email: `security_usera_${Date.now()}@codeforge.io`,
      username: `user_a_${Date.now()}`,
      passwordHash: 'hash_a',
    });
    userAId = userA.id;

    const { user: userB } = await userRepo.create({
      email: `security_userb_${Date.now()}@codeforge.io`,
      username: `user_b_${Date.now()}`,
      passwordHash: 'hash_b',
    });
    userBId = userB.id;

    // Create User A private agent
    const agentA = await agenticWorkspaceRepository.createAgent(userAId, {
      name: 'User A Private Coding Agent',
      type: AgentType.CODING_AGENT,
      systemPrompt: 'Private proprietary instructions',
    });
    userAAgentId = agentA.id;

    // Create User A task
    const taskA = await agenticWorkspaceRepository.createTask(userAId, {
      agentId: userAAgentId,
      title: 'Private User A Task',
    });
    userATaskId = taskA.id;

    // Create User A workflow
    const wfA = await agenticWorkspaceRepository.createWorkflow(userAId, {
      title: 'User A Confidential Pipeline',
      description: 'Private cron',
      triggerType: WorkflowTriggerType.SCHEDULED_CRON,
    });
    userAWorkflowId = wfA.id;

    // Create User A memory
    const memA = await agenticWorkspaceRepository.createMemory(userAId, {
      memoryType: MemoryType.CAREER,
      contextKey: 'Confidential Salary Data',
      content: 'Targeting $280k offer at Stripe',
      importanceScore: 99,
    });
    userAMemoryId = memA.id;

    // Create User A project
    const projA = await agenticWorkspaceRepository.createProject(userAId, {
      title: 'User A Secret Startup Codebase',
      goal: 'Launch Stealth Product',
    });
    userAProjectId = projA.id;

    // Create User A research report
    const repA = await agenticWorkspaceRepository.createResearchReport(userAId, {
      topic: 'Proprietary Zero-Knowledge Algorithm',
      category: 'SECURITY',
      executiveSummary: 'Secret zk-SNARK research',
      reportContent: 'Classified details',
      swotAnalysis: { strengths: [], weaknesses: [], opportunities: [], threats: [] },
      opportunityMatrix: [],
      keyTrends: [],
      recommendations: [],
      sources: [],
    });
    userAReportId = repA.id;

    // Create User A knowledge node
    const nodeA = await agenticWorkspaceRepository.createNode(userAId, {
      name: 'User A Secret Intellectual Property',
      nodeType: KnowledgeNodeType.CONCEPT,
    });
    userANodeId = nodeA.id;

    assert.ok(userAId);
    assert.ok(userBId);
  });

  test('2. User B cannot view or list agents belonging to User A', async () => {
    const directFetch = await agenticWorkspaceRepository.getAgentById(userAAgentId, userBId);
    assert.strictEqual(directFetch, null);

    const userBAgents = await agenticWorkspaceRepository.listAgents(userBId);
    const hasAgentA = userBAgents.some(a => a.id === userAAgentId);
    assert.strictEqual(hasAgentA, false);
  });

  test('3. User B cannot execute, read, or modify tasks belonging to User A', async () => {
    const directFetch = await agenticWorkspaceRepository.getTaskById(userATaskId, userBId);
    assert.strictEqual(directFetch, null);

    const maliciousUpdate = await agenticWorkspaceRepository.updateTask(userATaskId, userBId, {
      title: 'Hacked by User B',
      status: AgentStatus.COMPLETED,
    });
    assert.strictEqual(maliciousUpdate, null);

    const taskAOriginal = await agenticWorkspaceRepository.getTaskById(userATaskId, userAId);
    assert.strictEqual(taskAOriginal?.title, 'Private User A Task');
  });

  test('4. User B cannot trigger, read, or update workflows belonging to User A', async () => {
    const directFetch = await agenticWorkspaceRepository.getWorkflowById(userAWorkflowId, userBId);
    assert.strictEqual(directFetch, null);

    const maliciousUpdate = await agenticWorkspaceRepository.updateWorkflow(userAWorkflowId, userBId, {
      title: 'Corrupted Pipeline',
    });
    assert.strictEqual(maliciousUpdate, null);
  });

  test('5. User B cannot read or search memories stored by User A', async () => {
    const searchResult = await agenticWorkspaceRepository.searchMemories(userBId, 'Stripe');
    assert.strictEqual(searchResult.length, 0);

    const listResult = await agenticWorkspaceRepository.listMemories(userBId);
    const hasUserAMemory = listResult.some(m => m.id === userAMemoryId);
    assert.strictEqual(hasUserAMemory, false);
  });

  test('6. User B cannot read or modify autonomous projects owned by User A', async () => {
    const directFetch = await agenticWorkspaceRepository.getProjectById(userAProjectId, userBId);
    assert.strictEqual(directFetch, null);

    const maliciousUpdate = await agenticWorkspaceRepository.updateProject(userAProjectId, userBId, {
      title: 'Stolen Startup',
    });
    assert.strictEqual(maliciousUpdate, null);
  });

  test('7. User B cannot view research reports or delete knowledge graph nodes owned by User A', async () => {
    const directReport = await agenticWorkspaceRepository.getResearchReportById(userAReportId, userBId);
    assert.strictEqual(directReport, null);

    const maliciousDelete = await agenticWorkspaceRepository.deleteNode(userANodeId, userBId);
    assert.strictEqual(maliciousDelete, false);

    const nodeAOriginal = await agenticWorkspaceRepository.listNodes(userAId);
    const nodeAExists = nodeAOriginal.some(n => n.id === userANodeId);
    assert.strictEqual(nodeAExists, true);
  });
});
