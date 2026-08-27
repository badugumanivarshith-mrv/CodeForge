import React, { useState, useEffect } from 'react';
import { Trophy, Zap, User } from 'lucide-react';
import { Card, Badge } from '../components/common';
import { progressApi } from '../services/progressApi';
import { LeaderboardEntryDto } from '@codeforge/shared';

export const LeaderboardPage: React.FC = () => {
  const [learners, setLearners] = useState<LeaderboardEntryDto[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await progressApi.getLeaderboard(20);
        setLearners(data);
      } catch (err) {
        console.error('Failed to load leaderboard:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div style={{ padding: '32px 24px', maxWidth: '900px', margin: '0 auto', width: '100%' }}>
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <Trophy size={44} color="#f59e0b" style={{ marginBottom: '12px' }} />
        <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '8px' }}>Global Leaderboard</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Top engineers ranked by total mastery XP and consistency across all tracks.
        </p>
      </div>

      <Card padding="none">
        {isLoading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading rankings...
          </div>
        ) : learners.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No learners ranked yet. Complete lessons and quizzes to earn XP!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {learners.map(learner => (
              <div
                key={learner.id}
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
                      width: '32px',
                      color:
                        learner.rank === 1
                          ? '#f59e0b'
                          : learner.rank === 2
                          ? '#94a3b8'
                          : learner.rank === 3
                          ? '#d97706'
                          : 'var(--text-muted)',
                    }}
                  >
                    #{learner.rank}
                  </span>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {learner.avatarUrl ? (
                      <img
                        src={learner.avatarUrl}
                        alt={learner.username}
                        style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#1e293b' }}
                      />
                    ) : (
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <User size={18} color="#94a3b8" />
                      </div>
                    )}
                    <div style={{ fontSize: '15px', fontWeight: 700 }}>{learner.username}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <Badge variant={learner.rank <= 3 ? 'purple' : 'brand'} size="sm">
                    {learner.leagueTier}
                  </Badge>
                  <span
                    style={{
                      fontSize: '15px',
                      fontWeight: 800,
                      color: '#c084fc',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Zap size={14} /> {learner.totalXp} XP
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
