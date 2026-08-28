import { test, describe } from 'node:test';
import assert from 'node:assert';
import { AgentOrchestratorService } from '../../src/modules/agents/agentOrchestratorService';
import { AgentType, AgentStatus, AgentTaskPriority } from '@codeforge/shared';

describe('Agent Orchestrator & Multi-Agent Engine Unit Tests', () => {
  const createMockRepo = () => {
    const agents = new Map<string, any>();
    const tasks = new Map<string, any>();

    return {
      agents,
      tasks,
      async createAgent(userId: string, data: any) {
        const agent = {
          id: `agent-${Date.now()}-${Math.random()}`,
          userId,
          name: data.name,
          type: data.type,
          status: AgentStatus.IDLE,
          capabilities: data.capabilities || [],
          systemPrompt: data.systemPrompt || '',
          configuration: data.configuration || {},
          stats: {
            tasksCompleted: 0,
            successRate: 100,
            avgExecutionTimeMs: 0,
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        agents.set(agent.id, agent);
        return agent;
      },
      async getAgentById(agentId: string, userId: string) {
        const a = agents.get(agentId);
        if (a && a.userId === userId) return a;
        return null;
      },
      async listAgents(userId: string, filterType?: AgentType) {
        let list = Array.from(agents.values()).filter(a => a.userId === userId);
        if (filterType) list = list.filter(a => a.type === filterType);
        return list;
      },
      async updateAgent(agentId: string, userId: string, data: any) {
        const a = agents.get(agentId);
        if (!a || a.userId !== userId) return null;
        const updated = { ...a, ...data, updatedAt: new Date().toISOString() };
        agents.set(agentId, updated);
        return updated;
      },
      async createTask(userId: string, data: any) {
        const task = {
          id: `task-${Date.now()}-${Math.random()}`,
          userId,
          agentId: data.agentId,
          title: data.title,
          description: data.description,
          priority: data.priority || AgentTaskPriority.MEDIUM,
          status: AgentStatus.PLANNING,
          inputPayload: data.inputPayload || {},
          outputResult: null,
          dependencies: data.dependencies || [],
          toolsUsed: data.toolsUsed || [],
          executionTimeMs: 0,
          createdAt: new Date().toISOString(),
          completedAt: null,
        };
        tasks.set(task.id, task);
        return task;
      },
      async getTaskById(taskId: string, userId: string) {
        const t = tasks.get(taskId);
        if (t && t.userId === userId) return t;
        return null;
      },
      async listTasks(userId: string, agentId?: string, status?: AgentStatus) {
        let list = Array.from(tasks.values()).filter(t => t.userId === userId);
        if (agentId) list = list.filter(t => t.agentId === agentId);
        if (status) list = list.filter(t => t.status === status);
        return list;
      },
      async updateTask(taskId: string, userId: string, data: any) {
        const t = tasks.get(taskId);
        if (!t || t.userId !== userId) return null;
        const updated = { ...t, ...data };
        tasks.set(taskId, updated);
        return updated;
      },
    };
  };

  test('1. initializes all 8 default autonomous agents with correct capabilities', async () => {
    const mockRepo = createMockRepo();
    const service = new AgentOrchestratorService(mockRepo as any);
    const agents = await service.initializeDefaultAgents('user-orch-1');

    assert.strictEqual(agents.length, 8);
    const types = agents.map(a => a.type);
    assert.ok(types.includes(AgentType.CAREER_AGENT));
    assert.ok(types.includes(AgentType.CODING_AGENT));
    assert.ok(types.includes(AgentType.RESEARCH_AGENT));
    assert.ok(types.includes(AgentType.LEARNING_AGENT));
    assert.ok(types.includes(AgentType.PLACEMENT_AGENT));
    assert.ok(types.includes(AgentType.INTERVIEW_AGENT));
    assert.ok(types.includes(AgentType.MENTOR_AGENT));
    assert.ok(types.includes(AgentType.EXECUTIVE_ANALYTICS_AGENT));
  });

  test('2. decomposes complex distributed systems goal into sequential subtasks', () => {
    const service = new AgentOrchestratorService(createMockRepo() as any);
    const steps = service.decomposeGoal('Implement Raft consensus state machine in Rust', AgentType.CODING_AGENT);

    assert.ok(steps.length >= 3);
    assert.ok(steps[0].title.includes('Consensus State Machine'));
    assert.ok(steps[1].priority === AgentTaskPriority.CRITICAL);
    assert.ok(steps[1].toolsUsed.includes('compiler_sandbox'));
  });

  test('3. creates an atomic task assigned to an agent', async () => {
    const mockRepo = createMockRepo();
    const service = new AgentOrchestratorService(mockRepo as any);
    const agents = await service.initializeDefaultAgents('user-orch-2');

    const codingAgent = agents.find(a => a.type === AgentType.CODING_AGENT)!;
    const task = await service.createTask('user-orch-2', {
      agentId: codingAgent.id,
      title: 'Run AddressSanitizer on C++ memory arena',
      description: 'Check for buffer overflow vulnerabilities',
      priority: AgentTaskPriority.HIGH,
      toolsUsed: ['asan_runner', 'clang_tidy'],
    });

    assert.ok(task.id);
    assert.strictEqual(task.status, AgentStatus.PLANNING);
    assert.strictEqual(task.agentId, codingAgent.id);
    assert.strictEqual(task.priority, AgentTaskPriority.HIGH);
  });

  test('4. executes autonomous task and transitions status to COMPLETED', async () => {
    const mockRepo = createMockRepo();
    const service = new AgentOrchestratorService(mockRepo as any);
    const agents = await service.initializeDefaultAgents('user-orch-3');

    const codingAgent = agents.find(a => a.type === AgentType.CODING_AGENT)!;
    const task = await service.createTask('user-orch-3', {
      agentId: codingAgent.id,
      title: 'Benchmark SQLite WAL checkpoint throughput',
      priority: AgentTaskPriority.MEDIUM,
      toolsUsed: ['wal_benchmarker'],
    });

    const completed = await service.executeTask(task.id, 'user-orch-3');

    assert.strictEqual(completed.status, AgentStatus.COMPLETED);
    assert.ok(completed.completedAt !== null);
    assert.ok(completed.executionTimeMs > 0);
  });

  test('5. records execution output artifacts and metrics on task completion', async () => {
    const mockRepo = createMockRepo();
    const service = new AgentOrchestratorService(mockRepo as any);
    const agents = await service.initializeDefaultAgents('user-orch-4');

    const task = await service.createTask('user-orch-4', {
      agentId: agents[0].id,
      title: 'Audit System Architecture RFC',
      toolsUsed: ['rfc_linter', 'memory_profiler'],
    });

    const completed = await service.executeTask(task.id, 'user-orch-4');
    assert.ok(completed.outputResult);
    assert.strictEqual((completed.outputResult as any).verdict, 'SUCCESS');
    assert.ok((completed.outputResult as any).artifactsGenerated.length >= 2);
  });

  test('6. updates agent status back to IDLE after task execution completes', async () => {
    const mockRepo = createMockRepo();
    const service = new AgentOrchestratorService(mockRepo as any);
    const agents = await service.initializeDefaultAgents('user-orch-5');

    const agent = agents[0];
    const task = await service.createTask('user-orch-5', {
      agentId: agent.id,
      title: 'Analyze P99 Latency Spikes in Redis Cluster',
    });

    await service.executeTask(task.id, 'user-orch-5');
    const updatedAgent = await mockRepo.getAgentById(agent.id, 'user-orch-5');
    assert.strictEqual(updatedAgent?.status, AgentStatus.IDLE);
  });

  test('7. dispatches multi-agent communication message and receives delivery confirmation', () => {
    const service = new AgentOrchestratorService(createMockRepo() as any);
    const result = service.dispatchAgentMessage(
      AgentType.CAREER_AGENT,
      AgentType.CODING_AGENT,
      'Execute code verification loop for Promotion Milestone #3'
    );

    assert.ok(result.messageId);
    assert.strictEqual(result.from, AgentType.CAREER_AGENT);
    assert.strictEqual(result.to, AgentType.CODING_AGENT);
    assert.strictEqual(result.delivered, true);
    assert.ok(result.responsePayload);
  });

  test('8. filters agents by agent type correctly', async () => {
    const mockRepo = createMockRepo();
    const service = new AgentOrchestratorService(mockRepo as any);
    await service.initializeDefaultAgents('user-orch-6');

    const codingAgents = await service.listAgents('user-orch-6', AgentType.CODING_AGENT);
    assert.strictEqual(codingAgents.length, 1);
    assert.strictEqual(codingAgents[0].type, AgentType.CODING_AGENT);
  });
});
