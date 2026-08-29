import React, { useEffect, useState } from 'react';
import { enterpriseCivilizationApi } from '../../services/enterpriseCivilizationApi';
import { EconomicSimulationDto, EconomicSimulationScenario } from '@codeforge/shared';

export const EconomicSimulationPage: React.FC = () => {
  const [simulations, setSimulations] = useState<EconomicSimulationDto[]>([]);
  const [scenario, setScenario] = useState<EconomicSimulationScenario>(EconomicSimulationScenario.EQUILIBRIUM);
  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);

  useEffect(() => {
    loadSimulations();
  }, []);

  async function loadSimulations() {
    setLoading(true);
    try {
      const list = await enterpriseCivilizationApi.listEconomicSimulations();
      setSimulations(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleRunSimulation(e: React.FormEvent) {
    e.preventDefault();
    setSimulating(true);
    try {
      await enterpriseCivilizationApi.runEconomicSimulation({ scenario });
      await loadSimulations();
    } catch (err) {
      console.error('Failed to run simulation', err);
    } finally {
      setSimulating(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-amber-900/40 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">📊</span>
            <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-400">
              Economic Simulation Engine
            </h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Macro-Market Shock Testing • Supply & Demand Forecasting • Dynamic Inflation & Talent Tightness Models
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Trigger Simulation */}
        <div className="space-y-6">
          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md">
            <h2 className="font-bold text-base text-amber-300 mb-4">Trigger Macro Shock Simulation</h2>
            <form onSubmit={handleRunSimulation} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Simulation Scenario
                </label>
                <select
                  value={scenario}
                  onChange={(e) => setScenario(e.target.value as EconomicSimulationScenario)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm focus:outline-none focus:border-amber-500"
                >
                  {Object.values(EconomicSimulationScenario).map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-4 rounded-lg bg-slate-950/80 border border-slate-800 text-xs text-slate-400 space-y-1">
                <div className="font-bold text-slate-300">Scenario Context:</div>
                <p>
                  Tests enterprise resilience, talent supply buffers, and automated wage-token stabilization under macro conditions.
                </p>
              </div>

              <button
                type="submit"
                disabled={simulating}
                className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 font-semibold text-sm rounded-lg transition-colors text-white shadow-lg shadow-amber-600/30"
              >
                {simulating ? 'Computing Equilibrium Mesh...' : 'Run Simulation Scenario ➔'}
              </button>
            </form>
          </div>
        </div>

        {/* Center & Right: Simulation Runs Ledger */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-md space-y-4">
            <h2 className="font-bold text-base text-slate-200">Simulation Run Telemetry ({simulations.length})</h2>
            {loading ? (
              <div className="text-xs text-slate-500">Loading simulations...</div>
            ) : (
              <div className="space-y-3">
                {simulations.map((sim) => (
                  <div
                    key={sim.id}
                    className="p-5 rounded-lg bg-slate-950/60 border border-slate-800 space-y-3"
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                      <div>
                        <span className="text-base font-bold text-amber-300">{sim.scenario}</span>
                        <span className="text-xs text-slate-400 ml-2 font-mono">
                          Stress Score: {sim.stressTestScore}%
                        </span>
                      </div>
                      <span className="px-2.5 py-1 rounded bg-amber-950 text-amber-400 font-mono text-xs border border-amber-800/40">
                        Growth: +{sim.projectedMarketGrowthRate}%
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 bg-slate-900/50 p-3 rounded border border-slate-800">
                      {sim.simulatedShockImpactSummary}
                    </p>

                    <div className="grid grid-cols-3 gap-3 pt-2 text-center text-xs">
                      <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                        <div className="text-slate-400">Inflation Pressure</div>
                        <div className="text-sm font-bold text-amber-400 mt-0.5">{sim.inflationPressureIndex}%</div>
                      </div>
                      <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                        <div className="text-slate-400">Talent Tightness</div>
                        <div className="text-sm font-bold text-orange-400 mt-0.5">{sim.talentMarketTightnessIndex} / 10</div>
                      </div>
                      <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                        <div className="text-slate-400">Liquidity Index</div>
                        <div className="text-sm font-bold text-emerald-400 mt-0.5">{sim.liquidityAvailabilityIndex} / 10</div>
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
