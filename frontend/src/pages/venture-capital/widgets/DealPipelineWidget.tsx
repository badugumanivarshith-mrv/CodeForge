import React from 'react';
import { DealFlowDto, DealStage } from '@codeforge/shared';

interface DealPipelineWidgetProps {
  deals: DealFlowDto[];
}

export const DealPipelineWidget: React.FC<DealPipelineWidgetProps> = ({ deals }) => {
  const stages: { stage: DealStage; label: string; color: string }[] = [
    { stage: DealStage.INBOX, label: 'Inbox', color: 'bg-slate-700 text-slate-200' },
    { stage: DealStage.SCREENING, label: 'Screening', color: 'bg-blue-900/60 text-blue-300 border-blue-600/30' },
    { stage: DealStage.FIRST_CALL, label: 'First Call', color: 'bg-cyan-900/60 text-cyan-300 border-cyan-600/30' },
    { stage: DealStage.DUE_DILIGENCE, label: 'Due Diligence', color: 'bg-amber-900/60 text-amber-300 border-amber-600/30' },
    { stage: DealStage.PARTNER_MEETING, label: 'Partner Meeting', color: 'bg-purple-900/60 text-purple-300 border-purple-600/30' },
    { stage: DealStage.TERM_SHEET, label: 'Term Sheet', color: 'bg-emerald-900/60 text-emerald-300 border-emerald-600/30' },
  ];

  return (
    <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md shadow-xl space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-xl">📊</span>
          <h3 className="font-bold text-slate-100">Active Deal Pipeline Kanban</h3>
        </div>
        <div className="text-xs text-slate-400 font-mono">Total Deals: {deals.length}</div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {stages.map(({ stage, label, color }) => {
          const count = deals.filter((d) => d.stage === stage).length;
          return (
            <div key={stage} className={`p-3 rounded-lg border flex flex-col justify-between ${color}`}>
              <span className="text-xs font-semibold uppercase tracking-wider">{label}</span>
              <span className="text-2xl font-black mt-2">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
