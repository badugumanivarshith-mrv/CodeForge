import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { startupBuilderApi } from '../../services/startupBuilderApi';
import { StartupDto, AIFounderDecisionDto, StrategicPlanReportDto } from '@codeforge/shared';

export const AIFounderPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [startups, setStartups] = useState<StartupDto[]>([]);
  const [selectedStartupId, setSelectedStartupId] = useState<string>('');
  const [strategicPlan, setStrategicPlan] = useState<StrategicPlanReportDto | null>(null);

  // Decision support form
  const [decisionTitle, setDecisionTitle] = useState('Determine Pricing & Tiering Strategy for Enterprise Launch');
  const [decisionContext, setDecisionContext] = useState('We are launching our autonomous verifier and need to choose between seat-based licensing vs pure consumption API tokens.');
  const [optionsStr, setOptionsStr] = useState('Developer Seat Licensing ($150/dev/mo), Compute Token Metering ($0.05/proof), Hybrid Enterprise Platform License ($45,000/yr)');
  const [decisionResult, setDecisionResult] = useState<AIFounderDecisionDto | null>(null);
  const [simulating, setSimulating] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        const list = await startupBuilderApi.listStartups();
        setStartups(list);
        const queryId = searchParams.get('startupId');
        const activeId = queryId || (list.length > 0 ? list[0].id : '');
        if (activeId) {
          setSelectedStartupId(activeId);
          loadStartupData(activeId);
        }
      } catch (err) {
        console.error('Failed to init AI founder page', err);
      }
    }
    init();
  }, [searchParams]);

  async function loadStartupData(id: string) {
    try {
      const plan = await startupBuilderApi.getStrategicPlan(id);
      setStrategicPlan(plan);
    } catch (err) {
      console.error('Failed to load strategic plan', err);
    }
  }

  async function handleSimulateDecision(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedStartupId) return;
    setSimulating(true);
    try {
      const options = optionsStr.split(',').map((s) => s.trim()).filter(Boolean);
      const res = await startupBuilderApi.getFounderDecisionSupport({
        startupId: selectedStartupId,
        decisionTitle,
        context: decisionContext,
        options,
      });
      setDecisionResult(res);
    } catch (err) {
      console.error('Failed to simulate decision', err);
    } finally {
      setSimulating(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-pink-900/40 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-3xl">🧠</span>
            <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400">
              AI Founder Operating System & Strategic Decision Console
            </h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Simulated Founder Reasoning • Decision Support Sandbox • Multi-Horizon Prioritization • Risk Mitigation Matrix
          </p>
        </div>
        <div>
          <select
            value={selectedStartupId}
            onChange={(e) => {
              setSelectedStartupId(e.target.value);
              loadStartupData(e.target.value);
            }}
            className="px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-pink-500"
          >
            {startups.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.stage})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Strategic Plan Overview */}
      {strategicPlan && (
        <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-bold text-pink-400 uppercase tracking-wider">Venture Strategic Vision</span>
            <p className="text-slate-200 font-semibold text-base mt-1">{strategicPlan.visionStatement}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {strategicPlan.topPriorities.map((p, i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-indigo-400">Horizon: {p.horizonMonths} Mos</span>
                  <span className="text-slate-400">{p.ownerRole}</span>
                </div>
                <h3 className="font-bold text-slate-200 text-sm">{p.priorityTitle}</h3>
                <div className="text-[11px] text-slate-500">Impact Weight: {p.impactWeight}%</div>
              </div>
            ))}
          </div>

          {/* Resource Allocation & Risk Matrix */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Resource Budget Allocation</h3>
              {Object.entries(strategicPlan.resourceAllocations).map(([key, val]) => (
                <div key={key}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">{key}</span>
                    <span className="font-mono text-purple-400">{val}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: `${val}%` }}></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Risk Mitigation Matrix</h3>
              {strategicPlan.riskMitigationMatrix.map((r, i) => (
                <div key={i} className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-1">
                  <div className="flex justify-between text-rose-400 font-semibold">
                    <span>{r.risk}</span>
                    <span className="uppercase text-[10px]">{r.severity}</span>
                  </div>
                  <p className="text-slate-400">{r.mitigationStrategy}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Decision Simulation Console */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h2 className="font-bold text-slate-200 text-base">Founder Decision Sandbox</h2>
          <form onSubmit={handleSimulateDecision} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Strategic Decision Title
              </label>
              <input
                type="text"
                value={decisionTitle}
                onChange={(e) => setDecisionTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-sm focus:outline-none focus:border-pink-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Context & Objectives
              </label>
              <textarea
                value={decisionContext}
                onChange={(e) => setDecisionContext(e.target.value)}
                rows={3}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-sm focus:outline-none focus:border-pink-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Considered Options (comma-separated)
              </label>
              <textarea
                value={optionsStr}
                onChange={(e) => setOptionsStr(e.target.value)}
                rows={2}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-sm focus:outline-none focus:border-pink-500"
              />
            </div>
            <button
              type="submit"
              disabled={simulating}
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-sm transition-all shadow-lg shadow-pink-600/30"
            >
              {simulating ? 'Evaluating Scenarios...' : '🧠 Run AI Founder Simulation'}
            </button>
          </form>
        </div>

        {/* Results */}
        <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h2 className="font-bold text-slate-200 text-base">Simulation Synthesis & Rationale</h2>
          {decisionResult ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Recommended Path (Confidence {decisionResult.confidenceScore}%)
                </div>
                <div className="text-sm font-bold text-slate-100">{decisionResult.recommendedOption}</div>
                <p className="text-xs text-slate-300 leading-relaxed">{decisionResult.strategicRationale}</p>
              </div>

              <div className="space-y-3 pt-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Simulated Scenarios</div>
                {decisionResult.simulatedScenarios.map((sc, i) => (
                  <div key={i} className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-200">{sc.option}</span>
                      <span className="text-indigo-400 font-mono">Impact: {sc.projectedImpactScore}%</span>
                    </div>
                    <p className="text-slate-400">{sc.outcomeNarrative}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500 bg-slate-950/40 rounded-xl border border-dashed border-slate-800">
              Run a simulation to view simulated founder outcomes and risk-adjusted impact models.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
