import React, { useEffect, useState } from 'react';
import { cognitiveOsApi } from '../../services/cognitiveOsApi';
import { SelfReflectionReportDto, SelfImprovementRecordDto } from '@codeforge/shared';

export const SelfReflectionPage: React.FC = () => {
  const [reflections, setReflections] = useState<SelfReflectionReportDto[]>([]);
  const [improvements, setImprovements] = useState<SelfImprovementRecordDto[]>([]);
  const [reflecting, setReflecting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const refList = await cognitiveOsApi.listReflections();
        const impList = await cognitiveOsApi.listImprovements();
        setReflections(refList);
        setImprovements(impList);
      } catch (err) {
        console.error('Failed to load reflections', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleReflect = async () => {
    setReflecting(true);
    try {
      const res = await cognitiveOsApi.generateReflection({});
      setReflections([res, ...reflections]);
    } catch (err) {
      console.error('Failed to trigger reflection', err);
    } finally {
      setReflecting(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Loading Self-Reflection & Evolution Center...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-indigo-900/40 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🪞</span>
            <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-pink-400">
              Autonomous Self-Reflection & Evolution
            </h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Meta-Cognitive Evaluation, Failure Pattern Mining, & Continuous Self-Improvement Loops
          </p>
        </div>
        <button
          onClick={handleReflect}
          disabled={reflecting}
          className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-lg shadow-lg shadow-indigo-600/30 transition-all"
        >
          {reflecting ? 'Reflecting...' : 'Trigger Autonomous Reflection Pass'}
        </button>
      </div>

      {/* Reflections Grid */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-slate-100">Recent Self-Reflection Audits</h2>
        {reflections.length === 0 ? (
          <div className="p-8 text-center text-slate-500 bg-slate-900/40 rounded-xl border border-slate-800">
            No reflection reports generated yet. Click "Trigger Autonomous Reflection Pass".
          </div>
        ) : (
          reflections.map((r) => (
            <div key={r.id} className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs uppercase font-bold text-indigo-400 font-mono">Entity: {r.entityType} ({r.entityId})</span>
                <span className="text-xs text-emerald-400 font-mono">Impact Score: {r.impactScore}%</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-lg bg-emerald-950/20 border border-emerald-900/40 space-y-1">
                  <div className="font-bold text-emerald-400 uppercase">Identified Strengths:</div>
                  <ul className="list-disc list-inside text-slate-300">
                    {r.identifiedStrengths.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 rounded-lg bg-amber-950/20 border border-amber-900/40 space-y-1">
                  <div className="font-bold text-amber-400 uppercase">Identified Deficiencies & Bottlenecks:</div>
                  <ul className="list-disc list-inside text-slate-300">
                    {r.identifiedDeficiencies.map((d, idx) => (
                      <li key={idx}>{d}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-indigo-950/20 border border-indigo-900/40 text-xs space-y-1">
                <div className="font-bold text-indigo-400 uppercase">Actionable Adjustments:</div>
                <ul className="list-disc list-inside text-slate-300">
                  {r.actionableAdjustments.map((a, idx) => (
                    <li key={idx}>{a}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Applied Improvements */}
      {improvements.length > 0 && (
        <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h2 className="text-xl font-bold text-slate-100">Applied Self-Improvement Optimizations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {improvements.map((imp) => (
              <div key={imp.id} className="p-4 rounded-lg bg-slate-950/80 border border-slate-800 text-xs space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-indigo-300">{imp.componentName}</span>
                  <span className="text-emerald-400 font-mono">+{imp.accuracyDelta}% Accuracy</span>
                </div>
                <div className="text-slate-400">{imp.optimizationType} • {imp.latencyReductionPercent}% latency reduction</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
