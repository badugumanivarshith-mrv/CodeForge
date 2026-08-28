import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Building,
  Calendar,
  Clock,
  Video,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { placementApi } from '../services/placementApi';
import { JobApplicationDto, ApplicationStage, HiringInterviewStatus } from '@codeforge/shared';

const PIPELINE_STAGES: { stage: ApplicationStage; label: string }[] = [
  { stage: ApplicationStage.APPLIED, label: 'Applied' },
  { stage: ApplicationStage.SCREENING, label: 'Screening' },
  { stage: ApplicationStage.INTERVIEW, label: 'Interview' },
  { stage: ApplicationStage.TECHNICAL_ROUND, label: 'Technical' },
  { stage: ApplicationStage.HR_ROUND, label: 'HR Round' },
  { stage: ApplicationStage.OFFER, label: 'Offer' },
  { stage: ApplicationStage.HIRED, label: 'Hired' },
];

export const CandidateApplicationsPage: React.FC = () => {
  const [applications, setApplications] = useState<JobApplicationDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<JobApplicationDto | null>(null);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const res = await placementApi.getMyApplications();
      setApplications(res);
      if (res.length > 0) setSelectedApp(res[0]);
    } catch (err) {
      console.error('Failed to load applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStageIndex = (stage: ApplicationStage) => {
    if (stage === ApplicationStage.REJECTED) return -1;
    return PIPELINE_STAGES.findIndex(s => s.stage === stage);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Application Pipeline & ATS Tracking</h1>
          <p className="text-slate-400 text-sm mt-1">
            Real-time status updates, recruiter stage transitions, and scheduled technical interviews.
          </p>
        </div>

        {loading ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
          </div>
        ) : applications.length === 0 ? (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center space-y-4">
            <Briefcase className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-slate-300">No Job Applications Yet</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Explore Tier-1 verified companies and use your verified skills to apply directly with 1-click.
            </p>
            <Link
              to="/jobs"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition"
            >
              Explore Job Marketplace
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Applications List */}
            <div className="space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                Active Applications ({applications.length})
              </h2>
              <div className="space-y-3">
                {applications.map(app => {
                  const isSelected = selectedApp?.id === app.id;
                  return (
                    <div
                      key={app.id}
                      onClick={() => setSelectedApp(app)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? 'bg-indigo-950/40 border-indigo-500/60 shadow-lg'
                          : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-bold text-sm text-white">{app.jobTitle}</h3>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                            app.stage === ApplicationStage.HIRED
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                              : app.stage === ApplicationStage.REJECTED
                              ? 'bg-rose-950 text-rose-300 border border-rose-500/40'
                              : 'bg-indigo-950 text-indigo-300 border border-indigo-500/40'
                          }`}
                        >
                          {app.stage.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Building className="w-3 h-3 text-slate-500" />
                        <span>{app.companyName}</span>
                        <span>•</span>
                        <Sparkles className="w-3 h-3 text-indigo-400" />
                        <span>{app.matchScore}% Match</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Application Timeline & Interviews (2 Cols) */}
            {selectedApp && (
              <div className="lg:col-span-2 space-y-6">
                {/* Pipeline Progression Bar */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
                  <div>
                    <h2 className="text-lg font-bold text-white">{selectedApp.jobTitle}</h2>
                    <p className="text-xs text-slate-400">
                      Application ID: <span className="font-mono text-slate-500">{selectedApp.id}</span>
                    </p>
                  </div>

                  {selectedApp.stage === ApplicationStage.REJECTED ? (
                    <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                      <div>
                        <span className="font-bold">Application Status: Not Moving Forward.</span>
                        {selectedApp.rejectionReason && <p className="mt-0.5 text-rose-400">{selectedApp.rejectionReason}</p>}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="grid grid-cols-7 gap-1 text-center text-xs">
                        {PIPELINE_STAGES.map((s, idx) => {
                          const currentIdx = getStageIndex(selectedApp.stage);
                          const isDone = idx <= currentIdx;
                          const isCurrent = idx === currentIdx;

                          return (
                            <div key={s.stage} className="space-y-1.5">
                              <div
                                className={`h-2 rounded-full transition-all ${
                                  isDone ? 'bg-indigo-500' : 'bg-slate-800'
                                } ${isCurrent ? 'ring-2 ring-indigo-400 ring-offset-2 ring-offset-slate-950' : ''}`}
                              />
                              <span
                                className={`text-[11px] font-medium block truncate ${
                                  isCurrent ? 'text-indigo-400 font-bold' : isDone ? 'text-slate-300' : 'text-slate-600'
                                }`}
                              >
                                {s.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Stage Timeline Logs */}
                  {selectedApp.timeline && selectedApp.timeline.length > 0 && (
                    <div className="border-t border-slate-800/80 pt-5 space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Progression History</h4>
                      <div className="space-y-2">
                        {selectedApp.timeline.map((entry, i) => (
                          <div key={i} className="flex items-start gap-3 text-xs bg-slate-950/60 p-3 rounded-lg border border-slate-800/60">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="font-semibold text-slate-200">
                                  {entry.fromStage ? `${entry.fromStage} → ` : ''}{entry.toStage}
                                </span>
                                <span className="text-[11px] text-slate-500">
                                  {new Date(entry.changedAt).toLocaleDateString()}
                                </span>
                              </div>
                              {entry.notes && <p className="text-slate-400 text-xs mt-0.5">{entry.notes}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Scheduled Interviews Card */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white text-base flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-indigo-400" /> Scheduled Technical Interviews
                    </h3>
                  </div>

                  {selectedApp.interviews && selectedApp.interviews.length > 0 ? (
                    <div className="space-y-3">
                      {selectedApp.interviews.map(interview => (
                        <div
                          key={interview.id}
                          className="p-4 rounded-xl bg-slate-950/80 border border-indigo-500/30 space-y-3"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <span className="text-xs font-bold uppercase text-indigo-400">
                                {interview.interviewType.replace(/_/g, ' ')} Interview
                              </span>
                              <h4 className="font-semibold text-sm text-white mt-0.5">
                                Interviewer: {interview.interviewerName}
                              </h4>
                            </div>
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                interview.status === HiringInterviewStatus.COMPLETED
                                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                                  : 'bg-blue-950 text-blue-300 border border-blue-500/30'
                              }`}
                            >
                              {interview.status}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-slate-500" /> {interview.durationMinutes} mins
                            </span>
                            <span>•</span>
                            <span>{new Date(interview.scheduledAt).toLocaleString()}</span>
                          </div>

                          {interview.meetingUrl && interview.status === HiringInterviewStatus.SCHEDULED && (
                            <a
                              href={interview.meetingUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition"
                            >
                              <Video className="w-3.5 h-3.5" /> Join Video Interview Room
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500">
                      No interviews scheduled yet. Once a recruiter advances your application, meeting links and scorecards will appear here.
                    </p>
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
