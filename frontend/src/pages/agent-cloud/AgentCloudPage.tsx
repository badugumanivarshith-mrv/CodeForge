import React, { useState, useEffect } from 'react';
import {
  AgentInstanceDto,
  AgentRunDto,
  AgentHealthStatusDto,
  AgentCloudState,
  WorkforceAgentRole,
} from '@codeforge/shared';
import { agentCloudApi } from '../../services/agentCloudApi';

export const AgentCloudPage: React.FC = () => {
  const [agents, setAgents] = useState<AgentInstanceDto[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<AgentInstanceDto | null>(null);
  const [health, setHealth] = useState<AgentHealthStatusDto | null>(null);
  const [runs, setRuns] = useState<AgentRunDto[]>([]);
  const [executing, setExecuting] = useState(false);
  const [executionOutput, setExecutionOutput] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<WorkforceAgentRole>(WorkforceAgentRole.RESEARCH_AGENT);
  const [newPrompt, setNewPrompt] = useState('');

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    try {
      const data = await agentCloudApi.listAgents();
      if (data.length === 0) {
        // Create initial default autonomous agent if empty
        const defaultAgent = await agentCloudApi.createAgent({
          name: 'Atlas Autonomous Sentinel',
          description: 'Persistent cloud workforce orchestrator with self-healing runtime',
          role: WorkforceAgentRole.EXECUTIVE_AGENT,
          systemPrompt: 'You are the Atlas Autonomous Sentinel. Monitor workflows and maintain platform state.',
          capabilities: ['DAG Orchestration', 'Self-Healing', 'Continuous Telemetry'],
          assignedTools: ['code_sandbox_execute', 'semantic_search_docs'],
          isAlwaysOn: true,
        });
        setAgents([defaultAgent]);
        selectAgent(defaultAgent);
      } else {
        setAgents(data);
        selectAgent(data[0]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const selectAgent = async (agent: AgentInstanceDto) => {
    setSelectedAgent(agent);
    setExecutionOutput(null);
    try {
      const h = await agentCloudApi.getAgentHealth(agent.id);
      setHealth(h);
    } catch {
      setHealth(null);
    }
  };

  const handleStart = async (id: string) => {
    const updated = await agentCloudApi.startAgent(id);
    setAgents(agents.map(a => (a.id === id ? updated : a)));
    if (selectedAgent?.id === id) selectAgent(updated);
  };

  const handlePause = async (id: string) => {
    const updated = await agentCloudApi.pauseAgent(id);
    setAgents(agents.map(a => (a.id === id ? updated : a)));
    if (selectedAgent?.id === id) selectAgent(updated);
  };

  const handleTerminate = async (id: string) => {
    const updated = await agentCloudApi.terminateAgent(id);
    setAgents(agents.map(a => (a.id === id ? updated : a)));
    if (selectedAgent?.id === id) selectAgent(updated);
  };

  const handleRunAgent = async () => {
    if (!selectedAgent) return;
    try {
      setExecuting(true);
      const run = await agentCloudApi.runAgent(selectedAgent.id, {
        task: 'Execute full telemetry diagnostic and optimize workflow queue',
        timestamp: new Date().toISOString(),
      });
      setExecutionOutput(JSON.stringify(run.outputPayload, null, 2));
      setRuns([run, ...runs]);
    } catch (err: any) {
      setExecutionOutput(`Error executing agent: ${err?.message}`);
    } finally {
      setExecuting(false);
    }
  };

  const handleCreateAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPrompt) return;
    try {
      const created = await agentCloudApi.createAgent({
        name: newName,
        description: `Persistent cloud agent for role ${newRole}`,
        role: newRole,
        systemPrompt: newPrompt,
        capabilities: ['Real-Time Reasoning', 'Tool Invocation'],
        assignedTools: ['semantic_search_docs'],
        isAlwaysOn: true,
      });
      setAgents([created, ...agents]);
      selectAgent(created);
      setShowCreateModal(false);
      setNewName('');
      setNewPrompt('');
    } catch (err) {
      console.error(err);
    }
  };

  const getStateBadge = (state: AgentCloudState) => {
    switch (state) {
      case AgentCloudState.RUNNING:
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 animate-pulse';
      case AgentCloudState.PAUSED:
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case AgentCloudState.TERMINATED:
        return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 p-6 lg:p-10 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
                Persistent AI Agent Cloud
              </h1>
              <p className="text-sm text-slate-400">Autonomous multi-agent runtime, persistent memory fabrics & distributed execution</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium text-sm transition-all duration-200 shadow-lg shadow-indigo-600/30 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Deploy New Agent
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agent List Column */}
        <div className="lg:col-span-1 bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-5">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center justify-between">
            <span>Active Cloud Runtimes ({agents.length})</span>
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
          </h2>

          <div className="space-y-3 max-h-[680px] overflow-y-auto pr-1">
            {agents.map(agent => (
              <div
                key={agent.id}
                onClick={() => selectAgent(agent)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  selectedAgent?.id === agent.id
                    ? 'bg-indigo-950/40 border-indigo-500/50 shadow-md shadow-indigo-500/10'
                    : 'bg-slate-800/40 border-slate-800 hover:border-slate-700 hover:bg-slate-800/70'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-white text-base">{agent.name}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs border font-medium uppercase ${getStateBadge(agent.state)}`}>
                    {agent.state}
                  </span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-2 mb-3">{agent.description}</p>
                <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-800/80">
                  <span>Role: <strong className="text-slate-300 font-mono">{agent.role}</strong></span>
                  <span>Runs: <strong className="text-slate-300">{agent.totalRuns}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Agent Details & Runtime Console */}
        <div className="lg:col-span-2 space-y-6">
          {selectedAgent ? (
            <>
              {/* Agent Status Card */}
              <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl font-bold text-white">{selectedAgent.name}</h2>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs border font-medium uppercase ${getStateBadge(selectedAgent.state)}`}>
                        {selectedAgent.state}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 mt-1">{selectedAgent.description}</p>
                  </div>

                  {/* State Controls */}
                  <div className="flex items-center gap-2">
                    {selectedAgent.state !== AgentCloudState.RUNNING && (
                      <button
                        onClick={() => handleStart(selectedAgent.id)}
                        className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-semibold transition"
                      >
                        Start Agent
                      </button>
                    )}
                    {selectedAgent.state === AgentCloudState.RUNNING && (
                      <button
                        onClick={() => handlePause(selectedAgent.id)}
                        className="px-3 py-1.5 bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 border border-amber-500/30 rounded-lg text-xs font-semibold transition"
                      >
                        Pause Agent
                      </button>
                    )}
                    <button
                      onClick={() => handleTerminate(selectedAgent.id)}
                      className="px-3 py-1.5 bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/30 rounded-lg text-xs font-semibold transition"
                    >
                      Terminate
                    </button>
                  </div>
                </div>

                {/* Health Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                  <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                    <span className="text-xs text-slate-400">Health Status</span>
                    <p className="text-lg font-bold text-emerald-400 mt-1 flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                      {health?.isHealthy ? 'Optimal' : 'Degraded'}
                    </p>
                  </div>
                  <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                    <span className="text-xs text-slate-400">Error Rate</span>
                    <p className="text-lg font-bold text-indigo-300 mt-1">{health?.errorRate ?? 0}%</p>
                  </div>
                  <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                    <span className="text-xs text-slate-400">Active Runs</span>
                    <p className="text-lg font-bold text-purple-300 mt-1">{health?.activeRuns ?? 0}</p>
                  </div>
                  <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                    <span className="text-xs text-slate-400">Total Lifetime Runs</span>
                    <p className="text-lg font-bold text-pink-300 mt-1">{selectedAgent.totalRuns}</p>
                  </div>
                </div>

                {/* Capabilities & Tools */}
                <div className="mt-6 space-y-4">
                  <div>
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">System Capabilities</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedAgent.capabilities.map((cap, i) => (
                        <span key={i} className="px-2.5 py-1 bg-slate-800 text-slate-300 text-xs rounded-md border border-slate-700">
                          {cap}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Assigned Tools</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedAgent.assignedTools.map((tool, i) => (
                        <span key={i} className="px-2.5 py-1 bg-indigo-950/50 text-indigo-300 text-xs rounded-md border border-indigo-800/50 font-mono">
                          🔧 {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Execution Console */}
              <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-indigo-400"></span>
                    Autonomous Execution Runner
                  </h3>
                  <button
                    onClick={handleRunAgent}
                    disabled={executing || selectedAgent.state === AgentCloudState.TERMINATED}
                    className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition shadow-md shadow-indigo-600/20 flex items-center gap-2"
                  >
                    {executing ? (
                      <>
                        <svg className="animate-spin h-3.5 w-3.5 text-white" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                        </svg>
                        Executing Reasoning Loop...
                      </>
                    ) : (
                      '▶ Trigger Agent Run'
                    )}
                  </button>
                </div>

                {executionOutput && (
                  <div className="mt-4">
                    <span className="text-xs text-slate-400 font-mono">Execution Output Payload:</span>
                    <pre className="mt-2 p-4 bg-slate-950 border border-slate-800 text-emerald-400 text-xs font-mono rounded-xl overflow-x-auto">
                      {executionOutput}
                    </pre>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-slate-500 bg-slate-900/40 rounded-2xl border border-slate-800">
              Select an agent from the list to view runtime details
            </div>
          )}
        </div>
      </div>

      {/* Deploy Agent Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-4">Deploy Persistent Cloud Agent</h3>
            <form onSubmit={handleCreateAgent} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Agent Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="e.g. Orion Research Sentinel"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Agent Role</label>
                <select
                  value={newRole}
                  onChange={e => setNewRole(e.target.value as WorkforceAgentRole)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
                >
                  {Object.values(WorkforceAgentRole).map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">System Prompt</label>
                <textarea
                  rows={4}
                  required
                  value={newPrompt}
                  onChange={e => setNewPrompt(e.target.value)}
                  placeholder="Describe agent directives, decision heuristics, and execution boundaries..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg shadow-md shadow-indigo-600/30"
                >
                  Deploy Runtime
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
