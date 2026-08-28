import React, { useEffect, useState } from 'react';
import { cognitiveOsApi } from '../../services/cognitiveOsApi';
import { PredictiveForecastDto, PredictionHorizon } from '@codeforge/shared';

export const PredictiveIntelligencePage: React.FC = () => {
  const [forecasts, setForecasts] = useState<PredictiveForecastDto[]>([]);
  const [selectedHorizon, setSelectedHorizon] = useState<PredictionHorizon>(PredictionHorizon.THIRTY_DAYS);
  const [generating, setGenerating] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await cognitiveOsApi.listForecasts(undefined, selectedHorizon);
        setForecasts(data);
      } catch (err) {
        console.error('Failed to load forecasts', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [selectedHorizon]);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await cognitiveOsApi.generateForecast({ horizon: selectedHorizon });
      setForecasts([res, ...forecasts]);
    } catch (err) {
      console.error('Failed to generate forecast', err);
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Loading Predictive Intelligence Engine...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-emerald-900/40 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔮</span>
            <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400">
              Predictive Intelligence Engine
            </h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Probabilistic Foresight & Bayesian Trajectory Modeling Across 7-Day to 5-Year Planning Horizons
          </p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-lg shadow-lg shadow-emerald-600/30 transition-all"
        >
          {generating ? 'Simulating...' : 'Generate New Horizon Forecast'}
        </button>
      </div>

      {/* Horizon Filter Tabs */}
      <div className="flex gap-2 border-b border-slate-800 pb-2">
        {Object.values(PredictionHorizon).map((h) => (
          <button
            key={h}
            onClick={() => setSelectedHorizon(h)}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${
              selectedHorizon === h
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200'
            }`}
          >
            {h.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Forecasts List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {forecasts.length === 0 ? (
          <div className="col-span-full p-8 text-center text-slate-500 bg-slate-900/40 rounded-xl border border-slate-800">
            No forecasts active for this horizon. Click "Generate New Horizon Forecast" to execute simulation.
          </div>
        ) : (
          forecasts.map((f) => (
            <div key={f.id} className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs uppercase font-bold text-emerald-400">{f.horizon.replace('_', ' ')}</span>
                <span className="text-xs text-slate-400 font-mono">Confidence: {f.predictiveConfidence}%</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-emerald-400 font-mono">
                  {(f.successProbability * 100).toFixed(0)}%
                </span>
                <span className="text-xs text-slate-400 uppercase font-semibold">Success Probability</span>
              </div>

              {/* Expected Outcomes */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="text-xs font-semibold text-slate-300 uppercase">Projected Outcomes:</div>
                {f.expectedOutcomes.map((o, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs text-slate-300">
                    <span>{o.metric}</span>
                    <span className="font-mono text-emerald-400">
                      {o.projectedValue} {o.unit}
                    </span>
                  </div>
                ))}
              </div>

              {/* Actionable Recommendations */}
              <div className="pt-2 border-t border-slate-800">
                <div className="text-xs font-semibold text-slate-300 uppercase mb-1">Recommended Interventions:</div>
                <ul className="list-disc list-inside text-xs text-slate-400 space-y-1">
                  {f.actionableRecommendations.map((r, idx) => (
                    <li key={idx}>{r}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
