import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { cybersecurityApi } from '../../services/cybersecurityApi';
import { ThreatDto } from '@codeforge/shared';

export const ThreatCenterPage: React.FC = () => {
  const [threats, setThreats] = useState<ThreatDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await cybersecurityApi.listThreats();
        setThreats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Loading Threat Center...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-indigo-900/40 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-3xl">🚨</span>
            <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-amber-400">
              Active Threat Center
            </h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Analyze active exploit patterns, catalog affected service endpoints, and check mitigation lists.
          </p>
        </div>
      </div>

      {/* Navigation Quick Links */}
      <div className="flex flex-wrap gap-2 pt-1">
        {[
          { label: 'Security Dashboard', path: '/security', icon: '🛡️' },
          { label: 'Threat Center', path: '/security/threats', icon: '🚨' },
          { label: 'Vulnerability Manager', path: '/security/vulnerabilities', icon: '🔍' },
          { label: 'Incident Console', path: '/security/incidents', icon: '💻' },
        ].map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="px-3.5 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/80 text-xs font-semibold text-slate-300 transition-all flex items-center gap-1.5 shadow-md"
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-lg font-bold text-slate-200">Detected Anomalies</h2>
          <div className="space-y-6">
            {threats.map((threat) => (
              <div key={threat.id} className="p-6 rounded-2xl bg-slate-900/40 border border-slate-900 shadow-xl space-y-4 hover:border-indigo-500/20 transition-all">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-100 text-sm leading-normal">{threat.title}</h3>
                    <span className="text-[10px] font-mono text-slate-500 block uppercase mt-0.5">Detected: {new Date(threat.detectedAt).toLocaleDateString()}</span>
                  </div>
                  <span className={`text-[10px] font-mono font-extrabold px-2 py-0.5 rounded uppercase tracking-wider bg-rose-950 text-rose-400 border border-rose-500/30`}>
                    {threat.severity}
                  </span>
                </div>

                <p className="text-slate-400 text-xs leading-relaxed">{threat.description}</p>

                <div className="space-y-2.5 border-t border-slate-950 pt-4 text-xs font-mono">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Affected Host Group</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {threat.affectedSystems.map(system => (
                        <span key={system} className="px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-900 text-[10px]">
                          {system}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Directives Plan</span>
                    <ul className="list-disc pl-4 text-slate-300 mt-1 space-y-1">
                      {threat.mitigationSteps.map((step, idx) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-900 shadow-2xl h-fit space-y-4">
          <h2 className="text-lg font-bold text-slate-200">Threat Scope</h2>
          <div className="space-y-4 text-xs font-mono text-slate-400">
            <div>
              <span className="text-[10px] text-slate-500 block">Total Active Threats</span>
              <span className="text-xl font-bold text-slate-200 block mt-0.5">{threats.length} Active</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Threat Category</span>
              <span className="text-xl font-bold text-slate-200 block mt-0.5">External Botnet</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
