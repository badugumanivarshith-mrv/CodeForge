import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ventureCapitalApi } from '../../services/ventureCapitalApi';
import { PortfolioIntelligenceDto } from '@codeforge/shared';
import { PortfolioHealthRadar } from './widgets/PortfolioHealthRadar';

export const PortfolioIntelligencePage: React.FC = () => {
  const [intel, setIntel] = useState<PortfolioIntelligenceDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await ventureCapitalApi.getPortfolioIntelligence('fund-1');
        setIntel(data);
      } catch (err) {
        console.error('Failed to load portfolio intelligence', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Computing cross-portfolio intelligence telemetry...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-6">
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Link to="/vc-command-center" className="text-slate-400 hover:text-white">← Overview</Link>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-indigo-400">
              Portfolio Intelligence & Risk Analysis
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">Correlation matrices, risk-adjusted returns, and concentration optimization</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PortfolioHealthRadar intelligence={intel} />

        <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md shadow-xl space-y-4">
          <h3 className="font-bold text-slate-100 text-sm">Strategic Intelligence Directives</h3>
          <div className="space-y-3">
            {(intel?.recommendations || []).map((rec, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
                <span className="text-indigo-400 font-bold">0{idx + 1}.</span>
                <span>{rec}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
