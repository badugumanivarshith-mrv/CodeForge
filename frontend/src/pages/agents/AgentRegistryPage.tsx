import React, { useEffect, useState } from 'react';
import { agentEcosystemApi } from '../../services/agentEcosystemApi';
import { EcosystemAgentDto, EcosystemAgentType } from '@codeforge/shared';

export const AgentRegistryPage: React.FC = () => {
  const [agents, setAgents] = useState<EcosystemAgentDto[]>([]);
  const [agentName, setAgentName] = useState('');
  const [agentType, setAgentType] = useState<EcosystemAgentType>(EcosystemAgentType.COGNITIVE_COPROCESSOR);
  const [capabilities, setCapabilities] = useState('AST Parsing, spec proof, dialectic check');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    agentEcosystemApi.listAgents().then((data) => setAgents(data));
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agentName.trim()) return;

    setSubmitting(true);
    try {
      const caps = capabilities.split(',').map((c) => c.trim()).filter(Boolean);
      const newAgent = await agentEcosystemApi.registerAgent({
        agentName,
        agentType,
        capabilities: caps,
      });
      setAgents([...agents, newAgent]);
      setAgentName('');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Register Agent Form */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <h2 className="text-xl font-bold text-white">Register Swarm Agent</h2>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">Agent Name</label>
              <input
                type="text"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                placeholder="e.g. Cognitive Proving Coprocessor"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all font-mono text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">Agent Type</label>
              <select
                value={agentType}
                onChange={(e) => setAgentType(e.target.value as EcosystemAgentType)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-indigo-500 transition-all font-mono text-sm"
              >
                <option value={EcosystemAgentType.COGNITIVE_COPROCESSOR}>Cognitive Coprocessor</option>
                <option value={EcosystemAgentType.COORDINATOR}>Coordinator</option>
                <option value={EcosystemAgentType.CRITICAL_SYSTEM}>Critical System</option>
                <option value={EcosystemAgentType.UTILITY}>Utility</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">Capabilities (comma separated)</label>
              <input
                type="text"
                value={capabilities}
                onChange={(e) => setCapabilities(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all font-mono text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-indigo-500/25 active:scale-[0.98]"
            >
              {submitting ? 'Registering Agent...' : 'Register Agent'}
            </button>
          </form>
        </div>

        {/* Agents Grid List */}
        <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h2 className="text-xl font-bold text-white mb-6">Registered Agents Registry ({agents.length})</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {agents.map((agent) => (
              <div key={agent.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-bold text-white">{agent.agentName}</h3>
                    <div className="text-[10px] text-indigo-400 font-mono mt-0.5">{agent.agentType}</div>
                  </div>
                  <span className="text-[9px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">
                    {agent.status}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {agent.capabilities.map((c) => (
                    <span key={c} className="text-[9px] bg-slate-850 text-slate-500 border border-slate-800 px-2 py-0.5 rounded">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
