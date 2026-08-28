import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ecosystemApi } from '../../services/ecosystemApi';
import {
  MarketplaceAgentDto,
  MarketplaceOverviewDto,
  MarketplaceCategory,
  PricingModel,
} from '@codeforge/shared';

export const MarketplacePage: React.FC = () => {
  const [overview, setOverview] = useState<MarketplaceOverviewDto | null>(null);
  const [agents, setAgents] = useState<MarketplaceAgentDto[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPricing, setSelectedPricing] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [selectedCategory, selectedPricing]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [overviewData, agentsData] = await Promise.all([
        ecosystemApi.getOverview(),
        ecosystemApi.listAgents({
          category: selectedCategory !== 'all' ? (selectedCategory as MarketplaceCategory) : undefined,
          pricing: selectedPricing !== 'all' ? (selectedPricing as PricingModel) : undefined,
          search: searchQuery || undefined,
        }),
      ]);
      setOverview(overviewData);
      setAgents(agentsData);
    } catch (err) {
      console.error('Failed to load marketplace data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (e: React.MouseEvent, agentId: string) => {
    e.preventDefault();
    try {
      setDownloadingId(agentId);
      await ecosystemApi.downloadAgent(agentId);
      setAgents(prev =>
        prev.map(a => (a.id === agentId ? { ...a, downloadCount: a.downloadCount + 1 } : a))
      );
    } catch (err) {
      console.error('Download failed', err);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-3xl">🛒</span>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                CodeForge Agent & Plugin Marketplace
              </h1>
            </div>
            <p className="text-slate-400 mt-1">
              Discover, install, and orchestrate verified autonomous AI agents, plugins, and production workflows.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/marketplace/builder"
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium rounded-lg shadow-lg flex items-center gap-2 text-sm transition-all"
            >
              <span>✨</span> Agent Builder
            </Link>
            <Link
              to="/marketplace/creator"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium rounded-lg text-sm transition-all"
            >
              <span>📊</span> Creator Studio
            </Link>
          </div>
        </div>

        {/* Sub-Navigation Hub */}
        <div className="flex flex-wrap gap-2 mt-6">
          <Link
            to="/marketplace"
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold text-sm shadow-md"
          >
            🤖 AI Agents
          </Link>
          <Link
            to="/marketplace/plugins"
            className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-medium text-sm transition-all"
          >
            🔌 Plugin Ecosystem
          </Link>
          <Link
            to="/marketplace/integrations"
            className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-medium text-sm transition-all"
          >
            ⚡ Integration Hub
          </Link>
          <Link
            to="/marketplace/workflows"
            className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-medium text-sm transition-all"
          >
            🔄 Workflow Templates
          </Link>
          <Link
            to="/marketplace/developer"
            className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-medium text-sm transition-all"
          >
            💻 Developer API & SDK
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-10">
        {/* KPI Stats Bar */}
        {overview && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Agents</span>
              <p className="text-2xl font-bold text-cyan-400 mt-1">{overview.stats.totalAgents}</p>
            </div>
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Plugins</span>
              <p className="text-2xl font-bold text-indigo-400 mt-1">{overview.stats.totalPlugins}</p>
            </div>
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Workflows</span>
              <p className="text-2xl font-bold text-purple-400 mt-1">{overview.stats.totalWorkflows}</p>
            </div>
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Installs</span>
              <p className="text-2xl font-bold text-emerald-400 mt-1">{overview.stats.totalInstalls}</p>
            </div>
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Creators</span>
              <p className="text-2xl font-bold text-amber-400 mt-1">{overview.stats.activeCreators}</p>
            </div>
          </div>
        )}

        {/* Filter Controls & Search */}
        <div className="p-5 bg-slate-900/40 border border-slate-800 rounded-2xl flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {['all', ...Object.values(MarketplaceCategory)].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <select
              value={selectedPricing}
              onChange={e => setSelectedPricing(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded-lg px-3 py-2 outline-none focus:border-indigo-500"
            >
              <option value="all">All Pricing</option>
              <option value={PricingModel.FREE}>Free</option>
              <option value={PricingModel.FREEMIUM}>Freemium</option>
              <option value={PricingModel.PAID_ONE_TIME}>Paid (One-Time)</option>
              <option value={PricingModel.SUBSCRIPTION}>Subscription</option>
            </select>
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search agents..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && loadData()}
                className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg pl-8 pr-3 py-2 outline-none focus:border-indigo-500"
              />
              <span className="absolute left-2.5 top-2 text-slate-400 text-xs">🔍</span>
            </div>
          </div>
        </div>

        {/* Agents Grid */}
        {loading ? (
          <div className="p-16 text-center text-slate-400">
            <div className="animate-spin w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full mx-auto mb-3" />
            Loading AI agents catalog...
          </div>
        ) : agents.length === 0 ? (
          <div className="p-16 text-center text-slate-400 bg-slate-900/20 border border-slate-800 rounded-2xl">
            <p className="text-lg">No agents found matching your filters.</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedPricing('all');
                setSearchQuery('');
              }}
              className="mt-3 text-indigo-400 hover:underline text-sm"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map(agent => (
              <div
                key={agent.id}
                className="group p-6 bg-slate-900/60 border border-slate-800 hover:border-indigo-500/60 rounded-2xl flex flex-col justify-between transition-all duration-200 hover:shadow-xl hover:shadow-indigo-500/5"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-950 text-indigo-300 border border-indigo-800/60 uppercase tracking-wider">
                      {agent.category}
                    </span>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded ${
                        agent.pricingModel === PricingModel.FREE
                          ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-800/40'
                          : 'text-amber-400 bg-amber-950/60 border border-amber-800/40'
                      }`}
                    >
                      {agent.pricingModel === PricingModel.FREE
                        ? 'FREE'
                        : `$${(agent.priceCents / 100).toFixed(2)}`}
                    </span>
                  </div>

                  <Link to={`/marketplace/agents/${agent.id}`}>
                    <h3 className="text-lg font-bold text-slate-100 group-hover:text-indigo-400 transition-colors">
                      {agent.name}
                    </h3>
                  </Link>

                  <p className="text-slate-400 text-xs mt-2 line-clamp-3 leading-relaxed">
                    {agent.description}
                  </p>

                  {/* Capabilities Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {agent.capabilities.slice(0, 3).map((cap, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-slate-800 text-slate-300 text-[11px] rounded-md font-mono"
                      >
                        {cap}
                      </span>
                    ))}
                    {agent.capabilities.length > 3 && (
                      <span className="px-1.5 py-0.5 text-slate-500 text-[11px]">
                        +{agent.capabilities.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer Metrics & Actions */}
                <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1 text-amber-400">
                      ★ {agent.ratingAverage.toFixed(1)}
                    </span>
                    <span>📥 {agent.downloadCount}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/marketplace/agents/${agent.id}`}
                      className="px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      Details
                    </Link>
                    <button
                      onClick={e => handleDownload(e, agent.id)}
                      disabled={downloadingId === agent.id}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-lg shadow transition-colors"
                    >
                      {downloadingId === agent.id ? 'Installing...' : 'Install'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
