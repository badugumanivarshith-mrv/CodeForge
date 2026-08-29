import React, { useEffect, useState } from 'react';
import { startupBuilderApi } from '../../services/startupBuilderApi';
import { MarketReportDto, StartupCategory } from '@codeforge/shared';

export const MarketIntelligencePage: React.FC = () => {
  const [reports, setReports] = useState<MarketReportDto[]>([]);
  const [selectedSector, setSelectedSector] = useState<StartupCategory>(StartupCategory.AI_DEVTOOLS);
  const [generating, setGenerating] = useState(false);
  const [activeReport, setActiveReport] = useState<MarketReportDto | null>(null);

  useEffect(() => {
    loadReports();
  }, []);

  async function loadReports() {
    try {
      const list = await startupBuilderApi.listMarketReports();
      setReports(list);
      if (list.length > 0) setActiveReport(list[0]);
    } catch (err) {
      console.error('Failed to load market reports', err);
    }
  }

  async function handleGenerateReport(e: React.FormEvent) {
    e.preventDefault();
    setGenerating(true);
    try {
      const rep = await startupBuilderApi.generateMarketReport({ sector: selectedSector });
      setReports([rep, ...reports]);
      setActiveReport(rep);
    } catch (err) {
      console.error('Failed to generate market report', err);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-purple-900/40 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-3xl">📊</span>
            <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400">
              Market Intelligence & Opportunity Sizing Engine
            </h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            TAM / SAM / SOM Calculations • Competitive Landscape Maps • Industry CAGR Growth • Opportunity Gap Detection
          </p>
        </div>
        <form onSubmit={handleGenerateReport} className="flex items-center gap-2">
          <select
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value as StartupCategory)}
            className="px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-purple-500"
          >
            {Object.values(StartupCategory).map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={generating}
            className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-all shadow-lg shadow-purple-600/30"
          >
            {generating ? 'Analyzing...' : '+ Generate Sizing Report'}
          </button>
        </form>
      </div>

      {activeReport ? (
        <div className="space-y-8">
          {/* Sizing KPI Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Addressable Market (TAM)</div>
              <div className="text-3xl font-black text-purple-400 mt-2">
                ${(activeReport.tamUsd / 1000000000).toFixed(1)}B
              </div>
              <div className="text-xs text-slate-500 mt-1">Global Sector Market Size</div>
            </div>
            <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Serviceable Market (SAM)</div>
              <div className="text-3xl font-black text-indigo-400 mt-2">
                ${(activeReport.samUsd / 1000000000).toFixed(1)}B
              </div>
              <div className="text-xs text-slate-500 mt-1">Developer-Centric Segment</div>
            </div>
            <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Serviceable Obtainable (SOM)</div>
              <div className="text-3xl font-black text-pink-400 mt-2">
                ${(activeReport.somUsd / 1000000000).toFixed(1)}B
              </div>
              <div className="text-xs text-slate-500 mt-1">Direct Targetable ICP Capture</div>
            </div>
            <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Sector CAGR Growth</div>
              <div className="text-3xl font-black text-emerald-400 mt-2">{activeReport.cagrPercent}%</div>
              <div className="text-xs text-slate-500 mt-1">Compound Annual Growth Rate</div>
            </div>
          </div>

          {/* Sizing Distribution Visualizer & Trends */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Market Trends Card */}
            <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
              <h2 className="font-bold text-slate-200 text-base">Key Industry Trends & Tailwinds</h2>
              <div className="space-y-3">
                {activeReport.marketTrends.map((trend, i) => (
                  <div key={i} className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800 flex items-start gap-3">
                    <span className="text-purple-400 font-bold text-sm">0{i + 1}</span>
                    <span className="text-xs text-slate-300 leading-relaxed">{trend}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Opportunity Gaps Card */}
            <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
              <h2 className="font-bold text-slate-200 text-base">Identified Opportunity White Spaces</h2>
              <div className="space-y-3">
                {activeReport.opportunityGaps.map((gap, i) => (
                  <div key={i} className="p-3.5 rounded-lg bg-indigo-950/40 border border-indigo-500/30 flex items-start gap-3">
                    <span className="text-indigo-400 font-bold text-sm">✓</span>
                    <span className="text-xs text-indigo-200 leading-relaxed">{gap}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Competitor Matrix Card */}
          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h2 className="font-bold text-slate-200 text-base">Competitive Landscape & Market Share Breakdown</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {activeReport.competitiveLandscape.map((comp, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-200 text-sm">{comp.competitorName}</span>
                    <span className="px-2 py-0.5 rounded text-xs font-mono bg-purple-950 text-purple-300 border border-purple-500/30">
                      {comp.marketSharePercent}%
                    </span>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase text-emerald-400 mb-1">Strengths</div>
                    <ul className="text-xs text-slate-400 list-disc list-inside space-y-0.5">
                      {comp.strengths.map((s, idx) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase text-rose-400 mb-1">Weaknesses</div>
                    <ul className="text-xs text-slate-400 list-disc list-inside space-y-0.5">
                      {comp.weaknesses.map((w, idx) => (
                        <li key={idx}>{w}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center text-slate-500 bg-slate-900/30 rounded-xl border border-dashed border-slate-800">
          No market report selected. Click "+ Generate Sizing Report" above to initiate sector analysis.
        </div>
      )}
    </div>
  );
};
