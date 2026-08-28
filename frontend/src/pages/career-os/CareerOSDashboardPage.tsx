import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  Activity,
  Zap,
  TrendingUp,
  DollarSign,
  Award,
  Users,
  ShieldAlert,
  ArrowRight,
  BrainCircuit,
  Target,
  Sparkles,
  Calendar,
} from 'lucide-react';
import { careerOsApi } from '../../services/careerOsApi';
import {
  CareerTwinDto,
  CareerCoachingReportDto,
  PersonalBrandProfileDto,
  NetworkIntelligenceDto,
  CareerPredictionReportDto,
} from '@codeforge/shared';

export const CareerOSDashboardPage: React.FC = () => {
  const [twin, setTwin] = useState<CareerTwinDto | null>(null);
  const [coaching, setCoaching] = useState<CareerCoachingReportDto | null>(null);
  const [brand, setBrand] = useState<PersonalBrandProfileDto | null>(null);
  const [network, setNetwork] = useState<NetworkIntelligenceDto | null>(null);
  const [predictions, setPredictions] = useState<CareerPredictionReportDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [twinRes, coachRes, brandRes, netRes, predRes] = await Promise.all([
        careerOsApi.getTwin(),
        careerOsApi.getLatestCoachingReport(),
        careerOsApi.getPersonalBrand(),
        careerOsApi.getNetworkIntelligence(),
        careerOsApi.getPredictions(),
      ]);

      if (twinRes.data) setTwin(twinRes.data);
      if (coachRes.data) setCoaching(coachRes.data);
      if (brandRes.data) setBrand(brandRes.data);
      if (netRes.data) setNetwork(netRes.data);
      if (predRes.data) setPredictions(predRes.data);
    } catch (err) {
      console.error('Failed to load Career OS dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !twin) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
          <p className="text-sm font-medium text-slate-400">Loading AI Career Operating System...</p>
        </div>
      </div>
    );
  }

  const health = twin.healthScore || 78;
  const nextPred = predictions?.predictions?.[0];

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header Hero */}
        <div className="relative overflow-hidden rounded-2xl border border-indigo-900/40 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
          <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-400">
                <Sparkles className="h-3.5 w-3.5" />
                <span>AI Career Operating System • Active Companion</span>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Lifelong Career Intelligence Platform
              </h1>
              <p className="max-w-2xl text-sm text-slate-300">
                Live Career Digital Twin tracking growth vectors, market valuation, leadership readiness, personal branding, and multi-horizon role predictions.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/career-os/twin"
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-indigo-500 hover:shadow-indigo-500/25"
              >
                <BrainCircuit className="h-4 w-4" />
                <span>Inspect Digital Twin</span>
              </Link>
              <Link
                to="/career-os/insights"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-sm font-semibold text-slate-200 transition-all hover:bg-slate-700"
              >
                <Compass className="h-4 w-4" />
                <span>AI Career Coach</span>
              </Link>
            </div>
          </div>
        </div>

        {/* 9 Executive Career OS Widgets */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* 1. Career Health Score */}
          <div className="group rounded-xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg backdrop-blur-sm transition-all hover:border-indigo-500/50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Career Health Score</span>
              <Activity className="h-5 w-5 text-indigo-400" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">{health}</span>
              <span className="text-sm font-semibold text-indigo-400">/ 100</span>
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-800">
              <div className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400" style={{ width: `${health}%` }}></div>
            </div>
            <p className="mt-2 text-xs text-slate-400">Composite metric across 6 growth vectors</p>
          </div>

          {/* 2. Salary Position */}
          <div className="group rounded-xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg backdrop-blur-sm transition-all hover:border-emerald-500/50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Market Salary Position</span>
              <DollarSign className="h-5 w-5 text-emerald-400" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-black text-emerald-400">${(twin.currentSalaryUsd || 125000).toLocaleString()}</span>
              <span className="text-xs text-slate-400">USD</span>
            </div>
            <p className="mt-2 text-xs text-slate-300">Target Role Ceiling: <span className="font-semibold text-emerald-300">${(twin.targetSalaryUsd || 185000).toLocaleString()}</span></p>
            <Link to="/career-os/salary" className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300">
              <span>View benchmarks & premia</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {/* 3. Market Competitiveness */}
          <div className="group rounded-xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg backdrop-blur-sm transition-all hover:border-cyan-500/50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Market Competitiveness</span>
              <TrendingUp className="h-5 w-5 text-cyan-400" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-black text-cyan-400">{twin.marketCompetitiveness}</span>
              <span className="text-xs text-slate-400">th Percentile</span>
            </div>
            <p className="mt-2 text-xs text-slate-300">High demand in {twin.primarySkills.slice(0, 2).join(', ')}</p>
            <Link to="/career-os/predictions" className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300">
              <span>Explore job-switch forecasts</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {/* 4. Promotion Readiness */}
          <div className="group rounded-xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg backdrop-blur-sm transition-all hover:border-purple-500/50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Promotion Readiness</span>
              <Award className="h-5 w-5 text-purple-400" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-black text-purple-400">{coaching?.promotionReadiness || 72}%</span>
              <span className="text-xs text-slate-400">to {twin.targetRole}</span>
            </div>
            <p className="mt-2 text-xs text-slate-300">Target Horizon: ~{coaching?.promotionPlan?.estimatedHorizonMonths || 6} months</p>
            <Link to="/career-os/insights" className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-purple-400 hover:text-purple-300">
              <span>View promotion proof points</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {/* 5. Personal Brand Score */}
          <div className="group rounded-xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg backdrop-blur-sm transition-all hover:border-pink-500/50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Personal Brand Authority</span>
              <Sparkles className="h-5 w-5 text-pink-400" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-black text-pink-400">{brand?.brandScore.brandScore || 68}</span>
              <span className="text-xs rounded bg-pink-500/10 px-1.5 py-0.5 font-bold text-pink-400">{brand?.brandScore.brandTier || 'STRONG'}</span>
            </div>
            <p className="mt-2 text-xs text-slate-300">GitHub: {brand?.brandScore.githubScore || 72} • LinkedIn: {brand?.brandScore.linkedinScore || 70}</p>
            <Link to="/career-os/brand" className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-pink-400 hover:text-pink-300">
              <span>Optimize technical brand</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {/* 6. Network Strength */}
          <div className="group rounded-xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg backdrop-blur-sm transition-all hover:border-blue-500/50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Network Strength Graph</span>
              <Users className="h-5 w-5 text-blue-400" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-black text-blue-400">{network?.networkStrengthScore || 75}</span>
              <span className="text-xs text-slate-400">({network?.totalConnections || 4} Connections)</span>
            </div>
            <p className="mt-2 text-xs text-slate-300">2 Verified Mentor Matches available</p>
            <Link to="/career-os/timeline" className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-blue-400 hover:text-blue-300">
              <span>Expand professional graph</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {/* 7. Learning Velocity */}
          <div className="group rounded-xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg backdrop-blur-sm transition-all hover:border-amber-500/50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Learning Velocity</span>
              <Zap className="h-5 w-5 text-amber-400" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-black text-amber-400">{twin.learningVelocity}</span>
              <span className="text-xs text-slate-400">XP / Commit Pace</span>
            </div>
            <p className="mt-2 text-xs text-slate-300">Top 15% across platform engineers</p>
            <Link to="/career-os/twin" className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-amber-400 hover:text-amber-300">
              <span>View velocity telemetry</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {/* 8. Career Risk Index */}
          <div className="group rounded-xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg backdrop-blur-sm transition-all hover:border-rose-500/50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Career Risk Index</span>
              <ShieldAlert className="h-5 w-5 text-rose-400" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-black text-rose-400">{nextPred?.careerRiskScore || 15}</span>
              <span className="text-xs text-emerald-400 font-bold">LOW RISK</span>
            </div>
            <p className="mt-2 text-xs text-slate-300">Burnout Score: {coaching?.burnoutRiskScore || 18}/100 (Optimal)</p>
            <Link to="/career-os/insights" className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-rose-400 hover:text-rose-300">
              <span>Review risk alerts</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {/* 9. Leadership Potential */}
          <div className="group rounded-xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg backdrop-blur-sm transition-all hover:border-teal-500/50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-400">Leadership Potential</span>
              <Target className="h-5 w-5 text-teal-400" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-black text-teal-400">{twin.leadershipPotential}</span>
              <span className="text-xs text-slate-400">/ 100</span>
            </div>
            <p className="mt-2 text-xs text-slate-300">Staff Architecture & Mentorship Track</p>
            <Link to="/career-os/predictions" className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-teal-400 hover:text-teal-300">
              <span>Predict leadership horizon</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Momentum Vectors & Strategic Quick Links */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Digital Twin Vectors */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-sm lg:col-span-2">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white">6 Core Career Momentum Vectors</h2>
                <p className="text-xs text-slate-400">Real-time telemetry updated from assessments, contests, and project reviews</p>
              </div>
              <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-400">
                Target: {twin.targetRole}
              </span>
            </div>

            <div className="mt-6 space-y-4">
              {[
                { label: 'Learning Velocity', val: twin.learningVelocity, color: 'bg-indigo-500' },
                { label: 'Career Momentum', val: twin.careerMomentum, color: 'bg-blue-500' },
                { label: 'Market Competitiveness', val: twin.marketCompetitiveness, color: 'bg-cyan-500' },
                { label: 'Interview Readiness', val: twin.interviewReadiness, color: 'bg-emerald-500' },
                { label: 'Salary Positioning', val: twin.salaryPositioning, color: 'bg-amber-500' },
                { label: 'Leadership Potential', val: twin.leadershipPotential, color: 'bg-purple-500' },
              ].map((vec) => (
                <div key={vec.label}>
                  <div className="flex justify-between text-xs font-semibold text-slate-300">
                    <span>{vec.label}</span>
                    <span>{vec.val}%</span>
                  </div>
                  <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-800">
                    <div className={`h-full ${vec.color}`} style={{ width: `${vec.val}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Action Portals */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Career OS Portals</h3>

            {[
              { title: 'Digital Twin Studio', desc: 'Inspect verified skills & strength vectors', url: '/career-os/twin', icon: BrainCircuit, color: 'text-indigo-400' },
              { title: 'AI Career Coach', desc: 'Weekly reviews, burnout alerts & plans', url: '/career-os/insights', icon: Compass, color: 'text-purple-400' },
              { title: 'Salary Intelligence', desc: 'P25-P90 benchmarks & skill premia', url: '/career-os/salary', icon: DollarSign, color: 'text-emerald-400' },
              { title: 'Personal Brand Studio', desc: 'GitHub, LinkedIn & technical blogging', url: '/career-os/brand', icon: Sparkles, color: 'text-pink-400' },
              { title: 'Interactive Timeline', desc: 'Past milestones & future career targets', url: '/career-os/timeline', icon: Calendar, color: 'text-blue-400' },
              { title: 'AI Career Predictions', desc: '6M, 1Y, 3Y, 5Y probabilistic forecasts', url: '/career-os/predictions', icon: TrendingUp, color: 'text-cyan-400' },
            ].map((portal) => {
              const Icon = portal.icon;
              return (
                <Link
                  key={portal.url}
                  to={portal.url}
                  className="flex items-center justify-between rounded-xl border border-slate-800/80 bg-slate-900/60 p-3.5 shadow transition-all hover:border-slate-700 hover:bg-slate-800/80"
                >
                  <div className="flex items-center gap-3">
                    <div className={`rounded-lg bg-slate-800 p-2 ${portal.color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-100">{portal.title}</h4>
                      <p className="text-xs text-slate-400">{portal.desc}</p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-500 transition-transform group-hover:translate-x-1" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
