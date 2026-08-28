import React, { useEffect, useState } from 'react';
import { planetaryIntelligenceApi } from '../../services/planetaryIntelligenceApi';
import { PlanetaryTwinDto, PlanetarySimulationDto } from '@codeforge/shared';

export const PlanetaryTwinPage: React.FC = () => {
  const [twins, setTwins] = useState<PlanetaryTwinDto[]>([]);
  const [selectedTwin, setSelectedTwin] = useState<PlanetaryTwinDto | null>(null);
  const [simulationResult, setSimulationResult] = useState<PlanetarySimulationDto | null>(null);
  const [simulating, setSimulating] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const twinList = await planetaryIntelligenceApi.listTwins();
        setTwins(twinList);
        if (twinList.length > 0) setSelectedTwin(twinList[0]);
      } catch (err) {
        console.error('Failed to load planetary twins', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Loading Planetary Digital Twins...</div>;
  }

  const handleSimulate = async () => {
    if (!selectedTwin) return;
    setSimulating(true);
    try {
      const res = await planetaryIntelligenceApi.simulateTwin(
        selectedTwin.id,
        `Predictive Stress Test (${selectedTwin.entityName})`,
        30,
        { trafficMultiplier: 5.0, failureRateSim: 0.02 }
      );
      setSimulationResult(res);
    } catch (err) {
      console.error('Failed to simulate twin', err);
    } finally {
      setSimulating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center space-x-3">
            <span className="text-3xl">🌐</span>
            <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400">
              Planetary Digital Twins
            </h1>
          </div>
          <p className="text-slate-400 mt-1">
            Macro-Scale Virtual Mirrors for Economy, Education, Workforce, Research & Enterprise Systems
          </p>
        </div>
      </div>

      {/* Twin Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {twins.map((twin) => (
          <button
            key={twin.id}
            onClick={() => {
              setSelectedTwin(twin);
              setSimulationResult(null);
            }}
            className={`p-4 rounded-xl text-left border transition-all ${
              selectedTwin?.id === twin.id
                ? 'bg-emerald-950/60 border-emerald-500 shadow-lg shadow-emerald-950/40'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="text-[10px] uppercase font-bold text-emerald-400">{twin.twinType}</div>
            <div className="font-semibold text-white text-xs mt-1 truncate">{twin.entityName}</div>
            <div className="text-[10px] text-slate-400 mt-1">Fidelity: {twin.fidelityScore}%</div>
          </button>
        ))}
      </div>

      {/* Selected Twin Console */}
      {selectedTwin && (
        <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-white">{selectedTwin.entityName} Console</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Type: {selectedTwin.twinType} • Sync: Every {selectedTwin.syncFrequencySeconds}s
              </p>
            </div>
            <button
              onClick={handleSimulate}
              disabled={simulating}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-emerald-950/60 transition-all flex items-center space-x-2"
            >
              <span>{simulating ? 'Simulating Monte Carlo Matrix...' : '⚡ Run 30-Day Predictive Simulation'}</span>
            </button>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <h3 className="text-xs font-bold text-slate-400 uppercase mb-2">Live Synchronized State Snapshot</h3>
            <pre className="text-xs text-emerald-300 font-mono overflow-x-auto p-2">
              {JSON.stringify(selectedTwin.stateSnapshot, null, 2)}
            </pre>
          </div>

          {/* Simulation Outcome */}
          {simulationResult && (
            <div className="bg-slate-950/90 border border-emerald-800/80 p-5 rounded-xl space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-emerald-300">
                  🎯 Monte Carlo Horizon Outcomes ({simulationResult.horizonDays} Days)
                </h3>
                <span className="text-xs text-emerald-400 font-mono">
                  Confidence: {(simulationResult.monteCarloConfidence * 100).toFixed(1)}%
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {simulationResult.projectedOutcomes?.map((out, idx) => (
                  <div key={idx} className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-xs">
                    <div className="font-semibold text-white">{out.milestone}</div>
                    <div className="text-emerald-400 mt-1 font-bold">{out.impact}</div>
                    <div className="text-[10px] text-slate-400">Probability: {(out.probability * 100).toFixed(0)}%</div>
                  </div>
                ))}
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase mb-1">Optimized Counterfactual Interventions</h4>
                <ul className="text-xs text-slate-300 space-y-1">
                  {simulationResult.optimizedInterventions?.map((inv, idx) => (
                    <li key={idx} className="flex items-center space-x-1.5">
                      <span className="text-emerald-400">✓</span>
                      <span>{inv}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
