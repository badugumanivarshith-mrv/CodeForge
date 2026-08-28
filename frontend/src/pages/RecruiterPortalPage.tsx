import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Building,
  Calendar,
  Plus,
  Clock,
  CheckCircle2,
  Video,
  Loader2,
} from 'lucide-react';
import { placementApi } from '../services/placementApi';
import {
  RecruiterProfileDto,
  JobPostingDto,
  JobApplicationDto,
  TalentAnalyticsDto,
  HiringInterviewDto,
  ApplicationStage,
  JobType,
  WorkplaceType,
  HiringInterviewType,
  OfferRecommendation,
} from '@codeforge/shared';

const KANBAN_STAGES: { stage: ApplicationStage; label: string; color: string }[] = [
  { stage: ApplicationStage.APPLIED, label: 'Applied', color: 'border-slate-700 bg-slate-900/60' },
  { stage: ApplicationStage.SCREENING, label: 'Screening', color: 'border-blue-500/40 bg-blue-950/20' },
  { stage: ApplicationStage.INTERVIEW, label: 'Interview', color: 'border-indigo-500/40 bg-indigo-950/20' },
  { stage: ApplicationStage.TECHNICAL_ROUND, label: 'Technical', color: 'border-purple-500/40 bg-purple-950/20' },
  { stage: ApplicationStage.HR_ROUND, label: 'HR Round', color: 'border-amber-500/40 bg-amber-950/20' },
  { stage: ApplicationStage.OFFER, label: 'Offer', color: 'border-emerald-500/40 bg-emerald-950/20' },
  { stage: ApplicationStage.HIRED, label: 'Hired', color: 'border-teal-500/40 bg-teal-950/20' },
];

