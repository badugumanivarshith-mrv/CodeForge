import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { softwareFactoryApi } from '../../services/softwareFactoryApi';
import { SoftwareFactoryOverviewDto } from '@codeforge/shared';

export const SoftwareFactoryDashboardPage: React.FC = () => {
  const [overview, setOverview] = useState<SoftwareFactoryOverviewDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await softwareFactoryApi.getOverview();
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
    return <div className="p-8 text-center text-slate-400">Loading Software Factory OS...</div>;
  }

  const defaultOverview = overview || {
    metrics: {
      totalProjects: 0,
      activeProjects: 0,
      totalLinesOfCode: 0,
      buildSuccessRate: 0,
      activeAgentsCount: 0,
      averageTaskCompletionHours: 0,
      completedTasksCount: 0,
      failedTasksCount: 0,
      calculatedAt: new Date().toISOString(),
    },
    recentProjects: [],
    recentTasks: [],
    recentArtifacts: [],
    activeBlueprints: [],
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-indigo-900/40 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-3xl">⚙️</span>
            <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-amber-400">
              Autonomous Software Factory
            </h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Build and compile project blueprints, coordinate developer agents, and verify build pipelines.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/software-factory/generate"
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/30"
          >
            + Provision Project ➔
          </Link>
        </div>
      </div>

      {/* Navigation Quick Links */}
      <div className="flex flex-wrap gap-2 pt-1">
        {[
          { label: 'Factory Dashboard', path: '/software-factory', icon: '⚙️' },
          { label: 'Project Generator', path: '/software-factory/generate', icon: '🚀' },
          { label: 'Architecture Studio', path: '/software-factory/architecture', icon: '📐' },
          { label: 'Engineering Pipeline', path: '/software-factory/pipeline', icon: '📈' },
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
        <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md shadow-xl hover:border-indigo-500/30 transition-all">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Code Volume</div>
          <div className="text-3xl font-black text-indigo-400 mt-2">
            {defaultOverview.metrics.totalLinesOfCode.toLocaleString()} LOC
          </div>
          <div className="text-xs text-slate-500 mt-1">Generated across all workspaces</div>
        </div>

        <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md shadow-xl hover:border-purple-500/30 transition-all">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Build Success Rate</div>
          <div className="text-3xl font-black text-purple-400 mt-2">
            {defaultOverview.metrics.buildSuccessRate}%
          </div>
          <div className="text-xs text-slate-500 mt-1">Continuous Integration Telemetry</div>
        </div>

        <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md shadow-xl hover:border-amber-500/30 transition-all">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Active Developer Agents</div>
          <div className="text-3xl font-black text-amber-400 mt-2">
            {defaultOverview.metrics.activeAgentsCount} Agents
          </div>
          <div className="text-xs text-slate-500 mt-1">Orchestrating concurrent backlogs</div>
        </div>

        <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md shadow-xl hover:border-emerald-500/30 transition-all">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Completed Tasks</div>
          <div className="text-3xl font-black text-emerald-400 mt-2">
            {defaultOverview.metrics.completedTasksCount} Tasks
          </div>
          <div className="text-xs text-slate-500 mt-1">Average completion: {defaultOverview.metrics.averageTaskCompletionHours} hours</div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Recent Projects list */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-slate-200">Active Software Projects</h2>
          <div className="space-y-4">
            {defaultOverview.recentProjects.map((proj) => (
              <div key={proj.id} className="p-6 rounded-xl bg-slate-900/40 border border-slate-850 hover:border-indigo-500/20 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider">{proj.projectType.replace('_', ' ')}</span>
                      <h3 className="text-base font-bold text-slate-100 mt-1">{proj.name}</h3>
                      <p className="text-slate-400 text-xs mt-1">{proj.description}</p>
                    </div>
                    <span className={`text-[10px] font-mono font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${
                      proj.status === 'deployed'
                        ? 'bg-emerald-950 border border-emerald-500/30 text-emerald-400'
                        : 'bg-indigo-950 border border-indigo-500/30 text-indigo-300'
                    }`}>
                      {proj.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {proj.frameworks.map((fw) => (
                      <span key={fw} className="text-[9px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400">
                        {fw}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 border-t border-slate-950 mt-6 pt-4 text-xs font-mono text-slate-500">
                  <div>
                    <span>Volume</span>
                    <span className="block text-slate-300 font-bold mt-0.5">{proj.linesOfCodeGenerated.toLocaleString()} LOC</span>
                  </div>
                  <div>
                    <span>Complexity</span>
                    <span className="block text-slate-300 font-bold mt-0.5 uppercase">{proj.complexity}</span>
                  </div>
                  <div>
                    <span>Build Status</span>
                    <span className={`block font-bold mt-0.5 uppercase ${
                      proj.buildStatus === 'SUCCESS' ? 'text-emerald-400' : 'text-amber-400'
                    }`}>{proj.buildStatus}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Active build details */}
        <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-900 shadow-2xl h-fit space-y-6">
          <h2 className="text-lg font-bold text-slate-200">Active Build Logs</h2>
          <div className="p-4 rounded-lg bg-slate-950 border border-slate-900 font-mono text-[10px] text-slate-400 h-56 overflow-y-auto space-y-1 leading-relaxed">
            <div>[INIT] Provisioning virtual development workspace...</div>
            <div>[LOAD] Scanning framework dependencies and modules...</div>
            <div>[ANALYSIS] Architecture planner blueprint verified.</div>
            <div>[GENERATE] Emitting resource controller files...</div>
            <div>[TEST] Running integration testing suites...</div>
            <div className="text-emerald-400">[SUCCESS] Docker target bundle compiled successfully.</div>
            <div className="text-emerald-400">[DEPLOY] Deployment URL: https://ledger-api-gateway.codeforge.app</div>
          </div>

          <div className="space-y-3 border-t border-slate-850 pt-4">
            <h3 className="font-bold text-xs text-slate-200">Generated Code Snippets</h3>
            {defaultOverview.recentArtifacts.map((art) => (
              <div key={art.id} className="p-3 rounded-lg bg-slate-950 border border-slate-900">
                <span className="text-[9px] font-mono text-slate-500 block">{art.filePath}</span>
                <pre className="text-[9px] text-indigo-400 font-mono mt-1 overflow-x-auto whitespace-pre leading-normal">
                  {art.fileContent.slice(0, 150)}...
                </pre>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
