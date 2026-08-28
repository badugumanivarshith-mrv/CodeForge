import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { agenticWorkspaceApi } from '../../services/agenticWorkspaceApi';
import {
  ProductivityAnalyticsDto,
  ExecutiveDecisionDto,
  DecisionType,
} from '@codeforge/shared';

export const ProductivityAnalyticsPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<ProductivityAnalyticsDto | null>(null);
  const [decisions, setDecisions] = useState<ExecutiveDecisionDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly' | 'quarterly'>('weekly');
  const [decisionTitle, setDecisionTitle] = useState('');
  const [decisionType, setDecisionType] = useState<DecisionType>(DecisionType.CAREER_TRANSITION);
  const [evaluating, setEvaluating] = useState(false);

  useEffect(() => {
    loadData();
  }, [timeframe]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [analyticsData, decisionsData] = await Promise.all([
        agenticWorkspaceApi.getProductivityAnalytics(timeframe),
        agenticWorkspaceApi.listDecisions(),
      ]);
      setAnalytics(analyticsData);
      setDecisions(decisionsData);
    } catch (err) {
      console.error('Failed to load analytics & decisions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEvaluateDecision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!decisionTitle.trim()) return;
    try {
      setEvaluating(true);
      const evaluated = await agenticWorkspaceApi.evaluateDecision({
        decisionType,
        title: decisionTitle,
        contextData: { simulated: true },
      });
      setDecisions(prev => [evaluated, ...prev]);
      setDecisionTitle('');
    } catch (err) {
      console.error('Failed to evaluate executive decision:', err);
    } finally {
      setEvaluating(false);
    }
  };

  if (loading && !analytics) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-lg font-medium text-slate-300">Calculating Productivity Telemetry & ROI...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center space-x-2">
              <Link to="/ai-command-center" className="text-xs text-indigo-400 hover:underline">
                ← AI Command Center
              </Link>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-400">Executive Analytics</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white mt-1">
              AI Productivity Analytics & ROI Engine
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Focus scores, learning velocity, agent effectiveness hours saved, and decision intelligence.
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
            {(['weekly', 'monthly', 'quarterly'] as const).map(tf => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl capitalize transition-all ${
                  timeframe === tf ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        {/* Analytics Top Metric Cards */}
        {analytics && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-800 shadow-lg space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Focus Score</span>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-extrabold text-indigo-400">{analytics.focusMetrics.focusScore}</span>
                <span className="text-xs text-slate-400">/ 100</span>
              </div>
              <div className="text-xs text-slate-400">
                Peak Hours: <strong className="text-slate-300">{analytics.focusMetrics.peakProductivityHours}</strong>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-800 shadow-lg space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Deep Work Hours</span>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-extrabold text-emerald-400">{analytics.focusMetrics.deepWorkHours}</span>
                <span className="text-xs text-emerald-400">hours</span>
              </div>
              <div className="text-xs text-slate-400">
                Distraction Index: <strong className="text-emerald-400">{analytics.focusMetrics.distractionScore}% (Low)</strong>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-800 shadow-lg space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Learning Velocity</span>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-extrabold text-purple-400">{analytics.learningVelocity}</span>
                <span className="text-xs text-purple-400">/ 100</span>
              </div>
              <div className="text-xs text-slate-400">
                Career Velocity: <strong className="text-purple-300">{analytics.careerGrowthVelocity}/100</strong>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-800 shadow-lg space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Agent Effectiveness</span>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-extrabold text-amber-400">{analytics.agentEffectivenessScore}%</span>
              </div>
              <div className="text-xs text-slate-400">
                Tasks Completed: <strong className="text-white">{analytics.tasksCompleted}</strong>
              </div>
            </div>
          </div>
        )}

        {/* Agent ROI Breakdown Table */}
        {analytics?.agentBreakdown && (
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>🤖</span> Agent ROI & Hours Saved Breakdown
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-3 px-4">Agent Role</th>
                    <th className="py-3 px-4">Tasks Executed</th>
                    <th className="py-3 px-4">Hours Saved</th>
                    <th className="py-3 px-4">Quality Score</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-200">
                  {analytics.agentBreakdown.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-950/50">
                      <td className="py-3 px-4 font-bold text-indigo-400">{row.agentType}</td>
                      <td className="py-3 px-4">{row.tasksCompleted} tasks</td>
                      <td className="py-3 px-4 font-semibold text-emerald-400">+{row.hoursSaved} hrs</td>
                      <td className="py-3 px-4">{row.qualityScore}%</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/10 text-emerald-400">
                          Active & Optimized
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Actionable Productivity Recommendations */}
        {analytics?.recommendations && (
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>💡</span> AI Strategic Efficiency Recommendations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {analytics.recommendations.map((rec, rIdx) => (
                <div key={rIdx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
                  {rec}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Executive Decision Engine Simulator */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>⚖️</span> Executive Decision Engine (Multi-Criteria Trade-Off Simulator)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Simulate strategic options for career transitions, job offers, salary negotiations, and skill upgrades.
            </p>
          </div>

          <form onSubmit={handleEvaluateDecision} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-slate-400 block mb-1">Decision Dilemma / Question</label>
                <input
                  type="text"
                  value={decisionTitle}
                  onChange={e => setDecisionTitle(e.target.value)}
                  placeholder="e.g. Internal Staff Promotion vs Senior Distributed Lead Offer at Stripe"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Decision Type</label>
                <select
                  value={decisionType}
                  onChange={e => setDecisionType(e.target.value as DecisionType)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value={DecisionType.CAREER_TRANSITION}>Career Transition</option>
                  <option value={DecisionType.JOB_OFFER_EVALUATION}>Job Offer Evaluation</option>
                  <option value={DecisionType.SALARY_NEGOTIATION}>Salary Negotiation</option>
                  <option value={DecisionType.LEARNING_ROI}>Learning & Certification ROI</option>
                  <option value={DecisionType.SKILL_UPGRADE}>Skill Upgrade</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={evaluating}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-xs font-bold text-white hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/20 disabled:opacity-50 transition-all"
              >
                {evaluating ? 'Simulating Trade-Off Matrix...' : '⚡ Run Decision Intelligence Evaluation'}
              </button>
            </div>
          </form>

          {/* Evaluated Decisions Stream */}
          <div className="space-y-6 pt-4 border-t border-slate-800">
            {decisions.map(dec => (
              <div
                key={dec.id}
                className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="space-y-1">
                    <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-indigo-500/20 text-indigo-400">
                      {dec.decisionType}
                    </span>
                    <h3 className="text-base font-bold text-white">{dec.title}</h3>
                  </div>

                  <div className="flex items-center space-x-3 text-xs">
                    <span>Confidence: <strong className="text-emerald-400">{dec.confidenceScore}%</strong></span>
                    <span>Risk: <strong className="text-amber-400">{dec.riskScore}%</strong></span>
                  </div>
                </div>

                {/* Recommended Action */}
                <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-200">
                  <strong>💡 Executive Recommended Action:</strong> {dec.recommendedAction}
                </div>

                {/* Evaluated Options Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {dec.optionsEvaluated.map((opt, oIdx) => (
                    <div key={oIdx} className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-slate-100">{opt.title}</h4>
                        <span className="font-bold text-indigo-400">{opt.alignmentScore}% Match</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-emerald-400 block">Pros:</span>
                        <ul className="text-[11px] text-slate-300 list-disc list-inside space-y-0.5">
                          {opt.pros.map((p, i) => (
                            <li key={i}>{p}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-amber-400 block">Cons:</span>
                        <ul className="text-[11px] text-slate-400 list-disc list-inside space-y-0.5">
                          {opt.cons.map((c, i) => (
                            <li key={i}>{c}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="text-[11px] text-purple-300 border-t border-slate-800 pt-2 font-mono">
                        Outcome: {opt.projectedOutcome}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
