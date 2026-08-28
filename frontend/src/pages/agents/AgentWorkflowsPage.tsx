import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { agenticWorkspaceApi } from '../../services/agenticWorkspaceApi';
import {
  AgentWorkflowDto,
  WorkflowTriggerType,
  AgentType,
} from '@codeforge/shared';

export const AgentWorkflowsPage: React.FC = () => {
  const [workflows, setWorkflows] = useState<AgentWorkflowDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [triggeringId, setTriggeringId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newTrigger, setNewTrigger] = useState<WorkflowTriggerType>(WorkflowTriggerType.SCHEDULED_CRON);

  useEffect(() => {
    loadWorkflows();
  }, []);

  const loadWorkflows = async () => {
    try {
      setLoading(true);
      const data = await agenticWorkspaceApi.listWorkflows();
      setWorkflows(data);
    } catch (err) {
      console.error('Failed to load workflows:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTrigger = async (workflowId: string) => {
    try {
      setTriggeringId(workflowId);
      const updated = await agenticWorkspaceApi.triggerWorkflow(workflowId);
      setWorkflows(prev => prev.map(w => (w.id === workflowId ? updated : w)));
    } catch (err) {
      console.error('Failed to trigger workflow:', err);
    } finally {
      setTriggeringId(null);
    }
  };

  const handleCreateWorkflow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    try {
      const created = await agenticWorkspaceApi.createWorkflow({
        title: newTitle,
        description: newDesc,
        triggerType: newTrigger,
        steps: [
          {
            stepId: 'step-1',
            stepNumber: 1,
            agentType: AgentType.CODING_AGENT,
            action: 'Automated Codebase Static Analysis & Vulnerability Audit',
            inputTemplate: 'Run linter and check for memory safety bugs',
            dependencies: [],
          },
          {
            stepId: 'step-2',
            stepNumber: 2,
            agentType: AgentType.EXECUTIVE_ANALYTICS_AGENT,
            action: 'Calculate Sprint Velocity Delta & Quality Metrics',
            inputTemplate: 'Synthesize code quality scores and commit frequency',
            dependencies: ['step-1'],
          },
        ],
      });
      setWorkflows(prev => [created, ...prev]);
      setShowCreateModal(false);
      setNewTitle('');
      setNewDesc('');
    } catch (err) {
      console.error('Failed to create workflow:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-lg font-medium text-slate-300">Loading Autonomous Workflows...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center space-x-2">
              <Link to="/ai-command-center" className="text-xs text-indigo-400 hover:underline">
                ← AI Command Center
              </Link>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-400">Autonomous Orchestration</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white mt-1">
              Autonomous Workspace Workflows
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Recurring scheduled jobs and event-driven multi-agent execution pipelines.
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-lg shadow-indigo-500/20 transition-all self-start md:self-auto"
          >
            + Create Custom Workflow
          </button>
        </div>

        {/* Workflow Cards */}
        <div className="grid grid-cols-1 gap-6">
          {workflows.map(wf => (
            <div
              key={wf.id}
              className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                      {wf.triggerType}
                    </span>
                    {wf.scheduleCron && (
                      <span className="px-2 py-0.5 text-xs font-mono rounded bg-slate-800 text-slate-300">
                        ⏰ {wf.scheduleCron}
                      </span>
                    )}
                    <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                      wf.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                      wf.status === 'running' ? 'bg-amber-500/20 text-amber-400 animate-pulse' :
                      'bg-slate-800 text-slate-300'
                    }`}>
                      {wf.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white">{wf.title}</h3>
                  <p className="text-xs text-slate-400">{wf.description}</p>
                </div>

                <button
                  onClick={() => handleTrigger(wf.id)}
                  disabled={triggeringId === wf.id}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-xs font-bold text-white shadow-md disabled:opacity-50 transition-all whitespace-nowrap"
                >
                  {triggeringId === wf.id ? '⚡ Executing Workflow...' : '▶ Trigger Pipeline Now'}
                </button>
              </div>

              {/* Step Pipeline Visualization */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Agent Pipeline Steps ({wf.steps.length} Steps)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {wf.steps.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2 flex flex-col justify-between"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-indigo-500/20 text-indigo-400">
                            Step {step.stepNumber}
                          </span>
                          <span className="text-[10px] font-bold text-purple-400">{step.agentType}</span>
                        </div>
                        <h4 className="text-xs font-semibold text-slate-200">{step.action}</h4>
                        <p className="text-[11px] text-slate-500 font-mono italic">
                          "{step.inputTemplate}"
                        </p>
                      </div>

                      {step.outputSummary && (
                        <div className="pt-2 border-t border-slate-900 text-[11px] text-emerald-400 font-mono">
                          ✓ {step.outputSummary}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Create Workflow Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-lg p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Create Custom Autonomous Workflow</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-slate-400 hover:text-white text-lg"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateWorkflow} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Workflow Title</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    placeholder="e.g. Daily Bug Triage & Security Patching"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Description</label>
                  <textarea
                    value={newDesc}
                    onChange={e => setNewDesc(e.target.value)}
                    placeholder="Explain what this automated workflow orchestrates..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 h-20 resize-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Trigger Type</label>
                  <select
                    value={newTrigger}
                    onChange={e => setNewTrigger(e.target.value as WorkflowTriggerType)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value={WorkflowTriggerType.SCHEDULED_CRON}>Scheduled Cron</option>
                    <option value={WorkflowTriggerType.EVENT_DRIVEN}>Event Driven</option>
                    <option value={WorkflowTriggerType.GOAL_BASED}>Goal Based</option>
                    <option value={WorkflowTriggerType.MANUAL}>Manual Trigger</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-md"
                  >
                    Save & Activate
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
