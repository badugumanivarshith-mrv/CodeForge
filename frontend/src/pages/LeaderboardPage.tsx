import React from 'react';
import { Trophy, Zap } from 'lucide-react';
import { Card, Badge } from '../components/common';

export const LeaderboardPage: React.FC = () => {
  const topLearners = [
    { rank: 1, name: 'Alex_Dev', xp: 4250, streak: 28, badge: 'Diamond' },
    { rank: 2, name: 'CodeNinja', xp: 3890, streak: 21, badge: 'Diamond' },
    { rank: 3, name: 'Sarah_K', xp: 3410, streak: 14, badge: 'Platinum' },
    { rank: 4, name: 'BitMaster', xp: 2980, streak: 12, badge: 'Gold' },
    { rank: 5, name: 'Pythonista', xp: 2450, streak: 9, badge: 'Gold' },
  ];

  return (
    <div style={{ padding: '32px 24px', maxWidth: '900px', margin: '0 auto', width: '100%' }}>
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <Trophy size={40} color="#f59e0b" style={{ marginBottom: '12px' }} />
        <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '8px' }}>Global Leaderboard</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Top engineers ranked by total mastery XP and consistency across all tracks.
        </p>
      </div>

      <Card padding="none">
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {topLearners.map(learner => (
            <div
              key={learner.rank}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 24px',
                borderBottom: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <span
                  style={{
                    fontSize: '16px',
                    fontWeight: 800,
                    width: '28px',
                    color: learner.rank === 1 ? '#f59e0b' : learner.rank === 2 ? '#94a3b8' : learner.rank === 3 ? '#d97706' : 'var(--text-muted)',
                  }}
                >
                  #{learner.rank}
                </span>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 700 }}>{learner.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{learner.streak} Day Streak</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <Badge variant={learner.rank <= 2 ? 'purple' : 'brand'} size="sm">
                  {learner.badge}
                </Badge>
                <span style={{ fontSize: '15px', fontWeight: 800, color: '#c084fc', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Zap size={14} /> {learner.xp} XP
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