export const RecruiterPortalPage: React.FC = () => {
  const [profile, setProfile] = useState<RecruiterProfileDto | null>(null);
  const [activeTab, setActiveTab] = useState<'pipeline' | 'jobs' | 'schedule' | 'analytics' | 'register'>('pipeline');
  const [loading, setLoading] = useState(true);

  // Recruiter Registration Form
  const [regCompanyName, setRegCompanyName] = useState('');
  const [regTitle, setRegTitle] = useState('Technical Recruiter');
  const [regDept, setRegDept] = useState('Talent Acquisition');
  const [regLinkedin, setRegLinkedin] = useState('');
  const [regWebsite, setRegWebsite] = useState('');
  const [regIndustry, setRegIndustry] = useState('Technology / Software');

  // Recruiter Data
  const [jobs, setJobs] = useState<JobPostingDto[]>([]);
  const [applications, setApplications] = useState<JobApplicationDto[]>([]);
  const [analytics, setAnalytics] = useState<TalentAnalyticsDto | null>(null);
  const [interviews, setInterviews] = useState<HiringInterviewDto[]>([]);

  // Create Job Form
  const [showCreateJob, setShowCreateJob] = useState(false);
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newJobDesc, setNewJobDesc] = useState('');
  const [newJobReqs, setNewJobReqs] = useState('');
  const [newJobSkills, setNewJobSkills] = useState('TypeScript, PostgreSQL, Algorithms, Redis');
  const [newJobType, setNewJobType] = useState<JobType>(JobType.FULL_TIME);
  const [newJobWorkplace, setNewJobWorkplace] = useState<WorkplaceType>(WorkplaceType.REMOTE);
  const [newJobLocation, setNewJobLocation] = useState('Remote');
  const [newJobMinSalary, setNewJobMinSalary] = useState(120000);
  const [newJobMaxSalary, setNewJobMaxSalary] = useState(160000);

  // Schedule Interview Form
  const [selectedAppForSchedule, setSelectedAppForSchedule] = useState<JobApplicationDto | null>(null);
  const [interviewType, setInterviewType] = useState<HiringInterviewType>(HiringInterviewType.TECHNICAL);
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewDuration, setInterviewDuration] = useState(45);

  // Feedback Form
  const [selectedInterviewForFeedback, setSelectedInterviewForFeedback] = useState<HiringInterviewDto | null>(null);
  const [feedbackNotes, setFeedbackNotes] = useState('');
  const [techScore, setTechScore] = useState(4);
  const [commScore, setCommScore] = useState(4);
  const [psScore, setPsScore] = useState(4);
  const [offerRec, setOfferRec] = useState<OfferRecommendation>(OfferRecommendation.HIRE);

  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    loadRecruiter();
  }, []);

  const loadRecruiter = async () => {
    try {
      setLoading(true);
      const prof = await placementApi.getRecruiterProfile();
      setProfile(prof);
      if (prof) {
        await loadCompanyData(prof.companyId);
      } else {
        setActiveTab('register');
      }
    } catch (err) {
      console.warn('Recruiter profile not registered:', err);
      setActiveTab('register');
    } finally {
      setLoading(false);
    }
  };

  const loadCompanyData = async (companyId: string) => {
    try {
      const [jobRes, appRes, anaRes, intRes] = await Promise.all([
        placementApi.listJobs({ companyId }),
        placementApi.getCompanyApplications(companyId),
        placementApi.getTalentAnalytics(companyId),
        placementApi.getCompanyInterviews(companyId),
      ]);
      setJobs(jobRes.jobs);
      setApplications(appRes);
      setAnalytics(anaRes);
      setInterviews(intRes);
    } catch (err) {
      console.error('Failed to load company recruiter data:', err);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setErrorMsg('');
      const prof = await placementApi.registerRecruiter({
        companyName: regCompanyName,
        title: regTitle,
        department: regDept,
        linkedinUrl: regLinkedin,
        website: regWebsite,
        industry: regIndustry,
      });
      setProfile(prof);
      setActiveTab('pipeline');
      await loadCompanyData(prof.companyId);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || err.message || 'Failed to register recruiter.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setErrorMsg('');
      setMessage('');
      await placementApi.createJob({
        title: newJobTitle,
        description: newJobDesc,
        requirements: newJobReqs,
        skillsRequired: newJobSkills.split(',').map(s => s.trim()).filter(Boolean),
        jobType: newJobType,
        workplaceType: newJobWorkplace,
        location: newJobLocation,
        minSalary: Number(newJobMinSalary),
        maxSalary: Number(newJobMaxSalary),
        experienceLevel: 'Mid-Senior Level',
      });
      setMessage('Job posting published successfully!');
      setShowCreateJob(false);
      if (profile) loadCompanyData(profile.companyId);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || err.message || 'Failed to create job.');
    }
  };

  const handleAdvanceStage = async (applicationId: string, nextStage: ApplicationStage) => {
    try {
      await placementApi.updateApplicationStage(applicationId, { stage: nextStage });
      if (profile) loadCompanyData(profile.companyId);
    } catch (err) {
      console.error('Failed to advance application stage:', err);
    }
  };

  const handleScheduleInterview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppForSchedule) return;

    try {
      setErrorMsg('');
      setMessage('');
      await placementApi.scheduleInterview({
        applicationId: selectedAppForSchedule.id,
        interviewType,
        scheduledAt: interviewDate || new Date(Date.now() + 86400000).toISOString(),
        durationMinutes: Number(interviewDuration),
      });
      setMessage('Interview scheduled and invitation dispatched.');
      setSelectedAppForSchedule(null);
      if (profile) loadCompanyData(profile.companyId);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || err.message || 'Failed to schedule interview.');
    }
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInterviewForFeedback) return;

    try {
      setErrorMsg('');
      setMessage('');
      await placementApi.submitInterviewFeedback(selectedInterviewForFeedback.id, {
        feedbackNotes,
        technicalScore: techScore,
        communicationScore: commScore,
        problemSolvingScore: psScore,
        recommendation: offerRec,
      });
      setMessage('Interview feedback & scorecard successfully logged.');
      setSelectedInterviewForFeedback(null);
      if (profile) loadCompanyData(profile.companyId);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || err.message || 'Failed to submit scorecard.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-950/70 via-slate-900 to-indigo-950/60 border border-slate-800 rounded-2xl p-8 shadow-2xl backdrop-blur-xl flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-medium">
              <Building className="w-3.5 h-3.5" /> Recruiter Management & ATS Pipeline
            </div>
            <h1 className="text-3xl font-extrabold text-white">
              {profile ? `${profile.companyName} Hiring Portal` : 'Recruiter & Company Platform'}
            </h1>
            <p className="text-slate-300 text-sm">
              {profile
                ? `Logged in as ${profile.title} • ${profile.department || 'Talent'}`
                : 'Register your company account to post jobs, manage candidate ATS pipelines, and schedule interviews.'}
            </p>
          </div>

          {profile && (
            <div className="flex gap-3">
              <button
                onClick={() => setShowCreateJob(true)}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition flex items-center gap-2 shadow-lg shadow-indigo-600/30"
              >
                <Plus className="w-4 h-4" /> Post New Engineering Role
              </button>
            </div>
          )}
        </div>

        {message && (
          <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> {message}
          </div>
        )}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs">
            {errorMsg}
          </div>
        )}

        {/* Tab Navigation */}
        {profile && (
          <div className="flex items-center gap-6 border-b border-slate-800 pb-3">
            <button
              onClick={() => setActiveTab('pipeline')}
              className={`pb-2 text-sm font-semibold transition border-b-2 ${
                activeTab === 'pipeline'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Candidate Pipeline ({applications.length})
            </button>
            <button
              onClick={() => setActiveTab('jobs')}
              className={`pb-2 text-sm font-semibold transition border-b-2 ${
                activeTab === 'jobs'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Job Postings ({jobs.length})
            </button>
            <button
              onClick={() => setActiveTab('schedule')}
              className={`pb-2 text-sm font-semibold transition border-b-2 ${
                activeTab === 'schedule'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Interviews & Scorecards ({interviews.length})
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`pb-2 text-sm font-semibold transition border-b-2 ${
                activeTab === 'analytics'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Talent Analytics
            </button>
          </div>
        )}

        {/* Tab Contents */}
        {loading ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
          </div>
        ) : activeTab === 'register' || !profile ? (
          /* Recruiter Onboarding Form */
          <div className="max-w-xl mx-auto bg-slate-900/90 border border-slate-800 rounded-2xl p-8 space-y-6 shadow-2xl">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Building className="w-5 h-5 text-purple-400" /> Onboard as an Employer & Recruiter
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Post high-impact software engineering roles and tap into CodeForge verified talent.
              </p>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  value={regCompanyName}
                  onChange={e => setRegCompanyName(e.target.value)}
                  placeholder="e.g. OpenAI / Datadog / Stripe"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-purple-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Your Job Title</label>
                <input
                  type="text"
                  required
                  value={regTitle}
                  onChange={e => setRegTitle(e.target.value)}
                  placeholder="Lead Technical Recruiter"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-purple-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Department</label>
                <input
                  type="text"
                  value={regDept}
                  onChange={e => setRegDept(e.target.value)}
                  placeholder="Engineering Talent Acquisition"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-purple-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">LinkedIn Profile</label>
                <input
                  type="url"
                  value={regLinkedin}
                  onChange={e => setRegLinkedin(e.target.value)}
                  placeholder="https://linkedin.com/in/recruiter"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-purple-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Company Website</label>
                <input
                  type="url"
                  value={regWebsite}
                  onChange={e => setRegWebsite(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-purple-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Industry</label>
                <input
                  type="text"
                  value={regIndustry}
                  onChange={e => setRegIndustry(e.target.value)}
                  placeholder="e.g. Cloud Infrastructure / AI"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-purple-500 transition"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold transition shadow-lg shadow-purple-600/30"
              >
                Complete Recruiter Setup
              </button>
            </form>
          </div>
        ) : activeTab === 'pipeline' ? (
          /* Kanban Pipeline Board */
          <div className="space-y-4">
            <div className="overflow-x-auto pb-6">
              <div className="flex gap-4 min-w-[1200px]">
                {KANBAN_STAGES.map(stageObj => {
                  const stageApps = applications.filter(a => a.stage === stageObj.stage);
                  return (
                    <div
                      key={stageObj.stage}
                      className="flex-1 min-w-[220px] bg-slate-900/60 border border-slate-800/80 rounded-xl p-3 flex flex-col space-y-3"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                        <span className="text-xs font-bold text-slate-300">{stageObj.label}</span>
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-800 text-slate-400">
                          {stageApps.length}
                        </span>
                      </div>

                      <div className="space-y-2.5 overflow-y-auto max-h-[600px]">
                        {stageApps.length === 0 ? (
                          <div className="py-6 text-center text-[11px] text-slate-600 italic">No candidates</div>
                        ) : (
                          stageApps.map(app => (
                            <div
                              key={app.id}
                              className="p-3.5 rounded-lg bg-slate-950/90 border border-slate-800 space-y-2 text-xs shadow-sm hover:border-indigo-500/40 transition"
                            >
                              <div className="flex items-start justify-between">
                                <span className="font-bold text-white">{app.candidateName}</span>
                                <span className="text-[11px] font-semibold text-emerald-400">
                                  {app.matchScore}%
                                </span>
                              </div>

                              <div className="text-[11px] text-slate-400 line-clamp-1">{app.jobTitle}</div>

                              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                                <span>Elo: {app.candidateRating}</span>
                                <button
                                  onClick={() => setSelectedAppForSchedule(app)}
                                  className="text-indigo-400 hover:text-indigo-300 font-semibold text-[11px]"
                                >
                                  Schedule
                                </button>
                              </div>

                              {/* Stage Advance Actions */}
                              <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between gap-1">
                                {stageObj.stage !== ApplicationStage.HIRED && (
                                  <button
                                    onClick={() => {
                                      const nextIdx = KANBAN_STAGES.findIndex(s => s.stage === stageObj.stage) + 1;
                                      if (nextIdx < KANBAN_STAGES.length) {
                                        handleAdvanceStage(app.id, KANBAN_STAGES[nextIdx].stage);
                                      }
                                    }}
                                    className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-medium transition w-full text-center"
                                  >
                                    Advance →
                                  </button>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : activeTab === 'jobs' ? (
          /* Job Management */
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jobs.map(job => (
                <div key={job.id} className="p-6 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-base text-white">{job.title}</h3>
                      <span className="text-xs text-slate-400">
                        {job.location} • {job.jobType} • {job.experienceLevel}
                      </span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                      {job.status.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2">{job.description}</p>

                  <div className="flex flex-wrap gap-1">
                    {job.skillsRequired.map(s => (
                      <span key={s} className="px-2 py-0.5 rounded text-[11px] bg-slate-800 text-slate-300">
                        {s}
                      </span>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
                    <span>Published: {new Date(job.createdAt).toLocaleDateString()}</span>
                    <Link
                      to={`/jobs/${job.slug || job.id}`}
                      className="text-indigo-400 hover:text-indigo-300 font-semibold"
                    >
                      Public Page →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : activeTab === 'schedule' ? (
          /* Interviews List & Feedback */
          <div className="space-y-4">
            {interviews.length === 0 ? (
              <div className="p-12 text-center bg-slate-900/60 border border-slate-800 rounded-2xl text-slate-500">
                <Calendar className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p>No interviews scheduled yet. Use the Candidate Pipeline board to schedule technical screenings.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {interviews.map(i => (
                  <div key={i.id} className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-xs font-bold uppercase text-indigo-400">
                          {i.interviewType.replace(/_/g, ' ')} Interview
                        </span>
                        <h4 className="font-bold text-sm text-white mt-0.5">{i.candidateName}</h4>
                        <span className="text-xs text-slate-400">{i.jobTitle}</span>
                      </div>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          i.status === 'completed'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                            : 'bg-blue-950 text-blue-300 border border-blue-500/40'
                        }`}
                      >
                        {i.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-500" /> {i.durationMinutes} mins
                      </span>
                      <span>•</span>
                      <span>{new Date(i.scheduledAt).toLocaleString()}</span>
                    </div>

                    {i.recommendation && (
                      <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-xs space-y-1">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Recommendation:</span>
                          <span className="font-bold text-emerald-400">{i.recommendation}</span>
                        </div>
                        {i.feedbackNotes && <p className="text-slate-300 italic">"{i.feedbackNotes}"</p>}
                      </div>
                    )}

                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                      {i.meetingUrl && (
                        <a
                          href={i.meetingUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
                        >
                          <Video className="w-3.5 h-3.5" /> Meeting Link
                        </a>
                      )}
                      <button
                        onClick={() => setSelectedInterviewForFeedback(i)}
                        className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition"
                      >
                        {i.feedbackNotes ? 'Update Scorecard' : 'Log Scorecard'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Talent Analytics */
          analytics && (
            <div className="space-y-8">
              {/* Stat Counters */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-1">
                  <span className="text-xs text-slate-400">Total Applicants</span>
                  <div className="text-2xl font-extrabold text-white">{analytics.totalApplicants}</div>
                </div>
                <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-1">
                  <span className="text-xs text-slate-400">Interviews Conducted</span>
                  <div className="text-2xl font-extrabold text-indigo-400">{analytics.interviewsConducted}</div>
                </div>
                <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-1">
                  <span className="text-xs text-slate-400">Offers Extended</span>
                  <div className="text-2xl font-extrabold text-amber-400">{analytics.offersExtended}</div>
                </div>
                <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-1">
                  <span className="text-xs text-slate-400">Successful Hires</span>
                  <div className="text-2xl font-extrabold text-emerald-400">{analytics.hiresMade}</div>
                </div>
              </div>

              {/* Funnel Breakdown */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
                <h3 className="font-bold text-base text-white">Hiring Funnel Conversion Rates</h3>
                <div className="space-y-2.5">
                  {analytics.funnel.map(f => (
                    <div key={f.stage} className="space-y-1">
                      <div className="flex justify-between text-xs text-slate-300">
                        <span className="font-semibold">{f.stage.replace(/_/g, ' ')}</span>
                        <span>
                          {f.count} Candidates ({f.conversionRate}%)
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${Math.max(5, f.conversionRate)}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skill Heatmap */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
                <h3 className="font-bold text-base text-white">Candidate Verified Skill Heatmap</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {analytics.skillHeatmap.map(s => (
                    <div key={s.skill} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                      <span className="text-xs font-bold text-slate-300">{s.skill}</span>
                      <div className="text-xl font-extrabold text-indigo-400">{s.averageScore}% Avg</div>
                      <span className="text-[11px] text-slate-500 block">{s.candidateCount} Evaluated Candidates</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        )}

        {/* Modal: Create Job */}
        {showCreateJob && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Post New Engineering Role</h3>
                <button onClick={() => setShowCreateJob(false)} className="text-slate-400 hover:text-white text-sm font-bold">
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateJob} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Job Title</label>
                  <input
                    type="text"
                    required
                    value={newJobTitle}
                    onChange={e => setNewJobTitle(e.target.value)}
                    placeholder="Senior Distributed Backend Engineer"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Job Type</label>
                    <select
                      value={newJobType}
                      onChange={e => setNewJobType(e.target.value as JobType)}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition"
                    >
                      <option value="full_time">Full-Time</option>
                      <option value="part_time">Part-Time</option>
                      <option value="internship">Internship</option>
                      <option value="contract">Contract</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Workplace Type</label>
                    <select
                      value={newJobWorkplace}
                      onChange={e => setNewJobWorkplace(e.target.value as WorkplaceType)}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition"
                    >
                      <option value="remote">Remote</option>
                      <option value="hybrid">Hybrid</option>
                      <option value="on_site">On-Site</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Location</label>
                  <input
                    type="text"
                    value={newJobLocation}
                    onChange={e => setNewJobLocation(e.target.value)}
                    placeholder="Remote / San Francisco, CA"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Min Salary ($)</label>
                    <input
                      type="number"
                      value={newJobMinSalary}
                      onChange={e => setNewJobMinSalary(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Max Salary ($)</label>
                    <input
                      type="number"
                      value={newJobMaxSalary}
                      onChange={e => setNewJobMaxSalary(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Required Skills (Comma-separated)</label>
                  <input
                    type="text"
                    required
                    value={newJobSkills}
                    onChange={e => setNewJobSkills(e.target.value)}
                    placeholder="TypeScript, PostgreSQL, Docker, Redis"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Role Description</label>
                  <textarea
                    rows={4}
                    required
                    value={newJobDesc}
                    onChange={e => setNewJobDesc(e.target.value)}
                    placeholder="Describe mission, engineering team size, stack and challenges..."
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Requirements & Qualifications</label>
                  <textarea
                    rows={3}
                    required
                    value={newJobReqs}
                    onChange={e => setNewJobReqs(e.target.value)}
                    placeholder="Key competencies, years of experience, coding proficiency..."
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateJob(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30"
                  >
                    Publish Role
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Schedule Interview */}
        {selectedAppForSchedule && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white">Schedule Technical Interview</h3>
                <button
                  onClick={() => setSelectedAppForSchedule(null)}
                  className="text-slate-400 hover:text-white text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleScheduleInterview} className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-400">Candidate</label>
                  <div className="text-sm font-bold text-white">{selectedAppForSchedule.candidateName}</div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Interview Type</label>
                  <select
                    value={interviewType}
                    onChange={e => setInterviewType(e.target.value as HiringInterviewType)}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition"
                  >
                    <option value="screening">Initial Screening</option>
                    <option value="technical">Technical Coding</option>
                    <option value="system_design">System Design</option>
                    <option value="behavioral">Behavioral</option>
                    <option value="hr">HR Round</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Duration (Minutes)</label>
                  <input
                    type="number"
                    value={interviewDuration}
                    onChange={e => setInterviewDuration(Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Date & Time</label>
                  <input
                    type="datetime-local"
                    value={interviewDate}
                    onChange={e => setInterviewDate(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedAppForSchedule(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30"
                  >
                    Dispatch Invitation
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Submit Feedback Scorecard */}
        {selectedInterviewForFeedback && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white">Log Interview Scorecard</h3>
                <button
                  onClick={() => setSelectedInterviewForFeedback(null)}
                  className="text-slate-400 hover:text-white text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmitFeedback} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Recommendation</label>
                  <select
                    value={offerRec}
                    onChange={e => setOfferRec(e.target.value as OfferRecommendation)}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition"
                  >
                    <option value="strong_hire">Strong Hire</option>
                    <option value="hire">Hire</option>
                    <option value="lean_hire">Lean Hire</option>
                    <option value="lean_no_hire">Lean No Hire</option>
                    <option value="no_hire">No Hire</option>
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Technical (1-5)</label>
                    <input
                      type="number"
                      min={1}
                      max={5}
                      value={techScore}
                      onChange={e => setTechScore(Number(e.target.value))}
                      className="w-full text-center py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Communication</label>
                    <input
                      type="number"
                      min={1}
                      max={5}
                      value={commScore}
                      onChange={e => setCommScore(Number(e.target.value))}
                      className="w-full text-center py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Problem Solving</label>
                    <input
                      type="number"
                      min={1}
                      max={5}
                      value={psScore}
                      onChange={e => setPsScore(Number(e.target.value))}
                      className="w-full text-center py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Feedback Notes & Code Evaluation</label>
                  <textarea
                    rows={3}
                    required
                    value={feedbackNotes}
                    onChange={e => setFeedbackNotes(e.target.value)}
                    placeholder="Candidate demonstrated clean O(N) modular solution..."
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedInterviewForFeedback(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30"
                  >
                    Submit Scorecard
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
