import React, { useState, useEffect } from 'react';
import { EcosystemReputationDto, EcosystemLearningMetricDto, CollectiveConsensusDto } from '@codeforge/shared';
import { globalEcosystemApi } from '../../services/globalEcosystemApi';

export const EcosystemAnalyticsPage: React.FC = () => {
  const [reputation, setReputation] = useState<EcosystemReputationDto | null>(null);
  const [learningMetrics, setLearningMetrics] = useState<EcosystemLearningMetricDto[]>([]);
  const [consensus, setConsensus] = useState<CollectiveConsensusDto | null>(null);
  const [optimizing, setOptimizing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [rep, metrics, con] = await Promise.all([
        globalEcosystemApi.getReputation('current-user'),
        globalEcosystemApi.getLearningMetrics(),
        globalEcosystemApi.getConsensus('Multi-Agent Autonomous Optimization'),
      ]);
      setReputation(rep);
      setLearningMetrics(metrics);
      setConsensus(con);
    } catch (err) {
      console.error(err);
    }
  };

  const triggerOptimization = async (moduleName: string) => {
    setOptimizing(true);
    try {
      await globalEcosystemApi.triggerSelfImprovement(moduleName);
      await loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setOptimizing(false);
    }
  };

  return (
    <div style={{ padding: '28px', color: '#f8fafc', background: '#0b0f19', minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, margin: 0, background: 'linear-gradient(135deg, #10b981, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Ecosystem Economy, Reputation & Self-Improvement
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '14px', margin: '4px 0 0 0' }}>
            Reputation scoring, tokenized skill credits, collective consensus synthesis, and autonomous feedback loops
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
        {/* User Reputation & Token Credits */}
        <div style={{ background: '#131b2e', border: '1px solid #1e293b', borderRadius: '14px', padding: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 16px 0', color: '#f1f5f9' }}>
            Ecosystem Reputation & Wallet
          </h2>
          {reputation && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: '#0b1120', border: '1px solid #1e293b', borderRadius: '10px', padding: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>Reputation Standing</div>
                <div style={{ fontSize: '32px', fontWeight: 800, color: '#10b981' }}>{reputation.score} pts</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#38bdf8', marginTop: '4px' }}>{reputation.tier} Tier (Top {reputation.rankPercentile}%)</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ background: '#0b1120', border: '1px solid #1e293b', borderRadius: '8px', padding: '12px' }}>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>Skill Credits</div>
                  <div style={{ fontSize: '20px', fontWeight: 700, color: '#fbbf24' }}>{reputation.skillCreditsBalance} 🪙</div>
                </div>
                <div style={{ background: '#0b1120', border: '1px solid #1e293b', borderRadius: '8px', padding: '12px' }}>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>Contributions</div>
                  <div style={{ fontSize: '20px', fontWeight: 700, color: '#f1f5f9' }}>{reputation.totalContributions}</div>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '8px' }}>Badges Earned</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {reputation.badgesEarned.map((b, i) => (
                    <span key={i} style={{ padding: '4px 10px', borderRadius: '20px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', fontSize: '11px', fontWeight: 600 }}>
                      🎖️ {b}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Self-Improving AI Modules & Consensus */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Self-Improvement Loops */}
          <div style={{ background: '#131b2e', border: '1px solid #1e293b', borderRadius: '14px', padding: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 16px 0', color: '#f1f5f9' }}>
              Self-Improving AI Engine Metrics
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {learningMetrics.map((m, idx) => (
                <div key={idx} style={{ padding: '14px', background: '#0b1120', border: '1px solid #1e293b', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#f8fafc' }}>{m.moduleName}</div>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                      Prompt Version: <span style={{ color: '#38bdf8' }}>{m.selfTunedPromptVersion}</span> | Generation {m.optimizationGenerations}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '15px', fontWeight: 700, color: '#10b981' }}>{m.currentPerformance}%</div>
                      <div style={{ fontSize: '10px', color: '#64748b' }}>Baseline: {m.baselinePerformance}%</div>
                    </div>
                    <button
                      onClick={() => triggerOptimization(m.moduleName)}
                      disabled={optimizing}
                      style={{ padding: '6px 12px', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#f1f5f9', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}
                    >
                      Optimize
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Collective Consensus Card */}
          {consensus && (
            <div style={{ background: '#131b2e', border: '1px solid #1e293b', borderRadius: '14px', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: '#f1f5f9' }}>
                  Collective Intelligence Consensus: {consensus.topic}
                </h3>
                <span style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '6px', background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4', fontWeight: 600 }}>
                  Consensus Score: {consensus.consensusScore}% ({consensus.agreementPercentage}% agreement)
                </span>
              </div>
              <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.5, marginBottom: '14px' }}>
                {consensus.synthesizedInsight}
              </p>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>Ecosystem Best Practices:</div>
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '12px', color: '#94a3b8', lineHeight: 1.6 }}>
                {consensus.bestPractices.map((bp, i) => (
                  <li key={i}>{bp}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
