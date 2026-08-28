import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  Building,
  CheckCircle2,
  Trophy,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { placementApi } from '../services/placementApi';
import { HiringChallengeDto, HiringChallengeStandingDto } from '@codeforge/shared';

export const HiringChallengesPage: React.FC = () => {
  const [challenges, setChallenges] = useState<HiringChallengeDto[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState<HiringChallengeDto | null>(null);
  const [standings, setStandings] = useState<HiringChallengeStandingDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [standingsLoading, setStandingsLoading] = useState(false);

  useEffect(() => {
    loadChallenges();
  }, []);

  const loadChallenges = async () => {
    try {
      setLoading(true);
      const res = await placementApi.listHiringChallenges();
      setChallenges(res);
      if (res.length > 0) {
        setSelectedChallenge(res[0]);
        loadStandings(res[0].id);
      }
    } catch (err) {
      console.error('Failed to load challenges:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadStandings = async (challengeId: string) => {
    try {
      setStandingsLoading(true);
      const res = await placementApi.getHiringChallengeStandings(challengeId);
      setStandings(res);
    } catch (err) {
      console.error('Failed to load standings:', err);
    } finally {
      setStandingsLoading(false);
    }
  };

  const handleSelectChallenge = (c: HiringChallengeDto) => {
    setSelectedChallenge(c);
    loadStandings(c.id);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-indigo-950/40 border border-slate-800 rounded-2xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-medium">
              <Award className="w-3.5 h-3.5" /> Company Hiring Contests
            </div>
            <h1 className="text-3xl font-extrabold text-white">Recruiter Coding Challenges</h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              Compete in timed algorithmic hackathons hosted by Tier-1 employers. Top ranking engineers with scores exceeding company benchmarks earn automatic shortlisting to technical interview rounds.
            </p>
          </div>

          <Link
            to="/contests"
            className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold transition flex items-center gap-2 shadow-lg shadow-amber-600/30 self-start md:self-auto"
          >
            <Trophy className="w-4 h-4" /> View Arena Contests
          </Link>
        </div>

        {loading ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
          </div>
        ) : challenges.length === 0 ? (
          <div className="p-12 text-center bg-slate-900/60 border border-slate-800 rounded-2xl text-slate-500 space-y-3">
            <Award className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-300">No Active Challenges Currently Scheduled</h3>
            <p className="text-xs text-slate-500">
              New company hackathons and algorithmic hiring sprints are posted weekly.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Challenges List */}
            <div className="space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                Company Challenges ({challenges.length})
              </h2>
              <div className="space-y-3">
                {challenges.map(c => {
                  const isSelected = selectedChallenge?.id === c.id;
                  return (
                    <div
                      key={c.id}
                      onClick={() => handleSelectChallenge(c)}
                      className={`p-5 rounded-xl border cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? 'bg-amber-950/30 border-amber-500/50 shadow-lg'
                          : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <h3 className="font-bold text-sm text-white">{c.title}</h3>
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-800 text-amber-400 border border-slate-700">
                          {c.targetRole}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Building className="w-3.5 h-3.5 text-slate-500" />
                        <span>{c.companyName}</span>
                        <span>•</span>
                        <span>Min Score: {c.minScoreThreshold} pts</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Standings and Challenge Details (2 Cols) */}
            {selectedChallenge && (
              <div className="lg:col-span-2 space-y-6">
                {/* Challenge Summary */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <span className="text-xs font-bold uppercase text-amber-400">
                        {selectedChallenge.companyName} Hiring Challenge
                      </span>
                      <h2 className="text-xl font-bold text-white mt-0.5">{selectedChallenge.title}</h2>
                    </div>

                    <Link
                      to={`/contests/${selectedChallenge.contestId}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold transition self-start sm:self-auto shadow-lg shadow-amber-600/30"
                    >
                      Enter Coding Arena <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                    {selectedChallenge.description}
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800 text-xs">
                    <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800/80">
                      <span className="text-slate-500 block">Target Role</span>
                      <span className="font-semibold text-slate-200">{selectedChallenge.targetRole}</span>
                    </div>
                    <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800/80">
                      <span className="text-slate-500 block">Min Benchmark</span>
                      <span className="font-semibold text-amber-400">{selectedChallenge.minScoreThreshold} pts</span>
                    </div>
                    <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800/80">
                      <span className="text-slate-500 block">Auto Shortlisting</span>
                      <span className="font-semibold text-emerald-400">
                        {selectedChallenge.autoShortlist ? 'Enabled' : 'Manual'}
                      </span>
                    </div>
                    <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800/80">
                      <span className="text-slate-500 block">Registered</span>
                      <span className="font-semibold text-slate-200">{selectedChallenge.participantCount} Developers</span>
                    </div>
                  </div>
                </div>

                {/* Real-Time Standings */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white text-base flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-amber-400" /> Real-Time Challenge Standings
                    </h3>
                  </div>

                  {standingsLoading ? (
                    <div className="py-10 flex justify-center">
                      <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
                    </div>
                  ) : standings.length === 0 ? (
                    <div className="p-8 text-center text-xs text-slate-500">
                      No submissions recorded yet. Be the first to solve the challenge problems!
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-slate-800 text-slate-400">
                            <th className="pb-3 pl-2">Rank</th>
                            <th className="pb-3">Candidate</th>
                            <th className="pb-3">Elo Rating</th>
                            <th className="pb-3">Score</th>
                            <th className="pb-3">Penalty Time</th>
                            <th className="pb-3 text-right pr-2">Shortlist Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60">
                          {standings.map(s => (
                            <tr key={s.userId} className="hover:bg-slate-800/30 transition">
                              <td className="py-3 pl-2 font-bold text-slate-300">#{s.rank}</td>
                              <td className="py-3 font-semibold text-white">{s.fullName}</td>
                              <td className="py-3 text-indigo-400">{s.rating}</td>
                              <td className="py-3 font-bold text-amber-400">{s.score} pts</td>
                              <td className="py-3 text-slate-400">{s.penaltyTimeMinutes}m</td>
                              <td className="py-3 text-right pr-2">
                                {s.isShortlisted ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                                    <CheckCircle2 className="w-3 h-3" /> Shortlisted
                                  </span>
                                ) : (
                                  <span className="text-slate-500 text-[11px]">In Review</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
