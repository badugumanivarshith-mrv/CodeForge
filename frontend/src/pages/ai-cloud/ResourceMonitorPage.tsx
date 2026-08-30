import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { aiCloudApi } from '../../services/aiCloudApi';
import { AICloudOverviewDto } from '@codeforge/shared';

export const ResourceMonitorPage: React.FC = () => {
  const [overview, setOverview] = useState<AICloudOverviewDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await aiCloudApi.getOverview();
        setOverview(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Loading Resource Monitor...</div>;
  }

  const defaultStats = overview?.overviewStats || {
    totalAllocatedCostUsd: 4.80,
    activeDeploymentsCount: 1,
    globalAverageLatencyMs: 145.2,
    aggregateGpuUtilization: 39.2,
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-indigo-900/40 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-3xl">📊</span>
            <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-amber-400">
              Resource Telemetry Monitor
            </h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Analyze CPU, memory, GPU utilization, and simulated multi-region latency benchmarks.
          </p>
        </div>
      </div>

      {/* Navigation Quick Links */}
      <div className="flex flex-wrap gap-2 pt-1">
        {[
          { label: 'Cloud Overview', path: '/ai-cloud', icon: '☁️' },
          { label: 'Cluster Manager', path: '/ai-cloud/clusters', icon: '🖥️' },
          { label: 'Deployment Center', path: '/ai-cloud/deploy', icon: '🚀' },
          { label: 'Resource Monitor', path: '/ai-cloud/monitor', icon: '📊' },
        ].map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="px-3.5 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/80 text-xs font-semibold text-slate-300 transition-all flex items-center gap-1.5 shadow-md"
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Utilization details */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/40 border border-slate-900 shadow-xl space-y-6">
          <h2 className="text-lg font-bold text-slate-200">Simulated Cluster Load Rates</h2>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-mono text-slate-400">
                <span>GPU Allocation Capacity</span>
                <span className="text-indigo-400 font-bold">{defaultStats.aggregateGpuUtilization}%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-950 mt-1.5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                  style={{ width: `${defaultStats.aggregateGpuUtilization}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono text-slate-400">
                <span>System Memory Allocations</span>
                <span className="text-purple-400 font-bold">58%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-950 mt-1.5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-amber-500 rounded-full"
                  style={{ width: '58%' }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono text-slate-400">
                <span>CPU Core Load</span>
                <span className="text-amber-400 font-bold">35.8%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-950 mt-1.5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full"
                  style={{ width: '35.8%' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Multi-region latencies */}
        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-900 shadow-xl space-y-4">
          <h2 className="text-lg font-bold text-slate-200">Multi-Region Gateway Pings</h2>
          <div className="space-y-3">
            {[
              { region: 'US East (N. Virginia)', latency: '18 ms', color: 'text-emerald-400' },
              { region: 'US West (Oregon)', latency: '48 ms', color: 'text-emerald-400' },
              { region: 'EU West (Frankfurt)', latency: '98 ms', color: 'text-amber-400' },
              { region: 'Asia Pacific (Hong Kong)', latency: '185 ms', color: 'text-rose-400' },
            ].map((r, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 rounded-lg bg-slate-950 border border-slate-900">
                <span className="text-xs font-semibold text-slate-300">{r.region}</span>
                <span className={`text-xs font-mono font-bold ${r.color}`}>{r.latency}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
