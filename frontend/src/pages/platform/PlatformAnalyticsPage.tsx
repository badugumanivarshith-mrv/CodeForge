import React, { useEffect, useState } from 'react';
import { platformIntegrationApi } from '../../services/platformIntegrationApi';
import { PlatformHealthDto } from '@codeforge/shared';

export const PlatformAnalyticsPage: React.FC = () => {
  const [health, setHealth] = useState<PlatformHealthDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    platformIntegrationApi
      .getHealth()
      .then((data) => {
        setHealth(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-emerald-400 font-mono">
        <div className="text-xl animate-pulse">Retrieving Core Health Telemetry Data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="border-b border-slate-800 pb-6">
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
            Platform Analytics & Health
          </h1>
          <p className="text-slate-400 mt-2">
            Real-time diagnostics diagnostics including CPU overheads, cluster memory profiles, and individual modules heartbeats.
          </p>
        </div>

        {/* Uptime and Resource Profiles */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 p-6 rounded-2xl shadow-xl">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">Diagnostic Uptime</div>
            <div className="text-3xl font-extrabold text-emerald-400 mt-2">
              {((health?.uptimeSeconds ?? 0) / 86400).toFixed(1)} days
            </div>
            <div className="text-xs text-slate-500 mt-1">Uptime: {health?.uptimeSeconds}s</div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 p-6 rounded-2xl shadow-xl">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">CPU Core Load</div>
            <div className="text-3xl font-extrabold text-teal-300 mt-2">{health?.cpuUsagePercent}%</div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden">
              <div
                className="bg-teal-400 h-1.5 rounded-full"
                style={{ width: `${health?.cpuUsagePercent ?? 0}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 p-6 rounded-2xl shadow-xl">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">Memory Allocation</div>
            <div className="text-3xl font-extrabold text-indigo-400 mt-2">{health?.memoryUsagePercent}%</div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden">
              <div
                className="bg-indigo-400 h-1.5 rounded-full"
                style={{ width: `${health?.memoryUsagePercent ?? 0}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 p-6 rounded-2xl shadow-xl">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">Workflow Errors</div>
            <div className="text-3xl font-extrabold text-rose-400 mt-2">{health?.totalErrorsLogged}</div>
            <div className="text-xs text-slate-500 mt-1">Errors captured in last 24h</div>
          </div>
        </div>

        {/* Modules Heartbeat grid */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 shadow-xl">
          <h2 className="text-xl font-bold text-white mb-6">Autonomous Modules Heartbeat Registry</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {health?.moduleHealth &&
              Object.entries(health.moduleHealth).map(([moduleName, status]) => (
                <div
                  key={moduleName}
                  className="bg-slate-950 border border-slate-800/80 rounded-2xl p-5 flex justify-between items-center"
                >
                  <span className="font-bold text-sm text-slate-300">{moduleName}</span>
                  <span
                    className={`text-xs font-mono uppercase font-bold px-3 py-1 rounded-full ${
                      status === 'healthy'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}
                  >
                    {status}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
