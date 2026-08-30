import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dataIntelligenceApi } from '../../services/dataIntelligenceApi';
import { DataOverviewDto } from '@codeforge/shared';

export const DataDashboardPage: React.FC = () => {
  const [overview, setOverview] = useState<DataOverviewDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await dataIntelligenceApi.getOverview();
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
    return <div className="p-8 text-center text-slate-400">Loading Data Dashboard...</div>;
  }

  const metrics = overview?.metrics || {
    totalIngestedRows: 0,
    activeJobsCount: 0,
    generatedInsightsCount: 0,
    averageQualityScore: 100,
    totalDataSourcesCount: 0,
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-indigo-900/40 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-3xl">📊</span>
            <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-emerald-400 to-indigo-400">
              Data Intelligence Platform
            </h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Data pipeline telemetry, analytical job orchestration, quality auditing, and trend generation.
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

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Total Ingested Rows', value: metrics.totalIngestedRows.toLocaleString(), label: 'Aggregate row telemetry', icon: '📁', color: 'from-teal-400 to-emerald-400' },
          { title: 'Data Sources', value: metrics.totalDataSourcesCount, label: 'Active ingest pipelines', icon: '⚡', color: 'from-indigo-400 to-purple-400' },
          { title: 'Quality score', value: `${metrics.averageQualityScore}%`, label: 'Completeness check rate', icon: '🔍', color: 'from-amber-400 to-emerald-400' },
          { title: 'Active Jobs', value: metrics.activeJobsCount, label: 'Running analytics workers', icon: '⚙️', color: 'from-rose-400 to-pink-400' },
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
          <h2 className="text-lg font-bold text-slate-200">Active Ingestion Feeds</h2>
          <div className="space-y-4">
            {overview?.dataSources.map((src) => (
              <div key={src.id} className="p-5 rounded-2xl bg-slate-900/20 border border-slate-900 flex justify-between items-center text-xs">
                <div>
                  <h3 className="font-bold text-slate-200 text-sm">{src.name}</h3>
                  <span className="text-[10px] font-mono text-slate-500 block mt-1 uppercase">Type: {src.sourceType} | Size: {src.fileSizeKb} KB</span>
                </div>
                <div className="text-right">
                  <span className="text-teal-400 font-bold block">{src.rowCount.toLocaleString()} Rows</span>
                  <span className="text-[9px] text-slate-500 block mt-0.5">{new Date(src.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-900 shadow-2xl h-fit space-y-4">
          <h2 className="text-lg font-bold text-slate-200">Quality Constraints</h2>
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-900 text-xs">
              <span className="font-bold text-teal-300 block">Schema Check Verification</span>
              <p className="text-slate-400 leading-normal text-[11px] mt-1">Audit table columns completeness triggers automatically on source registry updates.</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-900 text-xs">
              <span className="font-bold text-teal-300 block">Anomaly Filter Logs</span>
              <p className="text-slate-400 leading-normal text-[11px] mt-1">Evaluates row metrics for spikes, logs outliers, and warns on quality dips.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
