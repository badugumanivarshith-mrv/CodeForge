import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  TrendingUp,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';
import { careerOsApi } from '../../services/careerOsApi';
import { SalaryIntelligenceReportDto, SkillSalaryPremiumDto } from '@codeforge/shared';

export const SalaryIntelligencePage: React.FC = () => {
  const [report, setReport] = useState<SalaryIntelligenceReportDto | null>(null);
  const [roleFilter, setRoleFilter] = useState('Senior Distributed Systems Engineer');
  const [levelFilter] = useState('L5 / Senior');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [roleFilter, levelFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await careerOsApi.getSalaryIntelligence(roleFilter, levelFilter);
      if (res.data) setReport(res.data);
    } catch (err) {
      console.error('Failed to load salary intelligence:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !report) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
          <p className="text-sm font-medium text-slate-400">Querying Global Compensation Telemetry...</p>
        </div>
      </div>
    );
  }

  const primaryBenchmark = report.benchmarks[0] || {
    role: report.userRole,
    level: levelFilter,
    p25SalaryUsd: 120000,
    p50SalaryUsd: 145000,
    p75SalaryUsd: 175000,
    p90SalaryUsd: 210000,
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 border-b border-slate-800 pb-6 md:flex-row md:items-center">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
              <DollarSign className="h-3.5 w-3.5" />
              <span>Compensation Intelligence • Global P25-P90 Benchmarks</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white">Salary Intelligence Platform</h1>
            <p className="text-sm text-slate-400">
              Granular market percentiles, skill premium valuations, and strategic negotiation playbooks.
            </p>
          </div>

          <div className="flex gap-3">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-200 focus:border-emerald-500 focus:outline-none"
            >
              <option value="Senior Distributed Systems Engineer">Senior Distributed Systems Engineer</option>
              <option value="Staff Backend Architect">Staff Backend Architect</option>
              <option value="AI Systems & LLM Platform Engineer">AI Systems & LLM Platform Engineer</option>
              <option value="Lead Rust & Low-Latency Engineer">Lead Rust & Low-Latency Engineer</option>
            </select>
          </div>
        </div>

        {/* User Positioning vs Market Benchmark Cards */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* User Status Card */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-sm lg:col-span-1">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold uppercase text-emerald-400">Your Compensation</span>
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
            </div>

            <div className="mt-4">
              <span className="text-3xl font-black text-white">${report.currentEstimatedP50.toLocaleString()}</span>
              <span className="text-xs text-slate-400"> USD / year</span>
              <p className="mt-1 text-xs text-slate-400">Positioning: <span className="font-bold text-emerald-400">{report.userPositionPercentile}th percentile</span></p>
            </div>

            <div className="mt-6 space-y-3 border-t border-slate-800 pt-4">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Promotion Target:</span>
                <span className="font-bold text-purple-400">${report.promotionSalaryForecastUsd.toLocaleString()} USD</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Job Switch Target:</span>
                <span className="font-bold text-emerald-400">${report.jobSwitchSalaryForecastUsd.toLocaleString()} USD</span>
              </div>
            </div>
          </div>

          {/* Benchmark Distribution Bar */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-sm lg:col-span-2">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">{primaryBenchmark.role} ({primaryBenchmark.level})</h3>
                <p className="text-xs text-slate-400">Global Tech Hubs • Base + Liquid Equity</p>
              </div>
              <span className="rounded bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-400">
                Median: ${primaryBenchmark.p50SalaryUsd.toLocaleString()}
              </span>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-3 text-center">
                <span className="text-xs font-bold uppercase text-slate-400">P25 (Entry)</span>
                <p className="mt-1 text-lg font-black text-slate-300">${primaryBenchmark.p25SalaryUsd.toLocaleString()}</p>
              </div>
              <div className="rounded-lg border border-emerald-500/40 bg-emerald-950/20 p-3 text-center">
                <span className="text-xs font-bold uppercase text-emerald-400">P50 (Median)</span>
                <p className="mt-1 text-lg font-black text-emerald-400">${primaryBenchmark.p50SalaryUsd.toLocaleString()}</p>
              </div>
              <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-3 text-center">
                <span className="text-xs font-bold uppercase text-slate-400">P75 (Top Tier)</span>
                <p className="mt-1 text-lg font-black text-slate-300">${primaryBenchmark.p75SalaryUsd.toLocaleString()}</p>
              </div>
              <div className="rounded-lg border border-purple-500/40 bg-purple-950/20 p-3 text-center">
                <span className="text-xs font-bold uppercase text-purple-400">P90 (Elite)</span>
                <p className="mt-1 text-lg font-black text-purple-400">${primaryBenchmark.p90SalaryUsd.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Skill Premia & Compensation Projections */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* High-Value Skill Premia */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Skill Premium Valuations</h3>
              </div>
              <span className="text-xs text-slate-400">Annual Comp Uplift</span>
            </div>

            <div className="mt-4 divide-y divide-slate-800/60">
              {report.skillSalaryPremiums.map((sp: SkillSalaryPremiumDto) => (
                <div key={sp.skill} className="flex items-center justify-between py-3">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-200">{sp.skill}</h4>
                    <span className="text-xs text-slate-400">{sp.highDemandSectors.join(', ')}</span>
                  </div>
                  <div className="text-right">
                    <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-400">
                      +${sp.avgEstimatedBoostUsd.toLocaleString()} USD ({sp.salaryPremiumPercentage}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Compensation Growth Forecasts & Tactics */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-sm">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
              <TrendingUp className="h-5 w-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white">Projected Growth Scenarios</h3>
            </div>

            <div className="mt-4 space-y-4">
              <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold uppercase text-purple-400">Internal Promotion Target</h4>
                    <p className="text-lg font-black text-white">${report.promotionSalaryForecastUsd.toLocaleString()} USD</p>
                  </div>
                  <span className="rounded bg-purple-500/20 px-2 py-1 text-xs font-bold text-purple-400">
                    Target Role Bump
                  </span>
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold uppercase text-emerald-400">External Market Switch Target</h4>
                    <p className="text-lg font-black text-white">${report.jobSwitchSalaryForecastUsd.toLocaleString()} USD</p>
                  </div>
                  <span className="rounded bg-emerald-500/20 px-2 py-1 text-xs font-bold text-emerald-400">
                    Market Premium
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase text-slate-400">Negotiation Strategy Recommendations</h4>
                <ul className="mt-2 space-y-1.5">
                  {report.compensationRecommendations.map((rec: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                      <ArrowUpRight className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
