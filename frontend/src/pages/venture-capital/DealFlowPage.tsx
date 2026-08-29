import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ventureCapitalApi } from '../../services/ventureCapitalApi';
import { DealFlowDto, DealStage, StartupCategory } from '@codeforge/shared';

export const DealFlowPage: React.FC = () => {
  const [deals, setDeals] = useState<DealFlowDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  useEffect(() => {
    async function loadDeals() {
      try {
        const data = await ventureCapitalApi.listDeals();
        setDeals(data);
      } catch (err) {
        console.error('Failed to load deals', err);
      } finally {
        setLoading(false);
      }
    }
    loadDeals();
  }, []);

  const stages = [
    { stage: DealStage.INBOX, label: 'Inbox (New)' },
    { stage: DealStage.SCREENING, label: 'Screening' },
    { stage: DealStage.FIRST_CALL, label: 'First Call' },
    { stage: DealStage.DUE_DILIGENCE, label: 'Due Diligence' },
    { stage: DealStage.PARTNER_MEETING, label: 'Partner Meeting' },
    { stage: DealStage.TERM_SHEET, label: 'Term Sheet' },
  ];

  const filteredDeals = selectedCategory === 'ALL'
    ? deals
    : deals.filter((d) => d.category === selectedCategory);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-6">
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Link to="/vc-command-center" className="text-slate-400 hover:text-white">← Overview</Link>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
              Autonomous Deal Flow Pipeline
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">Kanban board tracking sourced startups from discovery to legal close</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-xs rounded-lg px-3 py-1.5 text-slate-200"
          >
            <option value="ALL">All Categories</option>
            <option value={StartupCategory.AI_DEVTOOLS}>AI DevTools</option>
            <option value={StartupCategory.AUTONOMOUS_AGENTS}>Autonomous Agents</option>
            <option value={StartupCategory.CYBERSECURITY_AI}>Cybersecurity AI</option>
            <option value={StartupCategory.ENTERPRISE_INFRA}>Enterprise Infra</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center p-12 text-slate-400">Loading deal flow pipeline...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {stages.map(({ stage, label }) => {
            const stageDeals = filteredDeals.filter((d) => d.stage === stage);
            return (
              <div key={stage} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-slate-800 text-xs font-bold text-slate-300">
                  <span>{label}</span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">{stageDeals.length}</span>
                </div>

                <div className="space-y-3">
                  {stageDeals.map((deal) => (
                    <div key={deal.id} className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800 hover:border-indigo-500/50 transition-all space-y-2 shadow-sm">
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-sm text-slate-200">{deal.startupName}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-500/30">
                          {deal.fitScore}%
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-2">{deal.tagline}</p>
                      <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-900">
                        <span>${(deal.targetRaiseUsd / 1000000).toFixed(1)}M Target</span>
                        <span>${(deal.initialValuationUsd / 1000000).toFixed(0)}M Val</span>
                      </div>
                    </div>
                  ))}
                  {stageDeals.length === 0 && (
                    <div className="text-center py-6 text-[11px] text-slate-600 italic">No deals in stage</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
