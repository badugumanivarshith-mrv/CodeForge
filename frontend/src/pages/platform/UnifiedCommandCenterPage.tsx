import React, { useEffect, useState } from 'react';
import { platformIntegrationApi } from '../../services/platformIntegrationApi';
import { PlatformOverviewDto } from '@codeforge/shared';

export const UnifiedCommandCenterPage: React.FC = () => {
  const [overview, setOverview] = useState<PlatformOverviewDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    platformIntegrationApi
      .getOverview()
      .then((data) => {
        setOverview(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-emerald-400 font-mono">
        <div className="text-xl animate-pulse">Initializing Platform Command Center Telemetry...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex justify-between items-center border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
              Unified Command Center
            </h1>
            <p className="text-slate-400 mt-2">
              Cross-module orchestration command console integrating Cognitive OS, VC Intelligence, Cybersecurity, and Software Factories.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-full px-4 py-2 text-sm font-mono text-emerald-400">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></span>
            Orchestrator Online
          </div>
        </div>

        {/* Telemetry Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 p-6 rounded-2xl shadow-xl hover:border-emerald-500/50 transition-all duration-300">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">Logged Events</div>
            <div className="text-3xl font-extrabold text-emerald-400 mt-2">{overview?.metrics.totalEventsCount ?? 0}</div>
            <div className="text-xs text-slate-500 mt-1">Total system activities logged</div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 p-6 rounded-2xl shadow-xl hover:border-teal-500/50 transition-all duration-300">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">Running Workflows</div>
            <div className="text-3xl font-extrabold text-teal-300 mt-2">{overview?.metrics.activeWorkflowsCount ?? 0}</div>
            <div className="text-xs text-slate-500 mt-1">Active cross-module workflows</div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 p-6 rounded-2xl shadow-xl hover:border-indigo-500/50 transition-all duration-300">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">Shared Context Keys</div>
            <div className="text-3xl font-extrabold text-indigo-400 mt-2">{overview?.metrics.unifiedContextKeysCount ?? 0}</div>
            <div className="text-xs text-slate-500 mt-1">Cross-module shared state fields</div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 p-6 rounded-2xl shadow-xl hover:border-rose-500/50 transition-all duration-300">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">Platform Threat Score</div>
            <div className="text-3xl font-extrabold text-rose-400 mt-2">{overview?.metrics.aggregateRiskScore ?? 0} / 100</div>
            <div className="text-xs text-slate-500 mt-1">Real-time threat level rating</div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 p-6 rounded-2xl shadow-xl hover:border-amber-500/50 transition-all duration-300">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">System Uptime</div>
            <div className="text-3xl font-extrabold text-amber-400 mt-2">{overview?.metrics.systemUptimeHours ?? 0}h</div>
            <div className="text-xs text-slate-500 mt-1">Continuous platform uptime</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Events Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shadow-xl">
              <h2 className="text-xl font-bold tracking-tight text-white mb-6 flex items-center gap-2">
                Recent Platform Events
              </h2>
              <div className="space-y-4">
                {overview?.recentEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="flex justify-between items-start bg-slate-950 border border-slate-800/80 rounded-xl p-4 hover:bg-slate-900 transition-all duration-200"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded font-mono">
                          {evt.sourceModule}
                        </span>
                        <h4 className="text-sm font-semibold text-white">{evt.eventName}</h4>
                      </div>
                      <p className="text-xs text-slate-400 font-mono mt-1">
                        Payload: {JSON.stringify(evt.payload)}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`text-xs font-mono uppercase font-bold px-2 py-0.5 rounded ${
                          evt.severity === 'critical'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            : evt.severity === 'warning'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}
                      >
                        {evt.severity}
                      </span>
                      <div className="text-[10px] text-slate-500 font-mono mt-2">
                        {new Date(evt.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Active Workflows & Shared State Context Column */}
          <div className="space-y-8">
            {/* Active Workflows */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shadow-xl">
              <h2 className="text-xl font-bold text-white mb-6">Running Orchestrations</h2>
              {overview?.activeWorkflows.length === 0 ? (
                <div className="text-slate-500 text-sm font-mono py-4 text-center">No running orchestrations.</div>
              ) : (
                <div className="space-y-4">
                  {overview?.activeWorkflows.map((wf) => (
                    <div key={wf.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-semibold text-teal-300">{wf.workflowName}</h4>
                        <span className="text-[10px] font-mono uppercase bg-teal-500/10 text-teal-400 border border-teal-500/20 px-2 py-0.5 rounded">
                          {wf.status}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {wf.executedSteps.map((step) => (
                          <div key={step.stepNumber} className="flex justify-between items-center text-xs">
                            <span className="text-slate-400">
                              Step {step.stepNumber}: {step.moduleName} ({step.actionTaken})
                            </span>
                            <span
                              className={`font-mono text-[10px] uppercase ${
                                step.status === 'success'
                                  ? 'text-emerald-400'
                                  : step.status === 'running'
                                  ? 'text-amber-400 animate-pulse'
                                  : 'text-slate-500'
                              }`}
                            >
                              {step.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Context Keys */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shadow-xl">
              <h2 className="text-xl font-bold text-white mb-4">Unified State Variable Registry</h2>
              <div className="flex flex-wrap gap-2">
                {overview?.contextKeys.map((key) => (
                  <span
                    key={key}
                    className="text-xs font-mono bg-slate-800 hover:bg-slate-700 text-indigo-300 px-3 py-1.5 rounded-lg border border-slate-700/60 transition-colors"
                  >
                    ${key}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
