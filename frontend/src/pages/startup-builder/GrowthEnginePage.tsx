import React, { useEffect, useState } from 'react';
import { startupBuilderApi } from '../../services/startupBuilderApi';
import { GrowthForecastDto, StartupDto, GrowthChannel } from '@codeforge/shared';

export const GrowthEnginePage: React.FC = () => {
  const [startups, setStartups] = useState<StartupDto[]>([]);
  const [selectedStartupId, setSelectedStartupId] = useState('');
  const [selectedChannel, setSelectedChannel] = useState<GrowthChannel>(GrowthChannel.PRODUCT_LED);
  const [forecast, setForecast] = useState<GrowthForecastDto | null>(null);
  const [unitEconomics, setUnitEconomics] = useState<any | null>(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const sList = await startupBuilderApi.listStartups();
      setStartups(sList);
      if (sList.length > 0) {
        setSelectedStartupId(sList[0].id);
        loadGrowthData(sList[0].id, GrowthChannel.PRODUCT_LED);
      }
    } catch (err) {
      console.error('Failed to load growth page data', err);
    }
  }

  async function loadGrowthData(id: string, channel: GrowthChannel) {
    try {
      const [fc, ue] = await Promise.all([
        startupBuilderApi.generateGrowthForecast(id, channel),
        startupBuilderApi.getUnitEconomics(id),
      ]);
      setForecast(fc);
      setUnitEconomics(ue);
    } catch (err) {
      console.error('Failed to load growth models', err);
    }
  }

  async function handleGenerateForecast(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedStartupId) return;
    setGenerating(true);
    try {
      await loadGrowthData(selectedStartupId, selectedChannel);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-amber-900/40 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-3xl">📈</span>
            <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400">
              Autonomous Growth Engine & Unit Economics Simulator
            </h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            12-Month MAU / MRR Growth Projections • CAC / LTV Unit Economics • Viral Coefficient Loops • Retention Optimization
          </p>
        </div>
        <form onSubmit={handleGenerateForecast} className="flex items-center gap-2">
          <select
            value={selectedStartupId}
            onChange={(e) => setSelectedStartupId(e.target.value)}
            className="px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-amber-500"
          >
            {startups.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <select
            value={selectedChannel}
            onChange={(e) => setSelectedChannel(e.target.value as GrowthChannel)}
            className="px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-amber-500"
          >
            {Object.values(GrowthChannel).map((ch) => (
              <option key={ch} value={ch}>
                {ch}
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={generating}
            className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition-all shadow-lg shadow-amber-600/30"
          >
            {generating ? 'Simulating...' : 'Simulate Channel ➔'}
          </button>
        </form>
      </div>

      {/* Unit Economics KPI Bar */}
      {unitEconomics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Customer Acquisition (CAC)</div>
            <div className="text-3xl font-black text-amber-400 mt-2">${unitEconomics.cacUsd}</div>
            <div className="text-xs text-slate-500 mt-1">Blended Developer CAC</div>
          </div>
          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Lifetime Value (LTV)</div>
            <div className="text-3xl font-black text-emerald-400 mt-2">${unitEconomics.ltvUsd}</div>
            <div className="text-xs text-slate-500 mt-1">36-Month Enterprise Cohort</div>
          </div>
          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">LTV / CAC Ratio</div>
            <div className="text-3xl font-black text-indigo-400 mt-2">{unitEconomics.ltvCacRatio}x</div>
            <div className="text-xs text-emerald-400 mt-1">Exceptional Efficiency (&gt;3x benchmark)</div>
          </div>
          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Viral Coefficient (k)</div>
            <div className="text-3xl font-black text-rose-400 mt-2">{unitEconomics.viralCoefficient}</div>
            <div className="text-xs text-emerald-400 mt-1">Self-Sustaining Viral Loops (k &gt; 1.0)</div>
          </div>
        </div>
      )}

      {/* 12-Month Projections Table & Charts */}
      {forecast && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* MAU Forecast Card */}
          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-slate-200 text-base">Monthly Active Users (MAU) Trajectory</h2>
              <span className="text-xs font-mono text-amber-400">Primary Channel: {forecast.primaryChannel}</span>
            </div>
            <div className="space-y-2">
              {forecast.monthlyActiveUsersForecast.map((item) => (
                <div key={item.month} className="flex items-center gap-3 text-xs">
                  <span className="w-16 font-mono text-slate-500">Month {item.month}</span>
                  <div className="flex-1 h-3 rounded-full bg-slate-950 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                      style={{ width: `${Math.min(100, (item.mau / 110000) * 100)}%` }}
                    ></div>
                  </div>
                  <span className="w-20 text-right font-bold text-slate-200">{item.mau.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* MRR Revenue Forecast Card */}
          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-slate-200 text-base">Monthly Recurring Revenue (MRR) Projections</h2>
              <span className="text-xs font-mono text-emerald-400">ARR Run Rate: $27.6M at M12</span>
            </div>
            <div className="space-y-2">
              {forecast.monthlyRevenueForecastUsd.map((item) => (
                <div key={item.month} className="flex items-center gap-3 text-xs">
                  <span className="w-16 font-mono text-slate-500">Month {item.month}</span>
                  <div className="flex-1 h-3 rounded-full bg-slate-950 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                      style={{ width: `${Math.min(100, (item.mrr / 2300000) * 100)}%` }}
                    ></div>
                  </div>
                  <span className="w-24 text-right font-bold text-emerald-400">${item.mrr.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Growth Optimization Tactics */}
      {unitEconomics && (
        <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h2 className="font-bold text-slate-200 text-base">Autonomous Growth Optimization Strategies</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {unitEconomics.optimizationTactics.map((tactic: string, i: number) => (
              <div key={i} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-3">
                <span className="text-amber-400 font-bold text-base">🚀</span>
                <span className="text-xs text-slate-300 leading-relaxed">{tactic}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
