import React, { useState, useEffect } from 'react';
import {
  Users,
  Building,
  Plus,
  Send,
  Loader2,
} from 'lucide-react';
import { placementApi } from '../services/placementApi';
import { ReferralDto, ReferralRequestDto, JobPostingDto, CompanyDto, ReferralStatus } from '@codeforge/shared';

export const ReferralNetworkPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'my_referrals' | 'my_requests' | 'submit_referral' | 'request_referral'>('my_referrals');
  const [myReferrals, setMyReferrals] = useState<ReferralDto[]>([]);
  const [myRequests, setMyRequests] = useState<ReferralRequestDto[]>([]);
  const [companies, setCompanies] = useState<CompanyDto[]>([]);
  const [jobs, setJobs] = useState<JobPostingDto[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [refCandidateName, setRefCandidateName] = useState('');
  const [refCandidateEmail, setRefCandidateEmail] = useState('');
  const [refCompanyId, setRefCompanyId] = useState('');
  const [refNotes, setRefNotes] = useState('');

  const [reqJobId, setReqJobId] = useState('');
  const [reqMessage, setReqMessage] = useState('');

  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    loadNetworkData();
  }, []);

  const loadNetworkData = async () => {
    try {
      setLoading(true);
      const [refs, reqs, comps, jobsRes] = await Promise.all([
        placementApi.getMyReferrals(),
        placementApi.getMyReferralRequests(),
        placementApi.listCompanies(),
        placementApi.listJobs(),
      ]);
      setMyReferrals(refs);
      setMyRequests(reqs);
      setCompanies(comps);
      setJobs(jobsRes.jobs);
      if (comps.length > 0) {
        setRefCompanyId(comps[0].id);
      }
      if (jobsRes.jobs.length > 0) {
        setReqJobId(jobsRes.jobs[0].id);
      }
    } catch (err) {
      console.error('Failed to load referral network data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReferral = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setErrorMsg('');
      setMessage('');
      await placementApi.submitReferral({
        candidateName: refCandidateName,
        candidateEmail: refCandidateEmail,
        companyId: refCompanyId,
        notes: refNotes,
      });
      setMessage('Internal employee referral submitted successfully!');
      setActiveTab('my_referrals');
      loadNetworkData();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || err.message || 'Failed to submit referral.');
    }
  };

  const handleRequestReferral = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setErrorMsg('');
      setMessage('');
      await placementApi.requestReferral({
        jobId: reqJobId,
        message: reqMessage,
      });
      setMessage('Referral request broadcasted to company employees & verified mentors.');
      setActiveTab('my_requests');
      loadNetworkData();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || err.message || 'Failed to dispatch request.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-950/60 via-slate-900 to-indigo-950/40 border border-slate-800 rounded-2xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-medium">
              <Users className="w-3.5 h-3.5" /> Peer & Alumni Hiring Network
            </div>
            <h1 className="text-3xl font-extrabold text-white">Employee Referrals & Warm Introductions</h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              Connect directly with software engineers working at leading tech enterprises. Request warm referrals or vouch for verified peers in the CodeForge community.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab('request_referral')}
              className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold transition flex items-center gap-2 shadow-lg shadow-teal-600/30"
            >
              <Send className="w-4 h-4" /> Request Referral
            </button>
            <button
              onClick={() => setActiveTab('submit_referral')}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Refer an Engineer
            </button>
          </div>
        </div>

        {message && (
          <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs">
            {message}
          </div>
        )}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs">
            {errorMsg}
          </div>
        )}

        {/* Tab Switcher */}
        <div className="flex items-center gap-6 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab('my_referrals')}
            className={`pb-2 text-sm font-semibold transition border-b-2 ${
              activeTab === 'my_referrals'
                ? 'border-teal-500 text-teal-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            My Submissions ({myReferrals.length})
          </button>
          <button
            onClick={() => setActiveTab('my_requests')}
            className={`pb-2 text-sm font-semibold transition border-b-2 ${
              activeTab === 'my_requests'
                ? 'border-teal-500 text-teal-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            My Requests ({myRequests.length})
          </button>
        </div>

        {/* Tab Body */}
        {loading ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-teal-500" />
          </div>
        ) : activeTab === 'submit_referral' ? (
          /* Submit Referral Form */
          <div className="max-w-xl mx-auto bg-slate-900/90 border border-slate-800 rounded-2xl p-8 space-y-6 shadow-xl">
            <h2 className="text-xl font-bold text-white">Refer an Engineer to Your Company</h2>
            <form onSubmit={handleSubmitReferral} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Candidate Full Name</label>
                <input
                  type="text"
                  required
                  value={refCandidateName}
                  onChange={e => setRefCandidateName(e.target.value)}
                  placeholder="e.g. Alex Johnson"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-teal-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Candidate Email</label>
                <input
                  type="email"
                  required
                  value={refCandidateEmail}
                  onChange={e => setRefCandidateEmail(e.target.value)}
                  placeholder="engineer@example.com"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-teal-500 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Company</label>
                <select
                  value={refCompanyId}
                  onChange={e => setRefCompanyId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-teal-500 transition"
                >
                  {companies.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Endorsement & Recommendation Notes</label>
                <textarea
                  rows={4}
                  required
                  value={refNotes}
                  onChange={e => setRefNotes(e.target.value)}
                  placeholder="Candidate excels in distributed architectures, wrote core cache invalidation system..."
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-teal-500 transition"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('my_referrals')}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-lg shadow-teal-600/30"
                >
                  Submit Referral
                </button>
              </div>
            </form>
          </div>
        ) : activeTab === 'request_referral' ? (
          /* Request Referral Form */
          <div className="max-w-xl mx-auto bg-slate-900/90 border border-slate-800 rounded-2xl p-8 space-y-6 shadow-xl">
            <h2 className="text-xl font-bold text-white">Request a Referral for an Open Position</h2>
            <form onSubmit={handleRequestReferral} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Target Job Role</label>
                <select
                  value={reqJobId}
                  onChange={e => setReqJobId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-teal-500 transition"
                >
                  {jobs.map(j => (
                    <option key={j.id} value={j.id}>
                      {j.title} ({j.companyName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Introduction Message & Key Qualifications</label>
                <textarea
                  rows={4}
                  required
                  value={reqMessage}
                  onChange={e => setReqMessage(e.target.value)}
                  placeholder="Highlight key achievements, arena contest rank, and why you are targeting this specific team..."
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-teal-500 transition"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('my_requests')}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-lg shadow-teal-600/30"
                >
                  Broadcast Request
                </button>
              </div>
            </form>
          </div>
        ) : activeTab === 'my_referrals' ? (
          /* My Referrals List */
          <div className="space-y-4">
            {myReferrals.length === 0 ? (
              <div className="p-12 text-center bg-slate-900/60 border border-slate-800 rounded-2xl text-slate-500">
                <Users className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p>You haven't submitted any candidate referrals yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myReferrals.map(r => (
                  <div key={r.id} className="p-6 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-base text-white">{r.candidateName || r.candidateEmail}</h4>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <Building className="w-3.5 h-3.5 text-slate-500" />
                          <span>{r.companyName}</span>
                          {r.jobTitle && (
                            <>
                              <span>•</span>
                              <span>{r.jobTitle}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          r.status === ReferralStatus.HIRED
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                            : r.status === ReferralStatus.REJECTED
                            ? 'bg-rose-950 text-rose-300 border border-rose-500/40'
                            : 'bg-teal-950 text-teal-300 border border-teal-500/40'
                        }`}
                      >
                        {r.status.toUpperCase()}
                      </span>
                    </div>

                    {r.notes && <p className="text-xs text-slate-300 italic">"{r.notes}"</p>}

                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
                      <span>Submitted: {new Date(r.createdAt).toLocaleDateString()}</span>
                      {r.bonusAmount > 0 && (
                        <span className="text-emerald-400 font-semibold">Bonus: ${r.bonusAmount}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* My Requests List */
          <div className="space-y-4">
            {myRequests.length === 0 ? (
              <div className="p-12 text-center bg-slate-900/60 border border-slate-800 rounded-2xl text-slate-500">
                <Send className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p>No active referral requests dispatched. Request a referral to top companies to accelerate your interview pipeline.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myRequests.map(req => (
                  <div key={req.id} className="p-6 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-base text-white">{req.jobTitle}</h4>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <Building className="w-3.5 h-3.5 text-slate-500" />
                          <span>{req.targetCompanyName}</span>
                        </div>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-950 text-teal-300 border border-teal-500/40">
                        {req.status.toUpperCase()}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300">{req.message}</p>

                    <div className="pt-3 border-t border-slate-800 text-xs text-slate-500">
                      <span>Requested: {new Date(req.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
