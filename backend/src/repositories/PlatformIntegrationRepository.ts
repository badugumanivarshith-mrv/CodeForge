import { IPlatformIntegrationRepository } from './interfaces/IPlatformIntegrationRepository';
import {
  PlatformEventDto,
  CreatePlatformEventDto,
  UnifiedContextDto,
  CreateUnifiedContextDto,
  WorkflowExecutionDto,
  CreateWorkflowExecutionDto,
  PlatformOverviewDto,
  PlatformHealthDto,
  GlobalSearchResultDto,
  PlatformEventSeverity,
  OrchestrationStepStatus,
  CrossModuleWorkflowStatus,
  StartupDto,
} from '@codeforge/shared';
import { StartupBuilderRepository } from './StartupBuilderRepository';
import { cybersecurityRepository } from './CybersecurityRepository';
import { dataIntelligenceRepository } from './DataIntelligenceRepository';

export class PlatformIntegrationRepository implements IPlatformIntegrationRepository {
  private eventsList: PlatformEventDto[] = [];
  private contextsMap = new Map<string, UnifiedContextDto>(); // key: userId + '_' + contextKey
  private workflowsMap = new Map<string, WorkflowExecutionDto>();
  private startupRepo = new StartupBuilderRepository();

  constructor() {
    this.seedDefaultData();
  }

  private seedDefaultData() {
    const event1: PlatformEventDto = {
      id: 'event-seed-1',
      sourceModule: 'Cybersecurity',
      eventName: 'SQL Injection Blocked',
      severity: PlatformEventSeverity.WARNING,
      payload: { sourceIp: '198.51.100.42', target: '/api/v1/auth/login' },
      timestamp: new Date(Date.now() - 3600 * 1000).toISOString(),
    };

    const event2: PlatformEventDto = {
      id: 'event-seed-2',
      sourceModule: 'AI Cloud',
      eventName: 'Deployment Successful',
      severity: PlatformEventSeverity.INFO,
      payload: { clusterId: 'cluster-seed-1', image: 'nginx:latest' },
      timestamp: new Date().toISOString(),
    };

    this.eventsList.push(event1, event2);

    const context1: UnifiedContextDto = {
      id: 'context-seed-1',
      userId: 'test-user-id',
      contextKey: 'active_startup_id',
      contextValue: { startupId: 'startup-seed-1', projectName: 'CodeForge Autonomous OS' },
      updatedAt: new Date().toISOString(),
    };

    this.contextsMap.set('test-user-id_active_startup_id', context1);

    const wf1: WorkflowExecutionDto = {
      id: 'wf-seed-1',
      userId: 'test-user-id',
      workflowName: 'Ingest and Scan Repository',
      status: CrossModuleWorkflowStatus.COMPLETED,
      triggerEvent: 'Git Push Event Hook',
      executedSteps: [
        {
          stepNumber: 1,
          moduleName: 'Data Pipeline',
          actionTaken: 'Import repository code files',
          status: OrchestrationStepStatus.SUCCESS,
          resultSummary: 'Imported 125 files successfully',
        },
        {
          stepNumber: 2,
          moduleName: 'Cybersecurity',
          actionTaken: 'Audit package vulnerabilities',
          status: OrchestrationStepStatus.SUCCESS,
          resultSummary: 'Zero critical CVE found',
        },
      ],
      createdAt: new Date(Date.now() - 1800 * 1000).toISOString(),
      completedAt: new Date().toISOString(),
    };

    this.workflowsMap.set(wf1.id, wf1);
  }

  public async createPlatformEvent(dto: CreatePlatformEventDto): Promise<PlatformEventDto> {
    const event: PlatformEventDto = {
      id: `event-${Date.now()}`,
      sourceModule: dto.sourceModule,
      eventName: dto.eventName,
      severity: dto.severity,
      payload: dto.payload,
      timestamp: new Date().toISOString(),
    };
    this.eventsList.push(event);
    return event;
  }

  public async listPlatformEvents(): Promise<PlatformEventDto[]> {
    return this.eventsList;
  }

  public async saveUnifiedContext(userId: string, dto: CreateUnifiedContextDto): Promise<UnifiedContextDto> {
    const key = `${userId}_${dto.contextKey}`;
    const context: UnifiedContextDto = {
      id: `context-${Date.now()}`,
      userId,
      contextKey: dto.contextKey,
      contextValue: dto.contextValue,
      updatedAt: new Date().toISOString(),
    };
    this.contextsMap.set(key, context);
    return context;
  }

  public async getUnifiedContext(userId: string, key: string): Promise<UnifiedContextDto | null> {
    const lookupKey = `${userId}_${key}`;
    return this.contextsMap.get(lookupKey) || null;
  }

  public async listUnifiedContextKeys(userId: string): Promise<string[]> {
    const prefix = `${userId}_`;
    return Array.from(this.contextsMap.keys())
      .filter((k) => k.startsWith(prefix))
      .map((k) => k.replace(prefix, ''));
  }

