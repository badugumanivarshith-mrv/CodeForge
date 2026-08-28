import React, { useEffect, useState } from 'react';
import { cognitiveOsApi } from '../../services/cognitiveOsApi';
import { AgentCouncilDto } from '@codeforge/shared';

export const AgentCouncilPage: React.FC = () => {
  const [councils, setCouncils] = useState<AgentCouncilDto[]>([]);
  const [selectedCouncil, setSelectedCouncil] = useState<AgentCouncilDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const list = await cognitiveOsApi.listCouncils();
        setCouncils(list);
        if (list.length > 0) setSelectedCouncil(list[0]);
      } catch (err) {
        console.error('Failed to load councils', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Loading Multi-Agent Collaborative Councils...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-pink-900/40 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏛️</span>
            <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">
              Multi-Agent Collaborative Councils
            </h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Engineering, Research, Career, Education, & Executive Councils running dialectic debates and consensus ratification.
          </p>
        </div>
      </div>

      {/* Councils Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {councils.map((council) => (
          <div
            key={council.id}
            onClick={() => setSelectedCouncil(council)}
            className={`p-6 rounded-xl border cursor-pointer transition-all ${
              selectedCouncil?.id === council.id
                ? 'bg-pink-950/40 border-pink-500 shadow-lg shadow-pink-600/20'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="text-xs uppercase font-bold text-pink-400">{council.councilType}</span>
              <span className="text-xs text-emerald-400 font-mono">Consensus: {(council.consensusRatio * 100).toFixed(0)}%</span>
            </div>
            <div className="font-bold text-slate-100 text-base mt-2">{council.councilName}</div>
            <p className="text-xs text-slate-400 mt-2">{council.charterStatement}</p>
            <div className="text-xs text-slate-500 pt-3 mt-3 border-t border-slate-800 flex justify-between">
              <span>Chair: {council.leadAgentId}</span>
              <span>Debates: {council.activeDebatesCount}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Active Selected Council Details */}
      {selectedCouncil && (
        <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-100">
              Debate Chamber: {selectedCouncil.councilName}
            </h2>
            <span className="px-3 py-1 bg-pink-950 text-pink-300 border border-pink-700 text-xs rounded-full">
              Live Chamber
            </span>
          </div>

          <div className="p-4 rounded-lg bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="font-semibold text-slate-200 text-sm">
              Debate Topic: "Dynamic Compilation Invariant Verification vs. Speculative Execution"
            </div>
            <div className="space-y-2">
              <div className="p-3 rounded bg-indigo-950/30 border border-indigo-900/40 text-xs text-slate-300">
                <span className="font-bold text-indigo-400">Agent Alpha (Compiler Architect):</span> Propose hardware-assisted formal lemma caching to eliminate 85% of redundant AST validation passes.
              </div>
              <div className="p-3 rounded bg-purple-950/30 border border-purple-900/40 text-xs text-slate-300">
                <span className="font-bold text-purple-400">Agent Beta (Security Auditor):</span> Concur, provided zero-knowledge state isolation bounds are verified prior to memory commit.
              </div>
            </div>
            <div className="flex justify-between items-center text-xs text-emerald-400 font-mono pt-2 border-t border-slate-800">
              <span>Status: CONVERGED (96.5% Approval)</span>
              <span>Ratification: Invariant Enacted</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
