import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  TrendingUp,
  Target,
  DollarSign,
  BookOpen,
  ArrowRight,
  Loader2,
  Award,
  Layers,
} from 'lucide-react';
import { placementApi } from '../services/placementApi';
import { CareerAdvisorAnalysisDto } from '@codeforge/shared';

export const AiCareerAdvisorPage: React.FC = () => {
  const [advice, setAdvice] = useState<CareerAdvisorAnalysisDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [targetRole, setTargetRole] = useState('Full Stack Engineer');

  useEffect(() => {
    loadAdvice();
  }, []);

  const loadAdvice = async (customRole?: string) => {
    try {
      setLoading(true);
      const res = await placementApi.getCareerAdvice(customRole || targetRole);
      setAdvice(res);
    } catch (err) {
      console.error('Failed to load career advice:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = (role: string) => {
    setTargetRole(role);
    loadAdvice(role);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-slate-900 border border-slate-800 rounded-2xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5" /> AI Predictive Career Intelligence
            </div>
            <h1 className="text-3xl font-extrabold text-white">AI Placement Advisor & Trajectory Engine</h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              Synthesizing your verified contest Elo, algorithmic mastery metrics, and system design submissions to predict salary benchmarks, pinpoint skill deficits, and project career advancement.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-300">Target Role Horizon:</label>
            <select
              value={targetRole}
              onChange={e => handleRoleChange(e.target.value)}
              className="px-4 py-2.5 bg-slate-950/90 border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition"
            >
              <option value="Full Stack Engineer">Full Stack Engineer</option>
              <option value="Backend Systems Engineer">Backend Systems Engineer</option>
              <option value="Distributed Infrastructure Specialist">Distributed Infrastructure</option>
              <option value="Machine Learning Engineer">Machine Learning Engineer</option>
              <option value="Staff Software Architect">Staff Software Architect</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
          </div>
        ) : !advice ? (
          <div className="text-center py-16 text-slate-500">Failed to generate career advice.</div>
        ) : (
          <div className="space-y-8">
            {/* 3 Metric Gauges: Readiness, Placement Prob, Salary Range */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Interview Readiness */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Interview Readiness</span>
                  <Award className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="text-3xl font-extrabold text-white">
                  {advice.interviewReadinessScore}
                  <span className="text-base text-slate-400 font-normal"> / 100</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full"
                    style={{ width: `${advice.interviewReadinessScore}%` }}
                  />
                </div>
                <p className="text-xs text-slate-400">
                  Current Level: <span className="font-semibold text-slate-200">{advice.currentLevel}</span>
                </p>
              </div>

              {/* Placement Probability */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Placement Probability</span>
                  <Target className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-3xl font-extrabold text-emerald-400">
                  {advice.placementProbability}%
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${advice.placementProbability}%` }}
                  />
                </div>
                <p className="text-xs text-slate-400">
                  Calculated based on Tier-1 company hiring criteria.
                </p>
              </div>

              {/* Salary Estimation */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Estimated Market Compensation</span>
                  <DollarSign className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-extrabold text-white">
                  ${(advice.salaryEstimation.minAnnual / 1000).toFixed(0)}k - $
                  {(advice.salaryEstimation.maxAnnual / 1000).toFixed(0)}k
                  <span className="text-xs text-slate-400 font-normal"> / yr</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Median: ${(advice.salaryEstimation.medianAnnual / 1000).toFixed(0)}k</span>
                  <span className="text-indigo-400 font-semibold">{advice.salaryEstimation.percentileRank}th Percentile</span>
                </div>
              </div>
            </div>

            {/* Skill Gap Analysis Matrix */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-indigo-400" /> Critical Skill Gaps & Deficit Breakdown
                </h2>
                <p className="text-xs text-slate-400">
                  Identified competencies that will yield the highest rating increase and interview pass-rate for {advice.targetRole}.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {advice.skillGaps.map((gap, i) => (
                  <div key={i} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm text-slate-200">{gap.skill}</span>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[11px] font-bold uppercase ${
                          gap.importance === 'critical'
                            ? 'bg-rose-950 text-rose-300 border border-rose-500/30'
                            : gap.importance === 'important'
                            ? 'bg-amber-950 text-amber-300 border border-amber-500/30'
                            : 'bg-blue-950 text-blue-300 border border-blue-500/30'
                        }`}
                      >
                        {gap.importance.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>Current: {gap.currentProficiency}%</span>
                        <span className="text-indigo-300 font-semibold">Target: {gap.targetProficiency}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-500 rounded-full"
                          style={{ width: `${gap.currentProficiency}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Multi-Horizon Career Trajectory */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-indigo-400" /> 3-Stage Career Trajectory Horizon
                </h2>
                <p className="text-xs text-slate-400">
                  Projected career roadmap and milestones over the next 5 years.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {advice.careerTrajectory.map((traj, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div>
                        <span className="text-xs font-bold text-indigo-400 uppercase">{traj.timeline}</span>
                        <h3 className="font-bold text-base text-white mt-0.5">{traj.stage}</h3>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Target Roles:</span>
                        <div className="flex flex-wrap gap-1">
                          {traj.targetRoles.map((r, i) => (
                            <span key={i} className="px-2 py-0.5 rounded-md text-xs bg-slate-800 text-slate-300">
                              {r}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1.5 pt-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Milestones:</span>
                        <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
                          {traj.milestones.map((m, i) => (
                            <li key={i}>{m}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Personalized Practice & System Design Roadmap */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-indigo-400" /> Personalized Problem-Solving Practice Roadmap
                </h2>
                <p className="text-xs text-slate-400">
                  Step-by-step curricular actions targeting your exact algorithmic weaknesses.
                </p>
              </div>

              <div className="space-y-4">
                {advice.personalizedRoadmap.map(step => (
                  <div
                    key={step.step}
                    className="p-5 rounded-xl bg-slate-950/80 border border-indigo-500/20 hover:border-indigo-500/40 transition flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                  >
                    <div className="space-y-1.5 max-w-2xl">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                          {step.step}
                        </span>
                        <h3 className="font-bold text-sm text-white">{step.title}</h3>
                        <span className="text-xs text-slate-500">• {step.estimatedWeeks} Weeks</span>
                      </div>
                      <p className="text-xs text-slate-400 pl-8">{step.description}</p>
                    </div>

                    <Link
                      to="/arena"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition flex-shrink-0"
                    >
                      Practice Curated Problems <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
