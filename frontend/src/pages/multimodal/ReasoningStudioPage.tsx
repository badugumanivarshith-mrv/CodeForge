import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { multimodalApi } from '../../services/multimodalApi';
import { ReasoningSessionDto, ReasoningComplexity } from '@codeforge/shared';

export const ReasoningStudioPage: React.FC = () => {
  const [sessionName, setSessionName] = useState('Cross-media Audit Run');
  const [complexity, setComplexity] = useState<ReasoningComplexity>(ReasoningComplexity.CROSS_MEDIA);
  const [promptQuery, setPromptQuery] = useState('Verify diagram topology and audit matching cost ledgers.');
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<ReasoningSessionDto | null>(null);

  const handleReason = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const outcome = await multimodalApi.reason({
        sessionName,
        complexity,
        promptQuery,
      });
      setSession(outcome);
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
            <span className="text-3xl">🧠</span>
            <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-amber-400">
              Cognitive Reasoning Studio
            </h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Conduct cross-media validation, compare image layers structures, and evaluate logical constraint dependencies.
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <form onSubmit={handleReason} className="lg:col-span-2 space-y-6 bg-slate-900/40 border border-slate-900 p-8 rounded-2xl shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase text-slate-400">Session Identifier Name</label>
              <input
                type="text"
                required
                className="w-full bg-slate-950 border border-slate-850 focus:border-indigo-500 rounded-lg p-3 text-sm text-slate-100 font-medium transition-all focus:outline-none"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase text-slate-400">Cognitive Complexity</label>
              <select
                className="w-full bg-slate-950 border border-slate-850 focus:border-indigo-500 rounded-lg p-3 text-sm text-slate-100 font-medium transition-all focus:outline-none"
                value={complexity}
                onChange={(e) => setComplexity(e.target.value as ReasoningComplexity)}
              >
                <option value={ReasoningComplexity.BASIC}>Basic Textual Lookup</option>
                <option value={ReasoningComplexity.COGNITIVE}>Cognitive Intent Analysis</option>
                <option value={ReasoningComplexity.CROSS_MEDIA}>Cross-Media Relation Verification</option>
                <option value={ReasoningComplexity.HYPOTHESIS_GEN}>Hypothesis Generation</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase text-slate-400">Cross-Media Reasoning Prompt Query</label>
            <textarea
              required
              rows={3}
              className="w-full bg-slate-950 border border-slate-850 focus:border-indigo-500 rounded-lg p-3 text-sm text-slate-100 font-medium transition-all focus:outline-none resize-none"
              value={promptQuery}
              onChange={(e) => setPromptQuery(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-amber-500 hover:opacity-90 font-bold text-white text-sm tracking-wider uppercase transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2"
          >
            {loading ? 'Evaluating Cognitive Reasoning Graph...' : '🧠 Run Reasoning Engine ➔'}
          </button>
        </form>

        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-900 shadow-2xl h-fit space-y-4">
          <h2 className="text-lg font-bold text-slate-200">Execution steps</h2>
          {session ? (
            <div className="space-y-4 text-xs">
              <div className="space-y-2">
                <span className="text-[10px] text-slate-500 font-mono block">Cognitive Trace Log</span>
                {session.reasoningSteps.map((step, idx) => (
                  <div key={idx} className="flex gap-2 items-start text-[11px] leading-relaxed">
                    <span className="text-indigo-400 font-bold font-mono">[{idx + 1}]</span>
                    <p className="text-slate-300">{step}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-slate-950 pt-4">
                <span className="text-[10px] text-slate-500 font-mono block">Unified Intelligence Output</span>
                <p className="text-slate-200 font-semibold leading-relaxed mt-1 text-[11px]">{session.cognitiveOutput}</p>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500 leading-normal">Submit a query prompt linking graphic elements or spreadsheets tables to trigger cognitive trace execution.</p>
          )}
        </div>
      </div>
    </div>
  );
};
