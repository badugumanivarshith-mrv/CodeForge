import React, { useEffect, useState } from 'react';
import { cognitiveOsApi } from '../../services/cognitiveOsApi';
import { StrategicPlanDto } from '@codeforge/shared';

export const StrategyCenterPage: React.FC = () => {
  const [plans, setPlans] = useState<StrategicPlanDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const list = await cognitiveOsApi.listStrategicPlans();
        setPlans(list);
      } catch (err) {
        console.error('Failed to load strategic plans', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Loading AI Strategy Engine...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-cyan-900/40 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🗺️</span>
            <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
              AI Strategy Center
            </h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Dynamic Opportunity Ranking, Strategic Resource Allocation, & Multi-Quarter Execution Roadmaps
          </p>
        </div>
      </div>

      {/* Plans List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plans.length === 0 ? (
          <div className="col-span-full p-8 text-center text-slate-500 bg-slate-900/40 rounded-xl border border-slate-800">
            No strategic plans active. Default enterprise optimization roadmaps are currently calibrating.
          </div>
        ) : (
          plans.map((p) => (
            <div key={p.id} className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
              <div className="flex justify-between items-center">
                <span className="px-2 py-1 rounded bg-cyan-950/80 border border-cyan-700/60 text-cyan-300 text-xs font-mono uppercase">
                  {p.priority} Priority
                </span>
                <span className="text-xs text-emerald-400 font-mono">Expected ROI: {p.expectedRoiScore}%</span>
              </div>
              <h2 className="text-lg font-bold text-slate-100">{p.title}</h2>
              <p className="text-xs text-slate-300">{p.strategicNarrative}</p>

              {/* Milestones */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="text-xs font-semibold text-slate-400 uppercase">Quarterly Milestones:</div>
                {p.milestones.map((m, idx) => (
                  <div key={idx} className="p-3 rounded bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 space-y-1">
                    <div className="font-bold text-cyan-400">[{m.targetQuarter}] {m.title}</div>
                    <div className="text-slate-400">{m.expectedOutcome}</div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
