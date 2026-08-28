import React, { useState, useEffect } from 'react';
import {
  WorkflowDefinitionDto,
  WorkflowRunDto,
  DistributedWorkflowType,
  WorkforceAgentRole,
} from '@codeforge/shared';
import { agentCloudApi } from '../../services/agentCloudApi';

export const WorkflowStudioPage: React.FC = () => {
  const [workflows, setWorkflows] = useState<WorkflowDefinitionDto[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowDefinitionDto | null>(null);
  const [activeRun, setActiveRun] = useState<WorkflowRunDto | null>(null);
  const [executing, setExecuting] = useState(false);
  const [filterType, setFilterType] = useState<DistributedWorkflowType | 'all'>('all');

  useEffect(() => {
    loadWorkflows();
  }, [filterType]);

  const loadWorkflows = async () => {
    try {
      const type = filterType === 'all' ? undefined : filterType;
      const list = await agentCloudApi.listWorkflows(type);
      if (list.length === 0) {
        // Create initial starter DAG workflow
        const starter = await agentCloudApi.createWorkflow({
          title: 'Autonomous Technical Career Advancement Pipeline',
          description: 'Orchestrates skills gap analysis, interview simulation, and portfolio publishing',
          workflowType: DistributedWorkflowType.CAREER_WORKFLOW,
          isEnterprise: true,
          steps: [
            {
              stepId: 'step_gap_analysis',
              name: 'AI Skills & Repository Gap Analysis',
              agentRole: WorkforceAgentRole.CAREER_AGENT,
              actionType: 'analyze_skills_gap',
              config: { depth: 'exhaustive', targetRole: 'Senior AI Engineer' },
            },
            {
              stepId: 'step_interview_sim',
              name: 'Multi-Turn Socratic Technical Mock Interview',
              agentRole: WorkforceAgentRole.MENTOR_AGENT,
              actionType: 'conduct_mock_interview',
              dependsOn: ['step_gap_analysis'],
              config: { questionsCount: 5, difficulty: 'advanced' },
            },
            {
              stepId: 'step_portfolio_sync',
              name: 'Personal Brand & Verified Portfolio Sync',
              agentRole: WorkforceAgentRole.EXECUTIVE_AGENT,
              actionType: 'publish_portfolio_snapshot',
              dependsOn: ['step_interview_sim'],
              config: { targetPlatform: 'CodeForge Network' },
            },
          ],
        });
        setWorkflows([starter]);
        setSelectedWorkflow(starter);
      } else {
        setWorkflows(list);
        setSelectedWorkflow(list[0]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleExecute = async () => {
    if (!selectedWorkflow) return;
    try {
      setExecuting(true);
      const run = await agentCloudApi.executeWorkflow(selectedWorkflow.id, {
        triggeredBy: 'Workflow Studio UI',
        timestamp: new Date().toISOString(),
      });
      setActiveRun(run);
    } catch (err) {
      console.error(err);
    } finally {
      setExecuting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 p-6 lg:p-10 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-300 to-indigo-400 bg-clip-text text-transparent">
              Distributed Workflow Studio
            </h1>
            <p className="text-sm text-slate-400">Design, execute, and monitor multi-agent DAG pipelines across enterprise workflows</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value as any)}
            className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none"
          >
            <option value="all">All Workflow Domains</option>
            {Object.values(DistributedWorkflowType).map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Studio Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Workflows List */}
        <div className="lg:col-span-1 bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-5">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
            Workflow Definitions ({workflows.length})
          </h2>

          <div className="space-y-3">
            {workflows.map(wf => (
              <div
                key={wf.id}
                onClick={() => {
                  setSelectedWorkflow(wf);
                  setActiveRun(null);
                }}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  selectedWorkflow?.id === wf.id
                    ? 'bg-purple-950/40 border-purple-500/50 shadow-md shadow-purple-500/10'
                    : 'bg-slate-800/40 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-white text-sm">{wf.title}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-purple-500/20 text-purple-300 font-mono uppercase">
                    v{wf.version}
                  </span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-2 mb-2">{wf.description}</p>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="font-mono text-purple-400">{wf.workflowType}</span>
                  <span>{wf.steps.length} Steps</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Workflow Detail & DAG Visualizer */}
        <div className="lg:col-span-2 space-y-6">
          {selectedWorkflow ? (
            <>
              {/* Top Banner */}
              <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-white">{selectedWorkflow.title}</h2>
                    <p className="text-sm text-slate-400 mt-1">{selectedWorkflow.description}</p>
                  </div>
                  <button
                    onClick={handleExecute}
                    disabled={executing}
                    className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition shadow-lg shadow-purple-600/30 flex items-center gap-2"
                  >
                    {executing ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                        </svg>
                        Executing Pipeline...
                      </>
                    ) : (
                      '▶ Launch DAG Execution'
                    )}
                  </button>
                </div>
              </div>

              {/* DAG Pipeline Steps Visualizer */}
              <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
                <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-6 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-purple-400"></span>
                  Directed Acyclic Graph (DAG) Pipeline Steps
                </h3>

                <div className="space-y-4 relative">
                  {selectedWorkflow.steps.map((step, idx) => (
                    <div key={step.stepId} className="relative flex items-start gap-4">
                      {/* Step index pill */}
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-900/50 border border-purple-500/50 flex items-center justify-center font-bold text-purple-300 text-xs shadow-md">
                        {idx + 1}
                      </div>

                      {/* Step Card */}
                      <div className="flex-1 bg-slate-950/70 border border-slate-800 rounded-xl p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                          <h4 className="font-semibold text-white text-sm">{step.name}</h4>
                          <span className="px-2 py-0.5 rounded text-[11px] bg-slate-800 text-indigo-300 font-mono">
                            🤖 {step.agentRole || 'Automated Orchestrator'}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-slate-400 mt-2">
                          <span>Action: <strong className="text-slate-300 font-mono">{step.actionType}</strong></span>
                          {step.dependsOn && step.dependsOn.length > 0 && (
                            <span>Depends on: <strong className="text-purple-400 font-mono">{step.dependsOn.join(', ')}</strong></span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Live Execution Output Trace */}
              {activeRun && (
                <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
                      Execution Run Result ({activeRun.status})
                    </h3>
                    <span className="text-xs text-slate-500 font-mono">Run ID: {activeRun.id}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-4 text-xs">
                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                      <span className="text-slate-500">Status</span>
                      <p className="text-emerald-400 font-semibold uppercase mt-0.5">{activeRun.status}</p>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                      <span className="text-slate-500">Steps Completed</span>
                      <p className="text-white font-semibold mt-0.5">{activeRun.currentStepIndex} / {activeRun.totalSteps}</p>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                      <span className="text-slate-500">Started At</span>
                      <p className="text-white font-semibold mt-0.5">{new Date(activeRun.startedAt).toLocaleTimeString()}</p>
                    </div>
                  </div>

                  <pre className="p-4 bg-slate-950 border border-slate-800 text-emerald-400 text-xs font-mono rounded-xl overflow-x-auto max-h-60">
                    {JSON.stringify(activeRun.contextData, null, 2)}
                  </pre>
                </div>
              )}
            </>
          ) : (
            <div className="p-12 text-center text-slate-500 bg-slate-900/40 rounded-2xl border border-slate-800">
              Select a workflow from the list to inspect DAG graph and run executions
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
