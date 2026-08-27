import React from 'react';
import { ContestLeaderboardDto } from '@codeforge/shared';
import { Trophy, Medal } from 'lucide-react';


interface ContestLeaderboardTableProps {
  leaderboard: ContestLeaderboardDto;
}

export const ContestLeaderboardTable: React.FC<ContestLeaderboardTableProps> = ({ leaderboard }) => {
  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return <Medal size={18} color="#fbbf24" />;
      case 2:
        return <Medal size={18} color="#94a3b8" />;
      case 3:
        return <Medal size={18} color="#b45309" />;
      default:
        return <span style={{ fontWeight: 700, color: '#64748b', fontSize: '0.9rem' }}>#{rank}</span>;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Trophy size={18} color="#f59e0b" />
          <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#f8fafc', fontWeight: 600 }}>
            Live Contest Standings
          </h3>
        </div>
        <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
          {leaderboard.totalParticipants} Participants
        </span>
      </div>

      <div
        style={{
          border: '1px solid #1e293b',
          borderRadius: '12px',
          overflow: 'hidden',
          background: 'rgba(15, 23, 42, 0.6)',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#0b0f17', borderBottom: '1px solid #1e293b', color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '12px 16px', width: '60px' }}>Rank</th>
              <th style={{ padding: '12px 16px' }}>Competitor</th>
              <th style={{ padding: '12px 16px', textAlign: 'center' }}>Score</th>
              <th style={{ padding: '12px 16px', textAlign: 'center' }}>Penalty</th>
              <th style={{ padding: '12px 16px', textAlign: 'center' }}>Solved</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.entries.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>
                  No participants on the leaderboard yet.
                </td>
              </tr>
            ) : (
              leaderboard.entries.map((entry, idx) => (
                <tr
                  key={entry.userId || idx}
                  style={{
                    borderBottom: '1px solid #1e293b',
                    background: idx === 0 ? 'rgba(245, 158, 11, 0.05)' : 'transparent',
                  }}
                >
                  <td style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {getRankBadge(entry.rank)}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background: '#1e293b',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#f8fafc',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                        }}
                      >
                        {entry.username.charAt(0).toUpperCase()}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.9rem' }}>
                          {entry.displayName || entry.username}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>@{entry.username}</span>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'center', fontWeight: 700, color: '#fbbf24', fontSize: '0.95rem' }}>
                    {entry.score}
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem', fontFamily: 'monospace' }}>
                    {entry.penaltyTimeMinutes}m
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: '6px',
                        background: 'rgba(16, 185, 129, 0.15)',
                        color: '#34d399',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                      }}
                    >
                      {entry.solvedProblemsCount}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
