import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { agenticWorkspaceApi } from '../../services/agenticWorkspaceApi';
import {
  KnowledgeGraphDto,
  KnowledgeNodeType,
} from '@codeforge/shared';

export const KnowledgeGraphPage: React.FC = () => {
  const [graph, setGraph] = useState<KnowledgeGraphDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [extractText, setExtractText] = useState('');
  const [extracting, setExtracting] = useState(false);
  const [targetRole, setTargetRole] = useState('Staff Systems Architect');
  const [skillGapResult, setSkillGapResult] = useState<any | null>(null);
  const [analyzingGaps, setAnalyzingGaps] = useState(false);

  useEffect(() => {
    loadGraph();
  }, []);

  const loadGraph = async () => {
    try {
      setLoading(true);
      const data = await agenticWorkspaceApi.getKnowledgeGraph();
      setGraph(data);
    } catch (err) {
      console.error('Failed to load knowledge graph:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExtract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!extractText.trim()) return;
    try {
      setExtracting(true);
      await agenticWorkspaceApi.extractAndLinkEntities(extractText);
      const freshGraph = await agenticWorkspaceApi.getKnowledgeGraph();
      setGraph(freshGraph);
      setExtractText('');
    } catch (err) {
      console.error('Failed to extract entities:', err);
    } finally {
      setExtracting(false);
    }
  };

  const handleAnalyzeGaps = async () => {
    try {
      setAnalyzingGaps(true);
      const gaps = await agenticWorkspaceApi.findSkillGaps(targetRole);
      setSkillGapResult(gaps);
    } catch (err) {
      console.error('Failed to analyze skill gaps:', err);
    } finally {
      setAnalyzingGaps(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-lg font-medium text-slate-300">Constructing Semantic Knowledge Graph...</span>
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
              <span className="text-xs text-slate-400">Semantic Graph Engine</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white mt-1">
              Personal Knowledge Graph 2.0
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Semantic linking across engineering concepts, skills, projects, certifications, and target career roles.
            </p>
          </div>
        </div>

        {/* Graph Stats Bar */}
        {graph && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400">Total Entities / Nodes</span>
              <div className="text-2xl font-extrabold text-white mt-1">{graph.stats.totalNodes}</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400">Semantic Relations / Edges</span>
              <div className="text-2xl font-extrabold text-indigo-400 mt-1">{graph.stats.totalEdges}</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400">Graph Interconnectedness</span>
              <div className="text-2xl font-extrabold text-emerald-400 mt-1">{(graph.stats.density * 100).toFixed(1)}%</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <span className="text-xs text-slate-400">Primary Core Theme</span>
              <div className="text-sm font-bold text-purple-300 mt-2 truncate">
                {graph.stats.topConcepts[0] || 'Distributed Systems'}
              </div>
            </div>
          </div>
        )}

        {/* Entity Extraction Tool */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>⚡</span> Automatic Concept Extraction & Semantic Linking
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Paste code snippets, architecture RFCs, or course notes. The agent will extract entities and link them to your knowledge graph.
            </p>
          </div>

          <form onSubmit={handleExtract} className="space-y-3">
            <textarea
              value={extractText}
              onChange={e => setExtractText(e.target.value)}
              placeholder="e.g. Exploring WebAssembly runtime sandboxing with WASI, eBPF kernel probes for tracing, and vector embeddings..."
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 h-24 resize-none"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={extracting}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-md disabled:opacity-50 transition-all"
              >
                {extracting ? 'Extracting & Linking Entities...' : '+ Extract & Link to Graph'}
              </button>
            </div>
          </form>
        </div>

        {/* Graph Nodes and Edges Interactive Display */}
        {graph && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Entities / Nodes */}
            <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>🕸️</span> Conceptual Entity Nodes ({graph.nodes.length})
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {graph.nodes.map(node => (
                  <div
                    key={node.id}
                    className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${
                        node.nodeType === KnowledgeNodeType.ROLE ? 'bg-purple-500/20 text-purple-300' :
                        node.nodeType === KnowledgeNodeType.PROJECT ? 'bg-indigo-500/20 text-indigo-300' :
                        node.nodeType === KnowledgeNodeType.CERTIFICATION ? 'bg-emerald-500/20 text-emerald-300' :
                        'bg-slate-800 text-slate-300'
                      }`}>
                        {node.nodeType}
                      </span>
                      <span className="text-[10px] text-slate-500">{node.category}</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-100">{node.name}</h4>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-900">
                      <span>Confidence: <strong className="text-emerald-400">{node.confidenceScore}%</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Semantic Edges */}
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>🔗</span> Semantic Relations ({graph.edges.length})
              </h3>

              <div className="space-y-2.5 max-h-[450px] overflow-y-auto pr-1">
                {graph.edges.map(edge => {
                  const srcNode = graph.nodes.find(n => n.id === edge.sourceNodeId);
                  const tgtNode = graph.nodes.find(n => n.id === edge.targetNodeId);
                  return (
                    <div key={edge.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-200">{srcNode?.name || 'Node'}</span>
                        <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold rounded bg-indigo-500/20 text-indigo-400">
                          {edge.relationType}
                        </span>
                      </div>
                      <div className="text-slate-400 flex items-center justify-between text-[11px]">
                        <span>➔ {tgtNode?.name || 'Node'}</span>
                        <span className="text-slate-600">weight: {edge.weight}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Prerequisite Skill Gap Diagnostic Section */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>🎯</span> Role Readiness & Prerequisite Gap Diagnostic
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Traverse the knowledge graph to discover missing prerequisite competencies for your target career role.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <select
                value={targetRole}
                onChange={e => setTargetRole(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="Staff Systems Architect">Staff Systems Architect</option>
                <option value="Distributed Systems Lead">Distributed Systems Lead</option>
                <option value="Principal Cloud Engineer">Principal Cloud Engineer</option>
                <option value="Senior AI Platform Engineer">Senior AI Platform Engineer</option>
              </select>
              <button
                onClick={handleAnalyzeGaps}
                disabled={analyzingGaps}
                className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-md disabled:opacity-50 whitespace-nowrap"
              >
                {analyzingGaps ? 'Diagnosing...' : '🔍 Analyze Gaps'}
              </button>
            </div>
          </div>

          {skillGapResult && (
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/30">
                <div>
                  <h4 className="text-sm font-bold text-white">Target Role: {skillGapResult.targetRole}</h4>
                  <p className="text-xs text-slate-400">Graph prerequisite alignment score</p>
                </div>
                <div className="text-2xl font-extrabold text-emerald-400">
                  {skillGapResult.readinessScore}% Readiness
                </div>
              </div>

              <div className="space-y-2">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  ⚠️ Missing Prerequisite Concepts & Targeted Recommendations
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {skillGapResult.missingPrerequisites.map((gap: any, idx: number) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-amber-300">{gap.skill}</span>
                        <span className="text-[10px] font-bold text-rose-400">{gap.importance}</span>
                      </div>
                      <p className="text-[11px] text-slate-400">{gap.recommendation}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
