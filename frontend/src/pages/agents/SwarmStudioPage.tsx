import React, { useEffect, useState } from 'react';
import { agentEcosystemApi } from '../../services/agentEcosystemApi';
import { EcosystemAgentDto, EcosystemAgentTaskDto } from '@codeforge/shared';

export const SwarmStudioPage: React.FC = () => {
  const [agents, setAgents] = useState<EcosystemAgentDto[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState('');
  const [taskDescription, setTaskDescription] = useState('Compute specimen invariants checking spec dial.');
  const [tasks, setTasks] = useState<EcosystemAgentTaskDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [delegating, setDelegating] = useState(false);

  useEffect(() => {
    agentEcosystemApi.listAgents().then((data) => {
      setAgents(data);
      if (data.length > 0) {
        setSelectedAgentId(data[0].id);
      }
      setLoading(false);
    });
  }, []);

  const handleDelegate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAgentId || !taskDescription.trim()) return;

    setDelegating(true);
    try {
      const task = await agentEcosystemApi.delegateTask({
        assignedAgentId: selectedAgentId,
        taskDescription,
        inputParams: { runMode: 'speculative_dialectic' },
      });
      setTasks([task, ...tasks]);
      setTaskDescription('');
    } catch (err) {
      console.error(err);
    } finally {
      setDelegating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-indigo-400 font-mono">
        <div className="text-xl animate-pulse">Initializing Swarm Studio Workspace...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Swarm Studio Delegations form */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 shadow-xl space-y-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Swarm Studio
            </h1>
            <p className="text-slate-400 text-sm mt-2">
              Delegate complex multi-agent instructions to registered coprocessors and trace outputs logs.
            </p>
          </div>

          <form onSubmit={handleDelegate} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">Target Swarm Agent</label>
              <select
                value={selectedAgentId}
                onChange={(e) => setSelectedAgentId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-indigo-500 transition-all font-mono text-sm"
              >
                {agents.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.agentName} ({a.agentType})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">Task Instructions</label>
              <textarea
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                rows={4}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all font-mono text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={delegating}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-4 rounded-xl transition-all shadow-lg hover:shadow-indigo-500/25 active:scale-[0.98] mt-4"
            >
              {delegating ? 'Delegating Swarm directive...' : 'Delegate Task to Mesh'}
            </button>
          </form>
        </div>

        {/* Real-time Task outputs logs panel */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 shadow-xl flex flex-col">
          <h2 className="text-xl font-bold text-white mb-6">Real-Time Delegation Logs</h2>

          {tasks.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 font-mono py-12 border border-dashed border-slate-800 rounded-2xl bg-slate-950/20">
              <span>Awaiting task delegation...</span>
            </div>
          ) : (
            <div className="flex-1 space-y-4 overflow-y-auto">
              {tasks.map((task) => (
                <div key={task.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <span className="text-[10px] font-mono text-slate-500">ID: {task.id.slice(-6)}</span>
                    <span className="text-[9px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">
                      {task.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">{task.taskDescription}</p>
                  <div className="text-[10px] text-slate-500 font-mono bg-slate-900 p-2 rounded">
                    Input: {JSON.stringify(task.inputParams)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
