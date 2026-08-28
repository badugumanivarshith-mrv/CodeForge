import React, { useEffect, useState } from 'react';
import { planetaryIntelligenceApi } from '../../services/planetaryIntelligenceApi';
import { StrategicForecastDto, ForesightHorizon } from '@codeforge/shared';

export const StrategicForesightPage: React.FC = () => {
  const [forecasts, setForecasts] = useState<StrategicForecastDto[]>([]);
  const [selectedHorizon, setSelectedHorizon] = useState<ForesightHorizon | 'ALL'>('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const fcs = await planetaryIntelligenceApi.listStrategicForecasts();
        setForecasts(fcs);
      } catch (err) {
        console.error('Failed to load strategic forecasts', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Loading Strategic Foresight Engine...</div>;
  }

  const filtered = selectedHorizon === 'ALL'
    ? forecasts
    : forecasts.filter((f) => f.horizon === selectedHorizon);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center space-x-3">
            <span className="text-3xl">🔭</span>
            <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-indigo-400 to-purple-400">
              Strategic Foresight Engine
            </h1>
          </div>
          <p className="text-slate-400 mt-1">
            1-Year, 5-Year & 10-Year Horizon Planetary Projections, Opportunity Maps & Strategic Playbooks
          </p>
        </div>
      </div>

      {/* Horizon Filter Tabs */}
      <div className="flex gap-2">
        {(['ALL', ForesightHorizon.ONE_YEAR, ForesightHorizon.FIVE_YEAR, ForesightHorizon.TEN_YEAR] as const).map((h) => (
          <button
            key={h}
            onClick={() => setSelectedHorizon(h)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              selectedHorizon === h
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-950/60'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {h === 'ALL' ? 'ALL HORIZONS' : h.replace(/_/g, ' ').toUpperCase()}
          </button>
        ))}
      </div>

      {/* Forecasts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((fc) => (
          <div key={fc.id} className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                  {fc.horizon.replace(/_/g, ' ')} • {fc.domain}
                </span>
                <h3 className="font-bold text-white text-lg mt-1">{fc.title}</h3>
              </div>
              <span className="text-xs bg-indigo-950 text-indigo-300 px-2.5 py-1 rounded-lg border border-indigo-800/60">
                Confidence: {fc.confidenceScore}%
              </span>
            </div>
            <p className="text-slate-300 text-sm">{fc.forecastNarrative}</p>
            <div className="pt-2 border-t border-slate-800/60">
              <h4 className="text-xs font-bold text-slate-400 uppercase mb-1.5">Recommended Strategic Playbook</h4>
              <ul className="text-xs text-slate-300 space-y-1">
                {fc.recommendedPlaybook?.map((p, i) => (
                  <li key={i} className="flex items-center space-x-1.5">
                    <span className="text-indigo-400">▹</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
