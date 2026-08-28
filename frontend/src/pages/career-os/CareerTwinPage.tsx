import React, { useState, useEffect } from 'react';
import {
  BrainCircuit,
  Activity,
  Award,
  Target,
  Plus,
  Edit3,
  CheckCircle2,
  History,
} from 'lucide-react';
import { careerOsApi } from '../../services/careerOsApi';
import {
  CareerTwinDto,
  CareerSnapshotDto,
  CareerEventDto,
  CareerEventType,
} from '@codeforge/shared';

export const CareerTwinPage: React.FC = () => {
  const [twin, setTwin] = useState<CareerTwinDto | null>(null);
  const [snapshots, setSnapshots] = useState<CareerSnapshotDto[]>([]);
  const [events, setEvents] = useState<CareerEventDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);

  // Edit form state
  const [editForm, setEditForm] = useState({
    currentRole: '',
    currentLevel: '',
    targetRole: '',
    targetLevel: '',
    yearsOfExperience: 0,
    primarySkills: '',
  });

  // Event form state
  const [eventForm, setEventForm] = useState({
    eventType: CareerEventType.LEARNING_ACHIEVEMENT,
    title: '',
    description: '',
    company: '',
    role: '',
    salaryUsd: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [twinRes, snapRes, eventRes] = await Promise.all([
        careerOsApi.getTwin(),
        careerOsApi.getSnapshots(12),
        careerOsApi.listEvents(),
      ]);

      if (twinRes.data) {
        setTwin(twinRes.data);
        setEditForm({
          currentRole: twinRes.data.currentRole,
          currentLevel: twinRes.data.currentLevel,
          targetRole: twinRes.data.targetRole,
          targetLevel: twinRes.data.targetLevel,
          yearsOfExperience: twinRes.data.yearsOfExperience,
          primarySkills: twinRes.data.primarySkills.join(', '),
        });
      }
      if (snapRes.data) setSnapshots(snapRes.data);
      if (eventRes.data) setEvents(eventRes.data);
    } catch (err) {
      console.error('Failed to load Career Twin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTwin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updated = await careerOsApi.updateTwin({
        currentRole: editForm.currentRole,
        currentLevel: editForm.currentLevel,
        targetRole: editForm.targetRole,
        targetLevel: editForm.targetLevel,
        yearsOfExperience: Number(editForm.yearsOfExperience),
        primarySkills: editForm.primarySkills.split(',').map((s) => s.trim()).filter(Boolean),
      });
      if (updated.data) {
        setTwin(updated.data);
        setShowEditModal(false);
      }
    } catch (err) {
      console.error('Failed to update twin:', err);
    }
  };

  const handleRecordEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await careerOsApi.recordEvent({
        eventType: eventForm.eventType,
        title: eventForm.title,
        description: eventForm.description,
        company: eventForm.company || undefined,
        role: eventForm.role || undefined,
        salaryUsd: eventForm.salaryUsd ? Number(eventForm.salaryUsd) : undefined,
      });
      if (res.data) {
        setEvents([res.data, ...events]);
        setShowEventModal(false);
        setEventForm({
          eventType: CareerEventType.LEARNING_ACHIEVEMENT,
          title: '',
          description: '',
          company: '',
          role: '',
          salaryUsd: 0,
        });
        // Reload twin to get updated telemetry
        const updatedTwin = await careerOsApi.getTwin();
        if (updatedTwin.data) setTwin(updatedTwin.data);
      }
    } catch (err) {
      console.error('Failed to record event:', err);
    }
  };

  if (loading || !twin) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
          <p className="text-sm font-medium text-slate-400">Synthesizing Career Digital Twin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 border-b border-slate-800 pb-6 md:flex-row md:items-center">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-400">
              <BrainCircuit className="h-3.5 w-3.5" />
              <span>AI Digital Twin • Active Representation</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white">Career Digital Twin</h1>
            <p className="text-sm text-slate-400">
              Real-time persona model mapping skills, vectors, telemetry snapshots, and milestone logs.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowEventModal(true)}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-200 transition-all hover:bg-slate-700"
            >
              <Plus className="h-4 w-4" />
              <span>Log Milestone Event</span>
            </button>
            <button
              onClick={() => setShowEditModal(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg transition-all hover:bg-indigo-500"
            >
              <Edit3 className="h-4 w-4" />
              <span>Calibrate Twin</span>
            </button>
          </div>
        </div>

        {/* Profile Card & Health Radar */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Persona Card */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-sm lg:col-span-1">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 shadow-lg">
                <BrainCircuit className="h-7 w-7 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{twin.currentRole}</h3>
                <p className="text-xs font-medium text-slate-400">{twin.currentLevel} • {twin.yearsOfExperience} yrs exp</p>
              </div>
            </div>

            <div className="mt-6 space-y-4 border-t border-slate-800 pt-4">
              <div>
                <span className="text-xs font-semibold uppercase text-slate-400">Target Role Horizon</span>
                <p className="text-sm font-bold text-indigo-400">{twin.targetRole} ({twin.targetLevel})</p>
              </div>

              <div>
                <span className="text-xs font-semibold uppercase text-slate-400">Primary Technical Stack</span>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {twin.primarySkills.map((skill) => (
                    <span key={skill} className="rounded-md border border-slate-700 bg-slate-800/80 px-2.5 py-1 text-xs font-medium text-slate-200">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold uppercase text-slate-400">Core Strengths</span>
                <div className="mt-2 space-y-1">
                  {twin.topStrengths.map((str) => (
                    <div key={str} className="flex items-center gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                      <span>{str}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold uppercase text-slate-400">Target Growth Vectors</span>
                <div className="mt-2 space-y-1">
                  {twin.growthAreas.map((area) => (
                    <div key={area} className="flex items-center gap-2 text-xs text-slate-300">
                      <Target className="h-3.5 w-3.5 text-indigo-400 flex-shrink-0" />
                      <span>{area}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 6 Momentum Telemetry Vectors */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-sm lg:col-span-2">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white">Live Telemetry & Momentum Indices</h3>
                <p className="text-xs text-slate-400">Algorithmic weighting across CodeForge exercises, contests, and peer reviews</p>
              </div>
              <div className="flex items-center gap-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5">
                <Activity className="h-4 w-4 text-indigo-400" />
                <span className="text-sm font-extrabold text-indigo-400">{twin.healthScore}/100</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {[
                { label: 'Learning Velocity', val: twin.learningVelocity, desc: 'Exercise completion pace & concept retention', color: 'from-indigo-500 to-indigo-600' },
                { label: 'Career Momentum', val: twin.careerMomentum, desc: 'Milestone trajectory towards senior roles', color: 'from-blue-500 to-blue-600' },
                { label: 'Market Competitiveness', val: twin.marketCompetitiveness, desc: 'Relative positioning in global hiring pool', color: 'from-cyan-500 to-cyan-600' },
                { label: 'Interview Readiness', val: twin.interviewReadiness, desc: 'System design, concurrency & DSA readiness', color: 'from-emerald-500 to-emerald-600' },
                { label: 'Salary Positioning', val: twin.salaryPositioning, desc: 'Comp percentile relative to global P75/P90', color: 'from-amber-500 to-amber-600' },
                { label: 'Leadership Potential', val: twin.leadershipPotential, desc: 'RFC writing, peer review & mentoring impact', color: 'from-purple-500 to-purple-600' },
              ].map((vec) => (
                <div key={vec.label} className="rounded-xl border border-slate-800/80 bg-slate-950/40 p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-slate-200">{vec.label}</span>
                    <span className="text-base font-black text-white">{vec.val}%</span>
                  </div>
                  <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-800">
                    <div className={`h-full bg-gradient-to-r ${vec.color}`} style={{ width: `${vec.val}%` }}></div>
                  </div>
                  <p className="mt-2 text-xs text-slate-400">{vec.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Snapshots & Events Section */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Snapshot History */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-sm">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
              <History className="h-5 w-5 text-indigo-400" />
              <h3 className="text-base font-bold text-white">Historical Health Score Snapshots</h3>
            </div>
            <div className="mt-4 divide-y divide-slate-800/60 max-h-72 overflow-y-auto">
              {snapshots.map((snap) => (
                <div key={snap.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-xs font-bold text-indigo-400">
                      {snap.healthScore}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-200">Weekly Telemetry Snapshot</p>
                      <p className="text-xs text-slate-500">{new Date(snap.snapshotDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right text-xs text-slate-400">
                    <span>Velocity: {snap.metrics?.learningVelocity || 80}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Verified Career Events */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Verified Career Events ({events.length})</h3>
              </div>
            </div>
            <div className="mt-4 divide-y divide-slate-800/60 max-h-72 overflow-y-auto">
              {events.map((ev) => (
                <div key={ev.id} className="py-3">
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-indigo-500/10 px-2 py-0.5 text-xs font-bold text-indigo-400 uppercase">
                      {ev.eventType}
                    </span>
                    <span className="text-xs text-slate-500">{new Date(ev.eventDate).toLocaleDateString()}</span>
                  </div>
                  <h4 className="mt-1 text-sm font-semibold text-slate-100">{ev.title}</h4>
                  <p className="text-xs text-slate-400">{ev.description}</p>
                  {ev.company && (
                    <p className="mt-1 text-xs text-indigo-400">Company: {ev.company}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Twin Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Calibrate Digital Twin Persona</h3>
            <p className="text-xs text-slate-400">Update your target trajectories and technical strengths</p>

            <form onSubmit={handleUpdateTwin} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300">Current Role</label>
                  <input
                    type="text"
                    value={editForm.currentRole}
                    onChange={(e) => setEditForm({ ...editForm, currentRole: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300">Current Level</label>
                  <input
                    type="text"
                    value={editForm.currentLevel}
                    onChange={(e) => setEditForm({ ...editForm, currentLevel: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300">Target Role</label>
                  <input
                    type="text"
                    value={editForm.targetRole}
                    onChange={(e) => setEditForm({ ...editForm, targetRole: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300">Target Level</label>
                  <input
                    type="text"
                    value={editForm.targetLevel}
                    onChange={(e) => setEditForm({ ...editForm, targetLevel: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Years of Experience</label>
                <input
                  type="number"
                  value={editForm.yearsOfExperience}
                  onChange={(e) => setEditForm({ ...editForm, yearsOfExperience: parseInt(e.target.value, 10) })}
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Primary Skills (comma separated)</label>
                <input
                  type="text"
                  value={editForm.primarySkills}
                  onChange={(e) => setEditForm({ ...editForm, primarySkills: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                >
                  Save Calibration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Log Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Log Milestone Event</h3>
            <p className="text-xs text-slate-400">Record a promotion, certification, contest win, or publication</p>

            <form onSubmit={handleRecordEvent} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300">Event Type</label>
                <select
                  value={eventForm.eventType}
                  onChange={(e) => setEventForm({ ...eventForm, eventType: e.target.value as CareerEventType })}
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none"
                >
                  <option value={CareerEventType.PROMOTION}>Promotion</option>
                  <option value={CareerEventType.CERTIFICATION}>Certification</option>
                  <option value={CareerEventType.CONTEST_ACHIEVEMENT}>Contest Achievement</option>
                  <option value={CareerEventType.LEARNING_ACHIEVEMENT}>Learning Achievement</option>
                  <option value={CareerEventType.JOB_CHANGE}>Job Change</option>
                  <option value={CareerEventType.INTERVIEW}>Interview Passed</option>
                  <option value={CareerEventType.SALARY_UPDATE}>Salary Update</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Title</label>
                <input
                  type="text"
                  value={eventForm.title}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  placeholder="e.g. Promoted to Senior Distributed Systems Engineer"
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Description</label>
                <textarea
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  rows={3}
                  placeholder="Details of the event or achievement..."
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300">Company</label>
                  <input
                    type="text"
                    value={eventForm.company}
                    onChange={(e) => setEventForm({ ...eventForm, company: e.target.value })}
                    placeholder="e.g. Acme Corp"
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300">Salary (USD)</label>
                  <input
                    type="number"
                    value={eventForm.salaryUsd || ''}
                    onChange={(e) => setEventForm({ ...eventForm, salaryUsd: e.target.value ? parseInt(e.target.value, 10) : 0 })}
                    placeholder="e.g. 155000"
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowEventModal(false)}
                  className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                >
                  Save Milestone Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
