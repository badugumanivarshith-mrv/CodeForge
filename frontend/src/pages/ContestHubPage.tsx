import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { contestApi } from '../services/contestApi';
import {
  ContestDto,
  ContestState,
  GlobalLeaderboardDto,
  LeaderboardTimeframe,
  SkillRatingDto,
} from '@codeforge/shared';
import {
  Trophy,
  Users,
  Award,
  ArrowRight,
  Flame,
  Medal,
  Play,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { SkillRatingBadge } from '../components/contest/SkillRatingBadge';

export const ContestHubPage: React.FC = () => {
  const navigate = useNavigate();
  const [contests, setContests] = useState<ContestDto[]>([]);
  const [leaderboard, setLeaderboard] = useState<GlobalLeaderboardDto | null>(null);
  const [rating, setRating] = useState<SkillRatingDto | null>(null);
  const [timeframe, setTimeframe] = useState<LeaderboardTimeframe>(LeaderboardTimeframe.GLOBAL);
  const [loading, setLoading] = useState<boolean>(true);
  const [joiningId, setJoiningId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [contestList, lbData, ratingData] = await Promise.all([
          contestApi.listContests().catch(() => []),
          contestApi.getGlobalLeaderboard(timeframe).catch(() => null),
          contestApi.getMyRating().catch(() => null),
        ]);

        setContests(contestList);
        setLeaderboard(lbData);
        setRating(ratingData);
      } catch (err) {
        console.error('Failed to load contest hub data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeframe]);

  if (loading) {
    return (
      <div style={{ maxWidth: '800px', margin: '80px auto', textAlign: 'center', color: '#94a3b8' }}>
        Loading contest arena...
      </div>
    );
  }


  const handleJoinContest = async (contestId: string) => {
    try {
      setJoiningId(contestId);
      await contestApi.register(contestId);
      const updated = await contestApi.listContests();
      setContests(updated);
      alert('Successfully registered for the contest!');
    } catch (err) {
      console.error('Failed to join contest', err);
      alert('Failed to register for contest');
    } finally {
      setJoiningId(null);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Trophy size={22} color="#f59e0b" />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', color: '#fbbf24', letterSpacing: '0.05em' }}>
              Competitive Arena & Contests
            </span>
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#f8fafc', margin: '0 0 10px 0' }}>
            Contests & Global Leaderboards
          </h1>
          <p style={{ fontSize: '1rem', color: '#94a3b8', maxWidth: '650px', margin: 0, lineHeight: 1.6 }}>
            Compete in weekly algorithmic rounds under ICPC-style scoring. Climb the global skill tiers from Apprentice to Grandmaster.
          </p>
        </div>

        {rating && (
          <div style={{ minWidth: '280px' }}>
            <SkillRatingBadge rating={rating} />
          </div>
        )}
      </div>

      {/* Main Grid: Contests List & Global Leaderboard */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px' }}>
        {/* Contests Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Flame size={20} color="#ef4444" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
              Active & Upcoming Contests
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {contests.length === 0 ? (
              <div style={{ padding: '32px', textAlign: 'center', background: 'rgba(15, 23, 42, 0.4)', borderRadius: '12px', border: '1px solid #1e293b', color: '#64748b' }}>
                No active contests scheduled at this time.
              </div>
            ) : (
              contests.map(c => {
                const isLive = c.status === ContestState.LIVE;

                return (
                  <div
                    key={c.id}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '14px',
                      padding: '20px',
                      borderRadius: '12px',
                      background: 'rgba(15, 23, 42, 0.6)',
                      border: `1px solid ${isLive ? 'rgba(239, 68, 68, 0.4)' : '#1e293b'}`,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <span
                            style={{
                              padding: '2px 8px',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              background: isLive ? 'rgba(239, 68, 68, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                              color: isLive ? '#f87171' : '#60a5fa',
                              border: `1px solid ${isLive ? 'rgba(239, 68, 68, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`,
                            }}
                          >
                            {c.status}
                          </span>
                          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                            {c.durationMinutes} minutes
                          </span>
                        </div>
                        <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#f8fafc', fontWeight: 700 }}>
                          {c.title}
                        </h3>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#fbbf24', fontWeight: 600 }}>
                        <Award size={15} />
                        <span>{c.totalPoints} pts</span>
                      </div>
                    </div>

                    <p style={{ margin: 0, fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.5 }}>
                      {c.descriptionMdx}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #1e293b', paddingTop: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#64748b' }}>
                        <Users size={14} />
                        <span>{c.participantCount} registered</span>
                      </div>

                      <Button
                        size="sm"
                        variant={isLive ? 'primary' : 'outline'}
                        rightIcon={isLive ? <Play size={14} /> : <ArrowRight size={14} />}
                        disabled={joiningId === c.id}
                        onClick={() => {
                          if (isLive) {
                            navigate('/arena');
                          } else {
                            handleJoinContest(c.id);
                          }
                        }}
                      >
                        {isLive ? 'Enter Arena' : 'Register Now'}
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Global Leaderboard Standings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Medal size={20} color="#fbbf24" />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                Leaderboards
              </h2>
            </div>

            {/* Timeframe selector */}
            <div style={{ display: 'flex', gap: '6px', background: '#0b0f17', padding: '4px', borderRadius: '8px' }}>
              <button
                onClick={() => setTimeframe(LeaderboardTimeframe.GLOBAL)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: timeframe === LeaderboardTimeframe.GLOBAL ? '#1e293b' : 'transparent',
                  color: timeframe === LeaderboardTimeframe.GLOBAL ? '#f8fafc' : '#64748b',
                }}
              >
                Global
              </button>
              <button
                onClick={() => setTimeframe(LeaderboardTimeframe.WEEKLY)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: timeframe === LeaderboardTimeframe.WEEKLY ? '#1e293b' : 'transparent',
                  color: timeframe === LeaderboardTimeframe.WEEKLY ? '#f8fafc' : '#64748b',
                }}
              >
                Weekly
              </button>
            </div>
          </div>

          <div style={{ border: '1px solid #1e293b', borderRadius: '12px', overflow: 'hidden', background: 'rgba(15, 23, 42, 0.5)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#0b0f17', borderBottom: '1px solid #1e293b', color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '10px 14px', width: '50px' }}>Rank</th>
                  <th style={{ padding: '10px 14px' }}>Coder</th>
                  <th style={{ padding: '10px 14px', textAlign: 'center' }}>Rating</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right' }}>XP</th>
                </tr>
              </thead>
              <tbody>
                {!leaderboard || leaderboard.entries.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>
                      No ranked coders found.
                    </td>
                  </tr>
                ) : (
                  leaderboard.entries.slice(0, 10).map((entry, idx) => (
                    <tr key={entry.userId || idx} style={{ borderBottom: '1px solid #1e293b' }}>
                      <td style={{ padding: '12px 14px', fontWeight: 700, color: idx < 3 ? '#fbbf24' : '#64748b', fontSize: '0.85rem' }}>
                        #{idx + 1}
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.85rem' }}>
                            {entry.displayName || entry.username}
                          </span>
                          <span style={{ fontSize: '0.7rem', color: '#64748b' }}>@{entry.username}</span>
                        </div>
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'center', fontWeight: 700, color: '#60a5fa', fontSize: '0.9rem' }}>
                        {entry.currentRating}
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'right', color: '#fbbf24', fontSize: '0.85rem', fontWeight: 600 }}>
                        {entry.totalXp} XP
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
