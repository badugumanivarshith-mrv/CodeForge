import React, { useState } from 'react';
import { platformIntegrationApi } from '../../services/platformIntegrationApi';
import { GlobalSearchResultDto } from '@codeforge/shared';

export const GlobalSearchPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GlobalSearchResultDto[]>([]);
  const [searching, setSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setSearching(true);
    try {
      const data = await platformIntegrationApi.search(query);
      setResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
            Global Search Studio
          </h1>
          <p className="text-slate-400">
            Search cross-module models, active threat vectors, data ingestion sources, and startup milestones instantly.
          </p>
        </div>

        {/* Search Bar Form */}
        <form onSubmit={handleSearch} className="flex gap-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search across venture capitals, vulnerability databases, pipelines, model architectures..."
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-5 py-4 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/80 transition-all font-mono"
          />
          <button
            type="submit"
            disabled={searching}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 rounded-xl transition-all shadow-lg hover:shadow-indigo-500/25 active:scale-[0.98]"
          >
            {searching ? 'Querying...' : 'Search'}
          </button>
        </form>

        {/* Results list */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h2 className="text-xl font-bold text-white mb-6">Search Results ({results.length})</h2>

          {results.length === 0 ? (
            <div className="text-slate-500 font-mono text-center py-8">
              No index records matching query parameter values found.
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((res) => (
                <div
                  key={res.id}
                  className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex justify-between items-center hover:border-indigo-500/30 transition-all duration-200"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold font-mono tracking-wider uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded">
                        {res.type}
                      </span>
                      <h3 className="text-base font-bold text-white">{res.title}</h3>
                    </div>
                    <p className="text-sm text-slate-400 font-mono">{res.subtitle}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-500 font-mono">Match Score</div>
                    <div className="text-lg font-bold text-emerald-400 font-mono">
                      {(res.relevanceScore * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
