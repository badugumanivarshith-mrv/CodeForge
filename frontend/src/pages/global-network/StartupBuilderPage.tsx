import React, { useState, useEffect } from 'react';
import { StartupProfileDto, VentureIntelligenceReportDto, VentureStage } from '@codeforge/shared';
import { globalEcosystemApi } from '../../services/globalEcosystemApi';

export const StartupBuilderPage: React.FC = () => {
  const [startups, setStartups] = useState<StartupProfileDto[]>([]);
  const [selectedStartup, setSelectedStartup] = useState<StartupProfileDto | null>(null);
  const [intelligence, setIntelligence] = useState<VentureIntelligenceReportDto | null>(null);
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [industry, setIndustry] = useState('Artificial Intelligence');
  const [fundingGoal, setFundingGoal] = useState(250000);
  const [launching, setLaunching] = useState(false);

  useEffect(() => {
    loadStartups();
  }, []);

  const loadStartups = async () => {
    try {
      let data = await globalEcosystemApi.listStartups();
      if (data.length === 0) {
        // Create initial default startup
        const s1 = await globalEcosystemApi.launchStartup({
          name: 'NexusAgent OS',
          tagline: 'Autonomous AI Operating System for High-Scale FinTech Workflows',
          description: 'Deploying persistent autonomous agent fleets to handle complex compliance and regulatory workflows.',
          stage: VentureStage.SEED,
          industry: 'Artificial Intelligence & FinTech',
          targetMarket: 'Global Tier-1 Financial Institutions',
          businessModel: 'B2B Enterprise Subscription + Compute Consumption',
          fundingGoalUsd: 1000000,
          raisedAmountUsd: 250000,
          marketValidationScore: 92.5,
        });
        data = [s1];
      }
      setStartups(data);
      if (data.length > 0 && !selectedStartup) {
        selectStartup(data[0]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const selectStartup = async (s: StartupProfileDto) => {
    setSelectedStartup(s);
    try {
      const intel = await globalEcosystemApi.getVentureIntelligence(s.id);
      setIntelligence(intel);
    } catch {
      setIntelligence(null);
    }
  };

  const handleLaunch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description) return;
    setLaunching(true);
    try {
      const s = await globalEcosystemApi.launchStartup({
        name,
        tagline: tagline || name,
        description,
        industry,
        fundingGoalUsd: fundingGoal,
        stage: VentureStage.IDEA,
        targetMarket: 'Enterprise AI Developers',
        businessModel: 'Usage-Based AI API',
        marketValidationScore: 88,
      });
      setName('');
      setTagline('');
      setDescription('');
      await loadStartups();
      selectStartup(s);
    } catch (err) {
      console.error(err);
    } finally {
      setLaunching(false);
    }
  };

  return (
    <div style={{ padding: '28px', color: '#f8fafc', background: '#0b0f19', minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, margin: 0, background: 'linear-gradient(135deg, #f472b6, #ec4899, #db2777)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            AI Entrepreneurship & Venture Studio
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '14px', margin: '4px 0 0 0' }}>
            Autonomous startup incubator, co-founder discovery matrix, and venture intelligence modeling
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Startup Directory & Detail */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ background: '#131b2e', border: '1px solid #1e293b', borderRadius: '14px', padding: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 16px 0', color: '#f1f5f9' }}>
              Incubated Startups ({startups.length})
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '14px' }}>
              {startups.map(s => (
                <div
                  key={s.id}
                  onClick={() => selectStartup(s)}
                  style={{
                    padding: '16px',
                    background: selectedStartup?.id === s.id ? '#1e293b' : '#0b1120',
                    border: selectedStartup?.id === s.id ? '1px solid #f472b6' : '1px solid #1e293b',
                    borderRadius: '10px',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', background: 'rgba(244, 114, 182, 0.15)', color: '#f472b6', fontWeight: 600 }}>
                      {s.stage}
                    </span>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#34d399' }}>
                      ${(s.raisedAmountUsd / 1000).toFixed(0)}k raised
                    </span>
                  </div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#f8fafc', marginBottom: '4px' }}>{s.name}</div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.4 }}>{s.tagline}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Startup Venture Intelligence */}
          {selectedStartup && intelligence && (
            <div style={{ background: '#131b2e', border: '1px solid #1e293b', borderRadius: '14px', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: '#f1f5f9' }}>
                  Venture Intelligence Report: {selectedStartup.name}
                </h3>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <span style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '6px', background: 'rgba(52, 211, 153, 0.15)', color: '#34d399', fontWeight: 600 }}>
                    Viability: {intelligence.marketViabilityScore}%
                  </span>
                  <span style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '6px', background: 'rgba(244, 114, 182, 0.15)', color: '#f472b6', fontWeight: 600 }}>
                    Risk: {intelligence.competitionRiskScore}%
                  </span>
                </div>
              </div>

              <div style={{ fontSize: '13px', color: '#cbd5e1', marginBottom: '16px', lineHeight: 1.5 }}>
                <strong>Growth Trajectory:</strong> {intelligence.growthTrajectory}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px', background: '#0b1120', padding: '14px', borderRadius: '8px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>Target CAC</div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#f1f5f9' }}>${intelligence.unitEconomicsModel.cacUsd}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>Estimated LTV</div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#34d399' }}>${intelligence.unitEconomicsModel.ltvUsd}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>Gross Margin</div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#38bdf8' }}>{intelligence.unitEconomicsModel.grossMarginPercent}%</div>
                </div>
              </div>

              <div style={{ fontSize: '12px', fontWeight: 600, color: '#e2e8f0', marginBottom: '8px' }}>Strategic Roadmap Steps:</div>
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '12px', color: '#94a3b8', lineHeight: 1.6 }}>
                {intelligence.strategicRoadmapSteps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Launch New Startup Form */}
        <div style={{ background: '#131b2e', border: '1px solid #1e293b', borderRadius: '14px', padding: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 16px 0', color: '#f1f5f9' }}>
            Incubate New Venture
          </h2>
          <form onSubmit={handleLaunch} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Startup Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Omniscience AI"
                style={{ width: '100%', padding: '10px', background: '#0b1120', border: '1px solid #1e293b', borderRadius: '8px', color: '#f1f5f9', fontSize: '13px' }}
                required
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Tagline</label>
              <input
                type="text"
                value={tagline}
                onChange={e => setTagline(e.target.value)}
                placeholder="Brief value proposition"
                style={{ width: '100%', padding: '10px', background: '#0b1120', border: '1px solid #1e293b', borderRadius: '8px', color: '#f1f5f9', fontSize: '13px' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Industry</label>
              <input
                type="text"
                value={industry}
                onChange={e => setIndustry(e.target.value)}
                style={{ width: '100%', padding: '10px', background: '#0b1120', border: '1px solid #1e293b', borderRadius: '8px', color: '#f1f5f9', fontSize: '13px' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Target Funding Goal ($)</label>
              <input
                type="number"
                value={fundingGoal}
                onChange={e => setFundingGoal(Number(e.target.value))}
                style={{ width: '100%', padding: '10px', background: '#0b1120', border: '1px solid #1e293b', borderRadius: '8px', color: '#f1f5f9', fontSize: '13px' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Description</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={3}
                placeholder="Problem, solution, and core product mechanics..."
                style={{ width: '100%', padding: '10px', background: '#0b1120', border: '1px solid #1e293b', borderRadius: '8px', color: '#f1f5f9', fontSize: '13px' }}
                required
              />
            </div>
            <button
              type="submit"
              disabled={launching}
              style={{ padding: '10px', background: '#db2777', border: 'none', borderRadius: '8px', color: '#ffffff', fontWeight: 700, cursor: 'pointer', fontSize: '13px' }}
            >
              {launching ? 'Launching...' : 'Launch in AI Incubator'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
