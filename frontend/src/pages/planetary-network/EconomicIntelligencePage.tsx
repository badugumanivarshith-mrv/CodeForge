import React, { useEffect, useState } from 'react';
import { planetaryIntelligenceApi } from '../../services/planetaryIntelligenceApi';
import { EconomicSignalDto, EconomicForecastDto } from '@codeforge/shared';

export const EconomicIntelligencePage: React.FC = () => {
  const [signals, setSignals] = useState<EconomicSignalDto[]>([]);
  const [forecast, setForecast] = useState<EconomicForecastDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [sigData, fcData] = await Promise.all([
          planetaryIntelligenceApi.listEconomicSignals(),
          planetaryIntelligenceApi.generateEconomicForecast(12),
        ]);
        setSignals(sigData);
        setForecast(fcData);
      } catch (err) {
        console.error('Failed to load economic intelligence', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Loading Global Economic Intelligence...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center space-x-3">
            <span className="text-3xl">💹</span>
            <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400">
              Global Economic Intelligence
            </h1>
          </div>
          <p className="text-slate-400 mt-1">
            Talent Economy Analytics, Skill Premium Velocity & Macroeconomic Modeling
          </p>
        </div>
      </div>

      {/* Macro Forecast Summary Card */}
      {forecast && (
        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-emerald-300">
              📈 {forecast.horizonMonths}-Month Planetary Economic Forecast
            </h2>
            <span className="text-xs bg-emerald-950 text-emerald-400 px-3 py-1 rounded-full border border-emerald-800 font-semibold">
              Macro Health: {forecast.macroEconomicHealthScore}/100
            </span>
          </div>
          <p className="text-slate-300 text-sm">{forecast.forecastSummary}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {forecast.skillPremiumTrends?.map((sk, i) => (
              <div key={i} className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
                <div className="text-xs text-slate-400 font-medium">{sk.skill}</div>
                <div className="text-xl font-bold text-emerald-400 mt-1">+{sk.changePercent}%</div>
                <div className="text-[10px] text-slate-500">Premium appreciation</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Live Economic Signals */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-slate-100 mb-4">Live Economic Signals</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {signals.map((sig) => (
            <div key={sig.id} className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl space-y-1.5">
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-emerald-400 uppercase">{sig.signalType}</span>
                <span className="text-[10px] text-slate-500">{new Date(sig.detectedAt).toLocaleTimeString()}</span>
              </div>
              <div className="font-semibold text-white text-sm">{sig.sector}</div>
              <div className="text-xs text-slate-400">Intensity: {sig.intensityScore}/100 • Region: {sig.region}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
