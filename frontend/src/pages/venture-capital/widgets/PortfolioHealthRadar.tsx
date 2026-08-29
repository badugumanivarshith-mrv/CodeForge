import React from 'react';
import { PortfolioIntelligenceDto } from '@codeforge/shared';

interface PortfolioHealthRadarProps {
  intelligence: PortfolioIntelligenceDto | null;
}

export const PortfolioHealthRadar: React.FC<PortfolioHealthRadarProps> = ({ intelligence }) => {
  return (
    <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md shadow-xl space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-xl">🎯</span>
          <h3 className="font-bold text-slate-100">Portfolio Health & Risk Radar</h3>
        </div>
        <div className="text-xs text-emerald-400 font-mono">
          Health Score: {intelligence?.portfolioHealthScore || 93.0}/100
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-lg bg-slate-950/70 border border-slate-800/80 space-y-1">
          <span className="text-xs text-slate-400">Sharpe Ratio</span>
          <div className="text-2xl font-black text-indigo-400">{intelligence?.sharpeRatio || 2.85}</div>
          <span className="text-[10px] text-slate-500">Benchmark: &gt;2.0 Exceptional</span>
        </div>
        <div className="p-4 rounded-lg bg-slate-950/70 border border-slate-800/80 space-y-1">
          <span className="text-xs text-slate-400">Sortino Ratio</span>
          <div className="text-2xl font-black text-purple-400">{intelligence?.sortinoRatio || 3.42}</div>
          <span className="text-[10px] text-slate-500">Downside Volatility Shield</span>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Top Outlier Holdings</h4>
        <div className="space-y-2">
          {(intelligence?.topPerformers || [
            { startupName: 'AgentForge Studio', moic: 2.8, irr: 44.2 },
            { startupName: 'NeuroMatrix AI', moic: 2.1, irr: 36.8 },
          ]).map((p, idx) => (
            <div key={idx} className="flex justify-between items-center p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/50 text-xs">
              <span className="font-semibold text-slate-200">{p.startupName}</span>
              <div className="flex gap-3 text-slate-400 font-mono">
                <span className="text-emerald-400 font-bold">{p.moic}x MOIC</span>
                <span>{p.irr}% IRR</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
