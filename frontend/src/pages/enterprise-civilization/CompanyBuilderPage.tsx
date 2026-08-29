import React, { useEffect, useState } from 'react';
import { enterpriseCivilizationApi } from '../../services/enterpriseCivilizationApi';
import { CompanyBlueprintDto } from '@codeforge/shared';

export const CompanyBuilderPage: React.FC = () => {
  const [blueprints, setBlueprints] = useState<CompanyBlueprintDto[]>([]);
  const [selectedBp, setSelectedBp] = useState<CompanyBlueprintDto | null>(null);
  const [businessPlan, setBusinessPlan] = useState<any | null>(null);
  const [, setReadiness] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [market, setMarket] = useState('');
  const [domain, setDomain] = useState('');

  useEffect(() => {
    loadBlueprints();
  }, []);

  async function loadBlueprints() {
    setLoading(true);
    try {
      const list = await enterpriseCivilizationApi.listBlueprints();
      setBlueprints(list);
      if (list.length > 0) {
        selectBlueprint(list[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function selectBlueprint(bp: CompanyBlueprintDto) {
    setSelectedBp(bp);
    try {
      const plan = await enterpriseCivilizationApi.getBusinessPlan(bp.id);
      setBusinessPlan(plan);
      const ready = await enterpriseCivilizationApi.getInvestmentReadiness(bp.id);
      setReadiness(ready);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setGenerating(true);
    try {
      await enterpriseCivilizationApi.createBlueprint({
        companyName: name,
        targetMarket: market || 'Global AI Infrastructure & Enterprise SaaS',
        domainFocus: domain || 'Autonomous AI Workforces & Cognitive Mesh',
      });
      setName('');
      setMarket('');
      setDomain('');
      await loadBlueprints();
    } catch (err) {
      console.error('Failed to generate blueprint', err);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-emerald-900/40 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🚀</span>
            <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400">
              Autonomous Company Builder
            </h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Instant Startup Generation • Business Model Canvas Synthesis • 5-Year ARR Projections & Investment Readiness
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Generator Form & Blueprints List */}
        <div className="space-y-6">
          {/* Generator Box */}
          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
            <h2 className="font-bold text-base text-emerald-300 mb-4">Generate Autonomous Venture</h2>
            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Venture / Company Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Synapse Autonomous Systems"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Target Market Segment
                </label>
                <input
                  type="text"
                  value={market}
                  onChange={(e) => setMarket(e.target.value)}
                  placeholder="e.g. Fortune 500 Enterprise Automation"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Core Domain Focus
                </label>
                <input
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="e.g. Sovereign AI Multi-Agent Networks"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                disabled={generating}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 font-semibold text-sm rounded-lg transition-colors text-white shadow-lg shadow-emerald-600/30"
              >
                {generating ? 'Synthesizing Venture Blueprint...' : 'Generate Venture Blueprint ➔'}
              </button>
            </form>
          </div>

          {/* Blueprints List */}
          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
            <h2 className="font-bold text-base text-slate-200 mb-4">Venture Portfolios ({blueprints.length})</h2>
            {loading ? (
              <div className="text-xs text-slate-500">Loading blueprints...</div>
            ) : (
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {blueprints.map((bp) => (
                  <div
                    key={bp.id}
                    onClick={() => selectBlueprint(bp)}
                    className={`p-4 rounded-lg cursor-pointer border transition-all ${
                      selectedBp?.id === bp.id
                        ? 'bg-emerald-950/40 border-emerald-500 shadow-md shadow-emerald-500/10'
                        : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="font-bold text-sm text-slate-100">{bp.companyName}</div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono border border-emerald-800/40">
                        {bp.stage}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1 line-clamp-1">{bp.tagline}</div>
                    <div className="flex justify-between items-center text-[11px] text-slate-500 mt-3 pt-2 border-t border-slate-900">
                      <span>Tier: {bp.readinessTier}</span>
                      <span className="text-emerald-400 font-mono">${(bp.projectedAnnualRunRateUsd / 1000000).toFixed(1)}M ARR</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Center & Right Columns: Business Model Canvas & Projections */}
        <div className="lg:col-span-2 space-y-6">
          {selectedBp ? (
            <>
              {/* Overview Card */}
              <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md space-y-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                  <div>
                    <h2 className="text-2xl font-bold text-emerald-300">{selectedBp.companyName}</h2>
                    <p className="text-xs text-slate-400 mt-0.5">{selectedBp.tagline}</p>
                  </div>
                  <div className="px-3 py-1 rounded-lg bg-emerald-950/80 text-emerald-400 border border-emerald-800/50 text-xs font-mono">
                    Valuation: ${(selectedBp.projectedAnnualRunRateUsd * 8.5 / 1000000).toFixed(1)}M
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800/80">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Target Market</div>
                    <div className="text-sm font-semibold text-slate-200 mt-1">{selectedBp.targetMarket}</div>
                  </div>
                  <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800/80">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Value Proposition</div>
                    <div className="text-sm font-semibold text-slate-200 mt-1">{selectedBp.valueProposition}</div>
                  </div>
                </div>

                {/* Business Model Canvas Matrix */}
                <div className="p-4 rounded-lg bg-slate-950/80 border border-slate-800 space-y-3">
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Business Model Canvas Synthesis
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 rounded bg-slate-900 border border-slate-800">
                      <div className="text-emerald-400 font-bold mb-1">Key Partners</div>
                      <div className="text-slate-400">{selectedBp.businessModelCanvas?.keyPartners?.join(', ')}</div>
                    </div>
                    <div className="p-3 rounded bg-slate-900 border border-slate-800">
                      <div className="text-teal-400 font-bold mb-1">Key Activities</div>
                      <div className="text-slate-400">{selectedBp.businessModelCanvas?.keyActivities?.join(', ')}</div>
                    </div>
                    <div className="p-3 rounded bg-slate-900 border border-slate-800">
                      <div className="text-cyan-400 font-bold mb-1">Cost Structure</div>
                      <div className="text-slate-400">{selectedBp.businessModelCanvas?.costStructure?.join(', ')}</div>
                    </div>
                    <div className="p-3 rounded bg-slate-900 border border-slate-800">
                      <div className="text-purple-400 font-bold mb-1">Revenue Streams</div>
                      <div className="text-slate-400">{selectedBp.businessModelCanvas?.revenueStreams?.join(', ')}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 5-Year ARR Projections */}
              {businessPlan && (
                <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md space-y-4">
                  <h3 className="font-bold text-base text-slate-200">5-Year ARR Growth Projections</h3>
                  <div className="grid grid-cols-5 gap-3">
                    {businessPlan.projectedFiveYearARR?.map((item: any) => (
                      <div key={item.year} className="p-4 rounded-lg bg-slate-950/60 border border-slate-800 text-center">
                        <div className="text-xs text-slate-400">Year {item.year}</div>
                        <div className="text-lg font-black text-emerald-400 mt-1">
                          ${(item.arrUsd / 1000000).toFixed(1)}M
                        </div>
                        <div className="text-[10px] text-emerald-500 font-mono mt-0.5">+{item.growthRatePercent}%</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="p-12 text-center text-slate-500 rounded-xl bg-slate-900/40 border border-slate-800">
              Select or generate an autonomous startup blueprint to explore business model canvas and forecasts.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
