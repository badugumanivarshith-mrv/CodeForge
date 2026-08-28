import React, { useState, useEffect } from 'react';
import {
  MemoryFabricRecordDto,
  MemoryFabricType,
} from '@codeforge/shared';
import { agentCloudApi } from '../../services/agentCloudApi';

export const MemoryFabricPage: React.FC = () => {
  const [memories, setMemories] = useState<MemoryFabricRecordDto[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<MemoryFabricType>(MemoryFabricType.CROSS_AGENT);
  const [key, setKey] = useState('');
  const [content, setContent] = useState('');
  const [importance, setImportance] = useState(1.0);

  useEffect(() => {
    loadMemories();
  }, []);

  const loadMemories = async () => {
    try {
      const results = await agentCloudApi.searchMemory('', undefined);
      if (results.length === 0) {
        // Create initial starter persistent memories
        const m1 = await agentCloudApi.storeMemory({
          memoryType: MemoryFabricType.ORGANIZATIONAL,
          key: 'enterprise_code_standards',
          content: 'Strict TypeScript typing, Drizzle ORM repository patterns, and 100% test coverage mandatory',
          importance: 1.8,
        });
        const m2 = await agentCloudApi.storeMemory({
          memoryType: MemoryFabricType.CROSS_AGENT,
          key: 'active_pipeline_context',
          content: 'Carrier OS, Agentic Workspace and Autonomous Agent Cloud pipelines interconnected with shared event bus',
          importance: 1.5,
        });
        setMemories([m1, m2]);
      } else {
        setMemories(results);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const results = await agentCloudApi.searchMemory(searchQuery, selectedType);
      setMemories(results);
    } catch (err) {
      console.error(err);
    }
  };

  const handleStore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!key || !content) return;
    try {
      const stored = await agentCloudApi.storeMemory({
        memoryType: selectedType,
        key,
        content,
        importance,
      });
      setMemories([stored, ...memories]);
      setKey('');
      setContent('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 p-6 lg:p-10 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-violet-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
              Memory Fabric 2.0
            </h1>
            <p className="text-sm text-slate-400">Cross-agent vector memory store, organizational recall, semantic search & episodic archives</p>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Memory Storing Form */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Ingest Memory Fabric Record</h2>
            <form onSubmit={handleStore} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Memory Key / Symbol</label>
                <input
                  type="text"
                  required
                  value={key}
                  onChange={e => setKey(e.target.value)}
                  placeholder="e.g. system_architecture_heuristics"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white font-mono focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Memory Type</label>
                <select
                  value={selectedType}
                  onChange={e => setSelectedType(e.target.value as MemoryFabricType)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-violet-500"
                >
                  {Object.values(MemoryFabricType).map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Content / Vector Embedding Context</label>
                <textarea
                  rows={4}
                  required
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder="Detailed factual or procedural knowledge for cross-agent recall..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>Importance Weight</span>
                  <span className="font-mono text-violet-400">{importance.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={importance}
                  onChange={e => setImportance(Number(e.target.value))}
                  className="w-full accent-violet-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-xs font-semibold transition shadow-md shadow-violet-600/30"
              >
                + Commit into Memory Fabric
              </button>
            </form>
          </div>
        </div>

        {/* Semantic Search & Memory Records */}
        <div className="lg:col-span-2 space-y-6">
          {/* Search Bar */}
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-4">
            <form onSubmit={handleSearch} className="flex gap-3">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Semantic query or keyword recall..."
                className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-violet-500"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold rounded-xl transition shadow-md shadow-violet-600/20"
              >
                🔍 Recall
              </button>
            </form>
          </div>

          {/* Memory Records List */}
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4 flex items-center justify-between">
              <span>Indexed Memory Records ({memories.length})</span>
              <span className="text-xs text-violet-400 font-mono">Vector Indexed</span>
            </h3>

            <div className="space-y-4">
              {memories.map(mem => (
                <div key={mem.id} className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl hover:border-slate-700 transition">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <span className="font-semibold text-violet-300 text-sm font-mono">{mem.key}</span>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-violet-500/20 text-violet-300 font-mono">
                        {mem.memoryType}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Weight: <strong className="text-white">{mem.importance}x</strong>
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed mb-3">{mem.content}</p>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800/80">
                    <span>Access Count: <strong className="text-slate-300">{mem.accessCount}</strong></span>
                    <span>Last Recalled: <strong className="text-slate-400">{new Date(mem.lastAccessedAt).toLocaleTimeString()}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
