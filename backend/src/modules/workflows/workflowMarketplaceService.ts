import { IEcosystemRepository } from '../../repositories/interfaces/IEcosystemRepository';
import { IAgenticWorkspaceRepository } from '../../repositories/interfaces/IAgenticWorkspaceRepository';
import {
  WorkflowTemplateDto,
  CreateWorkflowTemplateDto,
  WorkflowCategory,
  WorkflowTriggerType,
  AgentType,
  AgentStatus,
  AgentWorkflowDto,
  WorkflowStatus,
} from '@codeforge/shared';

export class WorkflowMarketplaceService {
  constructor(
    private repo: IEcosystemRepository,
    private workspaceRepo?: IAgenticWorkspaceRepository
  ) {}

  async initializeStarterTemplates(creatorId: string): Promise<WorkflowTemplateDto[]> {
    const existing = await this.repo.listWorkflowTemplates();
    if (existing.length >= 5) {
      return existing;
    }

    const starterTemplates: CreateWorkflowTemplateDto[] = [
      {
        title: 'FAANG Staff System Design & Behavioral Drill',
        description: 'Multi-agent workflow orchestrating mock interviewer rubric analysis, live diagram generation, and STAR behavioral coaching.',
        category: WorkflowCategory.INTERVIEW_PREP,
        triggerType: WorkflowTriggerType.GOAL_BASED,
        steps: [
          {
            stepId: 'step-1',
            stepNumber: 1,
            agentType: AgentType.INTERVIEW_AGENT,
            action: 'Generate System Design Challenge Scenario',
            inputTemplate: 'Generate a distributed rate limiter prompt with 10M RPS scale requirements.',
            dependencies: [],
          },
          {
            stepId: 'step-2',
            stepNumber: 2,
            agentType: AgentType.RESEARCH_AGENT,
            action: 'Retrieve Production Whitepapers & Architecture Blueprints',
            inputTemplate: 'Fetch token bucket vs sliding window log implementations from Redis and Envoy docs.',
            dependencies: ['step-1'],
          },
          {
            stepId: 'step-3',
            stepNumber: 3,
            agentType: AgentType.MENTOR_AGENT,
            action: 'Evaluate Candidate Architecture against Staff Rubrics',
            inputTemplate: 'Score availability, consistency, partition tolerance, and single points of failure.',
            dependencies: ['step-2'],
          },
        ],
        isEnterprise: false,
      },
      {
        title: 'Staff Engineer Promotion Velocity & Impact Blueprint',
        description: 'Autonomously audits engineering impact, draft RFC reviews, and maps leadership milestones for L5-to-L6 transitions.',
        category: WorkflowCategory.CAREER_PLANNING,
        triggerType: WorkflowTriggerType.SCHEDULED_CRON,
        steps: [
          {
            stepId: 'step-1',
            stepNumber: 1,
            agentType: AgentType.CAREER_AGENT,
            action: 'Aggregate Cross-Functional Impact Metrics',
            inputTemplate: 'Analyze merged pull requests, architecture docs authored, and junior mentorship sessions.',
            dependencies: [],
          },
          {
            stepId: 'step-2',
            stepNumber: 2,
            agentType: AgentType.EXECUTIVE_ANALYTICS_AGENT,
            action: 'Forecast Promotion Readiness & Gap Analysis',
            inputTemplate: 'Compare telemetry to departmental staff engineer benchmark percentiles.',
            dependencies: ['step-1'],
          },
        ],
        isEnterprise: true,
      },
      {
        title: 'Weekly Distributed Systems & Concurrency Deep-Dive',
        description: 'Researches latest arXiv consensus papers, synthesizes minimal reproduction repos, and generates spaced flashcards.',
        category: WorkflowCategory.LEARNING_ROADMAP,
        triggerType: WorkflowTriggerType.SCHEDULED_CRON,
        steps: [
          {
            stepId: 'step-1',
            stepNumber: 1,
            agentType: AgentType.RESEARCH_AGENT,
            action: 'Scan arXiv & Usenix for High-Performance Concurrency Papers',
            inputTemplate: 'Search for lock-free data structures and cache-coherent ring buffers.',
            dependencies: [],
          },
          {
            stepId: 'step-2',
            stepNumber: 2,
            agentType: AgentType.LEARNING_AGENT,
            action: 'Synthesize Interactive Spaced-Repetition Study Cards',
            inputTemplate: 'Generate 5 question-answer flashcards with memory retrieval hooks.',
            dependencies: ['step-1'],
          },
        ],
        isEnterprise: false,
      },
      {
        title: 'Autonomous CI/CD Failure Diagnostic & Auto-Remediation',
        description: 'Monitors build test failures, isolates flaky integration tests, and generates hotfix pull request patches.',
        category: WorkflowCategory.DEVOPS_AUTOMATION,
        triggerType: WorkflowTriggerType.EVENT_DRIVEN,
        steps: [
          {
            stepId: 'step-1',
            stepNumber: 1,
            agentType: AgentType.CODING_AGENT,
            action: 'Parse Stack Trace & Isolate Failing Assertion',
            inputTemplate: 'Extract panic stack trace from test runner output log.',
            dependencies: [],
          },
          {
            stepId: 'step-2',
            stepNumber: 2,
            agentType: AgentType.CODING_AGENT,
            action: 'Synthesize Minimal Regression Unit Test & Hotfix Patch',
            inputTemplate: 'Generate idempotent fix addressing null pointer race condition.',
            dependencies: ['step-1'],
          },
        ],
        isEnterprise: false,
      },
      {
        title: 'Placement Readiness & Recruiter Outreach Pipeline',
        description: 'Tailors resume competencies to tier-1 enterprise job postings, generates cover notes, and prepares interview questions.',
        category: WorkflowCategory.PLACEMENT_READINESS,
        triggerType: WorkflowTriggerType.EVENT_DRIVEN,
        steps: [
          {
            stepId: 'step-1',
            stepNumber: 1,
            agentType: AgentType.PLACEMENT_AGENT,
            action: 'Score Job Posting Alignment & Keyword Match',
            inputTemplate: 'Evaluate candidate digital twin against target Senior Backend role.',
            dependencies: [],
          },
          {
            stepId: 'step-2',
            stepNumber: 2,
            agentType: AgentType.CAREER_AGENT,
            action: 'Generate Customized Recruiter Outreach Pitch',
            inputTemplate: 'Highlight top 3 high-impact open-source contributions and system benchmarks.',
            dependencies: ['step-1'],
          },
        ],
        isEnterprise: false,
      },
    ];

    const created: WorkflowTemplateDto[] = [];
    for (const t of starterTemplates) {
      const item = await this.repo.createWorkflowTemplate(creatorId, t);
      created.push(item);
    }
    return created;
  }

