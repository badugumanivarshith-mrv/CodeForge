import React from 'react';
import { LaboratoryDto } from '@codeforge/shared';

interface Props {
  lab: LaboratoryDto;
}

export const LabComputeUtilizationWidget: React.FC<Props> = ({ lab }) => {
  // Utilization calculation
  const loadPercentage = Math.min(96.0, 35.0 + (lab.activeSimulationsCount * 8.5));
  const temp = Math.min(85.0, 40.0 + (lab.activeSimulationsCount * 4.5));

  return (
    <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-bold text-slate-100">{lab.name}</h3>
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
            {lab.labType.replace('_', ' ')} • {lab.department.toUpperCase().replace('_', ' ')}
          </span>
        </div>
        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
          lab.status === 'operational'
            ? 'bg-emerald-950/80 border border-emerald-500/30 text-emerald-400'
            : 'bg-amber-950/80 border border-amber-500/30 text-amber-400'
        }`}>
          {lab.status}
        </span>
      </div>

      {/* Progress Bars */}
      <div className="space-y-3">
        <div className="space-y-1">
          <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
            <span>Compute Load ({lab.computeCapacityTeraflops.toLocaleString()} TFLOPS)</span>
            <span>{loadPercentage.toFixed(0)}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-500 rounded-full transition-all duration-500"
              style={{ width: `${loadPercentage}%` }}
            />
          </div>
        </div>

        <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
          <span>Active Simulations: {lab.activeSimulationsCount}</span>
          <span>Core Temp: {temp.toFixed(0)}°C</span>
        </div>
      </div>
    </div>
  );
};
