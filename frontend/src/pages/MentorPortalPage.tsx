import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Star,
  Video,
  CheckCircle2,
} from 'lucide-react';
import { enterpriseApi } from '../services/enterpriseApi';
import { MentorProfileDto, FacultyMentorSessionDto, MentorSessionStatus } from '@codeforge/shared';

export const MentorPortalPage: React.FC = () => {
  const [mentors, setMentors] = useState<MentorProfileDto[]>([]);
  const [sessions, setSessions] = useState<FacultyMentorSessionDto[]>([]);
  const [selectedMentor, setSelectedMentor] = useState<MentorProfileDto | null>(null);
  const [loading, setLoading] = useState(true);

  // Booking Modal / Form
  const [topic, setTopic] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [notes, setNotes] = useState('');
  const [booking, setBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [mentorList, sessionList] = await Promise.all([
        enterpriseApi.listMentors(),
        enterpriseApi.listMentorSessions(),
      ]);
      setMentors(mentorList);
      setSessions(sessionList);
    } catch (err) {
      console.error('Failed to load mentor data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMentor || !topic || !scheduledAt) return;
    try {
      setBooking(true);
      const newSession = await enterpriseApi.bookMentorSession({
        mentorId: selectedMentor.id,
        topic,
        scheduledAt,
        durationMinutes,
        notes,
      });
      setSessions([newSession, ...sessions]);
      setBookingSuccess(true);
      setTimeout(() => {
        setBookingSuccess(false);
        setSelectedMentor(null);
        setTopic('');
        setScheduledAt('');
        setNotes('');
      }, 2000);
    } catch (err) {
      console.error('Failed to book session:', err);
    } finally {
      setBooking(false);
    }
  };

  if (loading && mentors.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="border-b border-slate-800 pb-6">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-400">
              Expert Mentorship Ecosystem
            </span>
            <span className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs text-amber-400">
              <Star className="h-3 w-3" /> Top Rated Industry Mentors
            </span>
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Book 1:1 Expert Mentorship & Advisory
          </h1>
          <p className="mt-1 text-slate-400">
            Connect with senior university faculty, staff engineers, and domain specialists for mock interviews, career
            guidance, and code review.
          </p>
        </div>

        {/* Mentor Directory */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-white">Available Expert Mentors</h2>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {mentors.map(m => (
              <div
                key={m.id}
                className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-xl transition-all hover:border-slate-700"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-600 to-indigo-600 font-bold text-lg text-white shadow-md">
                        {m.username[0].toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-base">{m.fullName || m.username}</h3>
                        <p className="text-xs text-cyan-400">{m.organizationName || 'CodeForge Expert Network'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 rounded-lg bg-amber-500/10 px-2 py-1 text-xs font-bold text-amber-400">
                      <Star className="h-3 w-3 fill-amber-400" /> {m.rating}
                    </div>
                  </div>

                  <p className="mt-4 text-xs text-slate-300 line-clamp-2">{m.bio || 'Experienced engineering leader and mentor.'}</p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {m.specialization.map((s, idx) => (
                      <span key={idx} className="rounded-md bg-slate-800/90 px-2 py-0.5 text-[11px] text-slate-300">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 border-t border-slate-800/80 pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[11px] text-slate-400">Hourly Rate</p>
                      <p className="text-sm font-bold text-emerald-400">{m.hourlyRate > 0 ? `₹${m.hourlyRate}/hr` : 'Free for Students'}</p>
                    </div>
                    <button
                      onClick={() => setSelectedMentor(m)}
                      className="rounded-xl bg-cyan-600 px-4 py-2 text-xs font-semibold text-white shadow-lg transition-all hover:bg-cyan-500"
                    >
                      Book 1:1 Session
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scheduled Sessions */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-white">Your Scheduled Mentorship Sessions</h2>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sessions.map(s => (
              <div key={s.id} className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-white">{s.topic}</h4>
                    <p className="text-xs text-slate-400">Mentor: {s.mentorName}</p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      s.status === MentorSessionStatus.SCHEDULED
                        ? 'bg-cyan-500/10 text-cyan-400'
                        : 'bg-emerald-500/10 text-emerald-400'
                    }`}
                  >
                    {s.status.toUpperCase()}
                  </span>
                </div>

                <div className="mt-4 space-y-1.5 text-xs text-slate-400 border-t border-slate-800/80 pt-3">
                  <p className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" /> {new Date(s.scheduledAt).toLocaleString()}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-slate-400" /> {s.durationMinutes} Minutes Session
                  </p>
                </div>

                {s.meetingUrl && (
                  <a
                    href={s.meetingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-slate-800/90 py-2 text-xs font-semibold text-white transition-all hover:bg-slate-700"
                  >
                    <Video className="h-3.5 w-3.5 text-cyan-400" /> Join Video Meeting
                  </a>
                )}
              </div>
            ))}
            {sessions.length === 0 && (
              <div className="col-span-full rounded-2xl border border-dashed border-slate-800 p-8 text-center text-slate-400">
                You have no upcoming mentorship sessions. Book your first session with an expert above!
              </div>
            )}
          </div>
        </div>

        {/* Booking Modal */}
        {selectedMentor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">Book Mentorship Session</h3>
                  <p className="text-xs text-slate-400">with {selectedMentor.fullName || selectedMentor.username}</p>
                </div>
                <button
                  onClick={() => setSelectedMentor(null)}
                  className="rounded-lg p-1 text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {bookingSuccess ? (
                <div className="py-8 text-center">
                  <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-400" />
                  <p className="mt-3 font-semibold text-white">Session Confirmed!</p>
                  <p className="text-xs text-slate-400">Calendar invite and meeting link have been generated.</p>
                </div>
              ) : (
                <form onSubmit={handleBookSession} className="mt-6 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase">Session Topic</label>
                    <input
                      type="text"
                      value={topic}
                      onChange={e => setTopic(e.target.value)}
                      placeholder="e.g. Distributed System Architecture & High-Scale Design"
                      className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-cyan-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase">Date & Time</label>
                      <input
                        type="datetime-local"
                        value={scheduledAt}
                        onChange={e => setScheduledAt(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-cyan-500 focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase">Duration</label>
                      <select
                        value={durationMinutes}
                        onChange={e => setDurationMinutes(Number(e.target.value))}
                        className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-cyan-500 focus:outline-none"
                      >
                        <option value={30}>30 Minutes</option>
                        <option value={45}>45 Minutes</option>
                        <option value={60}>60 Minutes</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase">
                      Discussion Notes (Optional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                      placeholder="Share your background, GitHub repos, or specific problems you'd like advice on..."
                      rows={3}
                      className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-white focus:border-cyan-500 focus:outline-none"
                    />
                  </div>

                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedMentor(null)}
                      className="rounded-xl px-4 py-2 text-sm font-medium text-slate-300 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={booking}
                      className="rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:opacity-90 disabled:opacity-50"
                    >
                      {booking ? 'Scheduling...' : 'Confirm & Schedule'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
