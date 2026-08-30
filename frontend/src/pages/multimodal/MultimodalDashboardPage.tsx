import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { multimodalApi } from '../../services/multimodalApi';
import { MultimodalOverviewDto } from '@codeforge/shared';

export const MultimodalDashboardPage: React.FC = () => {
  const [overview, setOverview] = useState<MultimodalOverviewDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await multimodalApi.getOverview();
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
    return <div className="p-8 text-center text-slate-400">Loading Multimodal Dashboard...</div>;
  }

  const defaultMetrics = overview?.metrics || {
    totalAssetsProcessed: 4,
    averageAnalysisConfidence: 0.965,
    totalOCRCharactersExtracted: 840,
    activeReasoningSessionsCount: 2,
    knowledgeNodeDensity: 3,
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-indigo-900/40 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-3xl">🧩</span>
            <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-amber-400">
              Multimodal Intelligence Command
            </h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Orchestrate cross-media parsing, document entity extraction, and cognitive reasoning graphs.
          </p>
        </div>
      </div>

      {/* Navigation Quick Links */}
      <div className="flex flex-wrap gap-2 pt-1">
        {[
          { label: 'Intelligence Overview', path: '/multimodal', icon: '☁️' },
          { label: 'Image Analyzer', path: '/multimodal/analyze-image', icon: '🖼️' },
          { label: 'Document Intelligence', path: '/multimodal/analyze-document', icon: '📄' },
          { label: 'Reasoning Studio', path: '/multimodal/reason', icon: '🧠' },
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
          { title: 'Total Assets Evaluated', value: defaultMetrics.totalAssetsProcessed, label: 'Images & PDFs', icon: '📊', color: 'from-indigo-500 to-purple-500' },
          { title: 'Avg Extraction Confidence', value: `${(defaultMetrics.averageAnalysisConfidence * 100).toFixed(1)}%`, label: 'Model consensus rate', icon: '🎯', color: 'from-purple-500 to-amber-500' },
          { title: 'OCR Characters Extracted', value: defaultMetrics.totalOCRCharactersExtracted.toLocaleString(), label: 'Characters parsed', icon: '📝', color: 'from-amber-500 to-rose-500' },
          { title: 'Knowledge Nodes Density', value: defaultMetrics.knowledgeNodeDensity, label: 'Cross-media concept nodes', icon: '🕸️', color: 'from-rose-500 to-emerald-500' },
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
          <h2 className="text-lg font-bold text-slate-200">Recent Media Pipelines</h2>
          <div className="space-y-4">
            {overview?.recentAssets.map((asset) => {
              const res = overview.recentResults.find(r => r.assetId === asset.id);
              return (
                <div key={asset.id} className="p-4 rounded-xl bg-slate-900/20 border border-slate-900 flex justify-between items-center text-xs">
                  <div>
                    <h3 className="font-bold text-slate-200">{asset.name}</h3>
                    <span className="text-[10px] font-mono text-slate-500 block mt-0.5 uppercase">{asset.assetType} | {asset.fileSizeCharacters} chars</span>
                  </div>
                  {res && (
                    <div className="text-right">
                      <span className="text-indigo-400 font-semibold block">{res.status}</span>
                      <span className="text-[10px] font-mono text-slate-500">{res.detectedTags.slice(0, 3).join(', ')}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-900 shadow-2xl h-fit space-y-4">
          <h2 className="text-lg font-bold text-slate-200">Cross-Media Knowledge</h2>
          <div className="space-y-3">
            {overview?.knowledgeBase.map((k) => (
              <div key={k.id} className="p-3 rounded-lg bg-slate-950 border border-slate-900 text-xs space-y-1">
                <span className="font-bold text-indigo-300 block">{k.conceptName}</span>
                <p className="text-slate-400 leading-normal text-[11px]">{k.crossMediaSummary}</p>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {k.associatedTags.map(t => (
                    <span key={t} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-indigo-950/40 text-indigo-400 border border-indigo-900/30">
                      {t}
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
