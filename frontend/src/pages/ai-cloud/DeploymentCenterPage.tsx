import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { aiCloudApi } from '../../services/aiCloudApi';
import { WorkloadType } from '@codeforge/shared';

export const DeploymentCenterPage: React.FC = () => {
  const navigate = useNavigate();
  const [clusterId, setClusterId] = useState('cluster-seed-1');
  const [workloadType, setWorkloadType] = useState<WorkloadType>(WorkloadType.INFERENCE);
  const [replicaCount, setReplicaCount] = useState(2);
  const [cpuLimit, setCpuLimit] = useState(8);
  const [memoryLimitGb, setMemoryLimitGb] = useState(64);
  const [gpuLimit, setGpuLimit] = useState(2);
  const [loading, setLoading] = useState(false);

  const handleDeploy = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await aiCloudApi.deployWorkload({
        clusterId,
        workloadType,
        replicaCount,
        cpuLimit,
        memoryLimitGb,
        gpuLimit,
      });
      navigate('/ai-cloud');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-indigo-900/40 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-3xl">🚀</span>
            <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-amber-400">
              Deployment Configuration
            </h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Launch agent workload containers, specify hardware thresholds, and verify live pod replication.
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
        <form onSubmit={handleDeploy} className="lg:col-span-2 space-y-6 bg-slate-900/40 border border-slate-900 p-8 rounded-2xl shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase text-slate-400">Target Cluster</label>
              <select
                className="w-full bg-slate-950 border border-slate-850 focus:border-indigo-500 rounded-lg p-3 text-sm text-slate-100 font-medium transition-all focus:outline-none"
                value={clusterId}
                onChange={(e) => setClusterId(e.target.value)}
              >
                <option value="cluster-seed-1">Primary H100 Cluster - US East</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase text-slate-400">Workload Container Type</label>
              <select
                className="w-full bg-slate-950 border border-slate-850 focus:border-indigo-500 rounded-lg p-3 text-sm text-slate-100 font-medium transition-all focus:outline-none"
                value={workloadType}
                onChange={(e) => setWorkloadType(e.target.value as WorkloadType)}
              >
                <option value={WorkloadType.INFERENCE}>Inference Endpoints Proxy</option>
                <option value={WorkloadType.TRAINING}>Training Run Jobs</option>
                <option value={WorkloadType.FINE_TUNING}>Fine-Tuning Adaptation</option>
                <option value={WorkloadType.AGENT_FLEET}>Distributed Agent Fleet</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase text-slate-400">Replica Pool Count</label>
              <input
                type="number"
                required
                className="w-full bg-slate-950 border border-slate-850 focus:border-indigo-500 rounded-lg p-3 text-sm text-slate-100 font-medium transition-all focus:outline-none"
                value={replicaCount}
                onChange={(e) => setReplicaCount(Number(e.target.value))}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase text-slate-400">GPU Resource Limit (Cores)</label>
              <input
                type="number"
                required
                className="w-full bg-slate-950 border border-slate-850 focus:border-indigo-500 rounded-lg p-3 text-sm text-slate-100 font-medium transition-all focus:outline-none"
                value={gpuLimit}
                onChange={(e) => setGpuLimit(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase text-slate-400">CPU Allocation Limit (Cores)</label>
              <input
                type="number"
                required
                className="w-full bg-slate-950 border border-slate-850 focus:border-indigo-500 rounded-lg p-3 text-sm text-slate-100 font-medium transition-all focus:outline-none"
                value={cpuLimit}
                onChange={(e) => setCpuLimit(Number(e.target.value))}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase text-slate-400">Memory Allocation limit (GB)</label>
              <input
                type="number"
                required
                className="w-full bg-slate-950 border border-slate-850 focus:border-indigo-500 rounded-lg p-3 text-sm text-slate-100 font-medium transition-all focus:outline-none"
                value={memoryLimitGb}
                onChange={(e) => setMemoryLimitGb(Number(e.target.value))}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-amber-500 hover:opacity-90 font-bold text-white text-sm tracking-wider uppercase transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2"
          >
            {loading ? 'Orchestrating Pod Provisioning...' : '🚀 Launch Pod Workload ➔'}
          </button>
        </form>

        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-900 shadow-2xl h-fit space-y-4">
          <h2 className="text-lg font-bold text-slate-200">Scaling Constraints</h2>
          <div className="space-y-4 text-xs">
            <div className="flex gap-3">
              <div className="w-5 h-5 rounded-full bg-indigo-950 border border-indigo-500/30 text-[10px] font-mono flex items-center justify-center text-indigo-400 shrink-0">1</div>
              <div>
                <h4 className="font-semibold text-slate-300">GPU Resource Pools</h4>
                <p className="text-slate-500 text-[11px] mt-0.5">High GPU limits automatically allocate H100 hosts rather than standard A100 systems.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-5 h-5 rounded-full bg-indigo-950 border border-indigo-500/30 text-[10px] font-mono flex items-center justify-center text-indigo-400 shrink-0">2</div>
              <div>
                <h4 className="font-semibold text-slate-300">Cost Monitoring</h4>
                <p className="text-slate-500 text-[11px] mt-0.5">Workloads automatically incur simulated running rates proportional to GPU/CPU usage.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
