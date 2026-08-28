import React, { useEffect, useState } from 'react';
import { planetaryIntelligenceApi } from '../../services/planetaryIntelligenceApi';
import { ResearchFederationDto } from '@codeforge/shared';

export const ResearchCivilizationPage: React.FC = () => {
  const [federations, setFederations] = useState<ResearchFederationDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const feds = await planetaryIntelligenceApi.listResearchFederations();
        setFederations(feds);
      } catch (err) {
        console.error('Failed to load research federations', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Loading AI Research Civilization...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center space-x-3">
            <span className="text-3xl">🔬</span>
            <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-400">
              AI Research Civilization
            </h1>
          </div>
          <p className="text-slate-400 mt-1">
            Open Science Federations, Cross-Institutional Validation & Collaborative Breakthroughs
          </p>
        </div>
      </div>

      {/* Federations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {federations.map((fed) => (
          <div key={fed.id} className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-white text-lg">{fed.federationName}</h3>
                <p className="text-xs text-slate-400 mt-1">Focus: {fed.focusArea}</p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 font-semibold">
                {fed.status?.toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800/80 text-center">
              <div>
                <div className="text-xs text-slate-400">Lead Node</div>
                <div className="text-xs font-semibold text-white mt-0.5">{fed.leadInstitutionId}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400">Collaborations</div>
                <div className="text-xs font-semibold text-cyan-400 mt-0.5">{fed.activeCollaborationsCount}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400">Datasets</div>
                <div className="text-xs font-semibold text-sky-400 mt-0.5">{fed.sharedDatasetsCount}</div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Member Institutions</h4>
              <div className="flex flex-wrap gap-1.5">
                {fed.memberInstitutionIds?.map((inst, i) => (
                  <span key={i} className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg">
                    {inst}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
