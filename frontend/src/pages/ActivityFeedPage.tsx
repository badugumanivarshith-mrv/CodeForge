import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  Trophy,
  Award,
  BookOpen,
  Briefcase,
  TrendingUp,
  User,
  Users,
} from 'lucide-react';
import { Card, Badge } from '../components/common';
import { feedApi } from '../services/feedApi';
import { ActivityFeedEventDto, ActivityType } from '@codeforge/shared';

export const ActivityFeedPage: React.FC = () => {
  const [events, setEvents] = useState<ActivityFeedEventDto[]>([]);
  const [feedType, setFeedType] = useState<'global' | 'me'>('global');
  const [isLoading, setIsLoading] = useState(true);

  const fetchFeed = async () => {
    setIsLoading(true);
    try {
      const data = feedType === 'global' ? await feedApi.getGlobalFeed() : await feedApi.getMyFeed();
      setEvents(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, [feedType]);

  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case ActivityType.CONTEST_PARTICIPATION:
      case ActivityType.CONTEST_WIN:
        return <Trophy size={18} color="#f59e0b" />;
      case ActivityType.ACHIEVEMENT_UNLOCKED:
        return <Award size={18} color="#a855f7" />;
      case ActivityType.ASSESSMENT_COMPLETED:
        return <BookOpen size={18} color="#10b981" />;
      case ActivityType.PROJECT_PUBLISHED:
        return <Briefcase size={18} color="#3b82f6" />;
      case ActivityType.SKILL_PROMOTED:
        return <TrendingUp size={18} color="#6366f1" />;
      default:
        return <Activity size={18} color="#94a3b8" />;
    }
  };

  return (
    <div style={{ padding: '32px 24px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.02em' }}>Live Community Feed</h1>
            <Badge variant="brand" size="sm">Social Pulse</Badge>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
            Real-time milestones, contest triumphs, project releases, and rating advancements across CodeForge.
          </p>
        </div>

        {/* Feed Scope Switcher */}
        <div style={{ display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.04)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
          <button
            onClick={() => setFeedType('global')}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: 'none',
              background: feedType === 'global' ? 'var(--color-brand-primary)' : 'transparent',
              color: feedType === 'global' ? '#fff' : 'var(--text-secondary)',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Users size={14} /> Global Stream
          </button>
          <button
            onClick={() => setFeedType('me')}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: 'none',
              background: feedType === 'me' ? 'var(--color-brand-primary)' : 'transparent',
              color: feedType === 'me' ? '#fff' : 'var(--text-secondary)',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <User size={14} /> My Milestones
          </button>
        </div>
      </div>

      {/* Feed Stream */}
      {isLoading ? (
        <div style={{ padding: '60px 24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          Streaming platform events...
        </div>
      ) : events.length === 0 ? (
        <Card padding="lg" style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
          <Activity size={36} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
          <p style={{ fontSize: '15px', fontWeight: 600 }}>No activities recorded yet in this stream.</p>
          <p style={{ fontSize: '13px', marginTop: '4px' }}>Complete lessons, solve contest problems, or publish portfolio projects to broadcast your progress!</p>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {events.map(event => (
            <Card key={event.id} glow padding="md" style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {getActivityIcon(event.activityType)}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                  <div style={{ fontSize: '14px' }}>
                    <Link to={`/u/${event.username}`} style={{ fontWeight: 700, color: 'var(--text-primary)', marginRight: '6px' }}>
                      {event.fullName || event.username}
                    </Link>
                    <span style={{ color: 'var(--text-secondary)' }}>{event.title}</span>
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {new Date(event.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {event.description && (
                  <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: 1.4, margin: '4px 0 0 0' }}>
                    {event.description}
                  </p>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
