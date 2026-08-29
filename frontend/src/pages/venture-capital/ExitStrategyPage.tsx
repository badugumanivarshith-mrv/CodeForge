import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ventureCapitalApi } from '../../services/ventureCapitalApi';
import { ExitSimulationDto } from '@codeforge/shared';
import { ExitWaterfallWidget } from './widgets/ExitWaterfallWidget';

export const ExitStrategyPage: React.FC = () => {
  const [exits, setExits] = useState<ExitSimulationDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadExits() {
      try {
        const data = await ventureCapitalApi.getExitSimulations('fund-1');
        setExits(data);
      } catch (err) {
        console.error('Failed to load exit simulations', err);
      } finally {
        setLoading(false);
      }
    }
    loadExits();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Simulating venture exit paths and waterfalls...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-6">
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Link to="/vc-command-center" className="text-slate-400 hover:text-white">← Overview</Link>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-pink-400">
              Autonomous Exit Strategy & Liquidity Engine
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">IPO projections, strategic M&A acquirer matching, and GP/LP proceeds waterfalls</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExitWaterfallWidget exits={exits} />

        <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md shadow-xl space-y-4">
          <h3 className="font-bold text-slate-100 text-sm">Strategic M&A Candidate Pipeline</h3>
          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800 space-y-1">
              <div className="flex justify-between font-bold text-slate-200">
                <span>OmniCloud Technologies Corp</span>
                <span className="text-emerald-400 font-mono">Fit: 96%</span>
              </div>
              <p className="text-slate-400">Target Range: $120M - $250M • Synergy: Formal Compiler Verifier</p>
            </div>
            <div className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800 space-y-1">
              <div className="flex justify-between font-bold text-slate-200">
                <span>HyperScale Enterprise Systems</span>
                <span className="text-indigo-400 font-mono">Fit: 92.5%</span>
              </div>
              <p className="text-slate-400">Target Range: $90M - $190M • Synergy: SOC2 & Compliance Telemetry</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
