import React, { useEffect, useState } from 'react';
import { researchUniversityApi } from '../../services/researchUniversityApi';
import { AcademicKnowledgeNodeDto, AcademicDepartment, KnowledgeNodeType } from '@codeforge/shared';

export const AcademicKnowledgeGraphPage: React.FC = () => {
  const [nodes, setNodes] = useState<AcademicKnowledgeNodeDto[]>([]);
  const [lineagesAnalysis, setLineagesAnalysis] = useState<any>(null);
  const [selectedDept, setSelectedDept] = useState<AcademicDepartment | 'ALL'>('ALL');

  // Form states to index new node
  const [canonicalName, setCanonicalName] = useState('');
  const [nodeType, setNodeType] = useState<KnowledgeNodeType>(KnowledgeNodeType.THEOREM);
  const [domain, setDomain] = useState<AcademicDepartment>(AcademicDepartment.MATHEMATICS);
  const [definition, setDefinition] = useState('');
  const [confidence, setConfidence] = useState(95);

  useEffect(() => {
    loadNodesAndLineages();
  }, [selectedDept]);

  async function loadNodesAndLineages() {
    try {
      const deptFilter = selectedDept === 'ALL' ? undefined : selectedDept;
      const nodesData = await researchUniversityApi.listKnowledgeNodes(deptFilter);
      const lineagesData = await researchUniversityApi.getKnowledgeLineages(deptFilter);
      setNodes(nodesData);
      setLineagesAnalysis(lineagesData);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleIndexNode(e: React.FormEvent) {
    e.preventDefault();
    if (!canonicalName || !definition) return;
    try {
      await researchUniversityApi.indexKnowledgeNode({
        nodeType,
        canonicalName,
        domain,
        definition,
        confidenceScore: confidence,
        evolutionLineage: ['First Principles', canonicalName],
      });
      setCanonicalName('');
      setDefinition('');
      loadNodesAndLineages();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-amber-400">
          Academic Knowledge Graph Civilization
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Trace formal theorem lineages, map computational concepts, and search algorithm derivations.
        </p>
      </div>

      {/* Filter by Department */}
      <div className="flex flex-wrap gap-2 pt-1 border-b border-slate-900 pb-4">
        <button
          onClick={() => setSelectedDept('ALL')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
            selectedDept === 'ALL'
              ? 'bg-indigo-600 border-indigo-500 text-white'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
          }`}
        >
          ALL DOMAINS
        </button>
        {Object.values(AcademicDepartment).map((dept) => (
          <button
            key={dept}
            onClick={() => setSelectedDept(dept)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all uppercase ${
              selectedDept === dept
                ? 'bg-indigo-600 border-indigo-500 text-white'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            {dept.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Nodes list & Lineage analysis */}
        <div className="lg:col-span-2 space-y-8">
          {/* Lineage summary card */}
          {lineagesAnalysis && (
            <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-850">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono">Cross-Disciplinary Lineages</h3>
              <div className="grid grid-cols-2 gap-4 mt-4 font-mono text-center">
                <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-900">
                  <span className="text-[10px] text-slate-500 block uppercase">Total Nodes</span>
                  <span className="text-xl font-extrabold text-indigo-400 mt-1 block">{lineagesAnalysis.nodesCount} Nodes</span>
                </div>
                <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-900">
                  <span className="text-[10px] text-slate-500 block uppercase">Concept Clusters</span>
                  <span className="text-xl font-extrabold text-purple-400 mt-1 block">{lineagesAnalysis.conceptClusters} Clusters</span>
                </div>
              </div>
            </div>
          )}

          {/* Nodes grid */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-200">Knowledge Nodes Index</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {nodes.map((node) => (
                <div key={node.id} className="p-4 rounded-xl bg-slate-900/60 border border-slate-850 hover:border-indigo-500/20 transition-all flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex justify-between items-start">
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-indigo-950 border border-indigo-500/20 text-indigo-400 uppercase tracking-wider">
                        {node.nodeType}
                      </span>
                      <span className="text-[9px] font-mono text-slate-500">Confidence: {node.confidenceScore}%</span>
                    </div>
                    <h3 className="font-bold text-sm text-slate-200 mt-2">{node.canonicalName}</h3>
                    <p className="text-xs text-slate-400 mt-1">{node.definition}</p>
                  </div>

                  {/* Evolution timeline indicator */}
                  {node.evolutionLineage && node.evolutionLineage.length > 0 && (
                    <div className="space-y-1.5 pt-2.5 border-t border-slate-950">
                      <span className="text-[9px] font-mono text-slate-500 block uppercase">Derivation Lineage</span>
                      <div className="flex flex-wrap items-center gap-1.5 text-[9px] text-slate-400 font-mono">
                        {node.evolutionLineage.map((item, idx) => (
                          <React.Fragment key={idx}>
                            {idx > 0 && <span className="text-indigo-500">➔</span>}
                            <span>{item}</span>
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Indexing form */}
        <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-900 shadow-2xl h-fit space-y-4">
          <h3 className="font-bold text-slate-200">Index Knowledge Node</h3>
          <form onSubmit={handleIndexNode} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="text-slate-400 font-semibold uppercase">Canonical Concept Name</label>
              <input
                type="text"
                value={canonicalName}
                onChange={(e) => setCanonicalName(e.target.value)}
                placeholder="e.g., Riemannian Tensor Invariance"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-slate-400 font-semibold uppercase">Node Type</label>
                <select
                  value={nodeType}
                  onChange={(e) => setNodeType(e.target.value as KnowledgeNodeType)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 outline-none focus:border-indigo-500"
                >
                  {Object.values(KnowledgeNodeType).map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-semibold uppercase">Academic Domain</label>
                <select
                  value={domain}
                  onChange={(e) => setDomain(e.target.value as AcademicDepartment)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 outline-none focus:border-indigo-500"
                >
                  {Object.values(AcademicDepartment).map((d) => (
                    <option key={d} value={d}>
                      {d.replace('_', ' ').toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-semibold uppercase">Definitional Proposition</label>
              <textarea
                value={definition}
                onChange={(e) => setDefinition(e.target.value)}
                rows={4}
                placeholder="Axiomatic formulation or definitive description..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-semibold uppercase">Confidence Index ({confidence}%)</label>
              <input
                type="range"
                min="50"
                max="100"
                value={confidence}
                onChange={(e) => setConfidence(Number(e.target.value))}
                className="w-full accent-indigo-500 h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 font-semibold text-white transition-all text-sm shadow-lg shadow-indigo-950/20"
            >
              Index Node ➔
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
