import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';
import { Card, Badge, Button } from '../components/common';
import { talentApi } from '../services/talentApi';
import { TalentProfileSummaryDto } from '@codeforge/shared';

export const TalentDiscoveryPage: React.FC = () => {
  const [candidates, setCandidates] = useState<TalentProfileSummaryDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter query states
  const [role, setRole] = useState('');
  const [skill, setSkill] = useState('');
  const [minRating, setMinRating] = useState(1000);

  const fetchCandidates = async () => {
    setIsLoading(true);
    try {
      const res = await talentApi.searchTalent({
        role: role || undefined,
        skill: skill || undefined,
        minRating: minRating > 1000 ? minRating : undefined,
      });
      setCandidates(res.candidates);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCandidates();
  };

  return (
    <div style={{ padding: '32px 24px', maxWidth: '1150px', margin: '0 auto', width: '100%' }}>
      {/* Header Banner */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.02em' }}>
            Talent Discovery & Verified Engineers
          </h1>
          <Badge variant="brand" size="sm">Recruiter Network</Badge>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
          Source top engineering candidates with transparent, cryptographically verifiable CodeForge contest ratings and skill benchmarks.
        </p>
      </div>

      {/* Filter Toolbar */}
      <Card padding="md" style={{ marginBottom: '28px' }}>
        <form onSubmit={handleSearch} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr)) 120px', gap: '12px', alignItems: 'flex-end' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
              Target Role / Headline
            </label>
            <input
              type="text"
              value={role}
              onChange={e => setRole(e.target.value)}
              placeholder="e.g. Backend, Distributed Systems..."
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                fontSize: '13px',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
              Required Skill / Language
            </label>
            <input
              type="text"
              value={skill}
              onChange={e => setSkill(e.target.value)}
              placeholder="e.g. TypeScript, Rust, Python..."
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                fontSize: '13px',
              }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
              <span>Min Verified Rating</span>
              <span style={{ color: 'var(--color-brand-primary)' }}>{minRating}</span>
            </div>
            <input
              type="range"
              min={1000}
              max={2200}
              step={50}
              value={minRating}
              onChange={e => setMinRating(Number(e.target.value))}
              style={{ width: '100%', cursor: 'pointer' }}
            />
          </div>

          <Button type="submit" variant="primary" size="md" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <Search size={15} /> Filter
          </Button>
        </form>
      </Card>

      {/* Candidate Grid */}
      {isLoading ? (
        <div style={{ padding: '60px 24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          Searching verified developer talent...
        </div>
      ) : candidates.length === 0 ? (
        <Card padding="lg" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
          <p style={{ fontSize: '15px', fontWeight: 600 }}>No candidates matched your search criteria.</p>
          <p style={{ fontSize: '13px', marginTop: '4px' }}>Try lowering the rating threshold or searching for broader skills.</p>
        </Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
          {candidates.map(candidate => (
            <Card key={candidate.userId} glow padding="lg" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                  <div
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontSize: '20px',
                      fontWeight: 800,
                    }}
                  >
                    {candidate.fullName?.[0] || candidate.username[0]?.toUpperCase()}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '17px', fontWeight: 700 }}>{candidate.fullName || candidate.username}</h3>
                    <p style={{ fontSize: '13px', color: 'var(--color-brand-primary)', fontWeight: 600 }}>
                      {candidate.headline || `@${candidate.username}`}
                    </p>
                  </div>
                </div>

                {/* Rating & Rank Badges */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                  <Badge variant="success" size="sm">
                    <CheckCircle2 size={12} style={{ display: 'inline', marginRight: 4 }} /> Rating: {candidate.rating}
                  </Badge>
                  <Badge variant="brand" size="sm">
                    {candidate.rankTier}
                  </Badge>
                  {candidate.projectsCount > 0 && (
                    <Badge variant="default" size="sm">
                      {candidate.projectsCount} Project{candidate.projectsCount === 1 ? '' : 's'}
                    </Badge>
                  )}
                </div>

                {/* Skills tags */}
                {candidate.skills && candidate.skills.length > 0 && (
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '16px' }}>
                    {candidate.skills.slice(0, 5).map(s => (
                      <Badge key={s} variant="default" size="sm">{s}</Badge>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
                <Link to={`/u/${candidate.username}`}>
                  <Button variant="secondary" size="sm" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    <ExternalLink size={14} /> View Verified Profile & Portfolio
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
