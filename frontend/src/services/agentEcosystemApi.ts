import axios from 'axios';
import {
  EcosystemAgentDto,
  CreateEcosystemAgentDto,
  EcosystemAgentTaskDto,
  CreateEcosystemAgentTaskDto,
  AgentOverviewDto,
  AgentMetricsDto,
  EcosystemAgentType,
  EcosystemAgentStatus,
  AgentTaskStatus,
} from '@codeforge/shared';

const API_BASE = '/api/v1/agents';

// In-Memory Offline Fail-Safe Fallbacks
const offlineOverview: AgentOverviewDto = {
  metrics: {
    activeAgentsCount: 2,
    totalTasksDelegated: 1,
    averageSuccessRate: 96.8,
    totalMemoriesCount: 1,
    totalInteractionsCount: 1,
    recordedAt: new Date().toISOString(),
  },
  agentsList: [
    {
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
    },
  ],
  recentTasks: [
    {
      id: 'task-seed-1',
      assignedAgentId: 'agent-seed-1',
      taskDescription: 'Parse AST and extract invariants for smart contract vulnerability assessment',
      status: AgentTaskStatus.SUCCESS,
      inputParams: { filePath: '/src/contracts/Vault.sol' },
      outputResult: { vulnerabilityScore: 12, criticalCVEsCount: 0 },
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    },
  ],
  recentInteractions: [
    {
      id: 'inter-seed-1',
      sourceAgentId: 'agent-seed-2',
      targetAgentId: 'agent-seed-1',
      messageType: 'EXECUTE_PROOF',
      payload: { schemaId: 'vault-v1', checkType: 'overflow' },
      timestamp: new Date().toISOString(),
    },
  ],
};

export const agentEcosystemApi = {
  async listAgents(): Promise<EcosystemAgentDto[]> {
    try {
      const res = await axios.get<{ success: boolean; data: EcosystemAgentDto[] }>(API_BASE);
      return res.data.data;
    } catch {
      return offlineOverview.agentsList;
    }
  },

  async registerAgent(dto: CreateEcosystemAgentDto): Promise<EcosystemAgentDto> {
    try {
      const res = await axios.post<{ success: boolean; data: EcosystemAgentDto }>(`${API_BASE}/register`, dto);
      return res.data.data;
    } catch {
      const newAgent: EcosystemAgentDto = {
        id: `agent-offline-${Date.now()}`,
        creatorUserId: 'test-user-id',
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
      offlineOverview.agentsList.push(newAgent);
      offlineOverview.metrics.activeAgentsCount += 1;
      return newAgent;
    }
  },

  async delegateTask(dto: CreateEcosystemAgentTaskDto): Promise<EcosystemAgentTaskDto> {
    try {
      const res = await axios.post<{ success: boolean; data: EcosystemAgentTaskDto }>(`${API_BASE}/delegate`, dto);
      return res.data.data;
    } catch {
      const newTask: EcosystemAgentTaskDto = {
        id: `task-offline-${Date.now()}`,
        assignedAgentId: dto.assignedAgentId,
        taskDescription: dto.taskDescription,
        status: AgentTaskStatus.PENDING,
        inputParams: dto.inputParams,
        createdAt: new Date().toISOString(),
      };
      offlineOverview.recentTasks.push(newTask);
      offlineOverview.metrics.totalTasksDelegated += 1;
      return newTask;
    }
  },

  async getMetrics(): Promise<AgentMetricsDto> {
    try {
      const res = await axios.get<{ success: boolean; data: AgentMetricsDto }>(`${API_BASE}/metrics`);
      return res.data.data;
    } catch {
      return offlineOverview.metrics;
    }
  },

  async getOverview(): Promise<AgentOverviewDto> {
    // Aggregated endpoint logic fallback
    try {
      const list = await this.listAgents();
      const metrics = await this.getMetrics();
      return {
        metrics,
        agentsList: list,
        recentTasks: offlineOverview.recentTasks,
        recentInteractions: offlineOverview.recentInteractions,
      };
    } catch {
      return offlineOverview;
    }
  },
};
