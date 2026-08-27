import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  User,
  Flame,
  Zap,
  Github,
  Calendar,
  ArrowLeft,
  ExternalLink,
  CheckCircle2,
  Trophy,
} from 'lucide-react';
import { Card, Badge, Button } from '../components/common';
import { userApi, PublicProfileDto } from '../services/userApi';
import { portfolioApi } from '../services/portfolioApi';
import {
  PortfolioDto,
  PortfolioProjectDto,
  PortfolioSkillItemDto,
  PortfolioHeatmapItemDto,
} from '@codeforge/shared';

export const PublicProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<PublicProfileDto | null>(null);
  const [portfolio, setPortfolio] = useState<PortfolioDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!username) return;

    setIsLoading(true);
    setError(null);

    Promise.allSettled([
      userApi.getPublicProfile(username),
      portfolioApi.getPublicPortfolio(username),
    ])
      .then(([profResult, portResult]) => {
        if (profResult.status === 'fulfilled') {
          setProfile(profResult.value);
        } else {
          setError('User profile not found');
        }

        if (portResult.status === 'fulfilled') {
          setPortfolio(portResult.value);
        }
      })
      .finally(() => setIsLoading(false));
  }, [username]);

  if (isLoading) {
    return (
      <div style={{ padding: '60px 24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        Loading developer profile and verified portfolio...
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div style={{ padding: '60px 24px', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <Card padding="lg">
          <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>Developer Not Found</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '20px' }}>
            We couldn&apos;t find a developer profile matching @{username}.
          </p>
          <Link to="/">
            <Button variant="secondary" size="sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <ArrowLeft size={14} /> Back to CodeForge
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  const formattedDate = new Date(profile.joinedAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
  });

  return (
    <div style={{ padding: '32px 24px', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
      {/* Header Banner */}
      <Card glow padding="lg" style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
          <div
            style={{
              width: '84px',
              height: '84px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1, #a855f7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              overflow: 'hidden',
              border: '2px solid rgba(255, 255, 255, 0.15)',
            }}
          >
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.username}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <User size={42} />
            )}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
              <h1 style={{ fontSize: '26px', fontWeight: 800 }}>{profile.fullName || profile.username}</h1>
              <Badge variant="brand" size="sm">Level {profile.currentLevel}</Badge>
            </div>
            {portfolio?.settings.headline && (
              <p style={{ color: 'var(--color-brand-primary)', fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>
                {portfolio.settings.headline}
              </p>
            )}
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '8px' }}>
              @{profile.username} • <Calendar size={13} style={{ display: 'inline', verticalAlign: 'middle' }} /> Joined {formattedDate}
            </p>
            {profile.bio && (
              <p style={{ color: '#d1d5db', fontSize: '13px', maxWidth: '550px', marginBottom: '10px' }}>
                {profile.bio}
              </p>
            )}
            <div style={{ display: 'flex', gap: '16px', fontSize: '13px', flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f59e0b', fontWeight: 600 }}>
                <Flame size={16} /> {profile.streak} Day Streak
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#c084fc', fontWeight: 600 }}>
                <Zap size={16} /> {profile.totalXp} Total XP
              </span>
              {portfolio?.rating && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10b981', fontWeight: 700 }}>
                  <Trophy size={16} /> {portfolio.rating.currentRating} Rating ({portfolio.rating.rankTier})
                </span>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Verified Projects Showcase (If Portfolio exists) */}
      {portfolio && portfolio.projects.length > 0 && (
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '16px' }}>
            Featured Engineering Projects ({portfolio.projects.length})
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {portfolio.projects.map((proj: PortfolioProjectDto) => (
              <Card key={proj.id} padding="md" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>{proj.title}</h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '12px' }}>
                    {proj.description}
                  </p>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '14px' }}>
                    {proj.technologies.map((t: string) => (
                      <Badge key={t} variant="brand" size="sm">{t}</Badge>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
                  {proj.repositoryUrl && (
                    <a href={proj.repositoryUrl} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--color-brand-primary)' }}>
                      <Github size={13} /> Code
                    </a>
                  )}
                  {proj.demoUrl && (
                    <a href={proj.demoUrl} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#10b981' }}>
                      <ExternalLink size={13} /> Live Demo
                    </a>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Verified Skills & Activity Matrix */}
      {portfolio && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {portfolio.skills.length > 0 && (
            <Card padding="lg">
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} color="#10b981" /> Verified Technical Skills
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {portfolio.skills.slice(0, 6).map((s: PortfolioSkillItemDto) => (
                  <div key={s.skillName}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 600 }}>{s.skillName}</span>
                      <span style={{ color: 'var(--text-secondary)' }}>{s.score}%</span>
                    </div>
                    <div style={{ height: '5px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${s.score}%`, background: 'linear-gradient(90deg, #6366f1, #10b981)' }} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {portfolio.heatmap.length > 0 && (
            <Card padding="lg">
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>
                30-Day Activity Matrix
              </h3>
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', padding: '10px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                {portfolio.heatmap.map((day: PortfolioHeatmapItemDto) => {
                  const intensity = day.count === 0 ? 'rgba(255,255,255,0.05)' : day.count < 3 ? '#3b82f6' : day.count < 6 ? '#6366f1' : '#10b981';
                  return (
                    <div
                      key={day.date}
                      title={`${day.date}: ${day.count} activities`}
                      style={{
                        width: '14px',
                        height: '14px',
                        borderRadius: '3px',
                        backgroundColor: intensity,
                      }}
                    />
                  );
                })}
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};
