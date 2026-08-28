import { test, describe } from 'node:test';
import assert from 'node:assert';
import { agenticWorkspaceRepository } from '../../src/repositories/AgenticWorkspaceRepository';
import { UserRepository } from '../../src/repositories/UserRepository';
import {
  AgentType,
  AgentStatus,
  AgentTaskPriority,
  WorkflowTriggerType,
  WorkflowStatus,
  MemoryType,
  KnowledgeNodeType,
  KnowledgeRelationType,
  DocumentType,
  DecisionType,
} from '@codeforge/shared';

describe('Agentic Workspace Integration Tests (PostgreSQL & Database Layer)', () => {
  const userRepo = new UserRepository();
  let testUserId: string;
  let testAgentId: string;
  let testProjectId: string;

  test('1. Setup: Create test user and initialize Agent Fleet in PostgreSQL', async () => {
    const { user } = await userRepo.create({
      email: `agentic_test_${Date.now()}@codeforge.io`,
      username: `agentic_user_${Date.now()}`,
      passwordHash: 'hashed_pw_test',
    });
    testUserId = user.id;

    const agent = await agenticWorkspaceRepository.createAgent(testUserId, {
      name: 'Autonomous Systems Coding Agent',
      type: AgentType.CODING_AGENT,
      systemPrompt: 'High performance systems coding agent',
      capabilities: ['Rust', 'Raft', 'eBPF'],
    });

    testAgentId = agent.id;
    assert.ok(agent);
    assert.strictEqual(agent.userId, testUserId);
    assert.strictEqual(agent.type, AgentType.CODING_AGENT);
    assert.strictEqual(agent.status, AgentStatus.IDLE);
  });

  test('2. Agent Tasks: createTask, updateTask, and listTasks from DB', async () => {
    const task = await agenticWorkspaceRepository.createTask(testUserId, {
      agentId: testAgentId,
      title: 'Run Valgrind Leak Check on Distributed WAL',
      description: 'Check for unclosed file descriptors',
      priority: AgentTaskPriority.HIGH,
      toolsUsed: ['valgrind', 'file_auditor'],
    });

    assert.ok(task.id);
    assert.strictEqual(task.status, AgentStatus.PLANNING);

    const updated = await agenticWorkspaceRepository.updateTask(task.id, testUserId, {
      status: AgentStatus.COMPLETED,
      outputResult: { verdict: 'PASSED', leaks: 0 },
      executionTimeMs: 120,
      completedAt: new Date().toISOString(),
    });

    assert.ok(updated);
    assert.strictEqual(updated?.status, AgentStatus.COMPLETED);

    const tasksList = await agenticWorkspaceRepository.listTasks(testUserId);
    assert.ok(tasksList.length >= 1);
  });

  test('3. Agent Workflows: createWorkflow, updateWorkflow, and query status from DB', async () => {
    const wf = await agenticWorkspaceRepository.createWorkflow(testUserId, {
      title: 'Integration Test Workflow',
      description: 'Chains coding agent and executive analytics',
      triggerType: WorkflowTriggerType.SCHEDULED_CRON,
      scheduleCron: '0 9 * * 1',
      steps: [
        {
          stepId: 'step-1',
          stepNumber: 1,
          agentType: AgentType.CODING_AGENT,
          action: 'Execute Unit Suite',
          inputTemplate: 'Run test harness',
          dependencies: [],
        },
      ],
    });

    assert.ok(wf.id);
    assert.strictEqual(wf.title, 'Integration Test Workflow');

    const updated = await agenticWorkspaceRepository.updateWorkflow(wf.id, testUserId, {
      status: WorkflowStatus.COMPLETED,
    });

    assert.strictEqual(updated?.status, WorkflowStatus.COMPLETED);
  });

  test('4. Agent Memory: storeMemory, searchMemories, and listMemories from DB', async () => {
    const mem = await agenticWorkspaceRepository.createMemory(testUserId, {
      agentId: testAgentId,
      memoryType: MemoryType.LONG_TERM,
      contextKey: 'Raft State Machine',
      content: 'Mastered linearizable read index verification in Rust',
      importanceScore: 92,
      metadata: { complexity: 'Advanced' },
    });

    assert.ok(mem.id);
    assert.strictEqual(mem.importanceScore, 92);

    const search = await agenticWorkspaceRepository.searchMemories(testUserId, 'linearizable');
    assert.ok(search.length >= 1);
    assert.ok(search[0].content.includes('linearizable'));
  });

  test('5. Autonomous Projects: createProject, updateProject progress %, and list from DB', async () => {
    const project = await agenticWorkspaceRepository.createProject(testUserId, {
      title: 'Distributed File Engine',
      description: 'LSM-Tree storage engine with WAL',
      goal: 'Achieve 150MB/s sustained write throughput',
      roadmap: [
        { phase: 'Phase 1: Architecture', estimatedWeeks: 2, milestones: ['RFC Draft'], dependencies: [] },
      ],
      sprintPlan: [
        { sprintNumber: 1, name: 'Sprint 1', startDate: new Date().toISOString(), endDate: new Date().toISOString(), deliverables: ['RFC'], status: 'in_progress' },
      ],
      weeklyObjectives: [
        { weekNumber: 1, objective: 'Draft RFC', keyResults: ['Approved'], completed: false },
      ],
      resourceAllocation: { recommendedHoursPerWeek: 15, primaryTools: ['Rust'], suggestedLibraries: ['Tokio'] },
      riskFactors: ['Disk I/O latency bottleneck'],
    });

    testProjectId = project.id;
    assert.ok(project.id);
    assert.strictEqual(project.progressPercentage, 0);

    const updated = await agenticWorkspaceRepository.updateProject(testProjectId, testUserId, {
      progressPercentage: 100,
      status: 'completed',
    });

    assert.strictEqual(updated?.progressPercentage, 100);
    assert.strictEqual(updated?.status, 'completed');
  });

  test('6. Research Copilot: createResearchReport and verify SWOT & opportunity matrix persistence in DB', async () => {
    const report = await agenticWorkspaceRepository.createResearchReport(testUserId, {
      topic: 'Vector Database Indexing Algorithms',
      category: 'AI_ML',
      executiveSummary: 'Hierarchical Navigable Small World (HNSW) vs IVF-PQ indexing tradeoffs.',
      reportContent: '# Vector Indexing Report...',
      swotAnalysis: {
        strengths: ['Sub-millisecond nearest neighbor search'],
        weaknesses: ['High memory footprint for raw vector graphs'],
        opportunities: ['Quantization algorithms reducing RAM by 75%'],
        threats: ['Memory fragmentation under high insert velocities'],
      },
      opportunityMatrix: [
        { opportunity: 'Adopt Product Quantization', impactScore: 90, feasibilityScore: 85, recommendation: 'Deploy IVF-PQ' },
      ],
      keyTrends: ['Shift towards disk-backed graph indexes (DiskANN)'],
      recommendations: ['Benchmark recall@10 with synthetic datasets'],
      sources: [
        { title: 'ACM Proceedings on Vector Search', url: 'https://acm.org/vector', credibilityScore: 96 },
      ],
    });

    assert.ok(report.id);
    assert.strictEqual(report.category, 'AI_ML');
    assert.ok(report.swotAnalysis.strengths.length > 0);
  });

  test('7. Knowledge Graph: createNode, createEdge, and getKnowledgeGraph with density calculation from DB', async () => {
    const nodeA = await agenticWorkspaceRepository.createNode(testUserId, {
      name: 'Raft Consensus',
      nodeType: KnowledgeNodeType.CONCEPT,
      category: 'Distributed Systems',
      properties: {},
      confidenceScore: 95,
    });

    const nodeB = await agenticWorkspaceRepository.createNode(testUserId, {
      name: 'Distributed Systems Architect',
      nodeType: KnowledgeNodeType.ROLE,
      category: 'Career Target',
      properties: {},
      confidenceScore: 98,
    });

    const edge = await agenticWorkspaceRepository.createEdge(testUserId, {
      sourceNodeId: nodeA.id,
      targetNodeId: nodeB.id,
      relationType: KnowledgeRelationType.HIRED_FOR,
      weight: 0.95,
      metadata: {},
    });

    assert.ok(edge.id);

    const graph = await agenticWorkspaceRepository.getKnowledgeGraph(testUserId);
    assert.ok(graph.nodes.length >= 2);
    assert.ok(graph.edges.length >= 1);
    assert.ok(graph.stats.density >= 0);
  });

  test('8. Document Intelligence & Decisions: createDocument, createDecision, and saveAnalytics in DB', async () => {
    const doc = await agenticWorkspaceRepository.createDocument(testUserId, {
      title: 'Distributed System Design Notes',
      documentType: DocumentType.INTERVIEW_NOTES,
      summary: 'Architecture summary',
      extractedSkills: ['Distributed Locking', 'Consistent Hashing'],
      extractedActions: ['Add virtual nodes to ring buffer'],
      flashcards: [{ question: 'What is consistent hashing?', answer: 'Minimizes remapping on node add/remove', tag: 'System Design' }],
      keyFindings: ['Eliminates hot shards'],
      metadata: {},
    });
    assert.ok(doc.id);

    const dec = await agenticWorkspaceRepository.createDecision(testUserId, {
      decisionType: DecisionType.CAREER_TRANSITION,
      title: 'Choose between Tech Lead vs Staff IC Path',
      contextData: {},
      optionsEvaluated: [
        { optionId: 'opt-1', title: 'Staff IC Path', pros: ['Deep tech'], cons: ['High RFC burden'], alignmentScore: 92, projectedOutcome: 'Staff Lead' },
      ],
      recommendedAction: 'Execute Staff IC Path',
      riskScore: 20,
      confidenceScore: 90,
      expectedOutcomes: ['Higher technical authority'],
    });
    assert.ok(dec.id);

    const analytics = await agenticWorkspaceRepository.saveAnalytics(testUserId, {
      timeframe: 'weekly',
      periodDate: '2026-08-28',
      focusMetrics: { focusScore: 88, deepWorkHours: 32, distractionScore: 12, peakProductivityHours: '09:00 - 13:00' },
      learningVelocity: 85,
      careerGrowthVelocity: 80,
      tasksCompleted: 12,
      agentEffectivenessScore: 94,
      agentBreakdown: [],
      recommendations: ['Maintain deep work streak'],
    });
    assert.ok(analytics.id);
  });
});
