import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Zap,
  DollarSign,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';
import { enterpriseApi } from '../services/enterpriseApi';
import { WorkforceIntelligenceDto } from '@codeforge/shared';

export const WorkforceIntelligencePage: React.FC = () => {
  const [report, setReport] = useState<WorkforceIntelligenceDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadIntelligence();
  }, []);

  const loadIntelligence = async () => {
    try {
      setLoading(true);
      const data = await enterpriseApi.getWorkforceIntelligence(480);
      setReport(data);
    } catch (err) {
      console.error('Failed to load workforce intelligence:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !report) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  const { workforceReadiness, topDemandedSkills, salaryIntelligence, techTrends } = report;

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="border-b border-slate-800 pb-6">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-400">
              AI Workforce Intelligence Engine
            </span>
            <span className="flex items-center gap-1 rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-xs text-indigo-400">
              <Sparkles className="h-3 w-3" /> Predictive Labor Market Telemetry
            </span>
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            AI Skill Demand & Labor Market Forecasting
          </h1>
          <p className="mt-1 text-slate-400">
            Real-time market signal aggregation, salary benchmarking, and automated institutional readiness indexing.
          </p>
        </div>

        {/* Readiness Index Banner */}
        <div className="mt-8 rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/40 via-slate-900/60 to-indigo-950/40 p-6 backdrop-blur-xl">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Composite Readiness</span>
              <div className="mt-1 flex items-baseline gap-3">
                <h2 className="text-4xl font-extrabold text-white">{workforceReadiness.overallReadinessIndex}/100</h2>
                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400">
                  Benchmark: {workforceReadiness.industryBenchmark}%
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-300">
                {workforceReadiness.jobReadyTalentCount} of {workforceReadiness.activeLearnersCount} active candidates currently verified job-ready.
              </p>
            </div>

            {/* Talent Clusters Breakdown */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {workforceReadiness.topTalentClusters.map((cluster: any, idx: number) => (
                <div key={idx} className="rounded-xl border border-slate-800 bg-slate-950/80 p-3 text-center">
                  <p className="text-[11px] font-semibold text-slate-400 truncate">{cluster.domain}</p>
                  <p className="mt-1 text-xl font-bold text-cyan-400">{cluster.readinessScore}%</p>
                  <p className="text-[10px] text-slate-500">{cluster.candidateCount} Candidates</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Skill Forecasts & Emerging Tech */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Skill Demand Forecasts */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-cyan-400" /> High-Velocity Skill Demands
            </h2>
            <div className="mt-6 space-y-4">
              {topDemandedSkills.map((s: any, idx: number) => (
                <div key={idx} className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-white">{s.skill}</h4>
                      <p className="text-xs text-slate-400">{s.category} · Demand Score: {s.demandScore}/100</p>
                    </div>
                    <div className="text-right">
                      <span className="flex items-center gap-1 text-sm font-bold text-emerald-400">
                        <ArrowUpRight className="h-4 w-4" /> +{s.growthRatePercentage}%
                      </span>
                      <p className="text-[10px] text-slate-400 font-mono">Vol: {s.hiringVolume}</p>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500"
                      style={{ width: `${Math.min(100, s.demandScore)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Emerging Tech Trends */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-400" /> Tech Adoption Trends
            </h2>
            <div className="mt-6 space-y-4">
              {techTrends.map((tech: any, idx: number) => (
                <div key={idx} className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-white">{tech.technology}</h4>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase ${
                        tech.momentum === 'ACCELERATING'
                          ? 'bg-red-500/10 text-red-400'
                          : tech.momentum === 'STEADY'
                          ? 'bg-amber-500/10 text-amber-400'
                          : 'bg-indigo-500/10 text-indigo-400'
                      }`}
                    >
                      {tech.momentum}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-slate-300">Ecosystem: {tech.ecosystem} · Adoption Score: {tech.adoptionScore}/100</p>
                  <p className="mt-3 text-xs text-cyan-400 font-medium">
                    {tech.recommendedForCurriculum ? '★ Recommended for Curriculum' : 'Monitored for future inclusion'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Salary Benchmarks */}
        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-emerald-400" /> Compensation Intelligence Benchmarks
          </h2>
          <div className="mt-6 overflow-hidden rounded-xl border border-slate-800 bg-slate-950/60">
            <table className="min-w-full divide-y divide-slate-800 text-left text-sm">
              <thead className="bg-slate-950 text-xs uppercase text-slate-400">
                <tr>
                  <th className="px-6 py-3.5">Engineering Role</th>
                  <th className="px-6 py-3.5">Seniority</th>
                  <th className="px-6 py-3.5">25th Percentile</th>
                  <th className="px-6 py-3.5">Median Salary</th>
                  <th className="px-6 py-3.5">75th Percentile</th>
                  <th className="px-6 py-3.5">YoY Growth</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {salaryIntelligence.map((b: any, idx: number) => (
                  <tr key={idx} className="hover:bg-slate-900/40">
                    <td className="px-6 py-4 font-semibold text-white">{b.role}</td>
                    <td className="px-6 py-4 text-xs text-slate-400 capitalize">{b.experienceLevel}</td>
                    <td className="px-6 py-4 font-mono text-slate-300">${(b.percentile25th / 1000).toFixed(0)}k</td>
                    <td className="px-6 py-4 font-mono font-bold text-cyan-400">${(b.medianSalaryUsd / 1000).toFixed(0)}k</td>
                    <td className="px-6 py-4 font-mono font-bold text-emerald-400">${(b.percentile75th / 1000).toFixed(0)}k</td>
                    <td className="px-6 py-4 text-xs text-emerald-400 font-semibold">+{b.salaryGrowthYoY}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
