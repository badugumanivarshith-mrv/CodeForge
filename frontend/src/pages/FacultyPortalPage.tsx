import React, { useState, useEffect } from 'react';
import {
  Target,
  Clock,
  Plus,
  ArrowRight,
} from 'lucide-react';
import { enterpriseApi } from '../services/enterpriseApi';
import {
  MentorProfileDto,
  StudentMentorshipDto,
  StudentProfileDto,
  FacultyMentorSessionDto,
} from '@codeforge/shared';

export const FacultyPortalPage: React.FC = () => {
  const [mentors, setMentors] = useState<MentorProfileDto[]>([]);
  const [selectedFaculty, setSelectedFaculty] = useState<MentorProfileDto | null>(null);
  const [mentorships, setMentorships] = useState<StudentMentorshipDto[]>([]);
  const [sessions, setSessions] = useState<FacultyMentorSessionDto[]>([]);
  const [students, setStudents] = useState<StudentProfileDto[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal / Form state for new mentorship
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [goalsInput, setGoalsInput] = useState('');
  const [creatingMentorship, setCreatingMentorship] = useState(false);

  useEffect(() => {
    loadFaculty();
  }, []);

  useEffect(() => {
    if (selectedFaculty) {
      loadFacultyData(selectedFaculty.id);
    }
  }, [selectedFaculty]);

  const loadFaculty = async () => {
    try {
      setLoading(true);
      const [mentorList, studentList] = await Promise.all([
        enterpriseApi.listMentors(),
        enterpriseApi.listStudents(),
      ]);
      setMentors(mentorList);
      setStudents(studentList);
      if (mentorList.length > 0) {
        setSelectedFaculty(mentorList[0]);
      }
    } catch (err) {
      console.error('Failed to load faculty:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadFacultyData = async (mentorId: string) => {
    try {
      const [mentorshipData, sessionsData] = await Promise.all([
        enterpriseApi.listStudentMentorships(mentorId),
        enterpriseApi.listMentorSessions(mentorId),
      ]);
      setMentorships(mentorshipData);
      setSessions(sessionsData);
    } catch (err) {
      console.error('Failed to load faculty data:', err);
    }
  };

  const handleCreateMentorship = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFaculty || !selectedStudentId) return;
    try {
      setCreatingMentorship(true);
      const goals = goalsInput
        .split(',')
        .map(g => g.trim())
        .filter(Boolean);
      await enterpriseApi.createStudentMentorship(selectedFaculty.id, selectedStudentId, goals);
      setGoalsInput('');
      setSelectedStudentId('');
      await loadFacultyData(selectedFaculty.id);
    } catch (err) {
      console.error('Failed to create mentorship:', err);
    } finally {
      setCreatingMentorship(false);
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
        <div className="flex flex-col justify-between gap-4 border-b border-slate-800 pb-6 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-purple-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-purple-400">
                Faculty & Academic Portal
              </span>
              <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs text-emerald-400">
                Verified Faculty Mentor
              </span>
            </div>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Faculty Advisory & Student Mentorship
            </h1>
            <p className="mt-1 text-slate-400">
              Manage student mentees, track academic milestones, schedule office hours, and review progress.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedFaculty?.id || ''}
              onChange={e => {
                const m = mentors.find(x => x.id === e.target.value);
                if (m) setSelectedFaculty(m);
              }}
              className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 font-medium text-white shadow-inner focus:border-purple-500 focus:outline-none"
            >
              {mentors.map(m => (
                <option key={m.id} value={m.id}>
                  {m.fullName || m.username} ({m.specialization.join(', ')})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected Faculty Profile Info */}
        {selectedFaculty && (
          <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 font-bold text-2xl text-white shadow-lg">
                  {selectedFaculty.username[0].toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedFaculty.fullName || selectedFaculty.username}</h3>
                  <p className="text-sm text-purple-400">{selectedFaculty.organizationName || 'University Faculty'}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {selectedFaculty.specialization.map((s, idx) => (
                      <span key={idx} className="rounded-lg bg-slate-800 px-2 py-0.5 text-xs text-slate-300">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 border-t border-slate-800 pt-4 md:border-t-0 md:pt-0">
                <div className="text-center">
                  <p className="text-xs text-slate-400">Rating</p>
                  <p className="mt-1 text-xl font-bold text-amber-400">★ {selectedFaculty.rating}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-slate-400">Active Mentees</p>
                  <p className="mt-1 text-xl font-bold text-white">{mentorships.length}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-slate-400">Total Sessions</p>
                  <p className="mt-1 text-xl font-bold text-indigo-400">{selectedFaculty.totalSessions}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mentorship Programs & Sessions */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Active Student Mentorships */}
          <div className="space-y-4 lg:col-span-2">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Assigned Student Mentorships</h2>
              <span className="text-xs text-slate-400">{mentorships.length} Active Tracks</span>
            </div>

            <div className="space-y-3">
              {mentorships.map(m => {
                const st = students.find(s => s.id === m.studentId);
                return (
                  <div key={m.id} className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
                    <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                      <div>
                        <h4 className="font-semibold text-white">{st?.fullName || st?.username || 'Student Mentee'}</h4>
                        <p className="text-xs text-slate-400">
                          Roll: {st?.studentRollNumber || 'CS-2026-042'} · CGPA: {st?.cgpa || 8.8} · Sem {st?.semester || 6}
                        </p>
                      </div>
                      <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
                        {m.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="mt-4 border-t border-slate-800/80 pt-3">
                      <p className="text-xs font-semibold text-slate-300">Mentorship Goals:</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {m.goals.map((g, idx) => (
                          <span
                            key={idx}
                            className="flex items-center gap-1 rounded-lg bg-indigo-500/10 px-2.5 py-1 text-xs text-indigo-300"
                          >
                            <Target className="h-3 w-3" /> {g}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}

              {mentorships.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-800 p-8 text-center text-slate-400">
                  No active student mentorships yet. Use the form below to pair with a student.
                </div>
              )}
            </div>

            {/* Pair with new mentee form */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
              <h3 className="text-md font-bold text-white flex items-center gap-2">
                <Plus className="h-4 w-4 text-purple-400" /> Pair New Student Mentee
              </h3>
              <form onSubmit={handleCreateMentorship} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase">Select Student</label>
                  <select
                    value={selectedStudentId}
                    onChange={e => setSelectedStudentId(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-purple-500 focus:outline-none"
                    required
                  >
                    <option value="">-- Choose a student --</option>
                    {students.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.fullName || s.username} ({s.studentRollNumber || 'No Roll'}, CGPA {s.cgpa})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase">
                    Goals (comma separated)
                  </label>
                  <input
                    type="text"
                    value={goalsInput}
                    onChange={e => setGoalsInput(e.target.value)}
                    placeholder="e.g. Master Distributed Systems, FAANG Mock Interviews, Placement Readiness"
                    className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-purple-500 focus:outline-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={creatingMentorship}
                  className="w-full rounded-xl bg-purple-600 py-2.5 font-semibold text-white shadow-lg transition-all hover:bg-purple-500 disabled:opacity-50"
                >
                  {creatingMentorship ? 'Assigning...' : 'Assign Mentee'}
                </button>
              </form>
            </div>
          </div>

          {/* Scheduled Sessions & Office Hours */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white">Upcoming 1:1 Sessions</h2>
            <div className="space-y-3">
              {sessions.map(s => (
                <div key={s.id} className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-white">{s.topic}</h4>
                    <span className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-xs text-indigo-400">
                      {s.durationMinutes} min
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-400">Mentee: {s.menteeName || 'Student'}</p>
                  <p className="mt-1 text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {new Date(s.scheduledAt).toLocaleString()}
                  </p>
                  {s.meetingUrl && (
                    <a
                      href={s.meetingUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:underline"
                    >
                      Join Meeting <ArrowRight className="h-3 w-3" />
                    </a>
                  )}
                </div>
              ))}
              {sessions.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-800 p-6 text-center text-xs text-slate-400">
                  No sessions scheduled currently.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
