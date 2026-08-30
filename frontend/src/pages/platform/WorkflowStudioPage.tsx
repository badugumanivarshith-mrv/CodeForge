import React, { useState } from 'react';
import { platformIntegrationApi } from '../../services/platformIntegrationApi';
import { WorkflowExecutionDto } from '@codeforge/shared';

export const WorkflowStudioPage: React.FC = () => {
  const [workflowName, setWorkflowName] = useState('Autopilot Ingest and Auditing');
  const [triggerEvent, setTriggerEvent] = useState('New Commit Push');
  const [steps, setSteps] = useState([
    { stepNumber: 1, moduleName: 'Data Pipeline', actionTaken: 'Import repository code files' },
    { stepNumber: 2, moduleName: 'Cybersecurity', actionTaken: 'Audit package vulnerabilities' },
  ]);
  const [execution, setExecution] = useState<WorkflowExecutionDto | null>(null);
  const [executing, setExecuting] = useState(false);

  const addStep = () => {
    setSteps([...steps, { stepNumber: steps.length + 1, moduleName: 'AI Cloud', actionTaken: 'Deploy Image to Zone A' }]);
  };

  const removeStep = (idx: number) => {
    const nextSteps = steps.filter((_, i) => i !== idx).map((s, i) => ({ ...s, stepNumber: i + 1 }));
    setSteps(nextSteps);
  };

  const handleTrigger = async (e: React.FormEvent) => {
    e.preventDefault();
    setExecuting(true);
    try {
      const data = await platformIntegrationApi.triggerWorkflow({
        workflowName,
        triggerEvent,
        steps,
      });
      setExecution(data);
    } catch (err) {
      console.error(err);
    } finally {
      setExecuting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Workflow Creator */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 shadow-xl space-y-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-teal-300 via-emerald-300 to-indigo-400 bg-clip-text text-transparent">
              Workflow Studio
            </h1>
            <p className="text-slate-400 text-sm mt-2">
              Design cross-module trigger pipelines across Cognitive Core OS, Cybersecurity analysis, and deployment loops.
            </p>
          </div>

          <form onSubmit={handleTrigger} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">Workflow Name</label>
              <input
                type="text"
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all font-mono text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">Trigger Event Hook</label>
              <input
                type="text"
                value={triggerEvent}
                onChange={(e) => setTriggerEvent(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all font-mono text-sm"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center border-t border-slate-800 pt-4">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">Execution Steps Sequence</label>
                <button
                  type="button"
                  onClick={addStep}
                  className="text-xs font-bold text-emerald-400 hover:text-emerald-300 font-mono"
                >
                  + Add Step
                </button>
              </div>

              <div className="space-y-3">
                {steps.map((step, idx) => (
                  <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex gap-3 items-end">
                    <div className="flex-1 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-500 font-mono uppercase">Target Module</label>
                          <input
                            type="text"
                            value={step.moduleName}
                            onChange={(e) => {
                              const next = [...steps];
                              next[idx].moduleName = e.target.value;
                              setSteps(next);
                            }}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 text-xs font-mono"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-500 font-mono uppercase">Action Name</label>
                          <input
                            type="text"
                            value={step.actionTaken}
                            onChange={(e) => {
                              const next = [...steps];
                              next[idx].actionTaken = e.target.value;
                              setSteps(next);
                            }}
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 text-xs font-mono"
                          />
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeStep(idx)}
                      className="text-xs font-bold text-rose-400 hover:text-rose-300 font-mono pb-2"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={executing}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-4 rounded-xl transition-all shadow-lg hover:shadow-indigo-500/25 active:scale-[0.98] mt-4"
            >
              {executing ? 'Simulating Pipeline Executions...' : 'Initiate Platform Workflow'}
            </button>
          </form>
        </div>

        {/* Right Column: Execution Logs Output */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 shadow-xl flex flex-col">
          <h2 className="text-xl font-bold text-white mb-6">Real-Time Execution Logs</h2>

          {!execution ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 font-mono py-12 border border-dashed border-slate-800 rounded-2xl bg-slate-950/20">
              <span>Awaiting workflow initiation...</span>
            </div>
          ) : (
            <div className="flex-1 space-y-6">
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-teal-300">{execution.workflowName}</h3>
                    <div className="text-[10px] text-slate-500 font-mono mt-1">ID: {execution.id}</div>
                  </div>
                  <span className="text-xs font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full">
                    {execution.status}
                  </span>
                </div>

                <div className="space-y-4 font-mono text-xs">
                  {execution.executedSteps.map((step) => (
                    <div key={step.stepNumber} className="border-l-2 border-slate-800 pl-4 py-2 space-y-1 relative">
                      <div className="absolute w-2 h-2 rounded-full -left-[5px] top-[14px] bg-emerald-400"></div>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-300">
                          Step {step.stepNumber}: {step.moduleName}
                        </span>
                        <span className="text-[10px] uppercase text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                          {step.status}
                        </span>
                      </div>
                      <p className="text-slate-400">Action: {step.actionTaken}</p>
                      {step.resultSummary && (
                        <p className="text-slate-500 text-[11px] bg-slate-900 p-2 rounded mt-1 border border-slate-800/50">
                          Result: {step.resultSummary}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
