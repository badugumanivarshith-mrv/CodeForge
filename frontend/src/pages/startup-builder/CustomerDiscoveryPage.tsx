import React, { useEffect, useState } from 'react';
import { startupBuilderApi } from '../../services/startupBuilderApi';
import { CustomerPersonaDto, StartupDto, CustomerPersonaType, CustomerValidationReportDto } from '@codeforge/shared';

export const CustomerDiscoveryPage: React.FC = () => {
  const [personas, setPersonas] = useState<CustomerPersonaDto[]>([]);
  const [startups, setStartups] = useState<StartupDto[]>([]);
  const [selectedStartupId, setSelectedStartupId] = useState('');
  const [selectedPersonaType, setSelectedPersonaType] = useState<CustomerPersonaType>(CustomerPersonaType.STARTUP_CTO);
  const [generating, setGenerating] = useState(false);
  const [feedbackReport, setFeedbackReport] = useState<CustomerValidationReportDto | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const sList = await startupBuilderApi.listStartups();
      setStartups(sList);
      if (sList.length > 0) {
        setSelectedStartupId(sList[0].id);
        loadStartupDiscovery(sList[0].id);
      }
    } catch (err) {
      console.error('Failed to load discovery data', err);
    }
  }

  async function loadStartupDiscovery(id: string) {
    try {
      const [pList, fReport] = await Promise.all([
        startupBuilderApi.generatePersona(id, selectedPersonaType),
        startupBuilderApi.getDiscoveryFeedback(id),
      ]);
      setPersonas([pList]);
      setFeedbackReport(fReport);
    } catch (err) {
      console.error('Failed to load persona and feedback', err);
    }
  }

  async function handleGeneratePersona(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedStartupId) return;
    setGenerating(true);
    try {
      const p = await startupBuilderApi.generatePersona(selectedStartupId, selectedPersonaType);
      setPersonas([p, ...personas]);
    } catch (err) {
      console.error('Failed to generate persona', err);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-cyan-900/40 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-3xl">👥</span>
            <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-teal-400 to-indigo-400">
              Customer Discovery & Persona Validation System
            </h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Persona Generation • User Journey Mapping • Willingness-To-Pay Modeling • Interview Feedback Synthesis
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedStartupId}
            onChange={(e) => {
              setSelectedStartupId(e.target.value);
              loadStartupDiscovery(e.target.value);
            }}
            className="px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
          >
            {startups.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.category})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Discovery Feedback Metrics Row */}
      {feedbackReport && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Interviews Analyzed</div>
            <div className="text-3xl font-black text-cyan-400 mt-2">{feedbackReport.totalInterviewsAnalyzed}</div>
            <div className="text-xs text-slate-500 mt-1">Direct Engineering Leaders</div>
          </div>
          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Problem Resonance</div>
            <div className="text-3xl font-black text-emerald-400 mt-2">{feedbackReport.problemResonanceScore}%</div>
            <div className="text-xs text-slate-500 mt-1">Pain Point Severity Rating</div>
          </div>
          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Willingness to Buy</div>
            <div className="text-3xl font-black text-indigo-400 mt-2">{feedbackReport.willingnessToBuyPercent}%</div>
            <div className="text-xs text-slate-500 mt-1">Converting to Paid Pilot</div>
          </div>
          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Demand Projection</div>
            <div className="text-3xl font-black text-purple-400 mt-2">{feedbackReport.demandProjectionScore}%</div>
            <div className="text-xs text-slate-500 mt-1">Forward Market Appetite</div>
          </div>
        </div>
      )}

      {/* Persona Generator Form */}
      <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
        <h2 className="font-bold text-slate-200 text-base">Generate Target Customer Persona</h2>
        <form onSubmit={handleGeneratePersona} className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Persona Profile Archetype
            </label>
            <select
              value={selectedPersonaType}
              onChange={(e) => setSelectedPersonaType(e.target.value as CustomerPersonaType)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-sm focus:outline-none focus:border-cyan-500"
            >
              {Object.values(CustomerPersonaType).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={generating}
            className="px-6 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm transition-all shadow-lg shadow-cyan-600/30"
          >
            {generating ? 'Synthesizing...' : '👥 Generate Persona & Journey'}
          </button>
        </form>
      </div>

      {/* Personas Cards Display */}
      <div className="space-y-6">
        <h2 className="text-lg font-bold text-slate-200">Customer Personas & Journey Maps</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {personas.map((p) => (
            <div key={p.id} className="p-6 rounded-xl bg-slate-900/40 border border-slate-800 space-y-5">
              <div className="flex justify-between items-start border-b border-slate-800 pb-3">
                <div>
                  <h3 className="font-bold text-slate-100 text-base">{p.title}</h3>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {p.demographics.companySize} • Budget: ${(p.demographics.budgetAuthorityUsd / 1000).toFixed(0)}k/yr
                  </div>
                </div>
                <div className="px-3 py-1 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 text-xs font-mono">
                  WTP: ${p.willingnessToPayMonthlyUsd}/mo
                </div>
              </div>

              {/* Pain points & Motivations */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1">
                  <div className="font-bold text-rose-400 uppercase text-[10px]">Top Pain Points</div>
                  <ul className="text-slate-300 list-disc list-inside space-y-1">
                    {p.painPoints.map((pt, i) => (
                      <li key={i}>{pt}</li>
                    ))}
                  </ul>
                </div>
                <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1">
                  <div className="font-bold text-emerald-400 uppercase text-[10px]">Buying Motivations</div>
                  <ul className="text-slate-300 list-disc list-inside space-y-1">
                    {p.buyingMotivations.map((bm, i) => (
                      <li key={i}>{bm}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* User Journey Stages */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold uppercase text-slate-400">User Journey Touchpoints</div>
                <div className="space-y-2">
                  {p.userJourneyStages.map((st, i) => (
                    <div key={i} className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-1">
                      <div className="flex justify-between font-semibold text-slate-200">
                        <span className="text-cyan-400">{st.stage}</span>
                        <span className="text-slate-400 text-[11px]">{st.touchpoint}</span>
                      </div>
                      <div className="text-slate-400 text-[11px]">
                        <span className="text-rose-400 font-medium">Friction: </span>
                        {st.frictionPoint}
                      </div>
                      <div className="text-slate-300 text-[11px]">
                        <span className="text-emerald-400 font-medium">Delight: </span>
                        {st.delightMoment}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
