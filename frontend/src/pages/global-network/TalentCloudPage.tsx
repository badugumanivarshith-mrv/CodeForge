import React, { useState, useEffect } from 'react';
import { TalentProfileDto, TalentMatchScoreDto, ReputationTier } from '@codeforge/shared';
import { globalEcosystemApi } from '../../services/globalEcosystemApi';

export const TalentCloudPage: React.FC = () => {
  const [talents, setTalents] = useState<TalentProfileDto[]>([]);
  const [matches, setMatches] = useState<TalentMatchScoreDto[]>([]);
  const [searchSkill, setSearchSkill] = useState('');
  const [roleTitle, setRoleTitle] = useState('Autonomous Systems Architect');
  const [requiredSkills, setRequiredSkills] = useState('TypeScript, Python, Distributed Systems');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTalent();
  }, []);

  const loadTalent = async (skillFilter?: string) => {
    setLoading(true);
    try {
      let data = await globalEcosystemApi.searchTalent(skillFilter ? { skill: skillFilter } : undefined);
      if (data.length === 0) {
        // Create initial default talent profile
        await globalEcosystemApi.createOrUpdateTalentProfile({
          fullName: 'Elena Rostova',
          title: 'Principal AI Architect & Distributed Systems Specialist',
          bio: 'Author of multi-agent consensus frameworks with 10+ years experience.',
          hourlyRateUsd: 140,
          reputationScore: 480,
          reputationTier: ReputationTier.FELLOW,
          portfolioScore: 98,
          location: 'San Francisco, CA (Remote)',
        });
        await globalEcosystemApi.createOrUpdateTalentProfile({
          fullName: 'Marcus Vance',
          title: 'Full Stack Autonomous Agent Engineer',
          bio: 'Specializing in reactive DAG workflows and memory fabrics.',
          hourlyRateUsd: 110,
          reputationScore: 320,
          reputationTier: ReputationTier.MASTER,
          portfolioScore: 92,
          location: 'Berlin, Germany (Remote)',
        });
        data = await globalEcosystemApi.searchTalent();
      }
      setTalents(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const runMatch = async () => {
    try {
      const skills = requiredSkills.split(',').map(s => s.trim());
      const res = await globalEcosystemApi.matchTalent({ roleTitle, requiredSkills: skills });
      setMatches(res);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '28px', color: '#f8fafc', background: '#0b0f19', minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, margin: 0, background: 'linear-gradient(135deg, #fbbf24, #f59e0b, #d97706)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Global Talent Cloud & Verified Registry
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '14px', margin: '4px 0 0 0' }}>
            Decentralized talent network, verified skill registries, and AI recruiter matching engines
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '28px' }}>
        {/* Talent Search & Discovery */}
        <div style={{ background: '#131b2e', border: '1px solid #1e293b', borderRadius: '14px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: '#f1f5f9' }}>
              Verified Talent Directory ({talents.length})
            </h2>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={searchSkill}
                onChange={e => {
                  setSearchSkill(e.target.value);
                  loadTalent(e.target.value);
                }}
                placeholder="Filter by skill..."
                style={{ padding: '6px 10px', background: '#0b1120', border: '1px solid #1e293b', borderRadius: '6px', color: '#f1f5f9', fontSize: '12px' }}
              />
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>Searching verified talent...</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {talents.map(t => (
                <div key={t.id} style={{ padding: '16px', background: '#0b1120', border: '1px solid #1e293b', borderRadius: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <div>
                      <span style={{ fontSize: '15px', fontWeight: 700, color: '#f8fafc' }}>{t.fullName}</span>
                      <span style={{ marginLeft: '8px', fontSize: '11px', padding: '2px 8px', borderRadius: '12px', background: 'rgba(251, 191, 36, 0.15)', color: '#fbbf24', fontWeight: 600 }}>
                        {t.reputationTier}
                      </span>
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#34d399' }}>${t.hourlyRateUsd}/hr</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>{t.title}</div>
                  <p style={{ fontSize: '12px', color: '#cbd5e1', margin: '0 0 10px 0', lineHeight: 1.5 }}>{t.bio}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b', borderTop: '1px solid #1e293b', paddingTop: '8px' }}>
                    <span>Location: {t.location}</span>
                    <span>Reputation: {t.reputationScore} pts</span>
                    <span>Portfolio Score: {t.portfolioScore}/100</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* AI Talent Matching Engine */}
        <div style={{ background: '#131b2e', border: '1px solid #1e293b', borderRadius: '14px', padding: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 16px 0', color: '#f1f5f9' }}>
            AI Talent Matching Engine
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
            <div>
              <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Role Title</label>
              <input
                type="text"
                value={roleTitle}
                onChange={e => setRoleTitle(e.target.value)}
                style={{ width: '100%', padding: '10px', background: '#0b1120', border: '1px solid #1e293b', borderRadius: '8px', color: '#f1f5f9', fontSize: '13px' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Required Skills (comma-separated)</label>
              <input
                type="text"
                value={requiredSkills}
                onChange={e => setRequiredSkills(e.target.value)}
                style={{ width: '100%', padding: '10px', background: '#0b1120', border: '1px solid #1e293b', borderRadius: '8px', color: '#f1f5f9', fontSize: '13px' }}
              />
            </div>
            <button
              onClick={runMatch}
              style={{ padding: '10px', background: '#f59e0b', border: 'none', borderRadius: '8px', color: '#0f172a', fontWeight: 700, cursor: 'pointer', fontSize: '13px' }}
            >
              Run AI Candidate Match
            </button>
          </div>

          {/* Matches Output */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {matches.map((m, idx) => (
              <div key={idx} style={{ padding: '14px', background: '#0b1120', border: '1px solid #1e293b', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#f8fafc' }}>{m.talent.fullName}</span>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#fbbf24' }}>{m.matchScore}% Match</span>
                </div>
                <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '6px' }}>{m.fitSummary}</div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>
                  Matched: <span style={{ color: '#4ade80' }}>{m.matchingSkills.join(', ') || 'General Profile Alignment'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
