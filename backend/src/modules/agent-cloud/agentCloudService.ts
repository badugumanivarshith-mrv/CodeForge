import { IAgentCloudRepository } from '../../repositories/interfaces/IAgentCloudRepository';
import {
  AgentInstanceDto,
  CreateAgentInstanceDto,
  AgentRunDto,
  AgentCloudTaskDto,
  AgentScheduleDto,
  AgentHealthStatusDto,
  AgentCloudState,
  WorkforceAgentRole,
} from '@codeforge/shared';

export class AgentCloudService {
  constructor(private readonly agentCloudRepo: IAgentCloudRepository) {}

  async createAgent(userId: string, data: CreateAgentInstanceDto, organizationId?: string | null): Promise<AgentInstanceDto> {
    if (!data.name || !data.systemPrompt) {
      throw new Error('Agent name and system prompt are required');
    }
    return this.agentCloudRepo.createAgentInstance(userId, data, organizationId);
  }

  async getAgent(id: string, userId?: string): Promise<AgentInstanceDto | null> {
    return this.agentCloudRepo.getAgentInstanceById(id, userId);
  }

  async listAgents(userId: string, role?: WorkforceAgentRole, state?: AgentCloudState): Promise<AgentInstanceDto[]> {
    return this.agentCloudRepo.listAgentInstances(userId, role, state);
  }

  async startAgent(id: string, userId: string): Promise<AgentInstanceDto> {
    const agent = await this.agentCloudRepo.getAgentInstanceById(id, userId);
    if (!agent) throw new Error('Agent instance not found');

    const updated = await this.agentCloudRepo.updateAgentInstanceState(id, userId, AgentCloudState.RUNNING);
    if (!updated) throw new Error('Failed to transition agent to RUNNING');
    return updated;
  }

  async pauseAgent(id: string, userId: string): Promise<AgentInstanceDto> {
    const agent = await this.agentCloudRepo.getAgentInstanceById(id, userId);
    if (!agent) throw new Error('Agent instance not found');

    const updated = await this.agentCloudRepo.updateAgentInstanceState(id, userId, AgentCloudState.PAUSED);
    if (!updated) throw new Error('Failed to transition agent to PAUSED');
    return updated;
  }

  async terminateAgent(id: string, userId: string): Promise<AgentInstanceDto> {
    const agent = await this.agentCloudRepo.getAgentInstanceById(id, userId);
    if (!agent) throw new Error('Agent instance not found');

    const updated = await this.agentCloudRepo.updateAgentInstanceState(id, userId, AgentCloudState.TERMINATED);
    if (!updated) throw new Error('Failed to transition agent to TERMINATED');
    return updated;
  }

  async deleteAgent(id: string, userId: string): Promise<boolean> {
    return this.agentCloudRepo.deleteAgentInstance(id, userId);
  }

  async runAgent(id: string, userId: string, inputPayload: Record<string, any>): Promise<AgentRunDto> {
    const agent = await this.agentCloudRepo.getAgentInstanceById(id, userId);
    if (!agent) throw new Error('Agent instance not found');
    if (agent.state === AgentCloudState.TERMINATED) {
      throw new Error('Cannot execute a terminated agent');
    }

    const run = await this.agentCloudRepo.createAgentRun(id, userId, inputPayload);

    // Simulate agent autonomous reasoning execution
    const startTime = Date.now();
    const tokenEstimate = Math.floor(Math.random() * 350) + 150;
    const outputPayload = {
      result: `Agent [${agent.name}] executed task successfully.`,
      role: agent.role,
      insights: [
        'Analyzed incoming telemetry context',
        'Aligned with enterprise guidelines',
        'Generated deterministic response',
      ],
      processedAt: new Date().toISOString(),
      metadata: {
        inputKeys: Object.keys(inputPayload),
        toolsInvoked: agent.assignedTools,
      },
    };

    const duration = Date.now() - startTime + 45;
    const completed = await this.agentCloudRepo.completeAgentRun(run.id, outputPayload, duration, tokenEstimate);
    return completed || run;
  }

  async listRuns(agentId: string, userId: string): Promise<AgentRunDto[]> {
    return this.agentCloudRepo.listAgentRuns(agentId, userId);
  }

  async queueTask(agentId: string, userId: string, data: { title: string; priority?: any; payload: Record<string, any>; deadline?: string | null }): Promise<AgentCloudTaskDto> {
    const agent = await this.agentCloudRepo.getAgentInstanceById(agentId, userId);
    if (!agent) throw new Error('Agent instance not found');

    return this.agentCloudRepo.createAgentTask(agentId, userId, data);
  }

  async listTasks(agentId: string, userId: string): Promise<AgentCloudTaskDto[]> {
    return this.agentCloudRepo.listAgentTasks(agentId, userId);
  }

  async createSchedule(agentId: string, userId: string, cronExpression: string): Promise<AgentScheduleDto> {
    const agent = await this.agentCloudRepo.getAgentInstanceById(agentId, userId);
    if (!agent) throw new Error('Agent instance not found');

    return this.agentCloudRepo.createAgentSchedule(agentId, userId, cronExpression);
  }

  async listSchedules(agentId: string, userId: string): Promise<AgentScheduleDto[]> {
    return this.agentCloudRepo.listAgentSchedules(agentId, userId);
  }

  async getHealthStatus(agentId: string, userId: string): Promise<AgentHealthStatusDto> {
    const agent = await this.agentCloudRepo.getAgentInstanceById(agentId, userId);
    if (!agent) throw new Error('Agent instance not found');

    const runs = await this.agentCloudRepo.listAgentRuns(agentId, userId);
    const failedRuns = runs.filter(r => r.state === AgentCloudState.FAILED).length;
    const totalRuns = runs.length;
    const errorRate = totalRuns > 0 ? (failedRuns / totalRuns) * 100 : 0;
    const isHealthy = agent.state !== AgentCloudState.FAILED && agent.errorCount < 5 && errorRate <= 25;

    return {
      agentId: agent.id,
      name: agent.name,
      state: agent.state,
      isHealthy,
      uptimeSeconds: 86400,
      lastHeartbeat: agent.lastHeartbeatAt || new Date().toISOString(),
      errorRate: Math.round(errorRate * 100) / 100,
      activeRuns: runs.filter(r => r.state === AgentCloudState.RUNNING).length,
    };
  }

  async recoverFailedAgents(userId: string): Promise<{ recoveredCount: number }> {
    const agents = await this.agentCloudRepo.listAgentInstances(userId, undefined, AgentCloudState.FAILED);
    let recoveredCount = 0;
    for (const agent of agents) {
      if (agent.isAlwaysOn) {
        await this.agentCloudRepo.updateAgentInstanceState(agent.id, userId, AgentCloudState.RUNNING);
        recoveredCount++;
      }
    }
    return { recoveredCount };
  }
}
