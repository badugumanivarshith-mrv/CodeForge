import React, { useState, useEffect } from 'react';
import {
  DecisionRecordDto,
  ScenarioSimulationDto,
  DecisionCenterStatus,
} from '@codeforge/shared';
import { agentCloudApi } from '../../services/agentCloudApi';

export const DecisionCenterPage: React.FC = () => {
  const [decisions, setDecisions] = useState<DecisionRecordDto[]>([]);
  const [selectedDecision, setSelectedDecision] = useState<DecisionRecordDto | null>(null);
  const [simulation, setSimulation] = useState<ScenarioSimulationDto | null>(null);
  const [title, setTitle] = useState('');
  const [context, setContext] = useState('');
  const [executingOption, setExecutingOption] = useState<string | null>(null);

  useEffect(() => {
    loadDecisions();
  }, []);

  const loadDecisions = async () => {
    try {
      const list = await agentCloudApi.listDecisions();
      if (list.length === 0) {
        // Create initial starter strategic decision
        const starter = await agentCloudApi.createDecision({
          title: 'Infrastructure Scaling & Autonomous Agent Workforce Expansion',
          context: 'Evaluate horizontal scaling options for high-concurrency enterprise multi-agent workflows',
          options: [
            {
              title: 'Option A: Dedicated Cloud Worker Pools per Department',
              description: 'Partition agent workers into isolated Kubernetes namespaces with dedicated compute quotas',
              pros: ['Zero noisy-neighbor interference', 'Predictable SLA per business unit'],
              cons: ['Higher baseline infrastructure idle cost'],
            },
            {
              title: 'Option B: Dynamic Serverless Scaling with Auto-Sleep',
              description: 'Spin up on-demand ephemeral containers per agent execution run and suspend idle memory',
              pros: ['Optimized cost efficiency', 'Instant burst capacity'],
              cons: ['Cold start latency of ~250ms on first run'],
            },
          ],
        });
        setDecisions([starter]);
        selectDecision(starter);
      } else {
        setDecisions(list);
        selectDecision(list[0]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const selectDecision = (decision: DecisionRecordDto) => {
    setSelectedDecision(decision);
    setSimulation({
      decisionId: decision.id,
      scenarioName: 'Enterprise Concurrency Simulation (10,000 Concurrent Agents)',
      simulatedOutcomes: [
        { metric: 'Median Pipeline Latency', expectedChangePercent: -34, confidenceInterval: [-40, -28] },
        { metric: 'Monthly Token Infrastructure Cost', expectedChangePercent: -18, confidenceInterval: [-24, -12] },
        { metric: 'Autonomous Task Completion Rate', expectedChangePercent: +28, confidenceInterval: [+22, +35] },
      ],
      riskAssessment: 'Low systemic risk with verified fallback recovery paths and automated quotas',
    });
  };

  const handleExecuteOption = async (optionId: string) => {
    if (!selectedDecision) return;
    try {
      setExecutingOption(optionId);
      const updated = await agentCloudApi.executeDecision(selectedDecision.id, optionId);
      setSelectedDecision(updated);
      setDecisions(decisions.map(d => (d.id === updated.id ? updated : d)));
    } catch (err) {
      console.error(err);
    } finally {
      setExecutingOption(null);
    }
  };

  const handleCreateDecision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !context) return;
    try {
      const created = await agentCloudApi.createDecision({
        title,
        context,
        options: [
          {
            title: 'Option 1: Recommended Implementation Pathway',
            description: 'Fast-track rollout with automated telemetry and multi-tenant guardrails',
            pros: ['Fast time-to-market', 'Standardized compliance'],
          },
          {
            title: 'Option 2: Gradual Phased Canary Deployment',
            description: 'Stage rollout over 3 weekly intervals with deep audit verification',
            pros: ['Maximum safety', 'Granular error containment'],
          },
        ],
      });
      setDecisions([created, ...decisions]);
      selectDecision(created);
      setTitle('');
      setContext('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 p-6 lg:p-10 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              AI Decision Center
            </h1>
            <p className="text-sm text-slate-400">Opportunity ranking, multi-scenario simulations, risk scoring & strategic execution roadmaps</p>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Decisions List & Create */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Draft Strategic Decision</h2>
            <form onSubmit={handleCreateDecision} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Decision Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Model Architecture Upgrade"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Context & Constraints</label>
                <textarea
                  rows={3}
                  required
                  value={context}
                  onChange={e => setContext(e.target.value)}
                  placeholder="Strategic goal, trade-offs, budget and timeline..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition shadow-md shadow-emerald-600/30"
              >
                + Analyze Strategic Decision
              </button>
            </form>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Decision Records ({decisions.length})</h3>
            <div className="space-y-3">
              {decisions.map(d => (
                <div
                  key={d.id}
                  onClick={() => selectDecision(d)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer ${
                    selectedDecision?.id === d.id
                      ? 'bg-emerald-950/40 border-emerald-500/50'
                      : 'bg-slate-800/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-white text-sm line-clamp-1">{d.title}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 uppercase font-mono">
                      {d.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2">{d.context}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Decision Detail & Simulation */}
        <div className="lg:col-span-2 space-y-6">
          {selectedDecision && (
            <>
              {/* Option Ranking Matrix */}
              <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-bold text-white">{selectedDecision.title}</h2>
                    <p className="text-xs text-slate-400 mt-1">{selectedDecision.context}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-500 font-mono">AI Confidence</span>
                    <p className="text-lg font-bold text-emerald-400 font-mono">
                      {Math.round(selectedDecision.confidenceScore * 100)}%
                    </p>
                  </div>
                </div>

                <div className="space-y-4 mt-6">
                  {selectedDecision.options.map(opt => (
                    <div
                      key={opt.optionId}
                      className={`p-5 rounded-xl border transition ${
                        selectedDecision.recommendedOptionId === opt.optionId
                          ? 'bg-emerald-950/30 border-emerald-500/40'
                          : 'bg-slate-950/70 border-slate-800'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-white text-sm">{opt.title}</h4>
                          {selectedDecision.recommendedOptionId === opt.optionId && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium">
                              ★ AI Recommended
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => handleExecuteOption(opt.optionId)}
                          disabled={executingOption === opt.optionId || selectedDecision.status === DecisionCenterStatus.EXECUTED}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition"
                        >
                          {selectedDecision.executedOptionId === opt.optionId ? '✓ Executed' : 'Execute Pathway'}
                        </button>
                      </div>
                      <p className="text-xs text-slate-300 mb-3">{opt.description}</p>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="text-emerald-400">
                          <strong>Pros:</strong> {opt.pros.join(', ')}
                        </div>
                        <div className="text-rose-400">
                          <strong>Cons:</strong> {opt.cons.join(', ')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Scenario Simulation Output */}
              {simulation && (
                <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
                  <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-cyan-400"></span>
                    Scenario Simulation Analysis: {simulation.scenarioName}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    {simulation.simulatedOutcomes.map((outcome, idx) => (
                      <div key={idx} className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl">
                        <span className="text-xs text-slate-400">{outcome.metric}</span>
                        <p className={`text-lg font-bold mt-1 ${outcome.expectedChangePercent > 0 ? 'text-emerald-400' : 'text-cyan-400'}`}>
                          {outcome.expectedChangePercent > 0 ? `+${outcome.expectedChangePercent}%` : `${outcome.expectedChangePercent}%`}
                        </p>
                      </div>
                    ))}
                  </div>

                  <p className="text-xs text-slate-400 bg-slate-950/50 p-3 rounded-lg border border-slate-800">
                    🛡️ <strong className="text-slate-300">Risk Assessment:</strong> {simulation.riskAssessment}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
