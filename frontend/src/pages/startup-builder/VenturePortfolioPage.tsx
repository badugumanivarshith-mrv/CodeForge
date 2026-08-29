import React, { useEffect, useState } from 'react';
import { startupBuilderApi } from '../../services/startupBuilderApi';
import { VenturePortfolioDto } from '@codeforge/shared';

export const VenturePortfolioPage: React.FC = () => {
  const [portfolios, setPortfolios] = useState<VenturePortfolioDto[]>([]);
  const [portfolioName, setPortfolioName] = useState('');
  const [description, setDescription] = useState('');
  const [creating, setCreating] = useState(false);
  const [activeHealthReport, setActiveHealthReport] = useState<any | null>(null);

  useEffect(() => {
    loadPortfolios();
  }, []);

  async function loadPortfolios() {
    try {
      const list = await startupBuilderApi.listPortfolios();
      setPortfolios(list);
      if (list.length > 0) {
        handleEvaluateHealth(list[0].id);
      }
    } catch (err) {
      console.error('Failed to load venture portfolios', err);
    }
  }

  async function handleCreatePortfolio(e: React.FormEvent) {
    e.preventDefault();
    if (!portfolioName) return;
    setCreating(true);
    try {
      const newPf = await startupBuilderApi.createPortfolio({
        portfolioName,
        description,
      });
      setPortfolios([newPf, ...portfolios]);
      setPortfolioName('');
      setDescription('');
    } catch (err) {
      console.error('Failed to create portfolio', err);
    } finally {
      setCreating(false);
    }
  }

  async function handleEvaluateHealth(id: string) {
    try {
      const health = await startupBuilderApi.getPortfolioHealth(id);
      setActiveHealthReport(health);
    } catch (err) {
      console.error('Failed to evaluate portfolio health', err);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-teal-900/40 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-3xl">💼</span>
            <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400">
              Venture Portfolio Management & Multi-Startup Studio
            </h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Aggregate Venture Valuation • Cross-Portfolio Health Scoring • Resource Optimization • Capital Reallocation
          </p>
        </div>
      </div>

      {/* Portfolio Creator & Health KPI Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h2 className="font-bold text-slate-200 text-base">Create Venture Studio Portfolio</h2>
          <form onSubmit={handleCreatePortfolio} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Portfolio Name
              </label>
              <input
                type="text"
                value={portfolioName}
                onChange={(e) => setPortfolioName(e.target.value)}
                placeholder="e.g. Horizon Autonomous Ventures II"
                required
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-sm focus:outline-none focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Description & Thesis
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="Investment thesis and portfolio scope..."
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-sm focus:outline-none focus:border-teal-500"
              />
            </div>
            <button
              type="submit"
              disabled={creating}
              className="w-full py-2.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm transition-all shadow-lg shadow-teal-600/30"
            >
              {creating ? 'Initializing...' : '💼 Initialize Portfolio'}
            </button>
          </form>
        </div>

        {/* Health Summary */}
        <div className="lg:col-span-2 p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-5">
          <h2 className="font-bold text-slate-200 text-base">Portfolio Health & Momentum Telemetry</h2>
          {activeHealthReport ? (
            <div className="space-y-5">
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <div className="text-xs text-slate-400 uppercase font-semibold">Aggregate Valuation</div>
                  <div className="text-2xl font-black text-emerald-400 mt-1">
                    ${(activeHealthReport.aggregateValuationUsd / 1000000).toFixed(1)}M
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <div className="text-xs text-slate-400 uppercase font-semibold">Health Tier</div>
                  <div className="text-2xl font-black text-teal-400 mt-1">{activeHealthReport.healthTier}</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <div className="text-xs text-slate-400 uppercase font-semibold">Ventures Count</div>
                  <div className="text-2xl font-black text-cyan-400 mt-1">{activeHealthReport.portfolio.totalVentureCount}</div>
                </div>
              </div>

              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Capital Allocation Advice</div>
                <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                  {activeHealthReport.capitalReallocationAdvice.map((adv: string, i: number) => (
                    <li key={i}>{adv}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500">Select a portfolio to view health diagnostics.</div>
          )}
        </div>
      </div>

      {/* Portfolios & Ranked Ventures */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-200">Active Portfolios ({portfolios.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {portfolios.map((pf) => (
            <div key={pf.id} className="p-6 rounded-xl bg-slate-900/40 border border-slate-800 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-slate-100 text-base">{pf.portfolioName}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{pf.description}</p>
                </div>
                <button
                  onClick={() => handleEvaluateHealth(pf.id)}
                  className="px-3 py-1.5 rounded-lg bg-teal-950 hover:bg-teal-900 border border-teal-500/30 text-teal-300 text-xs font-semibold"
                >
                  Health Audit ➔
                </button>
              </div>

              {/* Ventures List */}
              <div className="space-y-2 pt-2">
                <div className="text-xs font-semibold uppercase text-slate-400">Holding Ventures</div>
                <div className="space-y-2">
                  {pf.ventures.map((v, i) => (
                    <div key={i} className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold text-slate-200">{v.startupName}</span>
                        <div className="text-[11px] text-slate-400">Stage: {v.stage}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-emerald-400">${(v.valuationUsd / 1000000).toFixed(1)}M</div>
                        <div className="text-[10px] text-teal-400 uppercase font-mono">{v.healthStatus}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
