import React, { useState, useEffect } from 'react';
import {
  GlobalCommandCenterOverviewDto,
  SuperintelligenceInsightDto,
  SuperintelligenceScope,
} from '@codeforge/shared';
import { globalEcosystemApi } from '../../services/globalEcosystemApi';

export const GlobalCommandCenterPage: React.FC = () => {
  const [overview, setOverview] = useState<GlobalCommandCenterOverviewDto | null>(null);
  const [insights, setInsights] = useState<SuperintelligenceInsightDto[]>([]);
  const [activeScope, setActiveScope] = useState<SuperintelligenceScope>(SuperintelligenceScope.STRATEGIC);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [activeScope]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [ov, ins] = await Promise.all([
        globalEcosystemApi.getCommandCenterOverview(),
        globalEcosystemApi.getStrategicInsights(activeScope),
      ]);
      setOverview(ov);
      setInsights(ins);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '28px', color: '#f8fafc', background: '#0b0f19', minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, margin: 0, background: 'linear-gradient(135deg, #60a5fa, #a855f7, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Global Command Center & Superintelligence
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '14px', margin: '4px 0 0 0' }}>
            Real-time planetary telemetry, cross-organizational intelligence feeds, and strategic foresight
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <span style={{ padding: '6px 14px', background: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.3)', borderRadius: '20px', color: '#4ade80', fontSize: '12px', fontWeight: 600 }}>
            ● Ecosystem Equilibrium: 99.4%
          </span>
          <button
            onClick={loadData}
            style={{ padding: '8px 16px', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f1f5f9', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}
          >
            Refresh Telemetry
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      {overview && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '28px' }}>
          {[
            { label: 'Global Nodes', value: overview.totalNetworkNodes.toLocaleString(), icon: '🌐', color: '#38bdf8' },
            { label: 'Active Autonomous Agents', value: overview.activeAutonomousAgents.toLocaleString(), icon: '🤖', color: '#818cf8' },
            { label: 'Live DAG Workflows', value: overview.liveWorkflowsCount.toLocaleString(), icon: '⚡', color: '#c084fc' },
            { label: 'Global Verified Talent', value: overview.globalTalentRegistered.toLocaleString(), icon: '⭐', color: '#fbbf24' },
            { label: 'Enterprises & Labs', value: (overview.activeEnterprises + overview.publishedResearchCount).toLocaleString(), icon: '🏛️', color: '#34d399' },
            { label: 'Active Startups', value: overview.ventureStartupsCount.toLocaleString(), icon: '🚀', color: '#f472b6' },
          ].map((kpi, idx) => (
            <div key={idx} style={{ background: '#131b2e', border: '1px solid #1e293b', borderRadius: '12px', padding: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 500 }}>{kpi.label}</span>
                <span style={{ fontSize: '18px' }}>{kpi.icon}</span>
              </div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: kpi.color }}>{kpi.value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Main Content Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Left Column: Strategic Superintelligence Insights */}
        <div style={{ background: '#131b2e', border: '1px solid #1e293b', borderRadius: '14px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: '#f1f5f9' }}>
              Strategic Superintelligence Insights
            </h2>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[SuperintelligenceScope.STRATEGIC, SuperintelligenceScope.ECOSYSTEM, SuperintelligenceScope.TALENT, SuperintelligenceScope.RISK].map(s => (
                <button
                  key={s}
                  onClick={() => setActiveScope(s)}
                  style={{
                    padding: '6px 12px',
                    fontSize: '12px',
                    fontWeight: 600,
                    borderRadius: '6px',
                    border: 'none',
                    cursor: 'pointer',
                    background: activeScope === s ? '#3b82f6' : '#1e293b',
                    color: activeScope === s ? '#ffffff' : '#94a3b8',
                  }}
                >
                  {s.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Analyzing global telemetry...</div>
          ) : insights.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>No insights available for this scope.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {insights.map(ins => (
                <div key={ins.id} style={{ background: '#0b1120', border: '1px solid #1e293b', borderRadius: '10px', padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, margin: 0, color: '#e2e8f0' }}>{ins.title}</h3>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '4px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', fontWeight: 600 }}>
                        Opportunity: {ins.opportunityScore}%
                      </span>
                      <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '4px', background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', fontWeight: 600 }}>
                        Risk: {ins.riskScore}%
                      </span>
                    </div>
                  </div>
                  <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.6, marginBottom: '14px' }}>
                    {ins.executiveSummary}
                  </p>

                  <div style={{ marginBottom: '12px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#cbd5e1' }}>Recommended Strategic Actions:</span>
                    <ul style={{ margin: '6px 0 0 0', paddingLeft: '20px', color: '#94a3b8', fontSize: '12px' }}>
                      {ins.strategicActions.map((act, i) => (
                        <li key={i} style={{ marginBottom: '4px' }}>
                          <strong style={{ color: '#f1f5f9' }}>[{act.priority}]</strong> {act.action}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div style={{ fontSize: '12px', color: '#64748b', fontStyle: 'italic', borderTop: '1px solid #1e293b', paddingTop: '8px' }}>
                    Impact Forecast: {ins.projectedEcosystemImpact}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Global Trend Signals & Activity Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Trend Signals Card */}
          <div style={{ background: '#131b2e', border: '1px solid #1e293b', borderRadius: '14px', padding: '20px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 16px 0', color: '#f1f5f9' }}>
              Emerging Ecosystem Trends
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {overview?.trends?.map((t, idx) => (
                <div key={idx} style={{ background: '#0b1120', border: '1px solid #1e293b', borderRadius: '8px', padding: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#f8fafc' }}>{t.trendName}</span>
                    <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 600 }}>+{t.growthRatePercent}%</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b' }}>
                    <span>Category: {t.category}</span>
                    <span>Momentum: {t.momentumScore}/100</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Navigation Cards */}
          <div style={{ background: '#131b2e', border: '1px solid #1e293b', borderRadius: '14px', padding: '20px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 14px 0', color: '#f1f5f9' }}>
              Ecosystem Navigation
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { name: 'Global AI Network Graph', path: '/global-network', desc: 'Cross-entity nodes & recommendations' },
                { name: 'Global Talent Cloud', path: '/talent-cloud', desc: 'Verified skills & AI matching' },
                { name: 'Global Research Network', path: '/research-network', desc: 'Publications, citations & labs' },
                { name: 'AI Startup Builder', path: '/startup-builder', desc: 'Venture studio & co-founder discovery' },
                { name: 'Digital Twin Ecosystem', path: '/digital-twins', desc: 'Multi-entity scenario simulations' },
                { name: 'Ecosystem Analytics', path: '/ecosystem-analytics', desc: 'Token economy & self-improvement' },
              ].map((link, i) => (
                <a
                  key={i}
                  href={link.path}
                  style={{
                    display: 'block',
                    padding: '10px 14px',
                    background: '#0b1120',
                    border: '1px solid #1e293b',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    color: '#e2e8f0',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#60a5fa' }}>{link.name} →</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>{link.desc}</div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
