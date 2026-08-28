import React, { useState, useEffect } from 'react';
import {
  Calendar,
  CheckCircle2,
  Plus,
  Target,
  Award,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { careerOsApi } from '../../services/careerOsApi';
import { CareerTimelineDto } from '@codeforge/shared';

export const CareerTimelinePage: React.FC = () => {
  const [timeline, setTimeline] = useState<CareerTimelineDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [milestoneForm, setMilestoneForm] = useState({
    title: '',
    description: '',
    category: 'TECHNICAL',
    targetDate: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await careerOsApi.getTimeline();
      if (res.data) setTimeline(res.data);
    } catch (err) {
      console.error('Failed to load career timeline:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await careerOsApi.createMilestone(milestoneForm);
      if (res.data) {
        setShowMilestoneModal(false);
        setMilestoneForm({ title: '', description: '', category: 'TECHNICAL', targetDate: '' });
        loadData();
      }
    } catch (err) {
      console.error('Failed to create milestone:', err);
    }
  };

  const handleAchieveMilestone = async (milestoneId: string) => {
    try {
      await careerOsApi.achieveMilestone(milestoneId);
      loadData();
    } catch (err) {
      console.error('Failed to mark milestone achieved:', err);
    }
  };

  if (loading || !timeline) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-sm font-medium text-slate-400">Rendering Interactive Career Timeline...</p>
        </div>
      </div>
    );
  }

  const { currentStanding, historicalEvents, milestones, futureMilestones } = timeline;

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 border-b border-slate-800 pb-6 md:flex-row md:items-center">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400">
              <Calendar className="h-3.5 w-3.5" />
              <span>Career Timeline Engine • Past, Present & Horizon</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white">Career Timeline & Milestones</h1>
            <p className="text-sm text-slate-400">
              Complete historical journey, current position health, and forward-looking milestone roadmaps.
            </p>
          </div>
          <button
            onClick={() => setShowMilestoneModal(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg transition-all hover:bg-blue-500"
          >
            <Plus className="h-4 w-4" />
            <span>Create Target Milestone</span>
          </button>
        </div>

        {/* Current Standing Card */}
        <div className="rounded-xl border border-blue-900/40 bg-gradient-to-r from-slate-900 via-blue-950/30 to-slate-900 p-6 shadow-xl backdrop-blur-sm">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400">
                <Target className="h-6 w-6" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase text-blue-400">CURRENT POSITION STANDING</span>
                <h3 className="text-xl font-bold text-white">{currentStanding.role}</h3>
                <p className="text-xs text-slate-400">{currentStanding.level} • {currentStanding.company || 'CodeForge'} • {currentStanding.yearsOfExperience} yrs experience</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-2 text-center">
                <span className="text-xs text-slate-400 font-medium">HEALTH INDEX</span>
                <p className="text-lg font-black text-indigo-400">{currentStanding.healthScore}/100</p>
              </div>
            </div>
          </div>
        </div>

        {/* 3-Stage Timeline Container */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Stage 1: Historical Events */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-sm">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Award className="h-5 w-5 text-amber-400" />
              <h3 className="text-base font-bold text-white">1. Verified History ({historicalEvents.length})</h3>
            </div>

            <div className="mt-4 space-y-4">
              {historicalEvents.map((ev) => (
                <div key={ev.id} className="relative pl-6 before:absolute before:left-2 before:top-2 before:h-full before:w-0.5 before:bg-slate-800">
                  <div className="absolute left-0 top-1 h-4 w-4 rounded-full border-2 border-amber-400 bg-slate-950"></div>
                  <span className="text-xs font-semibold text-slate-400">{new Date(ev.eventDate).toLocaleDateString()}</span>
                  <h4 className="text-sm font-bold text-slate-100">{ev.title}</h4>
                  <p className="text-xs text-slate-400">{ev.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Stage 2: Active User Milestones */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-sm">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Sparkles className="h-5 w-5 text-blue-400" />
              <h3 className="text-base font-bold text-white">2. Active Milestones ({milestones.length})</h3>
            </div>

            <div className="mt-4 space-y-3">
              {milestones.map((m) => (
                <div key={m.id} className="rounded-xl border border-slate-800 bg-slate-950/40 p-3.5">
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-blue-500/10 px-2 py-0.5 text-xs font-bold text-blue-400">
                      {m.category}
                    </span>
                    <span className="text-xs font-semibold text-amber-400">+{m.xpEarned} XP</span>
                  </div>
                  <h4 className="mt-2 text-sm font-bold text-slate-100">{m.title}</h4>
                  <p className="mt-1 text-xs text-slate-400">{m.description}</p>

                  <div className="mt-3 flex items-center justify-between border-t border-slate-800/80 pt-2">
                    <span className="text-xs text-slate-500">
                      {m.targetDate ? `Due: ${new Date(m.targetDate).toLocaleDateString()}` : 'In progress'}
                    </span>
                    {m.isAchieved ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Achieved</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => handleAchieveMilestone(m.id)}
                        className="rounded bg-blue-600/20 px-2.5 py-1 text-xs font-bold text-blue-400 hover:bg-blue-600/40"
                      >
                        Mark Achieved
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stage 3: Future AI Milestones Horizon */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-sm">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <TrendingUp className="h-5 w-5 text-purple-400" />
              <h3 className="text-base font-bold text-white">3. Horizon Roadmap</h3>
            </div>

            <div className="mt-4 space-y-4">
              {futureMilestones.map((fm, idx) => (
                <div key={idx} className="relative pl-6 before:absolute before:left-2 before:top-2 before:h-full before:w-0.5 before:bg-purple-900/40">
                  <div className="absolute left-0 top-1 h-4 w-4 rounded-full border-2 border-purple-400 bg-slate-950"></div>
                  <span className="text-xs font-semibold text-purple-400">Expected: {new Date(fm.expectedDate).toLocaleDateString()}</span>
                  <h4 className="text-sm font-bold text-slate-100">{fm.title}</h4>
                  <span className="mt-1 inline-block rounded bg-purple-500/10 px-2 py-0.5 text-xs text-purple-300">
                    Category: {fm.category}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Create Milestone Modal */}
      {showMilestoneModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Add Career Milestone</h3>
            <p className="text-xs text-slate-400">Define a clear technical or leadership target to track</p>

            <form onSubmit={handleCreateMilestone} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300">Title</label>
                <input
                  type="text"
                  value={milestoneForm.title}
                  onChange={(e) => setMilestoneForm({ ...milestoneForm, title: e.target.value })}
                  placeholder="e.g. Master Rust Concurrency & Async Channels"
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Description</label>
                <textarea
                  value={milestoneForm.description}
                  onChange={(e) => setMilestoneForm({ ...milestoneForm, description: e.target.value })}
                  rows={3}
                  placeholder="Specific requirements, deliverables, or criteria..."
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300">Category</label>
                  <select
                    value={milestoneForm.category}
                    onChange={(e) => setMilestoneForm({ ...milestoneForm, category: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="TECHNICAL">TECHNICAL</option>
                    <option value="LEADERSHIP">LEADERSHIP</option>
                    <option value="PROMOTION">PROMOTION</option>
                    <option value="BRAND">BRAND</option>
                    <option value="INTERVIEW">INTERVIEW</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300">Target Date</label>
                  <input
                    type="date"
                    value={milestoneForm.targetDate}
                    onChange={(e) => setMilestoneForm({ ...milestoneForm, targetDate: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-100 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowMilestoneModal(false)}
                  className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
                >
                  Save Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
