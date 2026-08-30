import React from 'react';
import { DiscoveryDto } from '@codeforge/shared';

interface Props {
  discoveries: DiscoveryDto[];
}

export const DiscoveryBreakthroughRadar: React.FC<Props> = ({ discoveries }) => {
  // A beautiful visual list representation showing Novelty vs Reproducibility for logged discoveries
  return (
    <div className="w-full h-64 bg-slate-950/40 rounded-xl p-4 border border-slate-900/60 flex flex-col justify-between">
      <div className="space-y-3 overflow-y-auto pr-1 h-52">
        {discoveries.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs">No discoveries seeded. Run simulations to view breakthroughs.</div>
        ) : (
          discoveries.map((disc) => {
            const composite = (disc.noveltyScore + disc.reproducibilityIndex) / 2.0;

            return (
              <div key={disc.id} className="p-3.5 rounded-lg bg-slate-950/50 border border-slate-800 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-100 line-clamp-1">{disc.title}</span>
                  <span className="text-[9px] font-mono font-extrabold text-amber-400">
                    {composite.toFixed(1)}%
                  </span>
                </div>
                {/* Dual Progress bars */}
                <div className="grid grid-cols-2 gap-2 text-[9px] font-mono text-slate-500">
                  <div className="space-y-0.5">
                    <div className="flex justify-between">
                      <span>Novelty</span>
                      <span>{disc.noveltyScore}%</span>
                    </div>
                    <div className="h-1 bg-slate-900 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${disc.noveltyScore}%` }} />
                    </div>
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex justify-between">
                      <span>Reprod.</span>
                      <span>{disc.reproducibilityIndex}%</span>
                    </div>
                    <div className="h-1 bg-slate-900 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: `${disc.reproducibilityIndex}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      <div className="text-[10px] text-slate-600 font-mono text-center pt-2 border-t border-slate-900/60">
        Empirical Verification Index (Threshold &gt; 90%)
      </div>
    </div>
  );
};
