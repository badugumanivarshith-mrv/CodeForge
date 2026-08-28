import React, { useEffect, useState } from 'react';
import { planetaryIntelligenceApi } from '../../services/planetaryIntelligenceApi';
import { CivilizationMetricsDto, CivilizationReportDto } from '@codeforge/shared';

export const CivilizationDashboardPage: React.FC = () => {
  const [metrics, setMetrics] = useState<CivilizationMetricsDto | null>(null);
  const [reports, setReports] = useState<CivilizationReportDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [m, r] = await Promise.all([
          planetaryIntelligenceApi.getCivilizationHealth(),
          planetaryIntelligenceApi.listCivilizationReports(),
        ]);
        setMetrics(m);
        setReports(r);
      } catch (err) {
        console.error('Failed to load civilization data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleGenerateReport = async () => {
    setGenerating(true);
    try {
      const rep = await planetaryIntelligenceApi.generateCivilizationReport();
      setReports([rep, ...reports]);
      const m = await planetaryIntelligenceApi.getCivilizationHealth();
      setMetrics(m);
    } catch (err) {
      console.error('Failed to generate report', err);
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Loading Digital Civilization Dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center space-x-3">
            <span className="text-3xl">🏛️</span>
            <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400">
              Digital Civilization Dashboard
            </h1>
          </div>
          <p className="text-slate-400 mt-1">
            Civilization Indices, Macro-Scale Opportunity Mapping, and Growth Synthesis
          </p>
        </div>
        <button
          onClick={handleGenerateReport}
          disabled={generating}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-emerald-950/50 transition-all flex items-center space-x-2"
        >
          <span>{generating ? 'Synthesizing...' : '⚡ Generate Civilization Synthesis'}</span>
        </button>
      </div>

      {/* 6 Civilization Indices */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl text-center">
          <div className="text-xs text-slate-400">Civilization Health</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">{metrics?.civilizationHealthScore}%</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Tier {metrics?.healthTier}</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl text-center">
          <div className="text-xs text-slate-400">Innovation Index</div>
          <div className="text-2xl font-bold text-indigo-400 mt-1">{metrics?.innovationIndex}%</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Breakthrough velocity</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl text-center">
          <div className="text-xs text-slate-400">Knowledge Growth</div>
          <div className="text-2xl font-bold text-purple-400 mt-1">{metrics?.knowledgeGrowthIndex}%</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Graph expansion</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl text-center">
          <div className="text-xs text-slate-400">Economic Activity</div>
          <div className="text-2xl font-bold text-cyan-400 mt-1">{metrics?.economicActivityIndex}%</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Liquidity & output</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl text-center">
          <div className="text-xs text-slate-400">Workforce Readiness</div>
          <div className="text-2xl font-bold text-pink-400 mt-1">{metrics?.workforceReadinessIndex}%</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Verified skill ratio</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl text-center">
          <div className="text-xs text-slate-400">Research Productivity</div>
          <div className="text-2xl font-bold text-amber-400 mt-1">{metrics?.researchProductivityIndex}%</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Academic momentum</div>
        </div>
      </div>

      {/* Civilization Reports Feed */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-slate-100 mb-4 flex items-center space-x-2">
          <span>📜</span>
          <span>Planetary Civilization Reports</span>
        </h2>
        <div className="space-y-4">
          {reports.map((rep) => (
            <div key={rep.id} className="bg-slate-950/80 border border-slate-800 p-5 rounded-xl space-y-3">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-emerald-300 text-lg">{rep.title}</h3>
                <span className="text-xs text-slate-500">{new Date(rep.generatedAt).toLocaleString()}</span>
              </div>
              <p className="text-slate-300 text-sm">{rep.summary}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-slate-800/60">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Growth Forecasts</h4>
                  <ul className="text-xs text-slate-300 space-y-1">
                    {rep.growthForecasts?.map((g, i) => (
                      <li key={i} className="flex justify-between">
                        <span>{g.sector}</span>
                        <span className="font-semibold text-emerald-400">+{g.projectedGrowthPercent}%</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Strategic Opportunities</h4>
                  <ul className="text-xs text-slate-300 space-y-1">
                    {rep.opportunityMap?.map((o, i) => (
                      <li key={i} className="flex justify-between">
                        <span>{o.title}</span>
                        <span className="font-semibold text-indigo-400">Impact: +{o.projectedGdpImpactScore}%</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
