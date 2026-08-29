import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ventureCapitalApi } from '../../services/ventureCapitalApi';
import { LpProfileDto } from '@codeforge/shared';

export const InvestorNetworkPage: React.FC = () => {
  const [lps, setLps] = useState<LpProfileDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLps() {
      try {
        const data = await ventureCapitalApi.listLpProfiles();
        setLps(data);
      } catch (err) {
        console.error('Failed to load LP profiles', err);
      } finally {
        setLoading(false);
      }
    }
    loadLps();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Loading LP Investor Network...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-6">
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Link to="/vc-command-center" className="text-slate-400 hover:text-white">← Overview</Link>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
              Investor Network & LP Syndicates
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">Limited partner management, co-investment matchmaking, and syndicate syndication</p>
        </div>

        <button className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md">
          + Form New Syndicate Group
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lps.map((lp) => (
          <div key={lp.id} className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-sm text-slate-200">{lp.lpName}</h4>
                <span className="text-[11px] text-slate-400 uppercase tracking-wider">{lp.lpType}</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono text-xs border border-emerald-500/30">
                Health: {lp.relationshipHealth}%
              </span>
            </div>

            <div className="space-y-1 text-xs text-slate-300">
              <div className="flex justify-between text-slate-400">
                <span>Committed Capital:</span>
                <span className="font-mono text-indigo-400 font-bold">${(lp.committedTotalUsd / 1000000).toFixed(0)}M</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Co-Investment Appetite:</span>
                <span className="text-emerald-400">{lp.coInvestmentAppetite ? 'ACTIVE' : 'PASSIVE'}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex flex-wrap gap-1.5">
              {lp.preferredSectors.map((sec, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-medium">
                  {sec}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
