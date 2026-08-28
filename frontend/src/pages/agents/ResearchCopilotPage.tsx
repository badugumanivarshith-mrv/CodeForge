import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { agenticWorkspaceApi } from '../../services/agenticWorkspaceApi';
import {
  ResearchReportDto,
} from '@codeforge/shared';

export const ResearchCopilotPage: React.FC = () => {
  const [reports, setReports] = useState<ResearchReportDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [topic, setTopic] = useState('');
  const [category, setCategory] = useState('SYSTEMS_ARCHITECTURE');
  const [researching, setResearching] = useState(false);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      const data = await agenticWorkspaceApi.listResearchReports();
      setReports(data);
    } catch (err) {
      console.error('Failed to load research reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleConductResearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    try {
      setResearching(true);
      const report = await agenticWorkspaceApi.conductResearch({
        topic,
        category,
      });
      setReports(prev => [report, ...prev]);
      setTopic('');
    } catch (err) {
      console.error('Failed to conduct deep research:', err);
    } finally {
      setResearching(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-lg font-medium text-slate-300">Synchronizing Research Copilot...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center space-x-2">
              <Link to="/ai-command-center" className="text-xs text-indigo-400 hover:underline">
                ← AI Command Center
              </Link>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-400">Deep Intelligence</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white mt-1">
              Deep Research Copilot
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Multi-source academic & industry technical research, SWOT matrices, and technology scouting.
            </p>
          </div>
        </div>

        {/* Research Input Form */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-5">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>🔬</span> Initiate Deep Multi-Source Technical Research
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Enter any architectural concept, distributed framework, or emerging paradigm to synthesize SWOT analysis and trends.
            </p>
          </div>

          <form onSubmit={handleConductResearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-3">
                <label className="text-xs font-bold text-slate-400 block mb-1">Research Topic or Question</label>
                <input
                  type="text"
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  placeholder="e.g. Zero-Copy LSM-Tree Storage Compaction in Rust vs C++"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Domain Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="SYSTEMS_ARCHITECTURE">Systems Architecture</option>
                  <option value="AI_ML">AI & Machine Learning</option>
                  <option value="DISTRIBUTED_CONSENSUS">Distributed Consensus</option>
                  <option value="SECURITY_PRIVACY">Security & Cryptography</option>
                  <option value="CLOUD_INFRASTRUCTURE">Cloud Infrastructure</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={researching}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-xs font-bold text-white hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/20 disabled:opacity-50 transition-all"
              >
                {researching ? 'Synthesizing Deep Research...' : '⚡ Generate Technical Intelligence Report'}
              </button>
            </div>
          </form>
        </div>

        {/* Research Reports Stream */}
        <div className="space-y-8">
          {reports.map(report => (
            <div
              key={report.id}
              className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6"
            >
              {/* Report Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-800 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-indigo-500/20 text-indigo-400">
                      {report.category}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white">{report.topic}</h3>
                </div>
              </div>

              {/* Executive Summary */}
              <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 text-xs text-indigo-200 leading-relaxed">
                <strong>Executive Summary:</strong> {report.executiveSummary}
              </div>

              {/* 4-Quadrant SWOT Matrix */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  📊 4-Quadrant SWOT Matrix
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                    <h5 className="text-xs font-bold text-emerald-400">💪 Strengths</h5>
                    <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                      {report.swotAnalysis.strengths.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-2">
                    <h5 className="text-xs font-bold text-amber-400">⚠️ Weaknesses</h5>
                    <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                      {report.swotAnalysis.weaknesses.map((w, i) => (
                        <li key={i}>{w}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 space-y-2">
                    <h5 className="text-xs font-bold text-indigo-400">🚀 Opportunities</h5>
                    <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                      {report.swotAnalysis.opportunities.map((o, i) => (
                        <li key={i}>{o}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-2">
                    <h5 className="text-xs font-bold text-rose-400">🛡️ Threats</h5>
                    <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                      {report.swotAnalysis.threats.map((t, i) => (
                        <li key={i}>{t}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Opportunity Matrix */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  🎯 Opportunity & Impact Matrix
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {report.opportunityMatrix.map((opp, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-300">{opp.opportunity}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>Impact: <strong className="text-emerald-400">{opp.impactScore}/100</strong></span>
                        <span>Feasibility: <strong className="text-indigo-400">{opp.feasibilityScore}/100</strong></span>
                      </div>
                      <p className="text-[11px] text-slate-400 border-t border-slate-900 pt-2">
                        {opp.recommendation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Trends & Recommendations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <h5 className="font-bold text-purple-300">📈 Key Ecosystem Trends:</h5>
                  <ul className="text-slate-300 space-y-1 list-disc list-inside">
                    {report.keyTrends.map((trend, tIdx) => (
                      <li key={tIdx}>{trend}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <h5 className="font-bold text-emerald-300">✅ Strategic Action Recommendations:</h5>
                  <ul className="text-slate-300 space-y-1 list-disc list-inside">
                    {report.recommendations.map((rec, rIdx) => (
                      <li key={rIdx}>{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Credible Sources */}
              {report.sources && report.sources.length > 0 && (
                <div className="pt-3 border-t border-slate-800 text-xs text-slate-500 space-y-1">
                  <span className="font-semibold text-slate-400">Referenced Academic & Industry Sources:</span>
                  <div className="flex flex-wrap gap-3 pt-1">
                    {report.sources.map((src, sIdx) => (
                      <a
                        key={sIdx}
                        href={src.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-400 hover:underline flex items-center gap-1"
                      >
                        🔗 {src.title} ({src.credibilityScore}% index)
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
