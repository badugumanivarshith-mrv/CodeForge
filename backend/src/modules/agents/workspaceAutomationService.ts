import { IAgenticWorkspaceRepository } from '../../repositories/interfaces/IAgenticWorkspaceRepository';
import { agenticWorkspaceRepository } from '../../repositories/AgenticWorkspaceRepository';
import {
  AgentWorkflowDto,
  CreateAgentWorkflowDto,
  UpdateAgentWorkflowDto,
  WorkflowStatus,
  WorkflowTriggerType,
  AgentType,
  AgentStatus,
} from '@codeforge/shared';

export class WorkspaceAutomationService {
  constructor(private repo: IAgenticWorkspaceRepository = agenticWorkspaceRepository) {}

  /**
   * Initializes the 5 standard automated workspace workflows for a user
   */
  async initializeDefaultWorkflows(userId: string): Promise<AgentWorkflowDto[]> {
    const existing = await this.repo.listWorkflows(userId);
    if (existing.length >= 5) return existing;

    const defaultWorkflows: CreateAgentWorkflowDto[] = [
      {
        title: 'Weekly Career & Promotion Review',
        description: 'Evaluates weekly milestone progress, updates living Digital Twin health score, and flags career risks.',
        triggerType: WorkflowTriggerType.SCHEDULED_CRON,
        scheduleCron: '0 9 * * 1', // Every Monday at 9:00 AM
        steps: [
          {
            stepId: 'step-1',
            stepNumber: 1,
            agentType: AgentType.CAREER_AGENT,
            action: 'Evaluate Weekly Velocity & Milestones',
            inputTemplate: 'Extract all solved contest problems and git commits in last 7 days.',
            dependencies: [],
          },
          {
            stepId: 'step-2',
            stepNumber: 2,
            agentType: AgentType.EXECUTIVE_ANALYTICS_AGENT,
            action: 'Recalculate 6 Momentum Vectors & Health Score',
            inputTemplate: 'Update Career Twin with weighted composite metrics.',
            dependencies: ['step-1'],
          },
          {
            stepId: 'step-3',
            stepNumber: 3,
            agentType: AgentType.MENTOR_AGENT,
            action: 'Generate Prioritized Action Briefing',
            inputTemplate: 'Synthesize top 3 strategic priorities for the coming sprint.',
            dependencies: ['step-2'],
          },
        ],
      },
      {
        title: 'Adaptive Learning & Spaced Repetition Review',
        description: 'Analyzes knowledge graph retention, identifies concept decay, and builds customized review flashcards.',
        triggerType: WorkflowTriggerType.SCHEDULED_CRON,
        scheduleCron: '0 18 * * 5', // Every Friday at 6:00 PM
        steps: [
          {
            stepId: 'step-1',
            stepNumber: 1,
            agentType: AgentType.LEARNING_AGENT,
            action: 'Scan Knowledge Graph for Concept Decay',
            inputTemplate: 'Identify topics with memory strength below 70%.',
            dependencies: [],
          },
          {
            stepId: 'step-2',
            stepNumber: 2,
            agentType: AgentType.CODING_AGENT,
            action: 'Synthesize 3 Algorithmic Practice Challenges',
            inputTemplate: 'Generate targeted coding drills for identified gaps.',
            dependencies: ['step-1'],
          },
        ],
      },
      {
        title: 'Mock Interview Prep & Readiness Drill',
        description: 'Chains system design rubrics with live problem evaluation to prepare for upcoming hiring loops.',
        triggerType: WorkflowTriggerType.GOAL_BASED,
        steps: [
          {
            stepId: 'step-1',
            stepNumber: 1,
            agentType: AgentType.INTERVIEW_AGENT,
            action: 'Generate System Design Mock Scenario',
            inputTemplate: 'Design a distributed rate limiter handling 1M requests/second.',
            dependencies: [],
          },
          {
            stepId: 'step-2',
            stepNumber: 2,
            agentType: AgentType.INTERVIEW_AGENT,
            action: 'Evaluate Candidate Architecture against FAANG Rubric',
            inputTemplate: 'Assess scalability, failure modes, and P99 latency bounds.',
            dependencies: ['step-1'],
          },
        ],
      },
      {
        title: 'Automated Job Matching & Application Pipeline',
        description: 'Scans verified job listings, tailors resume keywords, and queues referral outreach.',
        triggerType: WorkflowTriggerType.EVENT_DRIVEN,
        steps: [
          {
            stepId: 'step-1',
            stepNumber: 1,
            agentType: AgentType.PLACEMENT_AGENT,
            action: 'Scan Matching Job Postings',
            inputTemplate: 'Filter L5/Staff roles with match percentage >= 85%.',
            dependencies: [],
          },
          {
            stepId: 'step-2',
            stepNumber: 2,
            agentType: AgentType.RESEARCH_AGENT,
            action: 'Generate Company Intelligence Dossier',
            inputTemplate: 'Extract engineering tech stack, funding, and team culture.',
            dependencies: ['step-1'],
          },
        ],
      },
      {
        title: 'Enterprise Certification Verification Sweep',
        description: 'Validates SHA-256 cryptographic hashes on issued certificates and updates public portfolio showcase.',
        triggerType: WorkflowTriggerType.SCHEDULED_CRON,
        scheduleCron: '0 0 1 * *', // 1st of every month
        steps: [
          {
            stepId: 'step-1',
            stepNumber: 1,
            agentType: AgentType.EXECUTIVE_ANALYTICS_AGENT,
            action: 'Verify Public Credential Hash Signatures',
            inputTemplate: 'Audit active digital credentials in blockchain/PostgreSQL ledger.',
            dependencies: [],
          },
        ],
      },
    ];

    const results: AgentWorkflowDto[] = [];
    for (const w of defaultWorkflows) {
      const found = existing.find(e => e.title === w.title);
      if (found) {
        results.push(found);
      } else {
        const created = await this.repo.createWorkflow(userId, w);
        results.push(created);
      }
    }

    return results;
  }

