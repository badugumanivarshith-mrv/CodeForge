import { test, describe } from 'node:test';
import assert from 'node:assert';
import { WorkflowEngineService } from '../../src/modules/agent-cloud/workflowEngineService';
import {
  DistributedWorkflowType,
  WorkforceAgentRole,
  WorkflowRunStatus,
  WorkflowStepStatus,
} from '@codeforge/shared';

describe('Distributed Workflow Engine Unit Tests', () => {
  const createMockRepo = () => {
    const definitions = new Map<string, any>();
    const runs = new Map<string, any>();
    const steps = new Map<string, any[]>();

    return {
      definitions,
      runs,
      steps,
      async createWorkflowDefinition(userId: string, data: any) {
        const def = {
          id: `wf_${Date.now()}_${Math.random()}`,
          userId,
          title: data.title,
          slug: data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          description: data.description,
          workflowType: data.workflowType,
          version: 1,
          isEnterprise: data.isEnterprise ?? false,
          steps: data.steps,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        definitions.set(def.id, def);
        return def;
      },
      async getWorkflowDefinitionById(id: string) {
        return definitions.get(id) || null;
      },
      async listWorkflowDefinitions(userId: string, type?: string) {
        let list = Array.from(definitions.values()).filter(w => w.userId === userId);
        if (type) list = list.filter(w => w.workflowType === type);
        return list;
      },
      async createWorkflowRun(workflowId: string, userId: string, totalSteps: number, contextData: any, triggerEvent?: string | null) {
        const run = {
          id: `wfrun_${Date.now()}_${Math.random()}`,
          workflowId,
          userId,
          status: WorkflowRunStatus.RUNNING,
          triggerEvent: triggerEvent || null,
          currentStepIndex: 0,
          totalSteps,
          contextData,
          errorLog: null,
          startedAt: new Date().toISOString(),
          completedAt: null,
        };
        runs.set(run.id, run);
        return run;
      },
      async getWorkflowRunById(id: string, userId: string) {
        return runs.get(id) || null;
      },
      async updateWorkflowRunStatus(id: string, userId: string, status: WorkflowRunStatus, currentStepIndex: number, errorLog?: string | null) {
        const r = runs.get(id);
        if (!r) return null;
        r.status = status;
        r.currentStepIndex = currentStepIndex;
        r.errorLog = errorLog || null;
        if (status === WorkflowRunStatus.COMPLETED || status === WorkflowRunStatus.FAILED) {
          r.completedAt = new Date().toISOString();
        }
        return r;
      },
      async listWorkflowRuns(workflowId: string, userId: string) {
        return Array.from(runs.values()).filter(r => r.workflowId === workflowId && r.userId === userId);
      },
      async createWorkflowStepRun(workflowRunId: string, stepId: string, name: string, inputPayload: any) {
        const step = {
          id: `steprun_${Date.now()}_${Math.random()}`,
          workflowRunId,
          stepId,
          name,
          status: WorkflowStepStatus.RUNNING,
          inputPayload,
          outputPayload: null,
          retryAttempts: 0,
          durationMs: 0,
          errorMessage: null,
          executedAt: new Date().toISOString(),
        };
        const list = steps.get(workflowRunId) || [];
        list.push(step);
        steps.set(workflowRunId, list);
        return step;
      },
      async completeWorkflowStepRun(id: string, status: WorkflowStepStatus, outputPayload: any, durationMs: number, errorMessage?: string | null) {
        for (const list of steps.values()) {
          const s = list.find(item => item.id === id);
          if (s) {
            s.status = status;
            s.outputPayload = outputPayload;
            s.durationMs = durationMs;
            s.errorMessage = errorMessage || null;
            return s;
          }
        }
        return null;
      },
      async listWorkflowStepRuns(workflowRunId: string) {
        return steps.get(workflowRunId) || [];
      },
    };
  };

  test('1. should create workflow definition and execute all DAG pipeline steps sequentially with context', async () => {
    const mockRepo = createMockRepo();
    const service = new WorkflowEngineService(mockRepo as any);

    const def = await service.createDefinition('user-1', {
      title: 'Autonomous Tech Placement Pipeline',
      description: 'End-to-end multi-agent pipeline for enterprise hiring & candidate verification',
      workflowType: DistributedWorkflowType.HIRING_WORKFLOW,
      isEnterprise: true,
      steps: [
        {
          stepId: 'step_screening',
          name: 'AI Candidate Screening & ATS Evaluation',
          agentRole: WorkforceAgentRole.RECRUITER_AGENT,
          actionType: 'evaluate_candidate_resume',
          config: { threshold: 85 },
        },
        {
          stepId: 'step_challenge',
          name: 'Dynamic Technical Challenge Generation',
          agentRole: WorkforceAgentRole.FACULTY_AGENT,
          actionType: 'generate_technical_challenge',
          dependsOn: ['step_screening'],
          config: { difficulty: 'hard' },
        },
        {
          stepId: 'step_feedback',
          name: 'Executive Decision Synthesis & Recommendation',
          agentRole: WorkforceAgentRole.EXECUTIVE_AGENT,
          actionType: 'synthesize_hiring_report',
          dependsOn: ['step_challenge'],
          config: { exportFormat: 'pdf_json' },
        },
      ],
    });

    assert.strictEqual(def.title, 'Autonomous Tech Placement Pipeline');
    assert.strictEqual(def.steps.length, 3);

    const run = await service.executeWorkflow(def.id, 'user-1', { candidateId: 'cand_123' });
    assert.ok(run.id);
    assert.strictEqual(run.status, WorkflowRunStatus.COMPLETED);
    assert.strictEqual(run.currentStepIndex, 3);
    assert.ok(run.contextData['step_step_screening_output']);
    assert.ok(run.contextData['step_step_challenge_output']);
    assert.ok(run.contextData['step_step_feedback_output']);
  });

  test('2. should reject workflow creation with empty title or steps', async () => {
    const mockRepo = createMockRepo();
    const service = new WorkflowEngineService(mockRepo as any);

    await assert.rejects(async () => {
      await service.createDefinition('user-1', {
        title: '',
        description: 'No steps',
        workflowType: DistributedWorkflowType.PROJECT_WORKFLOW,
        steps: [],
      });
    }, /Workflow title and at least one step are required/);
  });

  test('3. should list workflow definitions filtered by workflow type', async () => {
    const mockRepo = createMockRepo();
    const service = new WorkflowEngineService(mockRepo as any);

    await service.createDefinition('user-1', {
      title: 'Research Pipeline',
      workflowType: DistributedWorkflowType.RESEARCH_WORKFLOW,
      steps: [{ stepId: 's1', name: 'Scan arXiv', agentRole: WorkforceAgentRole.RESEARCH_AGENT, actionType: 'search' }],
    });

    await service.createDefinition('user-1', {
      title: 'Learning Track',
      workflowType: DistributedWorkflowType.LEARNING_WORKFLOW,
      steps: [{ stepId: 's1', name: 'Generate Quiz', agentRole: WorkforceAgentRole.FACULTY_AGENT, actionType: 'quiz' }],
    });

    const researchDefs = await service.listDefinitions('user-1', DistributedWorkflowType.RESEARCH_WORKFLOW);
    assert.strictEqual(researchDefs.length, 1);
    assert.strictEqual(researchDefs[0].title, 'Research Pipeline');
  });

  test('4. should list workflow execution runs and step breakdown', async () => {
    const mockRepo = createMockRepo();
    const service = new WorkflowEngineService(mockRepo as any);

    const def = await service.createDefinition('user-1', {
      title: 'Quick Pipeline',
      workflowType: DistributedWorkflowType.CAREER_WORKFLOW,
      steps: [{ stepId: 's1', name: 'Step 1', agentRole: WorkforceAgentRole.CAREER_AGENT, actionType: 'analyze' }],
    });

    const run = await service.executeWorkflow(def.id, 'user-1');
    const runs = await service.listRuns(def.id, 'user-1');
    assert.strictEqual(runs.length, 1);

    const stepRuns = await service.listStepRuns(run.id);
    assert.strictEqual(stepRuns.length, 1);
    assert.strictEqual(stepRuns[0].name, 'Step 1');
  });
});
