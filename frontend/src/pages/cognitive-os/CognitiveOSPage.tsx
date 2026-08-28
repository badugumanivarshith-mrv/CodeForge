import React, { useEffect, useState } from 'react';
import { cognitiveOsApi } from '../../services/cognitiveOsApi';
import { ExecutiveCommandCenterOverviewDto } from '@codeforge/shared';
import { Link } from 'react-router-dom';

export const CognitiveOSPage: React.FC = () => {
  const [overview, setOverview] = useState<ExecutiveCommandCenterOverviewDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await cognitiveOsApi.getExecutiveOverview();
        setOverview(data);
      } catch (err) {
        console.error('Failed to load cognitive overview', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Loading Cognitive Operating System Command Center...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-indigo-900/40 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🧠</span>
            <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              Autonomous Superintelligence & Cognitive OS
            </h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Executive Command Center 2.0 • Recursive Reasoning, Multi-Agent Councils, & Continuous Self-Improvement
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-lg bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 font-mono text-sm">
            Health Score: {overview?.cognitiveHealthScore || 96.8}%
          </div>
          <Link
            to="/digital-brain"
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/30"
          >
            Open Digital Brain ➔
          </Link>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md shadow-xl">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Cognitive Health</div>
          <div className="text-3xl font-black text-indigo-400 mt-2">{overview?.cognitiveHealthScore}%</div>
          <div className="text-xs text-emerald-400 mt-1">● Subsystem Equilibrium Optimal</div>
        </div>
        <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md shadow-xl">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Active Goals</div>
          <div className="text-3xl font-black text-purple-400 mt-2">{overview?.activeGoalsCount}</div>
          <div className="text-xs text-slate-400 mt-1">Recursive sub-goal tracking</div>
        </div>
        <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md shadow-xl">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Memories Synthesized</div>
          <div className="text-3xl font-black text-pink-400 mt-2">{overview?.totalMemoriesSynthesized}</div>
          <div className="text-xs text-emerald-400 mt-1">Ebbinghaus Consolidation Active</div>
        </div>
        <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md shadow-xl">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Self-Improvement Velocity</div>
          <div className="text-3xl font-black text-amber-400 mt-2">{overview?.selfImprovementVelocity}%</div>
          <div className="text-xs text-amber-400 mt-1">Adaptive Prompt Tuning</div>
        </div>
      </div>

      {/* Subsystem Navigation & Portals */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/digital-brain"
          className="p-6 rounded-xl bg-gradient-to-br from-indigo-950/40 to-slate-900 border border-indigo-800/40 hover:border-indigo-500 transition-all group"
        >
          <div className="text-2xl mb-2">⚡</div>
          <h3 className="text-lg font-bold text-indigo-300 group-hover:text-indigo-200">Personal Digital Brain</h3>
          <p className="text-xs text-slate-400 mt-2">
            Unified memory, personal knowledge graph, and interactive decision reasoning explanations.
          </p>
        </Link>
        <Link
          to="/memory-evolution"
          className="p-6 rounded-xl bg-gradient-to-br from-purple-950/40 to-slate-900 border border-purple-800/40 hover:border-purple-500 transition-all group"
        >
          <div className="text-2xl mb-2">🧬</div>
          <h3 className="text-lg font-bold text-purple-300 group-hover:text-purple-200">Memory Evolution System</h3>
          <p className="text-xs text-slate-400 mt-2">
            5-tier memory fabric (Working, Episodic, Semantic, Procedural, Strategic) with decay pruning.
          </p>
        </Link>
        <Link
          to="/agent-council"
          className="p-6 rounded-xl bg-gradient-to-br from-pink-950/40 to-slate-900 border border-pink-800/40 hover:border-pink-500 transition-all group"
        >
          <div className="text-2xl mb-2">🏛️</div>
          <h3 className="text-lg font-bold text-pink-300 group-hover:text-pink-200">Multi-Agent Councils</h3>
          <p className="text-xs text-slate-400 mt-2">
            Engineering, Research, Career, Education, & Executive Councils running dialectic debates.
          </p>
        </Link>
        <Link
          to="/predictive-intelligence"
          className="p-6 rounded-xl bg-gradient-to-br from-emerald-950/40 to-slate-900 border border-emerald-800/40 hover:border-emerald-500 transition-all group"
        >
          <div className="text-2xl mb-2">🔮</div>
          <h3 className="text-lg font-bold text-emerald-300 group-hover:text-emerald-200">Predictive Intelligence</h3>
          <p className="text-xs text-slate-400 mt-2">
            Multi-horizon forecasts (7d, 30d, 90d, 1y, 3y, 5y) with Bayesian risk modeling.
          </p>
        </Link>
        <Link
          to="/strategy-center"
          className="p-6 rounded-xl bg-gradient-to-br from-cyan-950/40 to-slate-900 border border-cyan-800/40 hover:border-cyan-500 transition-all group"
        >
          <div className="text-2xl mb-2">🗺️</div>
          <h3 className="text-lg font-bold text-cyan-300 group-hover:text-cyan-200">AI Strategy Engine</h3>
          <p className="text-xs text-slate-400 mt-2">
            Opportunity ranking, automated resource allocation, and multi-quarter strategic roadmaps.
          </p>
        </Link>
        <Link
          to="/autonomous-execution"
          className="p-6 rounded-xl bg-gradient-to-br from-amber-950/40 to-slate-900 border border-amber-800/40 hover:border-amber-500 transition-all group"
        >
          <div className="text-2xl mb-2">🔄</div>
          <h3 className="text-lg font-bold text-amber-300 group-hover:text-amber-200">Autonomous Execution Fabric</h3>
          <p className="text-xs text-slate-400 mt-2">
            Execute ➔ Observe ➔ Reflect ➔ Improve ➔ Retry closed-loop workflow orchestrator.
          </p>
        </Link>
      </div>

      {/* Top Strategic Opportunities */}
      <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <span>🎯</span> Top Strategic Opportunities & Autonomous Initiatives
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {overview?.topStrategicOpportunities.map((op, idx) => (
            <div key={idx} className="p-4 rounded-lg bg-slate-950/70 border border-slate-800/80 flex justify-between items-center">
              <div>
                <div className="font-semibold text-slate-200 text-sm">{op.title}</div>
                <div className="text-xs text-indigo-400 uppercase mt-1">Priority: {op.priority}</div>
              </div>
              <div className="text-right">
                <div className="text-emerald-400 font-bold font-mono">{op.potentialImpact}%</div>
                <div className="text-xs text-slate-500">Expected ROI</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
