import React, { useEffect, useState } from 'react';
import { startupBuilderApi } from '../../services/startupBuilderApi';
import { ProductIncubationDto, StartupDto } from '@codeforge/shared';

export const IncubationEnginePage: React.FC = () => {
  const [incubations, setIncubations] = useState<ProductIncubationDto[]>([]);
  const [startups, setStartups] = useState<StartupDto[]>([]);
  const [selectedStartupId, setSelectedStartupId] = useState('');
  const [productName, setProductName] = useState('');
  const [conceptSummary, setConceptSummary] = useState('');
  const [creating, setCreating] = useState(false);
  const [activePmfReport, setActivePmfReport] = useState<any | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [incList, sList] = await Promise.all([
        startupBuilderApi.listIncubations(),
        startupBuilderApi.listStartups(),
      ]);
      setIncubations(incList);
      setStartups(sList);
      if (sList.length > 0) setSelectedStartupId(sList[0].id);
    } catch (err) {
      console.error('Failed to load incubation data', err);
    }
  }

  async function handleIncubate(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedStartupId || !productName) return;
    setCreating(true);
    try {
      const inc = await startupBuilderApi.incubateProduct({
        startupId: selectedStartupId,
        productName,
        conceptSummary,
      });
      setIncubations([inc, ...incubations]);
      setProductName('');
      setConceptSummary('');
    } catch (err) {
      console.error('Failed to incubate product', err);
    } finally {
      setCreating(false);
    }
  }

  async function handleEvaluatePmf(id: string) {
    try {
      const pmf = await startupBuilderApi.getProductMarketFit(id);
      setActivePmfReport(pmf);
    } catch (err) {
      console.error('Failed to evaluate PMF', err);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-emerald-900/40 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-3xl">🔬</span>
            <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400">
              Product Incubation Engine & PMF Validation
            </h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            MVP Feature Prioritization • Product-Market Fit Scoring • Retention Telemetry • Sean Ellis Index
          </p>
        </div>
      </div>

      {/* Incubation Form & PMF Report Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h2 className="font-bold text-slate-200 text-base">Incubate New Product Module</h2>
          <form onSubmit={handleIncubate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Parent Startup
              </label>
              <select
                value={selectedStartupId}
                onChange={(e) => setSelectedStartupId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-sm focus:outline-none focus:border-emerald-500"
              >
                {startups.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.stage})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Product Name
              </label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="e.g. AgentForge Core Verifier"
                required
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Concept Summary
              </label>
              <textarea
                value={conceptSummary}
                onChange={(e) => setConceptSummary(e.target.value)}
                rows={3}
                placeholder="Describe product concept and core value..."
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
            <button
              type="submit"
              disabled={creating}
              className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all shadow-lg shadow-emerald-600/30"
            >
              {creating ? 'Initializing Incubation...' : '🔬 Incubate Product Module'}
            </button>
          </form>
        </div>

        {/* PMF Metrics */}
        <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h2 className="font-bold text-slate-200 text-base">PMF Validation Assessment</h2>
          {activePmfReport ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <div className="text-xs text-slate-400 uppercase font-semibold">PMF Score</div>
                  <div className="text-3xl font-black text-emerald-400 mt-1">{activePmfReport.productMarketFitScore}%</div>
                  <div className="text-[10px] text-slate-500">{activePmfReport.pmfStatus}</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <div className="text-xs text-slate-400 uppercase font-semibold">Sean Ellis Score</div>
                  <div className="text-3xl font-black text-teal-400 mt-1">{activePmfReport.seanEllisScorePercent}%</div>
                  <div className="text-[10px] text-emerald-400">Target &gt;40% (Met)</div>
                </div>
              </div>

              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Key Growth Drivers</div>
                <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                  {activePmfReport.keyGrowthDrivers.map((d: string, i: number) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Recommended Refinements</div>
                <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                  {activePmfReport.recommendedProductRefinements.map((r: string, i: number) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500 bg-slate-950/40 rounded-xl border border-dashed border-slate-800">
              Select an incubation module below to evaluate real-time Product-Market Fit metrics.
            </div>
          )}
        </div>
      </div>

      {/* Incubation Cards List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-200">Active Incubations & Feature Boards ({incubations.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {incubations.map((inc) => (
            <div key={inc.id} className="p-6 rounded-xl bg-slate-900/40 border border-slate-800 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-slate-100 text-base">{inc.productName}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{inc.conceptSummary}</p>
                </div>
                <span className="px-2.5 py-1 rounded text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                  {inc.phase}
                </span>
              </div>

              {/* Validation Metrics */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 rounded bg-slate-950/80 border border-slate-800">
                  <div className="text-slate-500 text-[10px]">Interviews</div>
                  <div className="font-bold text-slate-200">{inc.validationMetrics.userInterviewsConducted}</div>
                </div>
                <div className="p-2 rounded bg-slate-950/80 border border-slate-800">
                  <div className="text-slate-500 text-[10px]">Prototype Tests</div>
                  <div className="font-bold text-slate-200">{inc.validationMetrics.prototypeTestCount}</div>
                </div>
                <div className="p-2 rounded bg-slate-950/80 border border-slate-800">
                  <div className="text-slate-500 text-[10px]">Early Signups</div>
                  <div className="font-bold text-emerald-400">{inc.validationMetrics.earlyAccessSignups}</div>
                </div>
              </div>

              {/* MVP Feature Set */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold uppercase text-slate-400">MVP Feature Roadmap</div>
                <div className="space-y-1.5">
                  {inc.mvpFeatureSet.map((f, i) => (
                    <div key={i} className="p-2.5 rounded bg-slate-950 border border-slate-800/80 flex justify-between items-center text-xs">
                      <span className="text-slate-200">{f.featureName}</span>
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400 uppercase">
                          {f.priority}
                        </span>
                        <span className="text-[10px] font-mono text-indigo-400">{f.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
                <span className="text-xs text-slate-400">PMF Score: {inc.productMarketFitScore}%</span>
                <button
                  onClick={() => handleEvaluatePmf(inc.id)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/30 text-emerald-300 text-xs font-semibold"
                >
                  Analyze PMF Telemetry ➔
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
