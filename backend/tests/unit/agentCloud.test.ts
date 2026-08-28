import { test, describe } from 'node:test';
import assert from 'node:assert';
import { AgentCloudService } from '../../src/modules/agent-cloud/agentCloudService';
import { AgentCloudState, WorkforceAgentRole } from '@codeforge/shared';

describe('Persistent AI Agent Cloud Unit Tests', () => {
  const createMockRepo = () => {
    const agents = new Map<string, any>();
    const runs = new Map<string, any[]>();
    const tasks = new Map<string, any[]>();
    const schedules = new Map<string, any[]>();

    return {
      agents,
      runs,
      tasks,
      schedules,
      async createAgentInstance(userId: string, data: any) {
        const agent = {
          id: `agent_${Date.now()}_${Math.random()}`,
          userId,
          name: data.name,
          slug: data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          description: data.description,
          role: data.role,
          state: AgentCloudState.CREATED,
          systemPrompt: data.systemPrompt,
          capabilities: data.capabilities || [],
          assignedTools: data.assignedTools || [],
          isAlwaysOn: data.isAlwaysOn ?? false,
          scheduleCron: data.scheduleCron || null,
          config: data.config || {},
          errorCount: 0,
          totalRuns: 0,
          lastHeartbeatAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        agents.set(agent.id, agent);
        return agent;
      },
      async getAgentInstanceById(id: string, userId?: string) {
        return agents.get(id) || null;
      },
      async listAgentInstances(userId: string, role?: WorkforceAgentRole, state?: AgentCloudState) {
        let list = Array.from(agents.values()).filter(a => a.userId === userId);
        if (role) list = list.filter(a => a.role === role);
        if (state) list = list.filter(a => a.state === state);
        return list;
      },
      async updateAgentInstanceState(id: string, userId: string, state: AgentCloudState) {
        const a = agents.get(id);
        if (!a) return null;
        a.state = state;
        a.updatedAt = new Date().toISOString();
        return a;
      },
      async updateAgentHeartbeat(id: string, userId: string) {
        const a = agents.get(id);
        if (a) a.lastHeartbeatAt = new Date().toISOString();
      },
      async deleteAgentInstance(id: string, userId: string) {
        return agents.delete(id);
      },
      async createAgentRun(agentId: string, userId: string, inputPayload: any) {
        const run = {
          id: `run_${Date.now()}_${Math.random()}`,
          agentId,
          userId,
          state: AgentCloudState.RUNNING,
          inputPayload,
          outputPayload: null,
          executionTimeMs: 0,
          tokensConsumed: 0,
          startedAt: new Date().toISOString(),
          completedAt: null,
        };
        const list = runs.get(agentId) || [];
        list.push(run);
        runs.set(agentId, list);
        const a = agents.get(agentId);
        if (a) a.totalRuns += 1;
        return run;
      },
      async completeAgentRun(runId: string, outputPayload: any, executionTimeMs: number, tokensConsumed: number) {
        for (const list of runs.values()) {
          const r = list.find(item => item.id === runId);
          if (r) {
            r.state = AgentCloudState.COMPLETED;
            r.outputPayload = outputPayload;
            r.executionTimeMs = executionTimeMs;
            r.tokensConsumed = tokensConsumed;
            r.completedAt = new Date().toISOString();
            return r;
          }
        }
        return null;
      },
      async listAgentRuns(agentId: string, userId: string) {
        return runs.get(agentId) || [];
      },
      async createAgentTask(agentId: string, userId: string, data: any) {
        const task = {
          id: `task_${Date.now()}`,
          agentId,
          userId,
          title: data.title,
          status: 'todo',
          payload: data.payload,
          deadline: data.deadline || null,
          createdAt: new Date().toISOString(),
        };
        const list = tasks.get(agentId) || [];
        list.push(task);
        tasks.set(agentId, list);
        return task;
      },
      async updateAgentTaskStatus(taskId: string, userId: string, status: any, result?: any) {
        for (const list of tasks.values()) {
          const t = list.find(item => item.id === taskId);
          if (t) {
            t.status = status;
            t.result = result;
            return t;
          }
        }
        return null;
      },
      async listAgentTasks(agentId: string, userId: string) {
        return tasks.get(agentId) || [];
      },
      async createAgentSchedule(agentId: string, userId: string, cronExpression: string) {
        const sched = {
          id: `sched_${Date.now()}`,
          agentId,
          userId,
          cronExpression,
          isActive: true,
          createdAt: new Date().toISOString(),
        };
        const list = schedules.get(agentId) || [];
        list.push(sched);
        schedules.set(agentId, list);
        return sched;
      },
      async listAgentSchedules(agentId: string, userId: string) {
        return schedules.get(agentId) || [];
      },
    };
  };

  test('1. should create, start, pause, and terminate an autonomous agent instance', async () => {
    const mockRepo = createMockRepo();
    const service = new AgentCloudService(mockRepo as any);

    const agent = await service.createAgent('user-1', {
      name: 'Atlas Sentinel',
      description: 'Persistent cloud sentinel for multi-agent workflows',
      role: WorkforceAgentRole.EXECUTIVE_AGENT,
      systemPrompt: 'You are Atlas Sentinel. Direct and orchestrate tasks.',
      capabilities: ['Reasoning', 'Tool Execution'],
      assignedTools: ['code_sandbox_execute'],
      isAlwaysOn: true,
    });

    assert.strictEqual(agent.name, 'Atlas Sentinel');
    assert.strictEqual(agent.state, AgentCloudState.CREATED);
    assert.strictEqual(agent.role, WorkforceAgentRole.EXECUTIVE_AGENT);

    const running = await service.startAgent(agent.id, 'user-1');
    assert.strictEqual(running.state, AgentCloudState.RUNNING);

    const paused = await service.pauseAgent(agent.id, 'user-1');
    assert.strictEqual(paused.state, AgentCloudState.PAUSED);

    const terminated = await service.terminateAgent(agent.id, 'user-1');
    assert.strictEqual(terminated.state, AgentCloudState.TERMINATED);
  });

  test('2. should execute autonomous agent run and track telemetry tokens and output', async () => {
    const mockRepo = createMockRepo();
    const service = new AgentCloudService(mockRepo as any);

    const agent = await service.createAgent('user-1', {
      name: 'Orion Researcher',
      description: 'Autonomous literature and repo synthesis agent',
      role: WorkforceAgentRole.RESEARCH_AGENT,
      systemPrompt: 'You are Orion Researcher.',
    });

    const run = await service.runAgent(agent.id, 'user-1', { query: 'Distributed Consensus algorithms' });
    assert.ok(run.id);
    assert.strictEqual(run.state, AgentCloudState.COMPLETED);
    assert.ok(run.outputPayload);
    assert.ok(run.tokensConsumed > 0);
  });

  test('3. should calculate agent health and uptime status metrics', async () => {
    const mockRepo = createMockRepo();
    const service = new AgentCloudService(mockRepo as any);

    const agent = await service.createAgent('user-1', {
      name: 'Aegis Sentinel',
      description: 'High reliability agent',
      role: WorkforceAgentRole.CAREER_AGENT,
      systemPrompt: 'You are Aegis.',
    });

    await service.runAgent(agent.id, 'user-1', { ping: true });
    const health = await service.getHealthStatus(agent.id, 'user-1');

    assert.strictEqual(health.agentId, agent.id);
    assert.strictEqual(health.name, 'Aegis Sentinel');
    assert.strictEqual(health.isHealthy, true);
    assert.strictEqual(health.errorRate, 0);
  });

  test('4. should filter agent instances by role and state', async () => {
    const mockRepo = createMockRepo();
    const service = new AgentCloudService(mockRepo as any);

    await service.createAgent('user-1', { name: 'Recruiter 1', role: WorkforceAgentRole.RECRUITER_AGENT, systemPrompt: 'p' });
    await service.createAgent('user-1', { name: 'Faculty 1', role: WorkforceAgentRole.FACULTY_AGENT, systemPrompt: 'p' });

    const recruiters = await service.listAgents('user-1', WorkforceAgentRole.RECRUITER_AGENT);
    assert.strictEqual(recruiters.length, 1);
    assert.strictEqual(recruiters[0].name, 'Recruiter 1');
  });

  test('5. should schedule recurring cron execution for persistent agent', async () => {
    const mockRepo = createMockRepo();
    const service = new AgentCloudService(mockRepo as any);

    const agent = await service.createAgent('user-1', { name: 'Cron Worker', role: WorkforceAgentRole.ANALYTICS_AGENT, systemPrompt: 'p' });
    const sched = await service.createSchedule(agent.id, 'user-1', '0 */4 * * *');

    assert.ok(sched.id);
    assert.strictEqual(sched.cronExpression, '0 */4 * * *');

    const schedules = await service.listSchedules(agent.id, 'user-1');
    assert.strictEqual(schedules.length, 1);
  });

  test('6. should enqueue and process agent cloud tasks', async () => {
    const mockRepo = createMockRepo();
    const service = new AgentCloudService(mockRepo as any);

    const agent = await service.createAgent('user-1', { name: 'Task Agent', role: WorkforceAgentRole.PROJECT_MANAGER_AGENT, systemPrompt: 'p' });
    const task = await service.queueTask(agent.id, 'user-1', { title: 'Sync team repos', payload: { branch: 'main' } });

    assert.ok(task.id);
    assert.strictEqual(task.title, 'Sync team repos');

    const tasks = await service.listTasks(agent.id, 'user-1');
    assert.strictEqual(tasks.length, 1);
  });

  test('7. should delete agent instance cleanly and isolate per user', async () => {
    const mockRepo = createMockRepo();
    const service = new AgentCloudService(mockRepo as any);

    const agent = await service.createAgent('user-1', { name: 'Temp Agent', role: WorkforceAgentRole.CAREER_AGENT, systemPrompt: 'p' });
    const deleted = await service.deleteAgent(agent.id, 'user-1');
    assert.strictEqual(deleted, true);

    const check = await service.getAgent(agent.id, 'user-1');
    assert.strictEqual(check, null);
  });
});
