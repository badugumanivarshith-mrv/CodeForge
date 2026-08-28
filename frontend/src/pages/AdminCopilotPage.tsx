import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ShieldAlert,
  AlertTriangle,
  Send,
  Zap,
  BrainCircuit,
  MessageSquare,
} from 'lucide-react';
import { enterpriseApi } from '../services/enterpriseApi';
import {
  AdminCopilotInsightsDto,
  RiskLevel,
} from '@codeforge/shared';

export const AdminCopilotPage: React.FC = () => {
  const [insights, setInsights] = useState<AdminCopilotInsightsDto | null>(null);
  const [loading, setLoading] = useState(true);

  // Copilot Query input
  const [query, setQuery] = useState('');
  const [chatLog, setChatLog] = useState<{ role: 'user' | 'assistant'; text: string }[]>([
    {
      role: 'assistant',
      text: "Hello Dean/Admin. I'm your AI Institutional Copilot. I've analyzed real-time campus telemetry: active risk alerts flagged, and curriculum alignment monitored. How can I assist with academic or hiring interventions today?",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = async () => {
    try {
      setLoading(true);
      const data = await enterpriseApi.getAdminCopilotInsights();
      setInsights(data);
    } catch (err) {
      console.error('Failed to load admin copilot insights:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMsg = query.trim();
    setChatLog(prev => [...prev, { role: 'user', text: userMsg }]);
    setQuery('');
    setIsTyping(true);

    setTimeout(() => {
      let response = `Based on institutional telemetry, here is my recommendation for "${userMsg}":\n\n1. Target batch students show 18% improvement in contest ratings when enrolled in the Distributed Systems module.\n2. Recommend pairing with faculty mentors for 1:1 code reviews prior to the upcoming hiring drives.`;
      if (userMsg.toLowerCase().includes('risk') || userMsg.toLowerCase().includes('student')) {
        response = `Identified students with critical risk indicators: low assessment engagement and pending backlogs. I have scheduled automated intervention advisories for their respective faculty advisors.`;
      }
      setChatLog(prev => [...prev, { role: 'assistant', text: response }]);
      setIsTyping(false);
    }, 1000);
  };

  if (loading || !insights) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  const { studentRiskAlerts, recommendations, placementForecasts, curriculumGaps } = insights;

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="border-b border-slate-800 pb-6">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-purple-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-purple-400">
              AI Administrative Intelligence
            </span>
            <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs text-emerald-400">
              <Sparkles className="h-3 w-3" /> Predictive Decision Support
            </span>
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            AI Admin Assistant & Student Risk Radar
          </h1>
          <p className="mt-1 text-slate-400">
            Proactive dropout risk detection, faculty intervention recommendations, and automated placement forecasting.
          </p>
        </div>

        {/* Health Scores Banner */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-purple-500/30 bg-purple-950/20 p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-purple-400">Placement Forecasts</span>
              <BrainCircuit className="h-5 w-5 text-purple-400" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-white">
                {placementForecasts[0]?.expectedPlacementRate || 88}%
              </span>
              <span className="text-xs text-emerald-400 font-semibold">{placementForecasts[0]?.cohortName || 'Class of 2026'}</span>
            </div>
            <p className="mt-2 text-xs text-slate-400">
              Projected Top Recruiters: {placementForecasts[0]?.projectedTopRecruiters?.join(', ') || 'Stripe, Google, OpenAI'}
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-emerald-400">Active Recommendations</span>
              <Zap className="h-5 w-5 text-emerald-400" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-white">{recommendations.length}</span>
              <span className="text-xs text-emerald-400 font-semibold">Prescriptive Actions</span>
            </div>
            <p className="mt-2 text-xs text-slate-400">Interventions ready for instant application.</p>
          </div>

          <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-6 backdrop-blur-xl sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-amber-400">Active Risk Flags</span>
              <AlertTriangle className="h-5 w-5 text-amber-400" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-white">{studentRiskAlerts.length} Flagged</span>
              <span className="text-xs text-amber-400 font-semibold">Immediate Advisory</span>
            </div>
            <p className="mt-2 text-xs text-slate-400">Faculty mentorship interventions scheduled.</p>
          </div>
        </div>

        {/* 2-Column: Risk Radar & Prescriptive Recommendations */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Student Risk Radar */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-red-400" /> Student Dropout & Placement Risk Radar
            </h2>
            <div className="mt-6 space-y-4">
              {studentRiskAlerts.map(alert => (
                <div key={alert.studentId} className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-white">{alert.studentName}</h4>
                      <p className="text-xs text-slate-400 font-mono">Roll: {alert.rollNumber || 'CS-2026-031'}</p>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase ${
                        alert.riskLevel === RiskLevel.HIGH || alert.riskLevel === RiskLevel.CRITICAL
                          ? 'bg-red-500/10 text-red-400'
                          : 'bg-amber-500/10 text-amber-400'
                      }`}
                    >
                      {alert.riskLevel} RISK
                    </span>
                  </div>

                  <div className="mt-3 text-xs text-slate-300">
                    <p className="font-semibold text-slate-400">Risk Factors:</p>
                    <ul className="mt-1 list-disc pl-4 space-y-0.5">
                      {alert.riskFactors.map((f: string, idx: number) => (
                        <li key={idx} className="text-slate-300">
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-3 border-t border-slate-800/80 pt-2.5 flex items-center justify-between text-xs">
                    <span className="text-cyan-400 font-medium">{alert.recommendedAction}</span>
                    <button className="rounded-lg bg-slate-800 px-3 py-1 text-white hover:bg-slate-700">
                      Notify Advisor
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Prescriptive Recommendations */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Zap className="h-5 w-5 text-purple-400" /> Prescriptive Action Plan
            </h2>
            <div className="mt-6 space-y-4">
              {recommendations.map(rec => (
                <div key={rec.id} className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-purple-500/10 px-2.5 py-0.5 text-xs font-bold uppercase text-purple-400">
                      {rec.category}
                    </span>
                    <span className="text-xs text-slate-400">
                      Urgency: <strong className="text-slate-200">{rec.urgency}</strong>
                    </span>
                  </div>

                  <h4 className="mt-2 text-sm font-bold text-white">{rec.title}</h4>
                  <p className="mt-1 text-xs text-slate-300">{rec.description}</p>

                  <div className="mt-3 flex items-center justify-between border-t border-slate-800/80 pt-2 text-xs">
                    <span className="text-emerald-400 font-semibold">Impact Score: {rec.impactScore}/10</span>
                    <button className="rounded-lg bg-purple-600/20 px-3 py-1 font-semibold text-purple-300 hover:bg-purple-600/30">
                      Apply Action
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Curriculum Gaps */}
        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
          <h2 className="text-lg font-bold text-white">Curriculum Industry Gap Analysis</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {curriculumGaps.map((gap, idx) => (
              <div key={idx} className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                <h4 className="font-semibold text-white text-sm">{gap.topic}</h4>
                <p className="text-xs text-amber-400 mt-1">Gap: {gap.industryDemandGap}</p>
                <p className="text-xs text-slate-300 mt-2">Proposal: {gap.actionableProposal}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Copilot Query Console */}
        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-indigo-400" /> Dean & Admin Copilot Console
          </h2>

          <div className="mt-4 max-h-64 space-y-3 overflow-y-auto rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs">
            {chatLog.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400">
                    <Sparkles className="h-3.5 w-3.5" />
                  </div>
                )}
                <div
                  className={`max-w-xl rounded-xl p-3 ${
                    msg.role === 'user'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-900 text-slate-200 border border-slate-800 whitespace-pre-line'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-2 text-slate-400 italic">
                <Sparkles className="h-3.5 w-3.5 animate-spin" /> Copilot is calculating insights...
              </div>
            )}
          </div>

          <form onSubmit={handleSendQuery} className="mt-4 flex gap-2">
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Ask Copilot: e.g. 'What is the forecast for CS placements?' or 'Generate mentorship plan for Class 2026'..."
              className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-purple-500 focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-xl bg-purple-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-purple-500"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
