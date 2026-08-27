import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { User, Award, Flame, Zap, Github, Globe, Calendar, ArrowLeft } from 'lucide-react';
import { Card, Badge, Button } from '../components/common';
import { userApi, PublicProfileDto } from '../services/userApi';

export const PublicProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<PublicProfileDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!username) return;

    setIsLoading(true);
    setError(null);
    userApi
      .getPublicProfile(username)
      .then(data => setProfile(data))
      .catch(err => setError(err.message || 'User profile not found'))
      .finally(() => setIsLoading(false));
  }, [username]);

  if (isLoading) {
    return (
      <div style={{ padding: '60px 24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        Loading developer profile...
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
    <div style={{ padding: '32px 24px', maxWidth: '900px', margin: '0 auto', width: '100%' }}>
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
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px' }}>
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
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#818cf8', fontWeight: 600 }}>
                <Award size={16} /> Level {profile.currentLevel} Developer
              </span>
              {profile.githubUsername && (
                <a
                  href={`https://github.com/${profile.githubUsername}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#93c5fd', textDecoration: 'none' }}
                >
                  <Github size={15} /> @{profile.githubUsername}
                </a>
              )}
            </div>
          </div>
        </div>
      </Card>

      {profile.learningGoals.length > 0 && (
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px' }}>Learning Objectives</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px' }}>
            {profile.learningGoals.map((goal, idx) => (
              <Card key={idx} padding="md" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Globe size={18} color="#6366f1" />
                <span style={{ fontSize: '14px', fontWeight: 600 }}>{goal}</span>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
