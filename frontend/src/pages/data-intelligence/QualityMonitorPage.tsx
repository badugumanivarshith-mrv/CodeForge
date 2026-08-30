import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dataIntelligenceApi } from '../../services/dataIntelligenceApi';
import { QualityReportDto } from '@codeforge/shared';

export const QualityMonitorPage: React.FC = () => {
  const [reports, setReports] = useState<QualityReportDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const overview = await dataIntelligenceApi.getOverview();
        setReports(overview.qualityReports);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Loading Quality Monitor...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-indigo-900/40 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-3xl">🔍</span>
            <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-emerald-400 to-indigo-400">
              Quality Monitor
            </h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Audit completeness percentages, track duplicates counts, and view null constraints check reports.
          </p>
        </div>
      </div>

      {/* Navigation Quick Links */}
      <div className="flex flex-wrap gap-2 pt-1">
        {[
          { label: 'Data Dashboard', path: '/data-intelligence', icon: '📊' },
          { label: 'Analytics Studio', path: '/data-intelligence/analytics', icon: '⚙️' },
          { label: 'Insight Center', path: '/data-intelligence/insights', icon: '💡' },
          { label: 'Quality Monitor', path: '/data-intelligence/quality', icon: '🔍' },
        ].map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="px-3.5 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-teal-500/50 hover:bg-slate-800/80 text-xs font-semibold text-slate-300 transition-all flex items-center gap-1.5 shadow-md"
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-lg font-bold text-slate-200">Data Quality Audits</h2>
          <div className="space-y-6">
            {reports.map((report) => (
              <div key={report.id} className="p-6 rounded-2xl bg-slate-900/40 border border-slate-900 shadow-xl space-y-4 hover:border-teal-500/20 transition-all">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-100 text-sm leading-normal">Source ID: {report.sourceId}</h3>
                    <span className="text-[10px] font-mono text-slate-500 block uppercase mt-0.5">Audited: {new Date(report.runAt).toLocaleDateString()}</span>
                  </div>
                  <span className={`text-[10px] font-mono font-extrabold px-2 py-0.5 rounded uppercase tracking-wider bg-teal-950 text-teal-400 border border-teal-500/30`}>
                    Rating: {report.rating}
                  </span>
                </div>

                <div className="space-y-2 border-t border-slate-950 pt-4 text-xs font-mono text-slate-400">
                  <div className="flex justify-between">
                    <span>Completeness Score:</span>
                    <span className="text-emerald-400 font-bold">{report.completenessPercentage}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duplicates Count:</span>
                    <span className="text-slate-200 font-bold">{report.duplicateCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Null Values Count:</span>
                    <span className="text-slate-200 font-bold">{report.nullValueCount}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-900 shadow-2xl h-fit space-y-4">
          <h2 className="text-lg font-bold text-slate-200">Integrity Telemetry</h2>
          <div className="space-y-4 text-xs font-mono text-slate-400">
            <div>
              <span className="text-[10px] text-slate-500 block">Total Audits Performed</span>
              <span className="text-xl font-bold text-slate-200 block mt-0.5">{reports.length} Reports</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Average Safe score</span>
              <span className="text-xl font-bold text-slate-200 block mt-0.5">99.85% Integrity</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