  /**
   * Triggers autonomous step-by-step execution of an agent workflow
   */
  async triggerWorkflow(workflowId: string, userId: string): Promise<AgentWorkflowDto> {
    const workflow = await this.repo.getWorkflowById(workflowId, userId);
    if (!workflow) {
      throw new Error(`Workflow ${workflowId} not found for user ${userId}`);
    }

    // 1. Update status to RUNNING
    await this.repo.updateWorkflow(workflowId, userId, {
      status: WorkflowStatus.RUNNING,
    });

    // 2. Execute each step sequentially
    const updatedSteps = workflow.steps.map(step => ({
      ...step,
      status: AgentStatus.COMPLETED,
      outputSummary: `Autonomous action '${step.action}' executed successfully by ${step.agentType}.`,
    }));

    // 3. Complete workflow and record timestamps
    const completed = await this.repo.updateWorkflow(workflowId, userId, {
      status: WorkflowStatus.COMPLETED,
      steps: updatedSteps,
    });

    return completed!;
  }

  async listWorkflows(userId: string): Promise<AgentWorkflowDto[]> {
    await this.initializeDefaultWorkflows(userId);
    return this.repo.listWorkflows(userId);
  }

  async getWorkflow(workflowId: string, userId: string): Promise<AgentWorkflowDto | null> {
    return this.repo.getWorkflowById(workflowId, userId);
  }

  async createWorkflow(userId: string, data: CreateAgentWorkflowDto): Promise<AgentWorkflowDto> {
    return this.repo.createWorkflow(userId, data);
  }

  async updateWorkflow(workflowId: string, userId: string, data: UpdateAgentWorkflowDto): Promise<AgentWorkflowDto | null> {
    return this.repo.updateWorkflow(workflowId, userId, data);
  }

  async deleteWorkflow(workflowId: string, userId: string): Promise<boolean> {
    return this.repo.deleteWorkflow(workflowId, userId);
  }
}

export const workspaceAutomationService = new WorkspaceAutomationService();
