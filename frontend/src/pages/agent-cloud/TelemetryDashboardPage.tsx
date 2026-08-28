import React, { useState, useEffect } from 'react';
import {
  TelemetryDashboardDto,
} from '@codeforge/shared';
import { agentCloudApi } from '../../services/agentCloudApi';

export const TelemetryDashboardPage: React.FC = () => {
  const [dashboard, setDashboard] = useState<TelemetryDashboardDto | null>(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const data = await agentCloudApi.getTelemetryDashboard();
      setDashboard(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 p-6 lg:p-10 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-pink-400 via-purple-300 to-indigo-400 bg-clip-text text-transparent">
              AI Observability & Telemetry
            </h1>
            <p className="text-sm text-slate-400">Real-time agent health monitoring, distributed trace latency, token tracking & cost allocation</p>
          </div>
        </div>

        <button
          onClick={loadDashboard}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-lg text-xs font-semibold transition flex items-center gap-2"
        >
          🔄 Refresh Metrics
        </button>
      </div>

      {dashboard && (
        <div className="space-y-6">
          {/* Key KPI Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400">Agents Online</span>
              <p className="text-xl font-bold text-white mt-1">{dashboard.totalAgentsOnline}</p>
            </div>
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400">Workflow Runs (24h)</span>
              <p className="text-xl font-bold text-indigo-400 mt-1">{dashboard.totalWorkflowRuns24h}</p>
            </div>
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400">Avg Latency</span>
              <p className="text-xl font-bold text-emerald-400 mt-1">{dashboard.averageExecutionLatencyMs} ms</p>
            </div>
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400">Tokens (24h)</span>
              <p className="text-xl font-bold text-purple-400 mt-1">{dashboard.totalTokensConsumed24h.toLocaleString()}</p>
            </div>
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400">Cost (24h)</span>
              <p className="text-xl font-bold text-amber-400 mt-1">${dashboard.totalCost24hUsd.toFixed(2)}</p>
            </div>
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400">Error Rate</span>
              <p className="text-xl font-bold text-pink-400 mt-1">{(dashboard.systemErrorRatePercent * 100).toFixed(2)}%</p>
            </div>
          </div>

          {/* Agent Health Matrix */}
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
              Autonomous Agent Health Matrix
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-500 font-mono uppercase">
                    <th className="pb-3">Agent Runtime</th>
                    <th className="pb-3">Avg Latency</th>
                    <th className="pb-3">Success Rate</th>
                    <th className="pb-3">Tokens Used</th>
                    <th className="pb-3">Allocated Cost</th>
                    <th className="pb-3">Health Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {dashboard.agentMetrics.map(agent => (
                    <tr key={agent.agentId} className="hover:bg-slate-800/30 transition">
                      <td className="py-3.5 font-semibold text-white">{agent.name}</td>
                      <td className="py-3.5 text-slate-300 font-mono">{agent.avgLatencyMs} ms</td>
                      <td className="py-3.5 text-emerald-400 font-mono">{Math.round(agent.successRate * 100)}%</td>
                      <td className="py-3.5 text-purple-300 font-mono">{agent.totalTokensConsumed.toLocaleString()}</td>
                      <td className="py-3.5 text-amber-300 font-mono">${agent.totalCostUsd.toFixed(2)}</td>
                      <td className="py-3.5">
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          Healthy
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cost Breakdown & Allocation */}
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">
              Infrastructure Cost Allocation Breakdown
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl">
                <span className="text-xs text-slate-400">Agent Reasoning & Planning</span>
                <p className="text-xl font-bold text-indigo-400 mt-1">${dashboard.costBreakdown.agentExecutionCostUsd.toFixed(2)}</p>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div className="bg-indigo-500 h-full w-[60%]"></div>
                </div>
              </div>
              <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl">
                <span className="text-xs text-slate-400">Tool & Plugin Invocations</span>
                <p className="text-xl font-bold text-purple-400 mt-1">${dashboard.costBreakdown.toolInvocationCostUsd.toFixed(2)}</p>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div className="bg-purple-500 h-full w-[25%]"></div>
                </div>
              </div>
              <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl">
                <span className="text-xs text-slate-400">Memory & Vector Storage</span>
                <p className="text-xl font-bold text-pink-400 mt-1">${dashboard.costBreakdown.storageAndMemoryCostUsd.toFixed(2)}</p>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div className="bg-pink-500 h-full w-[15%]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