  public async createWorkflowExecution(userId: string, dto: CreateWorkflowExecutionDto): Promise<WorkflowExecutionDto> {
    const wf: WorkflowExecutionDto = {
      id: `wf-${Date.now()}`,
      userId,
      workflowName: dto.workflowName,
      status: CrossModuleWorkflowStatus.ACTIVE,
      triggerEvent: dto.triggerEvent,
      executedSteps: dto.steps.map((s) => ({
        stepNumber: s.stepNumber,
        moduleName: s.moduleName,
        actionTaken: s.actionTaken,
        status: OrchestrationStepStatus.PENDING,
      })),
      createdAt: new Date().toISOString(),
    };
    this.workflowsMap.set(wf.id, wf);
    return wf;
  }

  public async updateWorkflowExecutionStep(
    id: string,
    stepNumber: number,
    status: OrchestrationStepStatus,
    resultSummary?: string
  ): Promise<WorkflowExecutionDto> {
    const wf = this.workflowsMap.get(id);
    if (!wf) throw new Error(`Workflow Execution with ID ${id} not found.`);

    wf.executedSteps = wf.executedSteps.map((step) => {
      if (step.stepNumber === stepNumber) {
        return { ...step, status, resultSummary };
      }
      return step;
    });

    this.workflowsMap.set(id, wf);
    return wf;
  }

  public async updateWorkflowStatus(id: string, status: CrossModuleWorkflowStatus): Promise<WorkflowExecutionDto> {
    const wf = this.workflowsMap.get(id);
    if (!wf) throw new Error(`Workflow Execution with ID ${id} not found.`);
    wf.status = status;
    if (status === CrossModuleWorkflowStatus.COMPLETED || status === CrossModuleWorkflowStatus.FAILED) {
      wf.completedAt = new Date().toISOString();
    }
    this.workflowsMap.set(id, wf);
    return wf;
  }

  public async getWorkflowExecution(id: string): Promise<WorkflowExecutionDto | null> {
    return this.workflowsMap.get(id) || null;
  }

  public async listWorkflowExecutions(userId: string): Promise<WorkflowExecutionDto[]> {
    return Array.from(this.workflowsMap.values()).filter((w) => w.userId === userId);
  }

  public async getOverview(userId: string): Promise<PlatformOverviewDto> {
    const recentEvents = this.eventsList.slice(-10);
    const activeWorkflows = Array.from(this.workflowsMap.values()).filter(
      (w) => w.userId === userId && w.status === CrossModuleWorkflowStatus.ACTIVE
    );
    const contextKeys = await this.listUnifiedContextKeys(userId);

    const cyberOverview = await cybersecurityRepository.getOverview();
    const aggregateRiskScore = cyberOverview.metrics.aggregateRiskScore;

    return {
      metrics: {
        totalEventsCount: this.eventsList.length,
        activeWorkflowsCount: activeWorkflows.length,
        unifiedContextKeysCount: contextKeys.length,
        aggregateRiskScore,
        systemUptimeHours: 720,
      },
      recentEvents,
      activeWorkflows,
      contextKeys,
    };
  }

  public async getHealth(): Promise<PlatformHealthDto> {
    const activeWorkflowsCount = Array.from(this.workflowsMap.values()).filter(
      (w) => w.status === CrossModuleWorkflowStatus.ACTIVE
    ).length;

    const totalErrorsLogged = this.eventsList.filter((e) => e.severity === PlatformEventSeverity.ERROR).length;

    return {
      status: 'healthy',
      uptimeSeconds: 2592000,
      cpuUsagePercent: 12.4,
      memoryUsagePercent: 44.8,
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
      activeWorkflowsCount,
      totalErrorsLogged,
    };
  }

  public async globalSearch(queryStr: string): Promise<GlobalSearchResultDto[]> {
    const results: GlobalSearchResultDto[] = [];
    const lowerQuery = queryStr.toLowerCase();

    // Query Startups
    const startups = await this.startupRepo.listStartups();
    startups.forEach((s: StartupDto) => {
      if (s.name.toLowerCase().includes(lowerQuery) || s.tagline.toLowerCase().includes(lowerQuery)) {
        results.push({
          type: 'concept',
          id: s.id,
          title: s.name,
          subtitle: `Startup builder venture in stage ${s.stage}`,
          relevanceScore: 0.95,
        });
      }
    });

    // Query Threats
    const threats = await cybersecurityRepository.listThreats();
    threats.forEach((t) => {
      if (t.title.toLowerCase().includes(lowerQuery) || t.description.toLowerCase().includes(lowerQuery)) {
        results.push({
          type: 'threat',
          id: t.id,
          title: t.title,
          subtitle: `Active cybersecurity threat alert level: ${t.severity}`,
          relevanceScore: 0.88,
        });
      }
    });

    // Query Data sources
    const sources = await dataIntelligenceRepository.listDataSources();
    sources.forEach((src) => {
      if (src.name.toLowerCase().includes(lowerQuery)) {
        results.push({
          type: 'source',
          id: src.id,
          title: src.name,
          subtitle: `Data source file size: ${src.fileSizeKb} KB`,
          relevanceScore: 0.84,
        });
      }
    });

    return results;
  }
}

export const platformIntegrationRepository = new PlatformIntegrationRepository();
