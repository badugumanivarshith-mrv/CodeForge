import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { aiCloudApi } from '../../services/aiCloudApi';
import { CloudClusterDto, ClusterStatus } from '@codeforge/shared';

export const ClusterManagerPage: React.FC = () => {
  const [clusters, setClusters] = useState<CloudClusterDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await aiCloudApi.listClusters();
        setClusters(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Loading Cluster Manager...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-indigo-900/40 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-3xl">🖥️</span>
            <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-amber-400">
              Cluster Infrastructure Portal
            </h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Provision and inspect regional host groups, compute hardware nodes, and memory allocations.
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
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-lg font-bold text-slate-200">Hardware Nodes Pool</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {clusters.map((cluster) => (
              <div key={cluster.id} className="p-6 rounded-2xl bg-slate-900/40 border border-slate-900 shadow-xl space-y-4 hover:border-indigo-500/20 transition-all">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-100 text-sm leading-normal">{cluster.name}</h3>
                    <span className="text-[9px] font-mono text-slate-500 block uppercase mt-0.5">{cluster.region}</span>
                  </div>
                  <span className={`text-[10px] font-mono font-extrabold px-2 py-0.5 rounded uppercase tracking-wider ${
                    cluster.status === ClusterStatus.HEALTHY ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' : 'bg-amber-950 text-amber-300 border border-amber-500/30'
                  }`}>
                    {cluster.status}
                  </span>
                </div>

                <div className="space-y-2.5 border-t border-slate-950 pt-4 text-xs">
                  <div className="flex justify-between font-mono">
                    <span className="text-slate-500">GPU Capacity:</span>
                    <span className="text-slate-300 font-bold">{cluster.totalGpus - cluster.availableGpus} / {cluster.totalGpus} GPUs</span>
                  </div>
                  <div className="flex justify-between font-mono">
                    <span className="text-slate-500">Memory Allocation:</span>
                    <span className="text-slate-300 font-bold">{cluster.totalMemoryGb - cluster.availableMemoryGb} / {cluster.totalMemoryGb} GB</span>
                  </div>
                  <div className="flex justify-between font-mono">
                    <span className="text-slate-500">CPU Usage:</span>
                    <span className="text-slate-300 font-bold">{cluster.totalCpuCores - cluster.availableCpuCores} / {cluster.totalCpuCores} Cores</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-900 shadow-2xl h-fit space-y-4">
          <h2 className="text-lg font-bold text-slate-200">Scale Metrics</h2>
          <div className="space-y-4 text-xs font-mono text-slate-400">
            <div>
              <span className="text-[10px] text-slate-500 block">Total Dedicated Compute</span>
              <span className="text-xl font-bold text-slate-200 block mt-0.5">1,024 Cores</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Active Compute Clusters</span>
              <span className="text-xl font-bold text-slate-200 block mt-0.5">{clusters.length} Regions</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Deploy Capacity Target</span>
              <span className="text-xl font-bold text-slate-200 block mt-0.5">85% Available</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
