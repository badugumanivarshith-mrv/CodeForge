import React, { useState, useEffect } from 'react';
import { DigitalTwinDto, SimulationScenarioDto, DigitalTwinType } from '@codeforge/shared';
import { globalEcosystemApi } from '../../services/globalEcosystemApi';

export const DigitalTwinPage: React.FC = () => {
  const [twins, setTwins] = useState<DigitalTwinDto[]>([]);
  const [selectedTwin, setSelectedTwin] = useState<DigitalTwinDto | null>(null);
  const [scenarioTitle, setScenarioTitle] = useState('Enterprise AI Scale-out Q3');
  const [simulationResult, setSimulationResult] = useState<SimulationScenarioDto | null>(null);
  const [simulating, setSimulating] = useState(false);

  useEffect(() => {
    loadTwins();
  }, []);

  const loadTwins = async () => {
    try {
      let data = await globalEcosystemApi.listTwins();
      if (data.length === 0) {
        // Create initial default twins
        const t1 = await globalEcosystemApi.createTwin({
          entityId: 'ent-enterprise-twin',
          twinType: DigitalTwinType.ENTERPRISE_TWIN,
          name: 'Enterprise Core Digital Twin',
          stateSnapshot: { activeAgents: 32, monthlyRunRateUsd: 18000, pipelineThroughputRps: 450 },
          behavioralModel: { scalingFactor: 1.4, elasticity: 0.95 },
        });
        const t2 = await globalEcosystemApi.createTwin({
          entityId: 'ent-career-twin',
          twinType: DigitalTwinType.CAREER_TWIN,
          name: 'Principal Engineer Career Twin',
          stateSnapshot: { currentSkills: ['Rust', 'Go', 'Distributed Systems'], targetRole: 'VP of AI Engineering' },
          behavioralModel: { learningVelocity: 1.25 },
        });
        data = [t1, t2];
      }
      setTwins(data);
      if (data.length > 0 && !selectedTwin) {
        setSelectedTwin(data[0]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSimulate = async () => {
    if (!selectedTwin) return;
    setSimulating(true);
    try {
      const res = await globalEcosystemApi.runSimulation(selectedTwin.id, scenarioTitle, {
        targetGrowth: '2.5x',
        additionalAgentAllocation: 16,
      });
      setSimulationResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setSimulating(false);
    }
  };

  return (
    <div style={{ padding: '28px', color: '#f8fafc', background: '#0b0f19', minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, margin: 0, background: 'linear-gradient(135deg, #38bdf8, #34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Digital Twin Ecosystem & Predictive Simulation
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '14px', margin: '4px 0 0 0' }}>
            High-fidelity state mirrors, Monte Carlo trajectory forecasts, and autonomous scenario optimization
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
        {/* Twins List */}
        <div style={{ background: '#131b2e', border: '1px solid #1e293b', borderRadius: '14px', padding: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 16px 0', color: '#f1f5f9' }}>
            Active Digital Twins ({twins.length})
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {twins.map(t => (
              <div
                key={t.id}
                onClick={() => {
                  setSelectedTwin(t);
                  setSimulationResult(null);
                }}
                style={{
                  padding: '16px',
                  background: selectedTwin?.id === t.id ? '#1e293b' : '#0b1120',
                  border: selectedTwin?.id === t.id ? '1px solid #34d399' : '1px solid #1e293b',
                  borderRadius: '10px',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', background: 'rgba(52, 211, 153, 0.15)', color: '#34d399', fontWeight: 600 }}>
                    {t.twinType}
                  </span>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>Accuracy: {t.accuracyRating}%</span>
                </div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#f8fafc' }}>{t.name}</div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Entity ID: {t.entityId}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Twin Simulation Studio */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {selectedTwin && (
            <div style={{ background: '#131b2e', border: '1px solid #1e293b', borderRadius: '14px', padding: '24px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 16px 0', color: '#f1f5f9' }}>
                Simulation Sandbox: {selectedTwin.name}
              </h2>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                <input
                  type="text"
                  value={scenarioTitle}
                  onChange={e => setScenarioTitle(e.target.value)}
                  placeholder="Enter scenario name..."
                  style={{ flex: 1, padding: '10px', background: '#0b1120', border: '1px solid #1e293b', borderRadius: '8px', color: '#f1f5f9', fontSize: '13px' }}
                />
                <button
                  onClick={handleSimulate}
                  disabled={simulating}
                  style={{ padding: '10px 20px', background: '#34d399', border: 'none', borderRadius: '8px', color: '#0f172a', fontWeight: 700, cursor: 'pointer', fontSize: '13px' }}
                >
                  {simulating ? 'Simulating...' : 'Execute Predictive Simulation'}
                </button>
              </div>

              {/* Simulation Result */}
              {simulationResult && (
                <div style={{ background: '#0b1120', border: '1px solid #1e293b', borderRadius: '10px', padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: '#38bdf8' }}>
                      Trajectory Forecast: {simulationResult.scenarioTitle}
                    </h3>
                    <span style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '6px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', fontWeight: 600 }}>
                      Risk Index: {simulationResult.riskScore}%
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                    {simulationResult.simulatedOutcomes.map((out, idx) => (
                      <div key={idx} style={{ padding: '12px', background: '#131b2e', border: '1px solid #1e293b', borderRadius: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span style={{ fontSize: '13px', fontWeight: 600, color: '#f8fafc' }}>{out.milestone}</span>
                          <span style={{ fontSize: '12px', fontWeight: 700, color: '#34d399' }}>{(out.probability * 100).toFixed(0)}% Probability</span>
                        </div>
                        <div style={{ fontSize: '12px', color: '#94a3b8' }}>{out.expectedImpact}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ fontSize: '12px', color: '#64748b', borderTop: '1px solid #1e293b', paddingTop: '8px' }}>
                    Confidence Interval: {simulationResult.confidenceInterval.min}% – {simulationResult.confidenceInterval.max}%
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
