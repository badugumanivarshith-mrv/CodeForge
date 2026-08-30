import React, { useEffect, useState } from 'react';
import { agentEcosystemApi } from '../../services/agentEcosystemApi';
import { AgentOverviewDto } from '@codeforge/shared';

export const AgentDashboardPage: React.FC = () => {
  const [overview, setOverview] = useState<AgentOverviewDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    agentEcosystemApi
      .getOverview()
      .then((data) => {
        setOverview(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-indigo-400 font-mono">
        <div className="text-xl animate-pulse">Initializing Agent Ecosystem Telemetry...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex justify-between items-center border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Agent Ecosystem Dashboard
            </h1>
            <p className="text-slate-400 mt-2">
              Autonomous swarm orchestrator coordinating multi-agent workflows, shared memory structures, and task delegations.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-full px-4 py-2 text-sm font-mono text-indigo-400">
            <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-ping"></span>
            Swarm Mesh Active
          </div>
        </div>

        {/* Telemetry Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 p-6 rounded-2xl shadow-xl hover:border-indigo-500/50 transition-all duration-300">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">Active Swarm</div>
            <div className="text-3xl font-extrabold text-indigo-400 mt-2">{overview?.metrics.activeAgentsCount ?? 0}</div>
            <div className="text-xs text-slate-500 mt-1">Autonomous agents online</div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 p-6 rounded-2xl shadow-xl hover:border-purple-500/50 transition-all duration-300">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">Tasks Delegated</div>
            <div className="text-3xl font-extrabold text-purple-300 mt-2">{overview?.metrics.totalTasksDelegated ?? 0}</div>
            <div className="text-xs text-slate-500 mt-1">Total jobs sent to mesh</div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 p-6 rounded-2xl shadow-xl hover:border-pink-500/50 transition-all duration-300">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">Success Rate</div>
            <div className="text-3xl font-extrabold text-pink-400 mt-2">{overview?.metrics.averageSuccessRate ?? 0}%</div>
            <div className="text-xs text-slate-500 mt-1">Mesh execution success score</div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 p-6 rounded-2xl shadow-xl hover:border-blue-500/50 transition-all duration-300">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">Knowledge Memories</div>
            <div className="text-3xl font-extrabold text-blue-400 mt-2">{overview?.metrics.totalMemoriesCount ?? 0}</div>
            <div className="text-xs text-slate-500 mt-1">Shared embedding context vectors</div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 p-6 rounded-2xl shadow-xl hover:border-teal-500/50 transition-all duration-300">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">Interactions Count</div>
            <div className="text-3xl font-extrabold text-teal-400 mt-2">{overview?.metrics.totalInteractionsCount ?? 0}</div>
            <div className="text-xs text-slate-500 mt-1">P2P message calls logged</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Agents Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shadow-xl">
              <h2 className="text-xl font-bold tracking-tight text-white mb-6">Swarm Registered Agents</h2>
              <div className="space-y-4">
                {overview?.agentsList.map((agent) => (
                  <div
                    key={agent.id}
                    className="bg-slate-950 border border-slate-800/80 rounded-xl p-5 hover:bg-slate-900 transition-all duration-200"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-base font-bold text-white">{agent.agentName}</h3>
                        <div className="text-xs text-indigo-400 font-mono mt-1">{agent.agentType}</div>
                      </div>
                      <span className="text-[10px] font-mono uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded">
                        {agent.status}
                      </span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {agent.capabilities.map((cap) => (
                        <span
                          key={cap}
                          className="text-[10px] bg-slate-850 text-slate-400 px-2 py-0.5 rounded border border-slate-800"
                        >
                          {cap}
                        </span>
                      ))}
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-4 border-t border-slate-800 pt-4 text-xs font-mono">
                      <div>
                        <span className="text-slate-500">Success Rate</span>
                        <div className="font-bold text-emerald-400">{agent.performanceMetrics.successRate}%</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Completed</span>
                        <div className="font-bold text-white">{agent.performanceMetrics.tasksCompleted} tasks</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Response</span>
                        <div className="font-bold text-white">{agent.performanceMetrics.averageResponseTimeMs}ms</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Tasks Column */}
          <div className="space-y-6">
            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shadow-xl">
              <h2 className="text-xl font-bold text-white mb-6">Recent Swarm Tasks</h2>
              {overview?.recentTasks.length === 0 ? (
                <div className="text-slate-500 text-sm font-mono py-4 text-center">No tasks dispatched to mesh.</div>
              ) : (
                <div className="space-y-4">
                  {overview?.recentTasks.map((t) => (
                    <div key={t.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="text-xs font-bold text-slate-300 font-mono">ID: {t.id.slice(-6)}</h4>
                        <span
                          className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded ${
                            t.status === 'success'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : t.status === 'running'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse'
                              : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                          }`}
                        >
                          {t.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{t.taskDescription}</p>
                      {t.outputResult && (
                        <div className="bg-slate-900 p-2 rounded text-[10px] text-slate-500 font-mono truncate">
                          Output: {JSON.stringify(t.outputResult)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