  async publishTemplate(creatorId: string, data: CreateWorkflowTemplateDto): Promise<WorkflowTemplateDto> {
    if (!data.title || data.title.trim().length === 0) {
      throw new Error('Workflow title is required');
    }
    if (!data.steps || data.steps.length === 0) {
      throw new Error('Workflow must contain at least 1 execution step');
    }
    return this.repo.createWorkflowTemplate(creatorId, data);
  }

  async getTemplateById(id: string): Promise<WorkflowTemplateDto | null> {
    return this.repo.getWorkflowTemplateById(id);
  }

  async listTemplates(category?: string): Promise<WorkflowTemplateDto[]> {
    return this.repo.listWorkflowTemplates(category);
  }

  async deleteTemplate(id: string, creatorId: string): Promise<boolean> {
    return this.repo.deleteWorkflowTemplate(id, creatorId);
  }

  async cloneTemplateToWorkspace(templateId: string, userId: string): Promise<AgentWorkflowDto | null> {
    const template = await this.repo.getWorkflowTemplateById(templateId);
    if (!template) {
      throw new Error('Workflow template not found');
    }

    if (this.workspaceRepo) {
      const cloned = await this.workspaceRepo.createWorkflow(userId, {
        title: `[Cloned] ${template.title}`,
        description: template.description,
        triggerType: template.triggerType,
        steps: template.steps,
      });
      return cloned;
    }

    // Fallback representation if standalone
    return {
      id: `wf-${Date.now()}`,
      userId,
      title: `[Cloned] ${template.title}`,
      description: template.description,
      triggerType: template.triggerType,
      scheduleCron: null,
      status: WorkflowStatus.ACTIVE,
      steps: template.steps.map(s => ({
        ...s,
        status: AgentStatus.IDLE,
      })),
      lastRunAt: null,
      nextRunAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
}
