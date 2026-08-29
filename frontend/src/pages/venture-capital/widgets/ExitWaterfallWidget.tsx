import React from 'react';
import { ExitSimulationDto } from '@codeforge/shared';

interface ExitWaterfallWidgetProps {
  exits: ExitSimulationDto[];
}

export const ExitWaterfallWidget: React.FC<ExitWaterfallWidgetProps> = ({ exits }) => {
  const primaryExit = exits[0];

  return (
    <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md shadow-xl space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-xl">🏆</span>
          <h3 className="font-bold text-slate-100">Exit Liquidity & Proceeds Waterfall</h3>
        </div>
        <div className="text-xs text-amber-400 font-mono">
          Simulated Val: ${(primaryExit?.simulatedExitValuationUsd / 1000000 || 180).toFixed(0)}M
        </div>
      </div>

      {primaryExit && (
        <div className="p-4 rounded-lg bg-slate-950/70 border border-slate-800/80 space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-bold text-slate-200 text-sm">{primaryExit.startupName}</h4>
              <div className="text-xs text-slate-400">Exit Type: {primaryExit.exitType} • Acquirer: {primaryExit.targetAcquirerOrExchange}</div>
            </div>
            <div className="text-right font-mono">
              <div className="text-emerald-400 font-bold text-sm">{(primaryExit.fundReturnMultiple || 13.3)}x Return</div>
              <div className="text-xs text-slate-400">${(primaryExit.expectedProceedsUsd / 1000000 || 33.3).toFixed(1)}M Net Proceeds</div>
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-800/60">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Waterfall Distribution Tiers</div>
            {(primaryExit.waterfallSummary || []).map((tier, idx) => (
              <div key={idx} className="flex justify-between items-center text-xs py-1 px-2 rounded bg-slate-900/50">
                <span className="text-slate-300">{tier.tier}</span>
                <span className="font-mono text-slate-400">${(tier.amountUsd / 1000000).toFixed(2)}M ({tier.percentage}%)</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
