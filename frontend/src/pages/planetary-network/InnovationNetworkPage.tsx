import React, { useEffect, useState } from 'react';
import { planetaryIntelligenceApi } from '../../services/planetaryIntelligenceApi';
import { InnovationRecordDto, InnovationRankingDto, InnovationDomain } from '@codeforge/shared';

export const InnovationNetworkPage: React.FC = () => {
  const [innovations, setInnovations] = useState<InnovationRecordDto[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<InnovationDomain>(InnovationDomain.AI_REASONING);
  const [ranking, setRanking] = useState<InnovationRankingDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [invs, rnk] = await Promise.all([
          planetaryIntelligenceApi.listInnovations(selectedDomain),
          planetaryIntelligenceApi.rankInnovations(selectedDomain),
        ]);
        setInnovations(invs);
        setRanking(rnk);
      } catch (err) {
        console.error('Failed to load innovation data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [selectedDomain]);

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Loading Global Innovation Network...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center space-x-3">
            <span className="text-3xl">💡</span>
            <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400">
              Global Innovation Network
            </h1>
          </div>
          <p className="text-slate-400 mt-1">
            Planetary Patent Intelligence, Technology Transfer Radar & Domain Rankings
          </p>
        </div>
      </div>

      {/* Domain Selector */}
      <div className="flex flex-wrap gap-2">
        {Object.values(InnovationDomain).map((dom) => (
          <button
            key={dom}
            onClick={() => setSelectedDomain(dom)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              selectedDomain === dom
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-950/60'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {dom.replace(/_/g, ' ').toUpperCase()}
          </button>
        ))}
      </div>

      {/* Domain Ranking Card */}
      {ranking && (
        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-amber-300">
              ⚡ {selectedDomain.replace(/_/g, ' ').toUpperCase()} Velocity Ranking
            </h2>
            <span className="text-xs bg-amber-950 text-amber-400 px-3 py-1 rounded-full border border-amber-800/60">
              Velocity: {ranking.velocityScore}/100 • Lead: {ranking.leadingRegion}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {ranking.topInnovations?.map((top, idx) => (
              <div key={top.id || idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-1">
                <div className="text-xs font-bold text-amber-400">RANK #{idx + 1}</div>
                <div className="font-semibold text-white text-sm">{top.title}</div>
                <div className="text-xs text-slate-400">Commercial Score: {top.commercialReadinessScore}%</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Innovations List */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-slate-100 mb-4">Breakthrough Innovations Registry</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {innovations.map((inv) => (
            <div key={inv.id} className="bg-slate-950/80 border border-slate-800 p-5 rounded-xl space-y-2">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-white text-base">{inv.title}</h3>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                  {inv.patentStatus?.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/60">
                <span>TRL Level: {inv.technologyMaturityLevel}/9</span>
                <span>Readiness: {inv.commercialReadinessScore}%</span>
                <span>Adoption: {inv.adoptionForecastPercent}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
