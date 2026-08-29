import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ventureCapitalApi } from '../../services/ventureCapitalApi';
import { VCCommandCenterOverviewDto } from '@codeforge/shared';
import { DealPipelineWidget } from './widgets/DealPipelineWidget';
import { FundPerformanceWidget } from './widgets/FundPerformanceWidget';
import { PortfolioHealthRadar } from './widgets/PortfolioHealthRadar';
import { ExitWaterfallWidget } from './widgets/ExitWaterfallWidget';
import { CapitalAllocationChart } from './widgets/CapitalAllocationChart';

export const VCCommandCenterPage: React.FC = () => {
  const [overview, setOverview] = useState<VCCommandCenterOverviewDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await ventureCapitalApi.getOverview();
        setOverview(data);
      } catch (err) {
        console.error('Failed to load VC Command Center overview', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Loading Venture Capital Intelligence OS...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-indigo-900/40 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-3xl">🏛️</span>
            <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-amber-400">
              Venture Capital Intelligence & Investment Network
            </h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Autonomous Deal Sourcing • Diligence AI • Multi-Agent Committee • Fund Management • Exit Waterfall
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 font-mono text-sm">
            Fund MOIC: {overview?.averageTvpi || 2.15}x • Net IRR: {overview?.grossIrrWeighted || 31.8}%
          </div>
          <Link
            to="/deal-flow"
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/30"
          >
            + Source Deal Flow ➔
          </Link>
        </div>
      </div>

      {/* Navigation Quick Links */}
      <div className="flex flex-wrap gap-2 pt-1">
        {[
          { label: 'Deal Flow Kanban', path: '/deal-flow', icon: '📥' },
          { label: 'Due Diligence', path: '/due-diligence', icon: '🔍' },
          { label: 'Investment Committee', path: '/investment-committee', icon: '⚖️' },
          { label: 'Fund Management', path: '/fund-management', icon: '💼' },
          { label: 'Portfolio Intelligence', path: '/portfolio-intelligence', icon: '📈' },
          { label: 'Exit Strategy', path: '/exit-strategy', icon: '🚀' },
          { label: 'Investor Network', path: '/investor-network', icon: '🤝' },
        ].map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="px-3.5 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/80 text-xs font-semibold text-slate-300 transition-all flex items-center gap-1.5"
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md shadow-xl">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total AUM</div>
          <div className="text-3xl font-black text-indigo-400 mt-2">
            ${((overview?.totalAumUsd || 185000000) / 1000000).toFixed(0)}M
          </div>
          <div className="text-xs text-slate-500 mt-1">{overview?.activeFundsCount || 3} Active Fund Vehicles</div>
        </div>

        <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md shadow-xl">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Portfolio Holdings</div>
          <div className="text-3xl font-black text-purple-400 mt-2">{overview?.totalPortfolioCompanies || 24}</div>
          <div className="text-xs text-slate-500 mt-1">NAV: ${((overview?.aggregatePortfolioNavUsd || 142000000) / 1000000).toFixed(0)}M</div>
        </div>

        <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md shadow-xl">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Average DPI / TVPI</div>
          <div className="text-3xl font-black text-emerald-400 mt-2">{overview?.averageTvpi || 2.15}x</div>
          <div className="text-xs text-slate-500 mt-1">Realized DPI: {overview?.averageDpi || 0.42}x</div>
        </div>

        <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md shadow-xl">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Active Deal Pipeline</div>
          <div className="text-3xl font-black text-amber-400 mt-2">{overview?.activeDealFlowCount || 48}</div>
          <div className="text-xs text-slate-500 mt-1">{overview?.pendingDueDiligenceCount || 6} In Deep Diligence</div>
        </div>
      </div>

      {/* Main Widgets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DealPipelineWidget deals={overview?.recentDeals || []} />
        <FundPerformanceWidget funds={overview?.topFunds || []} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PortfolioHealthRadar intelligence={null} />
        <ExitWaterfallWidget exits={overview?.recentExits || []} />
      </div>

      {/* Capital Allocation Overview */}
      <CapitalAllocationChart fundSizeUsd={overview?.totalAumUsd || 100000000} />
    </div>
  );
};
