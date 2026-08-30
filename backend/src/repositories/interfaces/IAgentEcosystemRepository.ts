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
  AgentTaskStatus,
  EcosystemAgentStatus,
} from '@codeforge/shared';

export interface IAgentEcosystemRepository {
  registerAgent(userId: string, dto: CreateEcosystemAgentDto): Promise<EcosystemAgentDto>;
  listAgents(userId: string): Promise<EcosystemAgentDto[]>;
  getAgent(id: string): Promise<EcosystemAgentDto | null>;
  updateAgentStatus(id: string, status: EcosystemAgentStatus): Promise<EcosystemAgentDto>;

  createTask(userId: string, dto: CreateEcosystemAgentTaskDto): Promise<EcosystemAgentTaskDto>;
  updateTaskStatus(id: string, status: AgentTaskStatus, result?: Record<string, any>, error?: string): Promise<EcosystemAgentTaskDto>;
  listTasks(agentId: string): Promise<EcosystemAgentTaskDto[]>;

  createMemory(dto: CreateEcosystemAgentMemoryDto): Promise<EcosystemAgentMemoryDto>;
  listMemories(agentId: string): Promise<EcosystemAgentMemoryDto[]>;

  logInteraction(dto: CreateAgentInteractionDto): Promise<AgentInteractionDto>;
  listInteractions(agentId: string): Promise<AgentInteractionDto[]>;

  getOverview(userId: string): Promise<AgentOverviewDto>;
  getMetrics(userId: string): Promise<AgentMetricsDto>;
}
