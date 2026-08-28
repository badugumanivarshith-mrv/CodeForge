import React, { useState } from 'react';
import { cognitiveOsApi } from '../../services/cognitiveOsApi';
import { ExecutionLoopRecordDto } from '@codeforge/shared';

export const AutonomousExecutionPage: React.FC = () => {
  const [goalId, setGoalId] = useState('');
  const [result, setResult] = useState<ExecutionLoopRecordDto | null>(null);
  const [executing, setExecuting] = useState(false);

  const handleRunLoop = async () => {
    setExecuting(true);
    try {
      const res = await cognitiveOsApi.runExecutionLoop(goalId || 'default-goal-loop', 3);
      setResult(res);
    } catch (err) {
      console.error('Failed to run execution loop', err);
    } finally {
      setExecuting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-amber-900/40 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔄</span>
            <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-400">
              Autonomous Execution Fabric
            </h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Closed-Loop Execution Engine: Execute ➔ Observe ➔ Reflect ➔ Improve ➔ Retry
          </p>
        </div>
      </div>

      {/* Trigger Box */}
      <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
        <h2 className="text-lg font-bold text-slate-100">Trigger Autonomous Closed-Loop Execution</h2>
        <div className="flex gap-4">
          <input
            type="text"
            value={goalId}
            onChange={(e) => setGoalId(e.target.value)}
            placeholder="Enter Target Goal ID or leave blank for autonomous demo goal"
            className="flex-1 px-4 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-amber-500"
          />
          <button
            onClick={handleRunLoop}
            disabled={executing}
            className="px-6 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm rounded-lg shadow-lg shadow-amber-600/30 transition-all"
          >
            {executing ? 'Executing Loop...' : 'Run Closed-Loop Pipeline'}
          </button>
        </div>
      </div>

      {/* Execution Results */}
      {result && (
        <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs uppercase font-bold text-amber-400 font-mono">
              Final State: {result.currentState}
            </span>
            <span className="text-xs text-emerald-400 font-mono">
              Iterations: {result.iteration} / {result.maxIterations} • Duration: {result.durationMs}ms
            </span>
          </div>

          <div className="font-bold text-slate-200 text-sm">Execution Loop Observability Log:</div>
          <div className="space-y-2 font-mono text-xs">
            {result.observations.map((obs, idx) => (
              <div key={idx} className="p-3 rounded bg-slate-950/80 border border-slate-800 text-slate-300">
                {obs}
              </div>
            ))}
          </div>

          {result.appliedImprovements && result.appliedImprovements.length > 0 && (
            <div className="p-4 rounded-lg bg-emerald-950/20 border border-emerald-900/40 text-xs space-y-1">
              <div className="font-bold text-emerald-400 uppercase">Self-Improvement Adjustments Applied:</div>
              <ul className="list-disc list-inside text-slate-300">
                {result.appliedImprovements.map((imp, idx) => (
                  <li key={idx}>{imp}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
