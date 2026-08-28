import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  ShieldAlert,
  RefreshCw,
  Zap,
} from 'lucide-react';
import { careerOsApi } from '../../services/careerOsApi';
import {
  CareerPredictionReportDto,
  ForecastHorizon,
} from '@codeforge/shared';

export const CareerPredictionsPage: React.FC = () => {
  const [report, setReport] = useState<CareerPredictionReportDto | null>(null);
  const [selectedHorizon, setSelectedHorizon] = useState<ForecastHorizon>(ForecastHorizon.MONTHS_6);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await careerOsApi.getPredictions();
      if (res.data) setReport(res.data);
    } catch (err) {
      console.error('Failed to load career predictions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async () => {
    try {
      setRegenerating(true);
      const res = await careerOsApi.generatePredictions();
      if (res.data) setReport(res.data);
    } catch (err) {
      console.error('Failed to regenerate predictions:', err);
    } finally {
      setRegenerating(false);
    }
  };

  if (loading || !report) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent"></div>
          <p className="text-sm font-medium text-slate-400">Executing Multi-Horizon Predictive Career Simulations...</p>
        </div>
      </div>
    );
  }

  const currentPred = report.predictions.find((p) => p.horizon === selectedHorizon) || report.predictions[0];

  const getHorizonLabel = (h: ForecastHorizon) => {
    switch (h) {
      case ForecastHorizon.MONTHS_6:
        return '6 Months';
      case ForecastHorizon.YEAR_1:
        return '1 Year';
      case ForecastHorizon.YEARS_3:
        return '3 Years';
      case ForecastHorizon.YEARS_5:
        return '5 Years';
      default:
        return h;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 border-b border-slate-800 pb-6 md:flex-row md:items-center">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-400">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>AI Career Prediction Engine • Probabilistic Forecasting</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white">Career Trajectory Predictions</h1>
            <p className="text-sm text-slate-400">
              Machine-learning projections across promotion velocity, comp escalations, external market pull, and risk mitigation.
            </p>
          </div>
          <button
            onClick={handleRegenerate}
            disabled={regenerating}
            className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-cyan-500 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${regenerating ? 'animate-spin' : ''}`} />
            <span>{regenerating ? 'Simulating...' : 'Re-Run Forecast Models'}</span>
          </button>
        </div>

        {/* Horizon Tabs */}
        <div className="flex flex-wrap gap-2 rounded-xl border border-slate-800 bg-slate-900/60 p-1.5 shadow-lg backdrop-blur-sm">
          {report.predictions.map((p) => {
            const isSelected = p.horizon === selectedHorizon;
            return (
              <button
                key={p.horizon}
                onClick={() => setSelectedHorizon(p.horizon)}
                className={`flex-1 min-w-[120px] rounded-lg py-2.5 px-4 text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-cyan-600 text-white shadow-md'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                {getHorizonLabel(p.horizon)} Horizon
              </button>
            );
          })}
        </div>

        {/* Selected Horizon Deep Dive */}
        {currentPred && (
          <div className="space-y-6">
            {/* Target Role & Model Confidence Banner */}
            <div className="rounded-xl border border-cyan-900/40 bg-gradient-to-r from-slate-900 via-cyan-950/30 to-slate-900 p-6 shadow-xl backdrop-blur-sm">
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <span className="text-xs font-bold uppercase text-cyan-400">PROJECTED ROLES AT {getHorizonLabel(currentPred.horizon).toUpperCase()}</span>
                  <h2 className="text-2xl font-extrabold text-white">{currentPred.predictedRoles.join(' • ')}</h2>
                  <p className="mt-1 text-sm text-slate-300">
                    Fastest Path: <span className="font-bold text-emerald-400">{report.fastestPathToTarget}</span>
                  </p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 px-5 py-3 text-right">
                  <span className="text-xs font-bold uppercase text-slate-400">Simulation Confidence</span>
                  <p className="text-2xl font-black text-cyan-400">{currentPred.confidenceScore}%</p>
                </div>
              </div>
            </div>

            {/* 6 Probability Gauges */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 shadow">
                <span className="text-xs font-bold uppercase text-slate-400">Promotion Probability</span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-black text-purple-400">{currentPred.promotionProbability}%</span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-800">
                  <div className="h-full bg-purple-500" style={{ width: `${currentPred.promotionProbability}%` }}></div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 shadow">
                <span className="text-xs font-bold uppercase text-slate-400">Salary Growth Probability</span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-black text-emerald-400">{currentPred.salaryGrowthProbability}%</span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-800">
                  <div className="h-full bg-emerald-500" style={{ width: `${currentPred.salaryGrowthProbability}%` }}></div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 shadow">
                <span className="text-xs font-bold uppercase text-slate-400">External Job Switch Likelihood</span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-black text-cyan-400">{currentPred.jobSwitchProbability}%</span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-800">
                  <div className="h-full bg-cyan-500" style={{ width: `${currentPred.jobSwitchProbability}%` }}></div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 shadow">
                <span className="text-xs font-bold uppercase text-slate-400">Leadership Readiness</span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-black text-indigo-400">{currentPred.leadershipReadiness}%</span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-800">
                  <div className="h-full bg-indigo-500" style={{ width: `${currentPred.leadershipReadiness}%` }}></div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 shadow">
                <span className="text-xs font-bold uppercase text-slate-400">Skill Relevance Index</span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-black text-amber-400">{currentPred.skillRelevanceScore}%</span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-800">
                  <div className="h-full bg-amber-500" style={{ width: `${currentPred.skillRelevanceScore}%` }}></div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 shadow">
                <span className="text-xs font-bold uppercase text-slate-400">Career Disruption Risk</span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-black text-rose-400">{currentPred.careerRiskScore}%</span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-800">
                  <div className="h-full bg-rose-500" style={{ width: `${currentPred.careerRiskScore}%` }}></div>
                </div>
              </div>
            </div>

            {/* Drivers & Risk Factors */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-sm">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
                  <Zap className="h-5 w-5 text-cyan-400" />
                  <h3 className="text-base font-bold text-white">Primary Growth Drivers</h3>
                </div>
                <ul className="mt-4 space-y-2">
                  {currentPred.growthDrivers.map((d, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                      <span className="flex h-5 w-5 items-center justify-center rounded bg-cyan-500/10 text-xs font-bold text-cyan-400 flex-shrink-0">
                        {idx + 1}
                      </span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-sm">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
                  <ShieldAlert className="h-5 w-5 text-rose-400" />
                  <h3 className="text-base font-bold text-white">Key Risk Factors</h3>
                </div>
                <ul className="mt-4 space-y-2">
                  {currentPred.riskFactors.map((r, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                      <span className="flex h-5 w-5 items-center justify-center rounded bg-rose-500/10 text-xs font-bold text-rose-400 flex-shrink-0">
                        !
                      </span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
