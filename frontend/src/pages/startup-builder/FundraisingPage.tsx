import React, { useEffect, useState } from 'react';
import { startupBuilderApi } from '../../services/startupBuilderApi';
import { StartupDto, StartupFundingStage } from '@codeforge/shared';

export const FundraisingPage: React.FC = () => {
  const [startups, setStartups] = useState<StartupDto[]>([]);
  const [selectedStartupId, setSelectedStartupId] = useState('');
  const [readiness, setReadiness] = useState<any | null>(null);
  const [matchedInvestors, setMatchedInvestors] = useState<any[]>([]);

  // Simulation form
  const [stage, setStage] = useState<StartupFundingStage>(StartupFundingStage.SEED);
  const [targetRaise, setTargetRaise] = useState(2000000);
  const [preMoneyValuation, setPreMoneyValuation] = useState(10000000);
  const [simulationResult, setSimulationResult] = useState<any | null>(null);
  const [simulating, setSimulating] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const list = await startupBuilderApi.listStartups();
      setStartups(list);
      if (list.length > 0) {
        setSelectedStartupId(list[0].id);
        loadFundraisingData(list[0].id);
      }
    } catch (err) {
      console.error('Failed to load startups', err);
    }
  }

  async function loadFundraisingData(id: string) {
    try {
      const [rd, inv] = await Promise.all([
        startupBuilderApi.getFundraisingReadiness(id),
        startupBuilderApi.getMatchedInvestors(id),
      ]);
      setReadiness(rd);
      setMatchedInvestors(inv.matchedInvestors);
      handleSimulate(stage, targetRaise, preMoneyValuation, id);
    } catch (err) {
      console.error('Failed to load fundraising data', err);
    }
  }

  async function handleSimulate(st: StartupFundingStage, raise: number, preMoney: number, id?: string) {
    setSimulating(true);
    try {
      const res = await startupBuilderApi.simulateFunding({
        startupId: id || selectedStartupId,
        stage: st,
        targetRaiseUsd: raise,
        preMoneyValuationUsd: preMoney,
      });
      setSimulationResult(res);
    } catch (err) {
      console.error('Failed to simulate funding', err);
    } finally {
      setSimulating(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-rose-900/40 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-3xl">💰</span>
            <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-rose-400 via-pink-400 to-amber-400">
              Fundraising & Institutional Investor Intelligence
            </h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Readiness Scoring • Investor Matching Matrix • Pitch Deck Intelligence • Cap Table & Dilution Simulator
          </p>
        </div>
        <div>
          <select
            value={selectedStartupId}
            onChange={(e) => {
              setSelectedStartupId(e.target.value);
              loadFundraisingData(e.target.value);
            }}
            className="px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-rose-500"
          >
            {startups.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.stage})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Readiness & Pitch Highlights */}
      {readiness && (
        <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-rose-400">Fundraising Readiness Score</div>
              <div className="text-3xl font-black text-slate-100 mt-1">{readiness.readinessScore}% — {readiness.readinessTier}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-400">Recommended Target Raise</div>
              <div className="text-2xl font-black text-emerald-400">${(readiness.recommendedRoundSizeUsd / 1000000).toFixed(1)}M</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Key Institutional Strengths</div>
              <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
                {readiness.keyStrengths.map((str: string, i: number) => (
                  <li key={i}>{str}</li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Investor Pitch Deck Highlights</div>
              <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
                {readiness.pitchHighlights.map((hl: string, i: number) => (
                  <li key={i}>{hl}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Cap Table Simulator & Matched Investors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Simulator Card */}
        <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-5">
          <h2 className="font-bold text-slate-200 text-base">Venture Cap Table & Dilution Simulator</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Round Stage
              </label>
              <select
                value={stage}
                onChange={(e) => {
                  const s = e.target.value as StartupFundingStage;
                  setStage(s);
                  handleSimulate(s, targetRaise, preMoneyValuation);
                }}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-sm focus:outline-none focus:border-rose-500"
              >
                {Object.values(StartupFundingStage).map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Target Raise ($)
                </label>
                <input
                  type="number"
                  value={targetRaise}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setTargetRaise(v);
                    handleSimulate(stage, v, preMoneyValuation);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-sm focus:outline-none focus:border-rose-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Pre-Money Valuation ($)
                </label>
                <input
                  type="number"
                  value={preMoneyValuation}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setPreMoneyValuation(v);
                    handleSimulate(stage, targetRaise, v);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-sm focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <button
              type="button"
              disabled={simulating}
              onClick={() => handleSimulate(stage, targetRaise, preMoneyValuation)}
              className="w-full py-2 rounded-lg bg-rose-600/80 hover:bg-rose-600 text-white font-bold text-xs transition-all"
            >
              {simulating ? 'Calculating Cap Table...' : '⚡ Recalculate Dilution'}
            </button>

            {simulationResult && (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 pt-4">
                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="p-2 rounded bg-slate-900/80">
                    <div className="text-slate-500 text-[10px] uppercase">Post-Money Valuation</div>
                    <div className="font-bold text-emerald-400">${(simulationResult.postMoneyValuationUsd / 1000000).toFixed(1)}M</div>
                  </div>
                  <div className="p-2 rounded bg-slate-900/80">
                    <div className="text-slate-500 text-[10px] uppercase">Investor Dilution</div>
                    <div className="font-bold text-rose-400">{simulationResult.investorEquityPercent}%</div>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <div className="text-xs font-bold uppercase text-slate-400">Post-Round Ownership Structure</div>
                  {simulationResult.capTableSummary.map((item: any, i: number) => (
                    <div key={i} className="flex justify-between items-center text-xs text-slate-300">
                      <span>{item.stakeholder}</span>
                      <span className="font-mono text-indigo-400">{item.ownershipPercent}% (${(item.equityValueUsd / 1000000).toFixed(1)}M)</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Matched Investors Card */}
        <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h2 className="font-bold text-slate-200 text-base">Matched Institutional Investors ({matchedInvestors.length})</h2>
          <div className="space-y-3">
            {matchedInvestors.map((inv, i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-200 text-sm">{inv.investorName}</span>
                  <span className="px-2.5 py-0.5 rounded text-xs font-mono bg-rose-950 text-rose-300 border border-rose-500/30">
                    {inv.matchConfidencePercent}% Match
                  </span>
                </div>
                <p className="text-xs text-slate-400">{inv.investmentThesis}</p>
                <div className="flex justify-between items-center text-xs text-slate-500 pt-1">
                  <span>Check Size: ${(inv.sweetSpotCheckSizeUsd / 1000000).toFixed(1)}M</span>
                  <span>Portfolio: {inv.portfolioCompanyCount} companies</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
