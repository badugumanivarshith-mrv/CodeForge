import React, { useEffect, useState } from 'react';
import { enterpriseCivilizationApi } from '../../services/enterpriseCivilizationApi';
import { InvestmentRecordDto } from '@codeforge/shared';

export const InvestmentIntelligencePage: React.FC = () => {
  const [investments, setInvestments] = useState<InvestmentRecordDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  // Form state
  const [round, setRound] = useState('Series A');
  const [targetUsd, setTargetUsd] = useState(10000000);
  const [committedUsd, setCommittedUsd] = useState(7500000);
  const [valuationUsd, setValuationUsd] = useState(50000000);
  const [investor, setInvestor] = useState('CodeForge Sovereign AI Fund');
  const [pitch, setPitch] = useState('');

  useEffect(() => {
    loadInvestments();
  }, []);

  async function loadInvestments() {
    setLoading(true);
    try {
      const list = await enterpriseCivilizationApi.listInvestments();
      setInvestments(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleRecord(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    try {
      await enterpriseCivilizationApi.createInvestment({
        fundingRound: round,
        targetAmountUsd: Number(targetUsd),
        committedAmountUsd: Number(committedUsd),
        preMoneyValuationUsd: Number(valuationUsd),
        leadInvestorEntity: investor,
        investorPitchDeckSummary: pitch || 'Sovereign venture investment round for high-growth autonomous intelligence platform.',
      });
      setPitch('');
      await loadInvestments();
    } catch (err) {
      console.error('Failed to record investment', err);
    } finally {
      setCreating(false);
    }
  }

  const totalCapital = investments.reduce((acc, i) => acc + i.committedAmountUsd, 0) || 7500000;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-emerald-900/40 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">💰</span>
            <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400">
              Capital & Investment Intelligence
            </h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Funding Readiness Scoring • Sovereign Venture Portfolios • Term Sheet Synthesis & Automated Cap Tables
          </p>
        </div>
        <div className="px-4 py-2 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 font-mono text-sm">
          Total Committed: ${(totalCapital / 1000000).toFixed(1)}M
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Investment Form */}
        <div className="space-y-6">
          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
            <h2 className="font-bold text-base text-emerald-300 mb-4">Record Sovereign Investment</h2>
            <form onSubmit={handleRecord} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Funding Round Name
                </label>
                <input
                  type="text"
                  value={round}
                  onChange={(e) => setRound(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Target Raise (USD)
                </label>
                <input
                  type="number"
                  value={targetUsd}
                  onChange={(e) => setTargetUsd(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Committed Capital (USD)
                </label>
                <input
                  type="number"
                  value={committedUsd}
                  onChange={(e) => setCommittedUsd(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Pre-Money Valuation (USD)
                </label>
                <input
                  type="number"
                  value={valuationUsd}
                  onChange={(e) => setValuationUsd(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Lead Investor Entity
                </label>
                <input
                  type="text"
                  value={investor}
                  onChange={(e) => setInvestor(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Deck / Thesis Summary
                </label>
                <textarea
                  value={pitch}
                  onChange={(e) => setPitch(e.target.value)}
                  placeholder="e.g. Series A round to fund cross-continental autonomous agent execution grid."
                  rows={2}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                disabled={creating}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 font-semibold text-sm rounded-lg transition-colors text-white shadow-lg shadow-emerald-600/30"
              >
                {creating ? 'Recording Round...' : 'Commit Investment Record ➔'}
              </button>
            </form>
          </div>
        </div>

        {/* Center & Right: Investments Ledger */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md space-y-4">
            <h2 className="font-bold text-base text-slate-200">Sovereign Investment Rounds ({investments.length})</h2>
            {loading ? (
              <div className="text-xs text-slate-500">Loading investment rounds...</div>
            ) : (
              <div className="space-y-3">
                {investments.map((inv) => (
                  <div
                    key={inv.id}
                    className="p-5 rounded-lg bg-slate-950/60 border border-slate-800 space-y-3"
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                      <div>
                        <span className="text-base font-bold text-emerald-300">{inv.fundingRound}</span>
                        <span className="text-xs text-slate-400 ml-2 font-mono">Lead: {inv.leadInvestorEntity}</span>
                      </div>
                      <span className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-400 font-mono text-xs border border-emerald-800/40">
                        Tier: {inv.readinessTier}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300">{inv.investorPitchDeckSummary}</p>

                    <div className="grid grid-cols-3 gap-3 pt-2 text-center text-xs">
                      <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                        <div className="text-slate-400">Target</div>
                        <div className="text-sm font-bold text-slate-200 mt-0.5">
                          ${(inv.targetAmountUsd / 1000000).toFixed(1)}M
                        </div>
                      </div>
                      <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                        <div className="text-slate-400">Committed</div>
                        <div className="text-sm font-bold text-emerald-400 mt-0.5">
                          ${(inv.committedAmountUsd / 1000000).toFixed(1)}M
                        </div>
                      </div>
                      <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                        <div className="text-slate-400">Pre-Money Valuation</div>
                        <div className="text-sm font-bold text-teal-400 mt-0.5">
                          ${(inv.preMoneyValuationUsd / 1000000).toFixed(1)}M
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
