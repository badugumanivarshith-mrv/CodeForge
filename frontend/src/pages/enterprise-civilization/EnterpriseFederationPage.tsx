import React, { useEffect, useState } from 'react';
import { enterpriseCivilizationApi } from '../../services/enterpriseCivilizationApi';
import { EnterpriseFederationDto, EnterpriseFederationType } from '@codeforge/shared';

export const EnterpriseFederationPage: React.FC = () => {
  const [federations, setFederations] = useState<EnterpriseFederationDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  // Form state
  const [treatyTitle, setTreatyTitle] = useState('');
  const [fedType, setFedType] = useState<EnterpriseFederationType>(EnterpriseFederationType.STRATEGIC_ALLIANCE);
  const [sharedRes, setSharedRes] = useState('');
  const [governance, setGovernance] = useState('');

  useEffect(() => {
    loadFederations();
  }, []);

  async function loadFederations() {
    setLoading(true);
    try {
      const list = await enterpriseCivilizationApi.listFederations();
      setFederations(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!treatyTitle.trim()) return;
    setCreating(true);
    try {
      await enterpriseCivilizationApi.createFederation({
        treatyTitle,
        federationType: fedType,
        sharedResourcesDescription: sharedRes || 'Joint GPU compute mesh and dialectic verification fabric',
        governanceTerms: governance || 'Equal parity consensus voting with automated SLA penalty slashing',
      });
      setTreatyTitle('');
      setSharedRes('');
      setGovernance('');
      await loadFederations();
    } catch (err) {
      console.error('Failed to create federation', err);
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-rose-900/40 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌐</span>
            <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-rose-400 to-pink-400">
              Enterprise Federation & Treaties
            </h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Cross-Enterprise Alliances • Joint Compute & Talent Treaties • Dialectic Governance & Resource Mesh
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Form */}
        <div className="space-y-6">
          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
            <h2 className="font-bold text-base text-rose-300 mb-4">Propose Federation Treaty</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Treaty Title
                </label>
                <input
                  type="text"
                  value={treatyTitle}
                  onChange={(e) => setTreatyTitle(e.target.value)}
                  placeholder="e.g. Sovereign GPU Mesh Accord"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm focus:outline-none focus:border-rose-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Federation Type
                </label>
                <select
                  value={fedType}
                  onChange={(e) => setFedType(e.target.value as EnterpriseFederationType)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm focus:outline-none focus:border-rose-500"
                >
                  {Object.values(EnterpriseFederationType).map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Shared Resources Description
                </label>
                <textarea
                  value={sharedRes}
                  onChange={(e) => setSharedRes(e.target.value)}
                  placeholder="e.g. 50,000 H100 GPU cluster tokens and automated talent exchange."
                  rows={2}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Governance Terms
                </label>
                <textarea
                  value={governance}
                  onChange={(e) => setGovernance(e.target.value)}
                  placeholder="e.g. 50/50 DAO voting with automated slashing penalties on latency violations."
                  rows={2}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm focus:outline-none focus:border-rose-500"
                />
              </div>

              <button
                type="submit"
                disabled={creating}
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 font-semibold text-sm rounded-lg transition-colors text-white shadow-lg shadow-rose-600/30"
              >
                {creating ? 'Ratifying Treaty...' : 'Propose Treaty ➔'}
              </button>
            </form>
          </div>
        </div>

        {/* Center & Right: Federations Ledger */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md space-y-4">
            <h2 className="font-bold text-base text-slate-200">Active Multi-Enterprise Federations ({federations.length})</h2>
            {loading ? (
              <div className="text-xs text-slate-500">Loading federations...</div>
            ) : (
              <div className="space-y-3">
                {federations.map((fed) => (
                  <div
                    key={fed.id}
                    className="p-5 rounded-lg bg-slate-950/60 border border-slate-800 space-y-3"
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                      <div>
                        <span className="text-base font-bold text-rose-300">{fed.treatyTitle}</span>
                        <span className="text-xs text-slate-400 ml-2 font-mono">
                          Joint Projects: {fed.jointProjectsCount}
                        </span>
                      </div>
                      <span className="px-2.5 py-1 rounded bg-rose-950 text-rose-300 font-mono text-xs border border-rose-800/40">
                        {fed.federationType}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded bg-slate-900 border border-slate-800">
                        <div className="text-rose-400 font-bold mb-1">Shared Resources</div>
                        <div className="text-slate-300">{fed.sharedResourcesDescription}</div>
                      </div>
                      <div className="p-3 rounded bg-slate-900 border border-slate-800">
                        <div className="text-pink-400 font-bold mb-1">Governance Protocols</div>
                        <div className="text-slate-300">{fed.governanceTerms}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
