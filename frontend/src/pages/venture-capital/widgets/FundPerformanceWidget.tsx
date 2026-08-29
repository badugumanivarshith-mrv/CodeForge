import React from 'react';
import { FundDto } from '@codeforge/shared';

interface FundPerformanceWidgetProps {
  funds: FundDto[];
}

export const FundPerformanceWidget: React.FC<FundPerformanceWidgetProps> = ({ funds }) => {
  return (
    <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md shadow-xl space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-xl">💰</span>
          <h3 className="font-bold text-slate-100">Fund Deployment & Reserves</h3>
        </div>
        <div className="text-xs text-indigo-400 font-mono">Active Funds: {funds.length}</div>
      </div>

      <div className="space-y-4">
        {funds.map((fund) => {
          const deployPercent = Math.min(100, Math.round((fund.deployedCapitalUsd / (fund.targetSizeUsd || 1)) * 100));
          const reservePercent = Math.min(100, Math.round((fund.reserveCapitalUsd / (fund.targetSizeUsd || 1)) * 100));

          return (
            <div key={fund.id} className="p-4 rounded-lg bg-slate-950/70 border border-slate-800/80 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-slate-200 text-sm">{fund.fundName}</h4>
                  <div className="text-xs text-slate-400">Vintage {fund.vintageYear} • Target ${(fund.targetSizeUsd / 1000000).toFixed(0)}M</div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
                  {fund.status}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Deployed: ${(fund.deployedCapitalUsd / 1000000).toFixed(1)}M ({deployPercent}%)</span>
                  <span>Reserves: ${(fund.reserveCapitalUsd / 1000000).toFixed(1)}M ({reservePercent}%)</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden flex">
                  <div className="bg-indigo-500 h-full" style={{ width: `${deployPercent}%` }} />
                  <div className="bg-purple-500 h-full" style={{ width: `${reservePercent}%` }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
