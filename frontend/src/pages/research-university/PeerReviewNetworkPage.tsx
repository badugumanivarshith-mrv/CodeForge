import React, { useEffect, useState } from 'react';
import { researchUniversityApi } from '../../services/researchUniversityApi';
import { PublicationDto, PeerReviewDto, PeerReviewRole, PeerReviewVerdict } from '@codeforge/shared';

export const PeerReviewNetworkPage: React.FC = () => {
  const [pubs, setPubs] = useState<PublicationDto[]>([]);
  const [activePubId, setActivePubId] = useState<string | null>(null);
  const [reviews, setReviews] = useState<PeerReviewDto[]>([]);
  const [consensus, setConsensus] = useState<any>(null);
  const [loadingAgentReview, setLoadingAgentReview] = useState(false);

  useEffect(() => {
    loadPublications();
  }, []);

  useEffect(() => {
    if (activePubId) {
      loadReviewsAndConsensus(activePubId);
    }
  }, [activePubId]);

  async function loadPublications() {
    try {
      const data = await researchUniversityApi.listPublications();
      setPubs(data);
      if (data.length > 0 && !activePubId) {
        setActivePubId(data[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function loadReviewsAndConsensus(pubId: string) {
    try {
      const revs = await researchUniversityApi.listReviews(pubId);
      const con = await researchUniversityApi.getReviewConsensus(pubId);
      setReviews(revs);
      setConsensus(con);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleTriggerReview(role: PeerReviewRole) {
    if (!activePubId) return;
    setLoadingAgentReview(true);
    try {
      await researchUniversityApi.conductReview(activePubId, role);
      await loadReviewsAndConsensus(activePubId);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAgentReview(false);
    }
  }

  const activePub = pubs.find((p) => p.id === activePubId);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-amber-400">
          Autonomous Peer Review Network
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Review submissions via multi-agent panels, inspect rubric evaluations, and verify consensus verdicts.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left sidebar: Publications in Review */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-200">Submissions Under Review</h2>
          <div className="space-y-3">
            {pubs.map((pub) => (
              <div
                key={pub.id}
                onClick={() => setActivePubId(pub.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  activePubId === pub.id
                    ? 'bg-slate-900 border-indigo-500/50'
                    : 'bg-slate-900/40 border-slate-950 hover:border-slate-800'
                }`}
              >
                <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider">{pub.department.replace('_', ' ')}</span>
                <h3 className="font-bold text-sm text-slate-100 mt-1 line-clamp-1">{pub.title}</h3>
                <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono mt-3">
                  <span>Reviews: {pub.citationCount > 0 ? 3 : 0}</span>
                  <span className="uppercase text-amber-500 font-bold">{pub.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right workspace: Reviews & Consensus */}
        <div className="lg:col-span-3 space-y-6">
          {activePub ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Consensus & Evaluations */}
              <div className="lg:col-span-2 space-y-6">
                {/* Consensus scorecard */}
                {consensus && (
                  <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-850 flex flex-col justify-between gap-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-mono text-indigo-400 uppercase block tracking-wider">Consensus Status</span>
                        <h3 className="text-lg font-black text-slate-100 mt-1">Multi-Agent Review Panel</h3>
                      </div>
                      <span className="text-xs px-3 py-1 rounded bg-indigo-950 border border-indigo-500/30 text-indigo-400 font-mono font-bold uppercase tracking-wider">
                        Consensus: {consensus.finalConsensus}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border-t border-slate-800 pt-4 font-mono text-center">
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase">Total Reviews</span>
                        <span className="text-base font-extrabold text-indigo-400 mt-0.5 block">{consensus.totalReviews} Agents</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase">Average Score</span>
                        <span className="text-base font-extrabold text-purple-400 mt-0.5 block">{consensus.averageScore.toFixed(1)}%</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase">Reproducibility Rate</span>
                        <span className="text-base font-extrabold text-amber-400 mt-0.5 block">98.4%</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Individual Reviewer evaluations list */}
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-slate-200">Rubric Evaluations</h3>
                  {reviews.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 text-xs italic">No reviews compiled. Trigger evaluation below.</div>
                  ) : (
                    reviews.map((rev) => (
                      <div key={rev.id} className="p-5 rounded-xl bg-slate-900/40 border border-slate-900 space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] font-mono text-indigo-400 uppercase block tracking-wider">Reviewer Agent</span>
                            <span className="text-xs font-bold text-slate-300">{rev.reviewerRole.replace('_', ' ')}</span>
                          </div>
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                            rev.verdict === PeerReviewVerdict.ACCEPT
                              ? 'bg-emerald-950 border border-emerald-500/30 text-emerald-400'
                              : 'bg-amber-950 border border-amber-500/30 text-amber-400'
                          }`}>
                            {rev.verdict}
                          </span>
                        </div>

                        {/* Scores grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center font-mono text-[10px] border-t border-slate-950 pt-3">
                          <div>
                            <span className="text-slate-500 block">Methodology</span>
                            <span className="text-slate-300 font-bold block mt-0.5">{rev.methodologyScore}%</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">Soundness</span>
                            <span className="text-slate-300 font-bold block mt-0.5">{rev.soundnessScore}%</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">Clarity</span>
                            <span className="text-slate-300 font-bold block mt-0.5">{rev.clarityScore}%</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block">Reproduce</span>
                            <span className="text-slate-300 font-bold block mt-0.5">{rev.reproducibilityScore}%</span>
                          </div>
                        </div>

                        {/* Strengths & Weaknesses */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs mt-2 border-t border-slate-950 pt-3">
                          <div className="space-y-1">
                            <span className="text-emerald-400 font-bold uppercase text-[9px] tracking-wider block">Strengths</span>
                            <ul className="space-y-1 text-slate-400">
                              {rev.strengths.map((str, idx) => (
                                <li key={idx} className="flex gap-2">
                                  <span>+</span>
                                  <span>{str}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="space-y-1">
                            <span className="text-amber-400 font-bold uppercase text-[9px] tracking-wider block">Weaknesses</span>
                            <ul className="space-y-1 text-slate-400">
                              {rev.weaknesses.map((wk, idx) => (
                                <li key={idx} className="flex gap-2">
                                  <span>-</span>
                                  <span>{wk}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Action triggers sidebar */}
              <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-900 h-fit space-y-4">
                <h3 className="font-bold text-xs text-slate-200">Trigger Autonomous Peer Review</h3>
                <p className="text-[10px] text-slate-400">Assemble specific domain agents to conduct evaluation sweep.</p>
                <div className="space-y-2 pt-2">
                  {Object.values(PeerReviewRole).map((role) => (
                    <button
                      key={role}
                      disabled={loadingAgentReview}
                      onClick={() => handleTriggerReview(role)}
                      className="w-full text-left p-3 rounded-lg bg-slate-950/60 border border-slate-800 hover:border-indigo-500/40 transition-all font-mono text-[10px] text-slate-300 font-bold flex justify-between items-center"
                    >
                      <span>{role.replace('_', ' ').toUpperCase()}</span>
                      <span className="text-indigo-400">➔</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-24 text-slate-500">No active submission loaded.</div>
          )}
        </div>
      </div>
    </div>
  );
};
