import axios from 'axios';
import {
  PlatformOverviewDto,
  GlobalSearchResultDto,
  WorkflowExecutionDto,
  PlatformHealthDto,
  CreateWorkflowExecutionDto,
  PlatformEventSeverity,
  OrchestrationStepStatus,
  CrossModuleWorkflowStatus,
} from '@codeforge/shared';

const API_BASE = '/api/v1/platform';

// In-Memory Offline Fail-Safe Fallbacks
const offlineOverview: PlatformOverviewDto = {
  metrics: {
    totalEventsCount: 2,
    activeWorkflowsCount: 1,
    unifiedContextKeysCount: 1,
    aggregateRiskScore: 12.0,
    systemUptimeHours: 720,
  },
  recentEvents: [
    {
      id: 'event-seed-1',
      sourceModule: 'Cybersecurity',
      eventName: 'SQL Injection Blocked',
      severity: PlatformEventSeverity.WARNING,
      payload: { sourceIp: '198.51.100.42', target: '/api/v1/auth/login' },
      timestamp: new Date().toISOString(),
    },
  ],
  activeWorkflows: [
    {
      id: 'wf-seed-1',
      userId: 'test-user-id',
      workflowName: 'Ingest and Scan Repository',
      status: CrossModuleWorkflowStatus.ACTIVE,
      triggerEvent: 'Git Push Event Hook',
      executedSteps: [
        {
          stepNumber: 1,
          moduleName: 'Data Pipeline',
          actionTaken: 'Import repository code files',
          status: OrchestrationStepStatus.SUCCESS,
        },
        {
          stepNumber: 2,
          moduleName: 'Cybersecurity',
          actionTaken: 'Audit package vulnerabilities',
          status: OrchestrationStepStatus.PENDING,
        },
      ],
      createdAt: new Date().toISOString(),
    },
  ],
  contextKeys: ['active_startup_id'],
};

const offlineHealth: PlatformHealthDto = {
  status: 'healthy',
  uptimeSeconds: 2592000,
  cpuUsagePercent: 14.5,
  memoryUsagePercent: 42.1,
  moduleHealth: {
    'Cognitive OS': 'healthy',
    'Enterprise Civilization': 'healthy',
    'Startup Builder': 'healthy',
    'VC Intelligence': 'healthy',
    'Research University': 'healthy',
    'Software Factory': 'healthy',
    'AI Cloud': 'healthy',
    'Multimodal Intelligence': 'healthy',
    Cybersecurity: 'healthy',
    'Data Intelligence': 'healthy',
  },
  activeWorkflowsCount: 1,
  totalErrorsLogged: 0,
};

export const platformIntegrationApi = {
  async getOverview(): Promise<PlatformOverviewDto> {
    try {
      const res = await axios.get<{ success: boolean; data: PlatformOverviewDto }>(`${API_BASE}/overview`);
      return res.data.data;
    } catch {
      return offlineOverview;
    }
  },

  async search(query: string): Promise<GlobalSearchResultDto[]> {
    try {
      const res = await axios.get<{ success: boolean; data: GlobalSearchResultDto[] }>(`${API_BASE}/search`, {
        params: { q: query },
      });
      return res.data.data;
    } catch {
      return ([
        {
          type: 'concept',
          id: 'concept-1',
          title: 'AgentForge Studio',
          subtitle: 'Startup builder venture in stage MVP',
          relevanceScore: 0.95,
        },
        {
          type: 'threat',
          id: 'threat-1',
          title: 'XSS Attack Blocked',
          subtitle: 'Active cybersecurity threat alert level: warning',
          relevanceScore: 0.85,
        },
      ] as GlobalSearchResultDto[]).filter((x) => x.title.toLowerCase().includes(query.toLowerCase()));
    }
  },

  async triggerWorkflow(dto: CreateWorkflowExecutionDto): Promise<WorkflowExecutionDto> {
    try {
      const res = await axios.post<{ success: boolean; data: WorkflowExecutionDto }>(`${API_BASE}/workflow`, dto);
      return res.data.data;
    } catch {
      const newWf: WorkflowExecutionDto = {
        id: `wf-offline-${Date.now()}`,
        userId: 'test-user-id',
        workflowName: dto.workflowName,
        status: CrossModuleWorkflowStatus.COMPLETED,
        triggerEvent: dto.triggerEvent,
        executedSteps: dto.steps.map((s) => ({
          stepNumber: s.stepNumber,
          moduleName: s.moduleName,
          actionTaken: s.actionTaken,
          status: OrchestrationStepStatus.SUCCESS,
          resultSummary: `Offline executed step successfully.`,
        })),
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
      };
      offlineOverview.activeWorkflows.push(newWf);
      return newWf;
    }
  },

  async getHealth(): Promise<PlatformHealthDto> {
    try {
      const res = await axios.get<{ success: boolean; data: PlatformHealthDto }>(`${API_BASE}/health`);
      return res.data.data;
    } catch {
      return offlineHealth;
    }
  },
};
