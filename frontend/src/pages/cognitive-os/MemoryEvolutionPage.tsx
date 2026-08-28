import React, { useEffect, useState } from 'react';
import { cognitiveOsApi } from '../../services/cognitiveOsApi';
import { MemoryRecordDto, CognitiveMemoryType } from '@codeforge/shared';

export const MemoryEvolutionPage: React.FC = () => {
  const [memories, setMemories] = useState<MemoryRecordDto[]>([]);
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [consolidating, setConsolidating] = useState(false);
  const [consolidationReport, setConsolidationReport] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const type = selectedType === 'ALL' ? undefined : (selectedType as CognitiveMemoryType);
        const data = await cognitiveOsApi.listMemories(type);
        setMemories(data);
      } catch (err) {
        console.error('Failed to load memories', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [selectedType]);

  const handleConsolidate = async () => {
    setConsolidating(true);
    try {
      const res = await cognitiveOsApi.consolidateMemories();
      setConsolidationReport(res);
      const data = await cognitiveOsApi.listMemories();
      setMemories(data);
    } catch (err) {
      console.error('Failed to consolidate memories', err);
    } finally {
      setConsolidating(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Loading Memory Evolution System...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-purple-900/40 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🧬</span>
            <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
              Memory Evolution System
            </h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            5-Tier Cognitive Memory Fabric • Working, Episodic, Semantic, Procedural, & Strategic Layers
          </p>
        </div>
        <button
          onClick={handleConsolidate}
          disabled={consolidating}
          className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-sm rounded-lg shadow-lg shadow-purple-600/30 transition-all"
        >
          {consolidating ? 'Consolidating...' : 'Trigger Ebbinghaus Consolidation'}
        </button>
      </div>

      {/* Consolidation Alert */}
      {consolidationReport && (
        <div className="p-6 rounded-xl bg-purple-950/40 border border-purple-800/60 space-y-2">
          <div className="font-bold text-purple-300">✨ Memory Consolidation Pass Completed</div>
          <div className="text-xs text-slate-300">
            Consolidated {consolidationReport.consolidatedCount} concepts • Pruned {consolidationReport.forgottenCount} decayed nodes • Compression Ratio: {(consolidationReport.compressionRatio * 100).toFixed(0)}%
          </div>
        </div>
      )}

      {/* Memory Tier Filter Tabs */}
      <div className="flex gap-2 border-b border-slate-800 pb-2">
        {['ALL', 'working', 'episodic', 'semantic', 'procedural', 'strategic'].map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${
              selectedType === type
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Memory List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {memories.length === 0 ? (
          <div className="col-span-full p-8 text-center text-slate-500 bg-slate-900/40 rounded-xl border border-slate-800">
            No memories found in this tier. Store or synthesize new concepts.
          </div>
        ) : (
          memories.map((m) => (
            <div key={m.id} className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="flex justify-between items-center">
                <span className="px-2 py-1 bg-purple-950/80 border border-purple-700/60 text-purple-300 font-mono text-xs rounded uppercase">
                  {m.memoryType}
                </span>
                <span className="text-xs text-slate-500 font-mono">Weight: {m.importanceWeight}</span>
              </div>
              <div className="font-bold text-slate-200 text-sm">{m.conceptKey}</div>
              <p className="text-xs text-slate-400 line-clamp-3">{m.content}</p>
              <div className="text-xs text-slate-500 pt-2 border-t border-slate-800/80 flex justify-between">
                <span>Accesses: {m.accessCount}</span>
                <span>Decay: {m.decayRate}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
