import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Building,
  MapPin,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  DollarSign,
  Send,
  Loader2,
  Check,
} from 'lucide-react';
import { placementApi } from '../services/placementApi';
import { JobPostingDto, JobMatchScoreDto } from '@codeforge/shared';

export const JobDetailPage: React.FC = () => {
  const { idOrSlug } = useParams<{ idOrSlug: string }>();
  const [job, setJob] = useState<JobPostingDto | null>(null);
  const [match, setMatch] = useState<JobMatchScoreDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [matchLoading, setMatchLoading] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [applySubmitted, setApplySubmitted] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (idOrSlug) {
      loadJobDetails(idOrSlug);
    }
  }, [idOrSlug]);

  const loadJobDetails = async (id: string) => {
    try {
      setLoading(true);
      const res = await placementApi.getJob(id);
      setJob(res);
      loadMatchScore(res.id);
    } catch (err) {
      console.error('Failed to load job details:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMatchScore = async (jobId: string) => {
    try {
      setMatchLoading(true);
      const matchRes = await placementApi.calculateJobMatch(jobId);
      setMatch(matchRes);
    } catch (err) {
      console.warn('Match score calculation unavailable without candidate profile:', err);
    } finally {
      setMatchLoading(false);
    }
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!job) return;

    try {
      setIsApplying(true);
      setErrorMsg('');
      await placementApi.applyForJob({
        jobId: job.id,
        coverLetter: coverLetter || undefined,
      });
      setApplySubmitted(true);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || err.message || 'Failed to submit application.');
    } finally {
      setIsApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 py-16 px-4 text-center">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold">Job Posting Not Found</h2>
        <Link to="/jobs" className="mt-4 inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300">
          <ArrowLeft className="w-4 h-4" /> Back to Job Board
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Navigation back */}
        <Link
          to="/jobs"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Explore Jobs
        </Link>

        {/* Top Job Header */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl backdrop-blur-md flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-indigo-400 uppercase tracking-wider">
                {job.jobType.replace(/_/g, ' ')}
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-sm text-slate-400">{job.experienceLevel}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{job.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300 pt-1">
              <span className="font-semibold text-slate-100 flex items-center gap-1.5">
                <Building className="w-4 h-4 text-slate-400" /> {job.companyName}
                {job.isCompanyVerified && (
                  <span title="Verified Employer">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 inline" />
                  </span>
                )}
              </span>
              <span className="flex items-center gap-1 text-slate-400">
                <MapPin className="w-4 h-4 text-slate-500" /> {job.location} ({job.workplaceType})
              </span>
              {job.minSalary && job.maxSalary && (
                <span className="flex items-center gap-1 text-emerald-400 font-medium">
                  <DollarSign className="w-4 h-4" /> ${(job.minSalary / 1000).toFixed(0)}k - $
                  {(job.maxSalary / 1000).toFixed(0)}k / year
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {applySubmitted ? (
              <div className="px-5 py-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-sm font-semibold flex items-center gap-2">
                <Check className="w-4 h-4" /> Application Submitted
              </div>
            ) : (
              <button
                onClick={() => {
                  const modal = document.getElementById('apply-modal');
                  if (modal) modal.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition shadow-lg shadow-indigo-600/30"
              >
                Apply Now
              </button>
            )}
            <Link
              to={`/referrals?jobId=${job.id}`}
              className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-sm font-medium transition"
            >
              Request Referral
            </Link>
          </div>
        </div>

        {/* 2-Column Layout: Job Specs vs AI Match Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Details (2 Cols) */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="text-lg font-bold text-white mb-3">Role Overview</h2>
                <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                  {job.description}
                </div>
              </div>

              <div className="border-t border-slate-800/80 pt-6">
                <h2 className="text-lg font-bold text-white mb-3">Key Requirements & Competencies</h2>
                <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                  {job.requirements}
                </div>
              </div>

              <div className="border-t border-slate-800/80 pt-6">
                <h2 className="text-lg font-bold text-white mb-3">Required Technical Stack</h2>
                <div className="flex flex-wrap gap-2">
                  {job.skillsRequired.map(skill => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 rounded-lg bg-slate-800/90 border border-slate-700 text-slate-200 text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Application Section */}
            <div id="apply-modal" className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Send className="w-5 h-5 text-indigo-400" /> Apply with CodeForge Verified Credentials
                </h2>
                <p className="text-xs text-slate-400">
                  Your verified arena ratings, assessment benchmarks, and published projects will automatically accompany your application.
                </p>
              </div>

              {applySubmitted ? (
                <div className="p-6 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                  <h3 className="text-base font-bold text-white">Application Received!</h3>
                  <p className="text-xs text-slate-400">
                    The recruiter has been notified. You can track application stages and scheduled interviews in your candidate pipeline.
                  </p>
                  <Link
                    to="/my-applications"
                    className="inline-block mt-3 px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition"
                  >
                    View Application Status
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleApply} className="space-y-4">
                  {errorMsg && (
                    <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs">
                      {errorMsg}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Cover Letter or Highlights (Optional)
                    </label>
                    <textarea
                      rows={4}
                      value={coverLetter}
                      onChange={e => setCoverLetter(e.target.value)}
                      placeholder="Briefly highlight why your technical background and problem-solving experience match this role..."
                      className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isApplying}
                    className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-semibold transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30"
                  >
                    {isApplying ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    Submit Verified Application
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* AI Match Gauge & Breakdown Sidebar (1 Col) */}
          <div className="space-y-6">
            <div className="bg-gradient-to-b from-slate-900/90 to-slate-950 border border-indigo-500/30 rounded-2xl p-6 shadow-xl backdrop-blur-md space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-400" />
                  <h3 className="font-bold text-white text-base">AI Candidate Match</h3>
                </div>
                {match && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-950 border border-indigo-500/40 text-indigo-300">
                    {match.category.replace(/_/g, ' ')}
                  </span>
                )}
              </div>

              {matchLoading ? (
                <div className="py-8 flex justify-center">
                  <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
                </div>
              ) : match ? (
                <div className="space-y-6">
                  {/* Gauge */}
                  <div className="text-center py-2">
                    <div className="text-4xl font-extrabold text-white tracking-tight">
                      {match.overallScore}
                      <span className="text-lg text-slate-400 font-normal"> / 100</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Multi-Dimensional Match Index</p>
                  </div>

                  {/* Dimension Bars */}
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-300">Skill Overlap (35%)</span>
                        <span className="text-indigo-400 font-semibold">{match.breakdown.skillScore}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${match.breakdown.skillScore}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-300">Contest Elo Rating (20%)</span>
                        <span className="text-indigo-400 font-semibold">{match.breakdown.ratingScore}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${match.breakdown.ratingScore}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-300">Assessment Benchmark (15%)</span>
                        <span className="text-indigo-400 font-semibold">{match.breakdown.assessmentScore}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500 rounded-full" style={{ width: `${match.breakdown.assessmentScore}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-300">Portfolio & Career Alignment (30%)</span>
                        <span className="text-indigo-400 font-semibold">
                          {Math.round((match.breakdown.portfolioScore + match.breakdown.careerGoalScore + match.breakdown.resumeScore) / 3)}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{
                            width: `${Math.round((match.breakdown.portfolioScore + match.breakdown.careerGoalScore + match.breakdown.resumeScore) / 3)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Matched vs Missing Skills */}
                  <div className="space-y-3 pt-4 border-t border-slate-800">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Verified Matched Skills</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {match.matchedSkills.length > 0 ? (
                          match.matchedSkills.map(s => (
                            <span key={s} className="px-2 py-0.5 rounded-md text-xs bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                              ✓ {s}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-500 italic">No exact skill overlap detected</span>
                        )}
                      </div>
                    </div>

                    {match.missingSkills.length > 0 && (
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Recommended Gap Bridging</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {match.missingSkills.map(s => (
                            <span key={s} className="px-2 py-0.5 rounded-md text-xs bg-amber-950/80 text-amber-300 border border-amber-500/30">
                              + {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* AI Strategic Insights */}
                  {match.insights.length > 0 && (
                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                      <h4 className="text-xs font-bold text-indigo-300">Strategic Match Notes:</h4>
                      <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
                        {match.insights.map((ins, i) => (
                          <li key={i}>{ins}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-6 text-xs text-slate-500">
                  Log in to generate real-time AI placement scoring against your profile.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
