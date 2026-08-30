import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { cybersecurityApi } from '../../services/cybersecurityApi';
import { SecurityOverviewDto } from '@codeforge/shared';

export const SecurityDashboardPage: React.FC = () => {
  const [overview, setOverview] = useState<SecurityOverviewDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await cybersecurityApi.getOverview();
        setOverview(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Loading Security Dashboard...</div>;
  }

  const defaultMetrics = overview?.metrics || {
    aggregateRiskScore: 84.6,
    totalThreatsDetected: 12,
    mitigatedThreatsCount: 10,
    openVulnerabilitiesCount: 1,
    activeIncidentsCount: 1,
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-indigo-900/40 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-3xl">🛡️</span>
            <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-amber-400">
              Cybersecurity Command Center
            </h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Real-time anomaly monitoring, automated threat mitigations, and packages vulnerability scoring.
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

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'System Risk Rating', value: `${defaultMetrics.aggregateRiskScore}%`, label: 'Aggregate safe metrics', icon: '🎯', color: 'from-emerald-400 to-teal-400' },
          { title: 'Threats Logs', value: defaultMetrics.totalThreatsDetected, label: 'Detected anomalies', icon: '🚨', color: 'from-indigo-500 to-purple-500' },
          { title: 'Vulnerabilities', value: defaultMetrics.openVulnerabilitiesCount, label: 'Unresolved CVE entries', icon: '🔍', color: 'from-amber-500 to-rose-500' },
          { title: 'Active Incidents', value: defaultMetrics.activeIncidentsCount, label: 'Requires attention', icon: '💻', color: 'from-rose-500 to-pink-500' },
        ].map((stat, idx) => (
          <div key={idx} className="p-6 rounded-2xl bg-slate-900/40 border border-slate-900 shadow-xl flex flex-col justify-between space-y-4">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.title}</span>
              <span className="text-lg">{stat.icon}</span>
            </div>
            <div>
              <span className={`text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r ${stat.color}`}>
                {stat.value}
              </span>
              <span className="text-[10px] text-slate-500 block mt-1">{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-lg font-bold text-slate-200">Recent Security Feed Events</h2>
          <div className="space-y-4">
            {overview?.recentEvents.map((event) => (
              <div key={event.id} className="p-4 rounded-xl bg-slate-900/20 border border-slate-900 flex justify-between items-center text-xs">
                <div>
                  <h3 className="font-bold text-slate-200">{event.eventType}</h3>
                  <span className="text-[10px] font-mono text-slate-500 block mt-0.5 uppercase">Source: {event.sourceIp} | Severity: {event.severity}</span>
                </div>
                <span className="text-rose-400 font-semibold block">{new Date(event.timestamp).toLocaleTimeString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-900 shadow-2xl h-fit space-y-4">
          <h2 className="text-lg font-bold text-slate-200">Mitigation Directives</h2>
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-900 text-xs">
              <span className="font-bold text-indigo-300 block">Firewall Rule Activation</span>
              <p className="text-slate-400 leading-normal text-[11px] mt-1">Block subnet access requests matching bruteforce thresholds.</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-900 text-xs">
              <span className="font-bold text-indigo-300 block">Package Dependency Upgrades</span>
              <p className="text-slate-400 leading-normal text-[11px] mt-1">CVE resolutions mapped to automated pull requests updates.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
