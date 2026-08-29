import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { startupBuilderApi } from '../../services/startupBuilderApi';
import { StartupCommandCenterOverviewDto } from '@codeforge/shared';

export const StartupCommandCenterPage: React.FC = () => {
  const [overview, setOverview] = useState<StartupCommandCenterOverviewDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await startupBuilderApi.getOverview();
        setOverview(data);
      } catch (err) {
        console.error('Failed to load startup command center overview', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Loading Autonomous Startup Command Center...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-indigo-900/40 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-3xl">🚀</span>
            <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              Autonomous Startup Builder & Venture Creation
            </h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Venture Incubation Engine • Market Intelligence • AI Founder OS • Growth Models • Investor Network
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-lg bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 font-mono text-sm">
            Avg PMF Score: {overview?.averageMarketFitScore || 88.5}%
          </div>
          <Link
            to="/startup-generator"
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/30"
          >
            + Generate Venture ➔
          </Link>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md shadow-xl">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Active Startups</div>
          <div className="text-3xl font-black text-indigo-400 mt-2">{overview?.totalStartupsCount || 0}</div>
          <div className="text-xs text-slate-500 mt-1">Autonomous Venture Entities</div>
        </div>
        <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md shadow-xl">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Ideas Generated</div>
          <div className="text-3xl font-black text-purple-400 mt-2">{overview?.totalIdeasGenerated || 0}</div>
          <div className="text-xs text-slate-500 mt-1">AI-Synthesized Opportunities</div>
        </div>
        <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md shadow-xl">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Active Incubations</div>
          <div className="text-3xl font-black text-pink-400 mt-2">{overview?.activeIncubationsCount || 0}</div>
          <div className="text-xs text-slate-500 mt-1">In Product-Market-Fit Pipeline</div>
        </div>
        <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md shadow-xl">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Portfolio Valuation</div>
          <div className="text-3xl font-black text-emerald-400 mt-2">
            ${((overview?.aggregatePortfolioValuationUsd || 12000000) / 1000000).toFixed(1)}M
          </div>
          <div className="text-xs text-slate-500 mt-1">Combined Venture Net Asset Value</div>
        </div>
      </div>

      {/* Module Navigation Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-200">Startup Creation Ecosystem Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/startup-generator"
            className="p-5 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900/80 transition-all group"
          >
            <div className="text-2xl mb-2">💡</div>
            <div className="font-bold text-slate-200 group-hover:text-indigo-400 transition-colors">Startup Generator</div>
            <p className="text-xs text-slate-400 mt-1">AI idea discovery, venture blueprints & business models</p>
          </Link>
          <Link
            to="/market-intelligence"
            className="p-5 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-purple-500/50 hover:bg-slate-900/80 transition-all group"
          >
            <div className="text-2xl mb-2">📊</div>
            <div className="font-bold text-slate-200 group-hover:text-purple-400 transition-colors">Market Intelligence</div>
            <p className="text-xs text-slate-400 mt-1">TAM/SAM/SOM calculations, competitor mapping & trends</p>
          </Link>
          <Link
            to="/ai-founder"
            className="p-5 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-pink-500/50 hover:bg-slate-900/80 transition-all group"
          >
            <div className="text-2xl mb-2">🧠</div>
            <div className="font-bold text-slate-200 group-hover:text-pink-400 transition-colors">AI Founder OS</div>
            <p className="text-xs text-slate-400 mt-1">Simulated founder decision support & strategic roadmaps</p>
          </Link>
          <Link
            to="/incubation-engine"
            className="p-5 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900/80 transition-all group"
          >
            <div className="text-2xl mb-2">🔬</div>
            <div className="font-bold text-slate-200 group-hover:text-emerald-400 transition-colors">Incubation Engine</div>
            <p className="text-xs text-slate-400 mt-1">MVP feature scoping & Product-Market Fit validation</p>
          </Link>
          <Link
            to="/customer-discovery"
            className="p-5 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900/80 transition-all group"
          >
            <div className="text-2xl mb-2">👥</div>
            <div className="font-bold text-slate-200 group-hover:text-cyan-400 transition-colors">Customer Discovery</div>
            <p className="text-xs text-slate-400 mt-1">Persona generation, journey maps & feedback analysis</p>
          </Link>
          <Link
            to="/growth-engine"
            className="p-5 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-900/80 transition-all group"
          >
            <div className="text-2xl mb-2">📈</div>
            <div className="font-bold text-slate-200 group-hover:text-amber-400 transition-colors">Growth Engine</div>
            <p className="text-xs text-slate-400 mt-1">12-month MAU/MRR models, CAC/LTV & viral loops</p>
          </Link>
          <Link
            to="/venture-portfolio"
            className="p-5 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-teal-500/50 hover:bg-slate-900/80 transition-all group"
          >
            <div className="text-2xl mb-2">💼</div>
            <div className="font-bold text-slate-200 group-hover:text-teal-400 transition-colors">Venture Portfolio</div>
            <p className="text-xs text-slate-400 mt-1">Multi-startup health tracking & capital allocation</p>
          </Link>
          <Link
            to="/fundraising"
            className="p-5 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-rose-500/50 hover:bg-slate-900/80 transition-all group"
          >
            <div className="text-2xl mb-2">💰</div>
            <div className="font-bold text-slate-200 group-hover:text-rose-400 transition-colors">Fundraising & Investors</div>
            <p className="text-xs text-slate-400 mt-1">Investor matching, pitch deck intelligence & cap table simulator</p>
          </Link>
        </div>
      </div>

      {/* Main Grid: Top Startups & Portfolio Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-200">Active Startup Ventures</h2>
            <Link to="/startup-generator" className="text-xs text-indigo-400 hover:underline">
              View All ➔
            </Link>
          </div>
          <div className="space-y-3">
            {overview?.topStartups && overview.topStartups.length > 0 ? (
              overview.topStartups.map((s) => (
                <div
                  key={s.id}
                  className="p-5 rounded-xl bg-slate-900/40 border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-slate-700 transition-all"
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-slate-100 text-base">{s.name}</span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-950 text-indigo-300 border border-indigo-500/30">
                        {s.category}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                        {s.stage}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{s.tagline}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-500 mt-2">
                      <span>Valuation: ${(s.valuationUsd / 1000000).toFixed(1)}M</span>
                      <span>•</span>
                      <span>Viability: {s.viabilityScore}%</span>
                      <span>•</span>
                      <span>Runway: {s.runwayMonths} mos</span>
                    </div>
                  </div>
                  <Link
                    to={`/ai-founder?startupId=${s.id}`}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
                  >
                    Founder OS ➔
                  </Link>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-500 bg-slate-900/20 rounded-xl border border-dashed border-slate-800">
                No active ventures found. Create your first autonomous startup!
              </div>
            )}
          </div>
        </div>

        {/* Portfolio Health Summary Card */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-200">Portfolio Health Breakdown</h2>
          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-6">
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-emerald-400 font-semibold">Thriving (High Momentum)</span>
                <span className="font-mono text-slate-300">{overview?.portfolioHealthSummary.thriving || 1} Ventures</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '70%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-indigo-400 font-semibold">On Track (Validation / MVP)</span>
                <span className="font-mono text-slate-300">{overview?.portfolioHealthSummary.onTrack || 1} Ventures</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: '25%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-amber-400 font-semibold">Needs Attention (Incubating)</span>
                <span className="font-mono text-slate-300">{overview?.portfolioHealthSummary.needsAttention || 0} Ventures</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '5%' }}></div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <Link
                to="/venture-portfolio"
                className="w-full block py-2.5 text-center rounded-lg bg-indigo-950/70 hover:bg-indigo-900 border border-indigo-500/30 text-indigo-300 font-semibold text-xs transition-colors"
              >
                Manage Venture Portfolio ➔
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
