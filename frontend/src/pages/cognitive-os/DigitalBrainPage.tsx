import React, { useEffect, useState } from 'react';
import { cognitiveOsApi } from '../../services/cognitiveOsApi';
import { DigitalBrainProfileDto } from '@codeforge/shared';

export const DigitalBrainPage: React.FC = () => {
  const [profile, setProfile] = useState<DigitalBrainProfileDto | null>(null);
  const [query, setQuery] = useState('');
  const [explanation, setExplanation] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [explaining, setExplaining] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await cognitiveOsApi.getBrainProfile();
        setProfile(data);
      } catch (err) {
        console.error('Failed to load brain profile', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Loading Personal Digital Brain...</div>;
  }

  const handleExplain = async () => {
    if (!query.trim()) return;
    setExplaining(true);
    try {
      const res = await cognitiveOsApi.explainReasoning(query);
      setExplanation(res);
    } catch (err) {
      console.error('Failed to explain decision', err);
    } finally {
      setExplaining(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-indigo-900/40 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
              Personal Digital Brain
            </h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Unified Memory Architecture, Personal Knowledge Graph, & Interactive Reasoning Explainer
          </p>
        </div>
        <div className="px-4 py-2 rounded-lg bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 font-mono text-sm">
          Efficiency: {profile?.cognitiveEfficiencyScore}%
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Memories Indexed</div>
          <div className="text-3xl font-black text-indigo-400 mt-2">{profile?.totalMemoriesCount}</div>
        </div>
        <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Knowledge Graph Nodes</div>
          <div className="text-3xl font-black text-cyan-400 mt-2">{profile?.knowledgeNodesCount}</div>
        </div>
        <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Dominant Thinking Patterns</div>
          <div className="text-sm font-semibold text-slate-200 mt-2">
            {profile?.dominantThinkingPatterns.join(' • ')}
          </div>
        </div>
      </div>

      {/* Interactive Reasoning Explainer */}
      <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <span>🧠</span> Interactive Cognitive Explainer
        </h2>
        <p className="text-xs text-slate-400">
          Inquire into any autonomous decision or recommendation to inspect the applied axioms, premises, and formal proofs.
        </p>
        <div className="flex gap-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Why was the multi-agent consensus protocol routed through the Engineering Council?"
            className="flex-1 px-4 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
          />
          <button
            onClick={handleExplain}
            disabled={explaining}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-lg transition-all"
          >
            {explaining ? 'Analyzing...' : 'Explain Reasoning'}
          </button>
        </div>

        {explanation && (
          <div className="mt-4 p-5 rounded-lg bg-indigo-950/40 border border-indigo-800/60 space-y-3">
            <div className="font-bold text-indigo-300 text-sm">{explanation.decisionSummary}</div>
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase">Premises Used:</div>
              <ul className="list-disc list-inside text-xs text-slate-300 mt-1">
                {explanation.premisesUsed.map((p: string, idx: number) => (
                  <li key={idx}>{p}</li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase">Axioms Applied:</div>
              <ul className="list-disc list-inside text-xs text-slate-300 mt-1">
                {explanation.axiomsApplied.map((a: string, idx: number) => (
                  <li key={idx}>{a}</li>
                ))}
              </ul>
            </div>
            <div className="flex justify-between items-center text-xs font-mono text-indigo-400 pt-2 border-t border-indigo-900/40">
              <span>Confidence: {explanation.confidenceMetric}%</span>
              <span>Proof: {explanation.verifiableProofs[0]}</span>
            </div>
          </div>
        )}
      </div>

      {/* Active Syntheses */}
      <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
        <h2 className="text-lg font-bold text-slate-200">Recent Syntheses & Consolidated Concepts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {profile?.recentSyntheses.map((s, idx) => (
            <div key={idx} className="p-4 rounded-lg bg-slate-950/80 border border-slate-800 text-sm text-slate-300">
              💎 {s}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
