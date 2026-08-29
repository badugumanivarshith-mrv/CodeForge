import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { enterpriseCivilizationApi } from '../../services/enterpriseCivilizationApi';
import { EnterpriseCommandCenterOverviewDto } from '@codeforge/shared';

export const EnterpriseCommandCenterPage: React.FC = () => {
  const [overview, setOverview] = useState<EnterpriseCommandCenterOverviewDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await enterpriseCivilizationApi.getOverview();
        setOverview(data);
      } catch (err) {
        console.error('Failed to load enterprise command center overview', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Loading Enterprise Civilization Command Center...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-cyan-900/40 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏢</span>
            <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400">
              Autonomous Enterprise Civilization
            </h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Global AI Workforce Operating System • Multi-Enterprise Federations • Autonomous Product Factories & Sovereign Venture Intelligence
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-mono text-sm">
            Efficiency: {overview?.averageOrganizationalEfficiency || 98.4}%
          </div>
          <Link
            to="/organization-engine"
            className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-sm transition-all shadow-lg shadow-cyan-600/30"
          >
            Launch Enterprise ➔
          </Link>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md shadow-xl">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Active Enterprises</div>
          <div className="text-3xl font-black text-cyan-400 mt-2">{overview?.totalActiveOrganizations || 0}</div>
          <p className="text-xs text-slate-500 mt-1">Autonomous multi-department entities</p>
        </div>

        <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md shadow-xl">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Digital Workforce</div>
          <div className="text-3xl font-black text-teal-400 mt-2">{overview?.totalDigitalWorkforceHeadcount || 0}</div>
          <p className="text-xs text-slate-500 mt-1">Autonomous AI specialists deployed</p>
        </div>

        <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md shadow-xl">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Capital Committed</div>
          <div className="text-3xl font-black text-emerald-400 mt-2">
            ${((overview?.totalCapitalCommittedUsd || 7500000) / 1000000).toFixed(1)}M
          </div>
          <p className="text-xs text-slate-500 mt-1">Sovereign Venture investments</p>
        </div>

        <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md shadow-xl">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Execution Velocity</div>
          <div className="text-3xl font-black text-purple-400 mt-2">{overview?.networkTasksExecutionRate || 98.6}%</div>
          <p className="text-xs text-slate-500 mt-1">Autonomous task completion rate</p>
        </div>
      </div>

      {/* Navigation Subsystem Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          to="/organization-engine"
          className="group p-6 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900/80 transition-all backdrop-blur-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-2xl">🏛️</span>
            <span className="text-xs font-mono text-cyan-400 group-hover:translate-x-1 transition-transform">EXPLORE ➔</span>
          </div>
          <h3 className="text-lg font-bold text-slate-100 mt-4 group-hover:text-cyan-300 transition-colors">
            AI Organization Engine
          </h3>
          <p className="text-xs text-slate-400 mt-2">
            Design hierarchical organizations, auto-generate departments & teams, and optimize workforce capacity models.
          </p>
        </Link>

        <Link
          to="/digital-workforce"
          className="group p-6 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-teal-500/50 hover:bg-slate-900/80 transition-all backdrop-blur-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-2xl">🤖</span>
            <span className="text-xs font-mono text-teal-400 group-hover:translate-x-1 transition-transform">EXPLORE ➔</span>
          </div>
          <h3 className="text-lg font-bold text-slate-100 mt-4 group-hover:text-teal-300 transition-colors">
            Digital Employee System
          </h3>
          <p className="text-xs text-slate-400 mt-2">
            Deploy AI engineers, researchers, product managers, designers, analysts, and executive leadership agents.
          </p>
        </Link>

        <Link
          to="/company-builder"
          className="group p-6 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900/80 transition-all backdrop-blur-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-2xl">🚀</span>
            <span className="text-xs font-mono text-emerald-400 group-hover:translate-x-1 transition-transform">EXPLORE ➔</span>
          </div>
          <h3 className="text-lg font-bold text-slate-100 mt-4 group-hover:text-emerald-300 transition-colors">
            Autonomous Company Builder
          </h3>
          <p className="text-xs text-slate-400 mt-2">
            Instant startup generation, business model canvas synthesis, 5-year ARR forecasting, and funding evaluation.
          </p>
        </Link>

        <Link
          to="/product-factory"
          className="group p-6 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-purple-500/50 hover:bg-slate-900/80 transition-all backdrop-blur-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-2xl">🏭</span>
            <span className="text-xs font-mono text-purple-400 group-hover:translate-x-1 transition-transform">EXPLORE ➔</span>
          </div>
          <h3 className="text-lg font-bold text-slate-100 mt-4 group-hover:text-purple-300 transition-colors">
            Autonomous Product Factory
          </h3>
          <p className="text-xs text-slate-400 mt-2">
            Opportunity discovery, automated roadmapping, telemetry tracking, and lifecycle stage advancement.
          </p>
        </Link>

        <Link
          to="/economic-simulation"
          className="group p-6 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-900/80 transition-all backdrop-blur-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-2xl">📊</span>
            <span className="text-xs font-mono text-amber-400 group-hover:translate-x-1 transition-transform">EXPLORE ➔</span>
          </div>
          <h3 className="text-lg font-bold text-slate-100 mt-4 group-hover:text-amber-300 transition-colors">
            Economic Simulation Engine
          </h3>
          <p className="text-xs text-slate-400 mt-2">
            Macro-market shock testing, competitive dynamics modeling, talent tightness simulations, and stress tests.
          </p>
        </Link>

        <Link
          to="/enterprise-federation"
          className="group p-6 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-rose-500/50 hover:bg-slate-900/80 transition-all backdrop-blur-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-2xl">🌐</span>
            <span className="text-xs font-mono text-rose-400 group-hover:translate-x-1 transition-transform">EXPLORE ➔</span>
          </div>
          <h3 className="text-lg font-bold text-slate-100 mt-4 group-hover:text-rose-300 transition-colors">
            Enterprise Federation & Treaties
          </h3>
          <p className="text-xs text-slate-400 mt-2">
            Cross-enterprise resource sharing, joint GPU mesh treaties, talent exchange protocols, and governance consensus.
          </p>
        </Link>
      </div>

      {/* Enterprise Civilization Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Enterprises */}
        <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-base text-slate-200">Active Autonomous Enterprises</h2>
            <Link to="/organization-engine" className="text-xs text-cyan-400 hover:underline">View All</Link>
          </div>
          <div className="space-y-3">
            {overview?.topEnterprises?.map((org) => (
              <div key={org.id} className="p-4 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm text-cyan-300">{org.name}</div>
                  <div className="text-xs text-slate-400">{org.missionStatement}</div>
                </div>
                <div className="text-right">
                  <span className="px-2 py-1 rounded bg-cyan-950 text-cyan-400 font-mono text-xs border border-cyan-800/50">
                    {org.organizationType}
                  </span>
                  <div className="text-xs text-slate-500 mt-1">{org.totalDepartmentsCount} Depts • {org.totalWorkforceHeadcount} Agents</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Blueprints */}
        <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-base text-slate-200">Recent Venture Blueprints</h2>
            <Link to="/company-builder" className="text-xs text-emerald-400 hover:underline">View All</Link>
          </div>
          <div className="space-y-3">
            {overview?.recentCompanyBlueprints?.map((bp) => (
              <div key={bp.id} className="p-4 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm text-emerald-300">{bp.companyName}</div>
                  <div className="text-xs text-slate-400">{bp.tagline}</div>
                </div>
                <div className="text-right">
                  <span className="px-2 py-1 rounded bg-emerald-950 text-emerald-400 font-mono text-xs border border-emerald-800/50">
                    {bp.stage}
                  </span>
                  <div className="text-xs text-slate-500 mt-1">${(bp.projectedAnnualRunRateUsd / 1000000).toFixed(1)}M ARR</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
