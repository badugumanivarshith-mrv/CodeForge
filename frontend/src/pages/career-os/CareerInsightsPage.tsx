import React, { useState, useEffect } from 'react';
import {
  Compass,
  ShieldAlert,
  Award,
  TrendingUp,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { careerOsApi } from '../../services/careerOsApi';
import {
  CareerCoachingReportDto,
  CareerRiskAlertLevel,
} from '@codeforge/shared';

export const CareerInsightsPage: React.FC = () => {
  const [report, setReport] = useState<CareerCoachingReportDto | null>(null);
  const [history, setHistory] = useState<CareerCoachingReportDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [latestRes, listRes] = await Promise.all([
        careerOsApi.getLatestCoachingReport(),
        careerOsApi.listCoachingReports(),
      ]);

      if (latestRes.data) setReport(latestRes.data);
      if (listRes.data) setHistory(listRes.data);
    } catch (err) {
      console.error('Failed to load career coaching reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    try {
      setGenerating(true);
      const res = await careerOsApi.generateCoachingReport('weekly');
      if (res.data) {
        setReport(res.data);
        setHistory([res.data, ...history]);
      }
    } catch (err) {
      console.error('Failed to generate report:', err);
    } finally {
      setGenerating(false);
    }
  };

  if (loading || !report) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
          <p className="text-sm font-medium text-slate-400">Consulting AI Career Coach...</p>
        </div>
      </div>
    );
  }

  const getAlertBadge = (level: CareerRiskAlertLevel) => {
    switch (level) {
      case CareerRiskAlertLevel.CRITICAL:
        return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      case CareerRiskAlertLevel.HIGH:
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case CareerRiskAlertLevel.MEDIUM:
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default:
        return 'bg-slate-700/50 text-slate-300 border-slate-600';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 border-b border-slate-800 pb-6 md:flex-row md:items-center">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-400">
              <Compass className="h-3.5 w-3.5" />
              <span>Executive AI Coach • Weekly Advisory</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white">AI Career Coaching & Insights</h1>
            <p className="text-sm text-slate-400">
              Continuous promotion readiness evaluation, burnout risk telemetry, and tactical career execution plans.
            </p>
          </div>
          <button
            onClick={handleGenerateReport}
            disabled={generating}
            className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-purple-500 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${generating ? 'animate-spin' : ''}`} />
            <span>{generating ? 'Synthesizing...' : 'Run New Coaching Cycle'}</span>
          </button>
        </div>

        {/* Executive Summary & Gauges */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Summary Box */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-sm lg:col-span-2">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">Executive Synthesis</span>
              <span className="text-xs text-slate-500">{new Date(report.generatedAt).toLocaleString()}</span>
            </div>
            <p className="mt-4 text-base leading-relaxed text-slate-200">{report.summary}</p>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-800/80 bg-slate-950/40 p-4">
                <span className="text-xs font-bold text-slate-400">PROMOTION READINESS</span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-black text-purple-400">{report.promotionReadiness}%</span>
                  <span className="text-xs text-slate-400">to next level</span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-800">
                  <div className="h-full bg-purple-500" style={{ width: `${report.promotionReadiness}%` }}></div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-800/80 bg-slate-950/40 p-4">
                <span className="text-xs font-bold text-slate-400">BURNOUT RISK TELEMETRY</span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-black text-emerald-400">{report.burnoutRiskScore}/100</span>
                  <span className="text-xs font-semibold text-emerald-400">Healthy Cadence</span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-800">
                  <div className="h-full bg-emerald-500" style={{ width: `${report.burnoutRiskScore}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Items List */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-sm lg:col-span-1">
            <h3 className="text-base font-bold text-white">Priority Action Items</h3>
            <p className="text-xs text-slate-400">Assigned by AI coach for this sprint</p>

            <div className="mt-4 space-y-3">
              {report.actionItems.map((item, idx) => (
                <div key={idx} className="rounded-lg border border-slate-800/80 bg-slate-950/50 p-3">
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-indigo-500/10 px-2 py-0.5 text-xs font-bold text-indigo-400">
                      {item.category}
                    </span>
                    <span className={`text-xs font-bold uppercase ${item.priority === 'HIGH' ? 'text-rose-400' : 'text-slate-400'}`}>
                      {item.priority}
                    </span>
                  </div>
                  <p className="mt-2 text-xs font-medium text-slate-200">{item.action}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Risk Alerts */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-sm">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
            <ShieldAlert className="h-5 w-5 text-rose-400" />
            <h3 className="text-lg font-bold text-white">Active Career Risk Alerts ({report.riskAlerts.length})</h3>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            {report.riskAlerts.map((alert, idx) => (
              <div key={idx} className="rounded-xl border border-slate-800/80 bg-slate-950/50 p-4">
                <div className="flex items-center justify-between">
                  <span className={`rounded border px-2.5 py-0.5 text-xs font-bold uppercase ${getAlertBadge(alert.level)}`}>
                    {alert.level} RISK
                  </span>
                  <span className="text-xs font-semibold text-slate-400">{alert.category}</span>
                </div>
                <h4 className="mt-2 text-sm font-bold text-slate-100">{alert.title}</h4>
                <p className="mt-1 text-xs text-slate-400">{alert.description}</p>
                <p className="mt-1.5 text-xs text-indigo-400 font-medium"><span className="font-bold text-indigo-300">Action: </span>{alert.suggestedAction}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Promotion & Job Switch Strategic Roadmaps */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Promotion Plan */}
          {report.promotionPlan && (
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-sm">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-purple-400" />
                  <h3 className="text-base font-bold text-white">Target Role Promotion Blueprint</h3>
                </div>
                <span className="text-xs text-slate-400">~{report.promotionPlan.estimatedHorizonMonths} Months Horizon</span>
              </div>

              <div className="mt-4 space-y-4">
                <div>
                  <h4 className="text-xs font-bold uppercase text-purple-400">Target Role</h4>
                  <p className="text-sm font-extrabold text-white">{report.promotionPlan.targetRole}</p>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase text-slate-400">Key Competency Gaps</h4>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {report.promotionPlan.keyCompetencyGaps.map((gap: string) => (
                      <span key={gap} className="rounded border border-slate-700 bg-slate-800 px-2 py-0.5 text-xs text-slate-200">
                        {gap}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase text-slate-400">Demonstrable Proof Points</h4>
                  <ul className="mt-1.5 space-y-1">
                    {report.promotionPlan.leadershipProofPoints.map((pt: string, idx: number) => (
                      <li key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="h-3.5 w-3.5 text-purple-400 flex-shrink-0" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Job Switch Plan */}
          {report.jobSwitchPlan && (
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-sm">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-emerald-400" />
                  <h3 className="text-base font-bold text-white">External Market Job-Switch Plan</h3>
                </div>
                <span className="text-xs text-slate-400">{report.jobSwitchPlan.recommendedPrepTimeWeeks} Weeks Prep</span>
              </div>

              <div className="mt-4 space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-xs font-bold uppercase text-emerald-400">Target External Comp Range</h4>
                    <p className="text-lg font-black text-emerald-400">${report.jobSwitchPlan.targetSalaryRange.min.toLocaleString()} – ${report.jobSwitchPlan.targetSalaryRange.max.toLocaleString()} USD</p>
                  </div>
                  <div className="text-right">
                    <h4 className="text-xs font-bold uppercase text-slate-400">Market Demand</h4>
                    <span className="rounded bg-emerald-500/20 px-2 py-1 text-xs font-bold text-emerald-400">
                      {report.jobSwitchPlan.marketDemandScore}/100
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase text-slate-400">Target Companies</h4>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {report.jobSwitchPlan.targetCompanies.map((co: string) => (
                      <span key={co} className="rounded border border-slate-700 bg-slate-800 px-2 py-0.5 text-xs font-medium text-slate-200">
                        {co}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase text-slate-400">Interview Readiness</h4>
                  <p className="mt-1 text-xs text-slate-300">Readiness Score: <span className="font-bold text-emerald-400">{report.jobSwitchPlan.interviewReadiness}%</span></p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
