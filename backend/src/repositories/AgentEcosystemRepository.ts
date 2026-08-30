import { IAgentEcosystemRepository } from './interfaces/IAgentEcosystemRepository';
import {
  EcosystemAgentDto,
  CreateEcosystemAgentDto,
  EcosystemAgentTaskDto,
  CreateEcosystemAgentTaskDto,
  EcosystemAgentMemoryDto,
  CreateEcosystemAgentMemoryDto,
  AgentInteractionDto,
  CreateAgentInteractionDto,
  AgentOverviewDto,
  AgentMetricsDto,
  EcosystemAgentType,
  EcosystemAgentStatus,
  AgentTaskStatus,
} from '@codeforge/shared';

export class AgentEcosystemRepository implements IAgentEcosystemRepository {
  private agentsMap = new Map<string, EcosystemAgentDto>();
  private tasksMap = new Map<string, EcosystemAgentTaskDto>();
  private memoriesList: EcosystemAgentMemoryDto[] = [];
  private interactionsList: AgentInteractionDto[] = [];

  constructor() {
    this.seedDefaultData();
  }

  private seedDefaultData() {
    const agent1: EcosystemAgentDto = {
      id: 'agent-seed-1',
      creatorUserId: 'test-user-id',
      agentName: 'Cognitive Coprocessor Alpha',
      agentType: EcosystemAgentType.COGNITIVE_COPROCESSOR,
      status: EcosystemAgentStatus.ACTIVE,
      capabilities: ['AST Parsing', 'ZK Invariants Proving', 'Dialectic Optimization'],
      performanceMetrics: {
        successRate: 98.4,
        tasksCompleted: 145,
        averageResponseTimeMs: 120,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const agent2: EcosystemAgentDto = {
      id: 'agent-seed-2',
      creatorUserId: 'test-user-id',
      agentName: 'Swarm Coordinator Beta',
      agentType: EcosystemAgentType.COORDINATOR,
      status: EcosystemAgentStatus.ACTIVE,
      capabilities: ['Task Routing', 'Consensus Resolution', 'Workspace Orchestration'],
      performanceMetrics: {
        successRate: 95.2,
        tasksCompleted: 88,
        averageResponseTimeMs: 250,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.agentsMap.set(agent1.id, agent1);
    this.agentsMap.set(agent2.id, agent2);

    const task1: EcosystemAgentTaskDto = {
      id: 'task-seed-1',
      assignedAgentId: 'agent-seed-1',
      taskDescription: 'Parse AST and extract invariants for smart contract vulnerability assessment',
      status: AgentTaskStatus.SUCCESS,
      inputParams: { filePath: '/src/contracts/Vault.sol' },
      outputResult: { vulnerabilityScore: 12, criticalCVEsCount: 0 },
      createdAt: new Date(Date.now() - 3600 * 1000).toISOString(),
      completedAt: new Date().toISOString(),
    };

    this.tasksMap.set(task1.id, task1);

    const memory1: EcosystemAgentMemoryDto = {
      id: 'memory-seed-1',
      agentId: 'agent-seed-1',
      memoryKey: 'vault_contract_cve_profile',
      memoryValue: 'Smart contract Vault.sol shows no active overflow vectors in tests.',
      createdAt: new Date().toISOString(),
    };

    this.memoriesList.push(memory1);

    const interaction1: AgentInteractionDto = {
      id: 'inter-seed-1',
      sourceAgentId: 'agent-seed-2',
      targetAgentId: 'agent-seed-1',
      messageType: 'EXECUTE_PROOF',
      payload: { schemaId: 'vault-v1', checkType: 'overflow' },
      timestamp: new Date().toISOString(),
    };

    this.interactionsList.push(interaction1);
  }

  public async registerAgent(userId: string, dto: CreateEcosystemAgentDto): Promise<EcosystemAgentDto> {
    const agent: EcosystemAgentDto = {
      id: `agent-${Date.now()}`,
      creatorUserId: userId,
      agentName: dto.agentName,
      agentType: dto.agentType,
      status: EcosystemAgentStatus.ACTIVE,
      capabilities: dto.capabilities,
      performanceMetrics: {
        successRate: 100.0,
        tasksCompleted: 0,
        averageResponseTimeMs: 0,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.agentsMap.set(agent.id, agent);
    return agent;
  }

  public async listAgents(userId: string): Promise<EcosystemAgentDto[]> {
    return Array.from(this.agentsMap.values()).filter((a) => a.creatorUserId === userId);
  }

  public async getAgent(id: string): Promise<EcosystemAgentDto | null> {
    return this.agentsMap.get(id) || null;
  }

  public async updateAgentStatus(id: string, status: EcosystemAgentStatus): Promise<EcosystemAgentDto> {
    const agent = this.agentsMap.get(id);
    if (!agent) throw new Error(`Agent with ID ${id} not found.`);
    agent.status = status;
    agent.updatedAt = new Date().toISOString();
    this.agentsMap.set(id, agent);
    return agent;
  }

  public async createTask(userId: string, dto: CreateEcosystemAgentTaskDto): Promise<EcosystemAgentTaskDto> {
    const task: EcosystemAgentTaskDto = {
      id: `task-${Date.now()}`,
      assignedAgentId: dto.assignedAgentId,
      taskDescription: dto.taskDescription,
      status: AgentTaskStatus.PENDING,
      inputParams: dto.inputParams,
      createdAt: new Date().toISOString(),
    };
    this.tasksMap.set(task.id, task);

    // Update agent stats
    const agent = this.agentsMap.get(dto.assignedAgentId);
    if (agent) {
      agent.performanceMetrics.tasksCompleted += 1;
      agent.updatedAt = new Date().toISOString();
      this.agentsMap.set(agent.id, agent);
    }

    return task;
  }

  public async updateTaskStatus(
    id: string,
    status: AgentTaskStatus,
    result?: Record<string, any>,
    error?: string
  ): Promise<EcosystemAgentTaskDto> {
    const task = this.tasksMap.get(id);
    if (!task) throw new Error(`Task with ID ${id} not found.`);
    task.status = status;
    if (result) task.outputResult = result;
    if (error) task.errorSummary = error;
    task.completedAt = new Date().toISOString();
    this.tasksMap.set(id, task);
    return task;
  }

  public async listTasks(agentId: string): Promise<EcosystemAgentTaskDto[]> {
    return Array.from(this.tasksMap.values()).filter((t) => t.assignedAgentId === agentId);
  }

  public async createMemory(dto: CreateEcosystemAgentMemoryDto): Promise<EcosystemAgentMemoryDto> {
    const memory: EcosystemAgentMemoryDto = {
      id: `mem-${Date.now()}`,
      agentId: dto.agentId,
      memoryKey: dto.memoryKey,
      memoryValue: dto.memoryValue,
      createdAt: new Date().toISOString(),
    };
    this.memoriesList.push(memory);
    return memory;
  }

  public async listMemories(agentId: string): Promise<EcosystemAgentMemoryDto[]> {
    return this.memoriesList.filter((m) => m.agentId === agentId);
  }

  public async logInteraction(dto: CreateAgentInteractionDto): Promise<AgentInteractionDto> {
    const inter: AgentInteractionDto = {
      id: `inter-${Date.now()}`,
      sourceAgentId: dto.sourceAgentId,
      targetAgentId: dto.targetAgentId,
      messageType: dto.messageType,
      payload: dto.payload,
      timestamp: new Date().toISOString(),
    };
    this.interactionsList.push(inter);
    return inter;
  }

  public async listInteractions(agentId: string): Promise<AgentInteractionDto[]> {
    return this.interactionsList.filter((i) => i.sourceAgentId === agentId || i.targetAgentId === agentId);
  }

  public async getOverview(userId: string): Promise<AgentOverviewDto> {
    const agentsList = await this.listAgents(userId);
    const recentTasks = Array.from(this.tasksMap.values()).slice(-10);
    const recentInteractions = this.interactionsList.slice(-10);
    const metrics = await this.getMetrics(userId);

    return {
      metrics,
      agentsList,
      recentTasks,
      recentInteractions,
    };
  }

  public async getMetrics(userId: string): Promise<AgentMetricsDto> {
    const agents = await this.listAgents(userId);
    const activeAgentsCount = agents.filter((a) => a.status === EcosystemAgentStatus.ACTIVE).length;
    const totalTasksDelegated = Array.from(this.tasksMap.values()).length;
    const averageSuccessRate =
      agents.length > 0 ? agents.reduce((acc, a) => acc + a.performanceMetrics.successRate, 0) / agents.length : 100.0;

    return {
      activeAgentsCount,
      totalTasksDelegated,
      averageSuccessRate: Number(averageSuccessRate.toFixed(1)),
      totalMemoriesCount: this.memoriesList.length,
      totalInteractionsCount: this.interactionsList.length,
      recordedAt: new Date().toISOString(),
    };
  }
}

export const agentEcosystemRepository = new AgentEcosystemRepository();
