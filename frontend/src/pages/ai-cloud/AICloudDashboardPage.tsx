import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { aiCloudApi } from '../../services/aiCloudApi';
import { AICloudOverviewDto } from '@codeforge/shared';

export const AICloudDashboardPage: React.FC = () => {
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
    return <div className="p-8 text-center text-slate-400">Loading AI Cloud Control Center...</div>;
  }

  const defaultOverview = overview || {
    clusters: [],
    nodes: [],
    deployments: [],
    metrics: [],
    overviewStats: {
      totalAllocatedCostUsd: 0,
      activeDeploymentsCount: 0,
      globalAverageLatencyMs: 0,
      aggregateGpuUtilization: 0,
    },
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-indigo-900/40 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-3xl">☁️</span>
            <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-amber-400">
              Autonomous AI Cloud OS
            </h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Provision server clusters, deploy distributed workload containers, route token inference requests, and monitor resource costs.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/ai-cloud/deploy"
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/30"
          >
            + Deploy Workload ➔
          </Link>
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

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-880 backdrop-blur-md shadow-xl hover:border-indigo-500/30 transition-all">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Run Rate Cost</div>
          <div className="text-3xl font-black text-indigo-400 mt-2">
            ${defaultOverview.overviewStats.totalAllocatedCostUsd.toFixed(2)}/hr
          </div>
          <div className="text-xs text-slate-500 mt-1">Simulated compute billing</div>
        </div>

        <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-880 backdrop-blur-md shadow-xl hover:border-purple-500/30 transition-all">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Active Deployments</div>
          <div className="text-3xl font-black text-purple-400 mt-2">
            {defaultOverview.overviewStats.activeDeploymentsCount} Pods
          </div>
          <div className="text-xs text-slate-500 mt-1">Running agent containers</div>
        </div>

        <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-880 backdrop-blur-md shadow-xl hover:border-amber-500/30 transition-all">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Avg Gateway Latency</div>
          <div className="text-3xl font-black text-amber-400 mt-2">
            {defaultOverview.overviewStats.globalAverageLatencyMs} ms
          </div>
          <div className="text-xs text-slate-500 mt-1">Token routing pathway round-trip</div>
        </div>

        <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-880 backdrop-blur-md shadow-xl hover:border-emerald-500/30 transition-all">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">GPU Utilization</div>
          <div className="text-3xl font-black text-emerald-400 mt-2">
            {defaultOverview.overviewStats.aggregateGpuUtilization}%
          </div>
          <div className="text-xs text-slate-500 mt-1">Average cluster allocation</div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Cluster Clusters Health & Active nodes */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-lg font-bold text-slate-200">Active Server Clusters</h2>
          <div className="space-y-4">
            {defaultOverview.clusters.map((c) => (
              <div key={c.id} className="p-6 rounded-xl bg-slate-900/40 border border-slate-850 hover:border-indigo-500/20 transition-all">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider">{c.region.replace('_', ' ')}</span>
                    <h3 className="text-base font-bold text-slate-100 mt-1">{c.name}</h3>
                  </div>
                  <span className={`text-[10px] font-mono font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${
                    c.status === 'healthy'
                      ? 'bg-emerald-950 border border-emerald-500/30 text-emerald-400'
                      : 'bg-amber-950 border border-amber-500/30 text-amber-300'
                  }`}>
                    {c.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4 border-t border-slate-950 mt-6 pt-4 text-xs font-mono text-slate-500">
                  <div>
                    <span>TPU / GPU Cores</span>
                    <span className="block text-slate-300 font-bold mt-0.5">{c.totalGpus - c.availableGpus} / {c.totalGpus} Allocated</span>
                  </div>
                  <div>
                    <span>Memory Allocation</span>
                    <span className="block text-slate-300 font-bold mt-0.5">{c.totalMemoryGb - c.availableMemoryGb} / {c.totalMemoryGb} GB</span>
                  </div>
                  <div>
                    <span>CPU Cores</span>
                    <span className="block text-slate-300 font-bold mt-0.5">{c.totalCpuCores - c.availableCpuCores} / {c.totalCpuCores} Cores</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-lg font-bold text-slate-200">Active Host Nodes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {defaultOverview.nodes.map((node) => (
              <div key={node.id} className="p-4 rounded-xl bg-slate-900/30 border border-slate-900 flex justify-between items-center">
                <div>
                  <h4 className="text-xs font-bold text-slate-200">{node.name}</h4>
                  <span className="text-[9px] font-mono text-slate-500 block uppercase mt-0.5">{node.nodeType}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-indigo-400 block">{node.gpuUtilizationPercent}% GPU</span>
                  <span className="text-[9px] font-mono text-slate-500 block mt-0.5">{node.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Deployment logs stream */}
        <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-900 shadow-2xl h-fit space-y-6">
          <h2 className="text-lg font-bold text-slate-200">Deployment Logs Stream</h2>
          {defaultOverview.deployments.map((d) => (
            <div key={d.id} className="space-y-3">
              <span className="text-[10px] font-mono text-indigo-400 block uppercase tracking-wider">{d.workloadType}</span>
              <div className="p-4 rounded-lg bg-slate-950 border border-slate-900 font-mono text-[10px] text-slate-400 h-56 overflow-y-auto space-y-1 leading-relaxed">
                {d.logs.map((log, idx) => (
                  <div key={idx} className={log.includes('SUCCESS') ? 'text-emerald-400' : ''}>
                    {log}
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="border-t border-slate-850 pt-4 space-y-3">
            <h3 className="font-bold text-xs text-slate-200">Network Resource Inbound / Outbound</h3>
            {defaultOverview.metrics.map((m) => (
              <div key={m.id} className="flex justify-between items-center text-xs font-mono text-slate-400">
                <span>Inbound: {m.networkInboundGbps} Gbps</span>
                <span>Outbound: {m.networkOutboundGbps} Gbps</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
