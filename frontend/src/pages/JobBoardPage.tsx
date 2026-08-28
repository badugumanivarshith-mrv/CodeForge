import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Building,
  MapPin,
  Sparkles,
  Search,
  CheckCircle2,
  Award,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { placementApi } from '../services/placementApi';
import { JobPostingDto, JobRecommendationDto, MatchCategory, JobType, WorkplaceType } from '@codeforge/shared';

export const JobBoardPage: React.FC = () => {
  const [jobs, setJobs] = useState<JobPostingDto[]>([]);
  const [recommendations, setRecommendations] = useState<JobRecommendationDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [jobType, setJobType] = useState<string>('');
  const [workplaceType, setWorkplaceType] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'all' | 'recommended'>('all');

  useEffect(() => {
    loadJobs();
    loadRecommendations();
  }, [search, jobType, workplaceType]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const res = await placementApi.listJobs({
        search: search || undefined,
        jobType: (jobType as JobType) || undefined,
        workplaceType: (workplaceType as WorkplaceType) || undefined,
      });
      setJobs(res.jobs);
    } catch (err) {
      console.error('Failed to load jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadRecommendations = async () => {
    try {
      const res = await placementApi.getRecommendedJobs(6);
      setRecommendations(res);
    } catch (err) {
      console.error('Failed to load recommendations:', err);
    }
  };

  const getMatchBadge = (category?: MatchCategory, score?: number) => {
    if (score === undefined && !category) return null;
    let color = 'bg-slate-800 text-slate-400 border-slate-700';
    let label = 'Partial Match';

    if (category === MatchCategory.STRONG_MATCH || (score && score >= 80)) {
      color = 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40';
      label = 'Strong Match';
    } else if (category === MatchCategory.GOOD_MATCH || (score && score >= 65)) {
      color = 'bg-blue-950/80 text-blue-300 border-blue-500/40';
      label = 'Good Match';
    } else if (category === MatchCategory.PARTIAL_MATCH || (score && score >= 45)) {
      color = 'bg-amber-950/80 text-amber-300 border-amber-500/40';
      label = 'Partial Match';
    }

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${color}`}>
        <Sparkles className="w-3 h-3" />
        {score ? `${score}% Match` : label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Banner */}
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-slate-900 border border-slate-800 p-8 sm:p-10 shadow-2xl backdrop-blur-xl">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-medium">
              <Award className="w-3.5 h-3.5" /> AI Placement & Talent Marketplace
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-indigo-200">
              Verified Engineering Careers & Direct Hiring Pipelines
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Match with Tier-1 tech companies based on your verified code ratings, algorithmic masteries, and AI interview readiness benchmarks.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/advisor"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition shadow-lg shadow-indigo-600/30"
              >
                <Sparkles className="w-4 h-4" /> AI Career Advisor
              </Link>
              <Link
                to="/referrals"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium border border-slate-700 transition"
              >
                <TrendingUp className="w-4 h-4" /> Referral Network
              </Link>
              <Link
                to="/hiring-challenges"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium border border-slate-700 transition"
              >
                <Award className="w-4 h-4" /> Company Challenges
              </Link>
              <Link
                to="/recruiter"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 text-sm font-medium transition"
              >
                <Building className="w-4 h-4" /> Recruiter Portal
              </Link>
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 sm:p-5 shadow-lg backdrop-blur-md space-y-4 sm:space-y-0 sm:flex sm:items-center sm:gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by job title, technologies, or keywords..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <select
              value={jobType}
              onChange={e => setJobType(e.target.value)}
              className="px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-lg text-sm text-slate-300 focus:outline-none focus:border-indigo-500 transition"
            >
              <option value="">All Employment Types</option>
              <option value="full_time">Full-Time</option>
              <option value="part_time">Part-Time</option>
              <option value="internship">Internship</option>
              <option value="contract">Contract</option>
            </select>

            <select
              value={workplaceType}
              onChange={e => setWorkplaceType(e.target.value)}
              className="px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-lg text-sm text-slate-300 focus:outline-none focus:border-indigo-500 transition"
            >
              <option value="">All Workplaces</option>
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
              <option value="on_site">On-Site</option>
            </select>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-4 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex items-center gap-2 pb-2 text-sm font-semibold transition border-b-2 ${
              activeTab === 'all'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Briefcase className="w-4 h-4" /> All Active Postings ({jobs.length})
          </button>
          <button
            onClick={() => setActiveTab('recommended')}
            className={`flex items-center gap-2 pb-2 text-sm font-semibold transition border-b-2 ${
              activeTab === 'recommended'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4" /> AI Recommended Matches ({recommendations.length})
          </button>
        </div>

        {/* Job Listings Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="h-48 rounded-xl bg-slate-900/60 border border-slate-800 animate-pulse" />
            ))}
          </div>
        ) : activeTab === 'recommended' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendations.length === 0 ? (
              <div className="col-span-2 text-center py-16 text-slate-500">
                <Sparkles className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p>No customized AI matches generated yet. Complete arena problems to unlock precision matching.</p>
              </div>
            ) : (
              recommendations.map(rec => (
                <div
                  key={rec.job.id}
                  className="group relative rounded-xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-indigo-500/20 hover:border-indigo-500/50 p-6 shadow-xl transition-all duration-200 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition">
                            {rec.job.title}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                          <span className="font-medium text-slate-300">{rec.job.companyName}</span>
                          {rec.job.isCompanyVerified && (
                            <span title="Verified Company">
                              <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 inline" />
                            </span>
                          )}
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-500" /> {rec.job.location}
                          </span>
                        </div>
                      </div>
                      {getMatchBadge(rec.match.category, rec.match.overallScore)}
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2">{rec.job.description}</p>

                    <div className="flex flex-wrap gap-1.5">
                      {rec.job.skillsRequired.slice(0, 4).map(skill => {
                        const isMatched = rec.match.matchedSkills.includes(skill.toLowerCase());
                        return (
                          <span
                            key={skill}
                            className={`px-2 py-0.5 rounded-md text-xs font-medium ${
                              isMatched
                                ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {skill}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-5 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                    <div className="text-xs text-slate-400">
                      {rec.job.minSalary && rec.job.maxSalary ? (
                        <span className="font-semibold text-slate-200">
                          ${(rec.job.minSalary / 1000).toFixed(0)}k - ${(rec.job.maxSalary / 1000).toFixed(0)}k / yr
                        </span>
                      ) : (
                        <span>Competitive Salary</span>
                      )}
                    </div>
                    <Link
                      to={`/jobs/${rec.job.slug || rec.job.id}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-400 group-hover:text-indigo-300 transition"
                    >
                      View Role & Apply <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobs.length === 0 ? (
              <div className="col-span-2 text-center py-16 text-slate-500">
                <Briefcase className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p>No job postings match your selected filters.</p>
              </div>
            ) : (
              jobs.map(job => (
                <div
                  key={job.id}
                  className="group relative rounded-xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 p-6 shadow-md transition-all duration-200 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition">
                          {job.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                          <span className="font-medium text-slate-300">{job.companyName}</span>
                          {job.isCompanyVerified && (
                            <span title="Verified Company">
                              <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 inline" />
                            </span>
                          )}
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-500" /> {job.location}
                          </span>
                        </div>
                      </div>
                      {job.matchScore ? getMatchBadge(job.matchCategory, job.matchScore) : (
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-400 border border-slate-700">
                          {job.workplaceType.toUpperCase()}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2">{job.description}</p>

                    <div className="flex flex-wrap gap-1.5">
                      {job.skillsRequired.slice(0, 5).map(skill => (
                        <span key={skill} className="px-2 py-0.5 rounded-md text-xs font-medium bg-slate-800 text-slate-300">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-5 mt-4 border-t border-slate-800 flex items-center justify-between">
                    <div className="text-xs text-slate-400">
                      {job.minSalary && job.maxSalary ? (
                        <span className="font-semibold text-slate-200">
                          ${(job.minSalary / 1000).toFixed(0)}k - ${(job.maxSalary / 1000).toFixed(0)}k / yr
                        </span>
                      ) : (
                        <span>Competitive Salary</span>
                      )}
                    </div>
                    <Link
                      to={`/jobs/${job.slug || job.id}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-400 group-hover:text-indigo-300 transition"
                    >
                      View Role <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
