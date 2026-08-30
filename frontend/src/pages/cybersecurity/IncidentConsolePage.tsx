import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { cybersecurityApi } from '../../services/cybersecurityApi';
import { ThreatSeverity } from '@codeforge/shared';

export const IncidentConsolePage: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('Suspicious Database Outbound Spikes');
  const [description, setDescription] = useState('Unusual query telemetry exceeding threshold capacity patterns.');
  const [severity, setSeverity] = useState<ThreatSeverity>(ThreatSeverity.HIGH);
  const [assignedTeam, setAssignedTeam] = useState('SecOps-Alpha');
  const [loading, setLoading] = useState(false);

  const handleReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await cybersecurityApi.declareIncident({
        title,
        description,
        severity,
        assignedTeam,
      });
      navigate('/security');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-indigo-900/40 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-3xl">💻</span>
            <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-amber-400">
              Incident Response Console
            </h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Report new security incidents, link containment directives plans, and manage resolution states.
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
        <form onSubmit={handleReport} className="lg:col-span-2 space-y-6 bg-slate-900/40 border border-slate-900 p-8 rounded-2xl shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase text-slate-400">Incident Alert Title</label>
              <input
                type="text"
                required
                className="w-full bg-slate-950 border border-slate-850 focus:border-indigo-500 rounded-lg p-3 text-sm text-slate-100 font-medium transition-all focus:outline-none"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase text-slate-400">Assigned containment Team</label>
              <input
                type="text"
                required
                className="w-full bg-slate-950 border border-slate-850 focus:border-indigo-500 rounded-lg p-3 text-sm text-slate-100 font-medium transition-all focus:outline-none"
                value={assignedTeam}
                onChange={(e) => setAssignedTeam(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase text-slate-400">Threat Severity</label>
              <select
                className="w-full bg-slate-950 border border-slate-850 focus:border-indigo-500 rounded-lg p-3 text-sm text-slate-100 font-medium transition-all focus:outline-none"
                value={severity}
                onChange={(e) => setSeverity(e.target.value as ThreatSeverity)}
              >
                <option value={ThreatSeverity.LOW}>Low Severity</option>
                <option value={ThreatSeverity.MEDIUM}>Medium Severity</option>
                <option value={ThreatSeverity.HIGH}>High Severity</option>
                <option value={ThreatSeverity.CRITICAL}>Critical Severity</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase text-slate-400">Exploit Description Details</label>
            <textarea
              required
              rows={4}
              className="w-full bg-slate-950 border border-slate-850 focus:border-indigo-500 rounded-lg p-3 text-sm text-slate-100 font-medium transition-all focus:outline-none resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-amber-500 hover:opacity-90 font-bold text-white text-sm tracking-wider uppercase transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2"
          >
            {loading ? 'Declaring Incident State...' : '🚨 Declare Active Incident ➔'}
          </button>
        </form>

        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-900 shadow-2xl h-fit space-y-4">
          <h2 className="text-lg font-bold text-slate-200">Containment Protocols</h2>
          <div className="space-y-4 text-xs font-mono text-slate-400">
            <div className="flex gap-2">
              <span className="text-indigo-400 font-bold font-mono">[1]</span>
              <p>Verify host groups dependencies and isolate target ports.</p>
            </div>
            <div className="flex gap-2">
              <span className="text-indigo-400 font-bold font-mono">[2]</span>
              <p>Enable WAF mitigation rules and rate limits triggers.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
