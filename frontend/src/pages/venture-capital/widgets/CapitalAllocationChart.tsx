import React from 'react';

interface CapitalAllocationChartProps {
  fundSizeUsd?: number;
}

export const CapitalAllocationChart: React.FC<CapitalAllocationChartProps> = ({ fundSizeUsd = 100000000 }) => {
  const allocation = [
    { label: 'Initial Check Deployments', percent: 45, amountUsd: fundSizeUsd * 0.45, color: 'bg-indigo-500' },
    { label: 'Follow-On Reserves (Series A/B)', percent: 45, amountUsd: fundSizeUsd * 0.45, color: 'bg-purple-500' },
    { label: 'Contingency & Bridge Buffer', percent: 10, amountUsd: fundSizeUsd * 0.1, color: 'bg-amber-500' },
  ];

  return (
    <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md shadow-xl space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-xl">⚖️</span>
          <h3 className="font-bold text-slate-100">Dynamic Capital Allocation Model</h3>
        </div>
        <div className="text-xs text-indigo-400 font-mono">Total AUM: ${(fundSizeUsd / 1000000).toFixed(0)}M</div>
      </div>

      <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden flex">
        {allocation.map((item, idx) => (
          <div key={idx} className={`${item.color} h-full`} style={{ width: `${item.percent}%` }} />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {allocation.map((item, idx) => (
          <div key={idx} className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-1">
            <div className="flex items-center gap-1.5">
              <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
              <span className="text-xs text-slate-400 font-medium truncate">{item.label}</span>
            </div>
            <div className="text-lg font-black text-slate-200">
              ${(item.amountUsd / 1000000).toFixed(1)}M <span className="text-xs font-normal text-slate-400 font-mono">({item.percent}%)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
