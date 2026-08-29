import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ventureCapitalApi } from '../../services/ventureCapitalApi';
import { InvestmentDecisionDto } from '@codeforge/shared';

export const InvestmentCommitteePage: React.FC = () => {
  const [decision, setDecision] = useState<InvestmentDecisionDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDecision() {
      try {
        const data = await ventureCapitalApi.getInvestmentDecision('deal-1');
        setDecision(data);
      } catch (err) {
        console.error('Failed to load investment committee decision', err);
      } finally {
        setLoading(false);
      }
    }
    loadDecision();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Synthesizing Investment Committee Multi-Agent Debates...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-6">
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Link to="/vc-command-center" className="text-slate-400 hover:text-white">← Overview</Link>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
              Autonomous Investment Committee AI
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">Multi-agent partner debate, quorum voting, and consensus term sheet synthesis</p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 rounded-lg bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 font-mono text-xs font-bold">
            Quorum: {decision?.quorumMet ? '100% MET' : 'PENDING'} • Conviction: {decision?.convictionScore}%
          </span>
        </div>
      </div>

      {/* Decision Summary Card */}
      <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Consensus Investment Decision</span>
            <div className="text-xl font-bold text-emerald-400 mt-1">{decision?.recommendation} — Allocate ${(((decision?.proposedInvestmentUsd || 2500000) / 1000000)).toFixed(1)}M Seed Check</div>
          </div>
          <div className="text-right text-xs font-mono text-slate-400">
            <div>Post-Money Valuation: ${(((decision?.proposedValuationUsd || 12000000) / 1000000)).toFixed(0)}M</div>
            <div className="text-slate-500 mt-0.5">{decision?.yesVotes} YES • {decision?.conditionalVotes} CONDITIONAL • {decision?.noVotes} NO</div>
          </div>
        </div>

        <p className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
          {decision?.consensusRationale}
        </p>
      </div>

      {/* Committee Member Votes */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Agent Committee Votes & Perspectives</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(decision?.votes || []).map((vote, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-sm text-slate-200">{vote.agentName}</h4>
                  <span className="text-[11px] text-slate-400">{vote.role}</span>
                </div>
                <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                  {vote.vote} ({vote.convictionScore}%)
                </span>
              </div>
              <p className="text-xs text-slate-300">{vote.rationale}</p>
              {vote.conditions && vote.conditions.length > 0 && (
                <div className="pt-2 border-t border-slate-800 text-[11px] text-amber-300">
                  Covenants: {vote.conditions.join('; ')}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
