import React, { useState, useEffect } from 'react';
import {
  Plus,
  Layers,
  Clock,
  Play,
  Users,
} from 'lucide-react';
import { enterpriseApi } from '../services/enterpriseApi';
import { CourseDto, CourseModuleDto, CourseLevel } from '@codeforge/shared';

export const CourseBuilderPage: React.FC = () => {
  const [courses, setCourses] = useState<CourseDto[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<CourseDto | null>(null);
  const [modules, setModules] = useState<CourseModuleDto[]>([]);
  const [loading, setLoading] = useState(true);

  // New course modal state
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [level, setLevel] = useState<CourseLevel>(CourseLevel.INTERMEDIATE);
  const [price, setPrice] = useState(0);
  const [creating, setCreating] = useState(false);

  // New module modal state
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [moduleTitle, setModuleTitle] = useState('');
  const [moduleDuration, setModuleDuration] = useState(60);

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      loadModules(selectedCourse.id);
    }
  }, [selectedCourse]);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const data = await enterpriseApi.listCourses();
      setCourses(data);
      if (data.length > 0) {
        setSelectedCourse(data[0]);
      }
    } catch (err) {
      console.error('Failed to load courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadModules = async (courseId: string) => {
    try {
      const data = await enterpriseApi.listCourseModules(courseId);
      setModules(data);
    } catch (err) {
      console.error('Failed to load modules:', err);
    }
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    try {
      setCreating(true);
      const newCourse = await enterpriseApi.createCourse({
        title,
        description,
        level,
        price,
      });
      setCourses([newCourse, ...courses]);
      setSelectedCourse(newCourse);
      setShowCourseModal(false);
      setTitle('');
      setDescription('');
    } catch (err) {
      console.error('Failed to create course:', err);
    } finally {
      setCreating(false);
    }
  };

  const handleAddModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse || !moduleTitle) return;
    try {
      const newMod = await enterpriseApi.addCourseModule(selectedCourse.id, {
        title: moduleTitle,
        durationMinutes: moduleDuration,
        sequence: modules.length + 1,
      });
      setModules([...modules, newMod]);
      setShowModuleModal(false);
      setModuleTitle('');
    } catch (err) {
      console.error('Failed to add module:', err);
    }
  };

  const handleEnroll = async (courseId: string) => {
    try {
      await enterpriseApi.enrollCourse(courseId);
      alert('Successfully enrolled in course!');
    } catch (err) {
      console.error('Failed to enroll in course:', err);
    }
  };

  if (loading && courses.length === 0) {
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
              <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-400">
                Enterprise LMS Engine
              </span>
              <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs text-emerald-400">
                SCORM & Micro-Learning Ready
              </span>
            </div>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Course Builder & Curriculum Studio
            </h1>
            <p className="mt-1 text-slate-400">
              Author interactive computer science curricula, distributed systems labs, and assessment modules.
            </p>
          </div>

          <button
            onClick={() => setShowCourseModal(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 font-semibold text-white shadow-lg transition-all hover:bg-indigo-500"
          >
            <Plus className="h-4 w-4" /> Create New Course
          </button>
        </div>

        {/* Main Content Layout */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Courses Sidebar */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white">Course Library</h2>
            <div className="space-y-3">
              {courses.map(c => (
                <div
                  key={c.id}
                  onClick={() => setSelectedCourse(c)}
                  className={`cursor-pointer rounded-2xl border p-5 transition-all ${
                    selectedCourse?.id === c.id
                      ? 'border-indigo-500 bg-slate-900/80 shadow-lg ring-1 ring-indigo-500/30'
                      : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase ${
                        c.level === CourseLevel.ADVANCED
                          ? 'bg-purple-500/10 text-purple-400'
                          : c.level === CourseLevel.INTERMEDIATE
                          ? 'bg-cyan-500/10 text-cyan-400'
                          : 'bg-emerald-500/10 text-emerald-400'
                      }`}
                    >
                      {c.level}
                    </span>
                    <span className="text-xs font-semibold text-amber-400">★ {c.rating || 4.9}</span>
                  </div>

                  <h3 className="mt-2 text-base font-bold text-white">{c.title}</h3>
                  <p className="mt-1 text-xs text-slate-400 line-clamp-2">{c.description}</p>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-800/80 pt-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Layers className="h-3 w-3" /> {c.modulesCount} Modules
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" /> {c.enrolledCount} Enrolled
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Course Detail & Module Hierarchy */}
          {selectedCourse && (
            <div className="space-y-6 lg:col-span-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div>
                    <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-bold uppercase text-indigo-400">
                      {selectedCourse.level} Level Curriculum
                    </span>
                    <h2 className="mt-2 text-2xl font-bold text-white">{selectedCourse.title}</h2>
                    <p className="mt-1 text-sm text-slate-300">{selectedCourse.description}</p>
                  </div>
                  <button
                    onClick={() => handleEnroll(selectedCourse.id)}
                    className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-2.5 font-semibold text-white shadow-lg transition-all hover:opacity-90"
                  >
                    Enroll Now
                  </button>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-4 border-t border-slate-800 pt-4 text-center">
                  <div>
                    <p className="text-xs text-slate-400">Total Modules</p>
                    <p className="mt-1 text-xl font-bold text-white">{modules.length || selectedCourse.modulesCount}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Active Students</p>
                    <p className="mt-1 text-xl font-bold text-indigo-400">{selectedCourse.enrolledCount || 150}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Rating</p>
                    <p className="mt-1 text-xl font-bold text-amber-400">★ {selectedCourse.rating || 4.9}</p>
                  </div>
                </div>
              </div>

              {/* Module List */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">Curriculum Modules & Lessons</h3>
                  <button
                    onClick={() => setShowModuleModal(true)}
                    className="flex items-center gap-1.5 rounded-lg bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold text-indigo-400 hover:bg-indigo-500/20"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Module
                  </button>
                </div>

                <div className="mt-4 space-y-3">
                  {modules.map((m, idx) => (
                    <div
                      key={m.id}
                      className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 p-4 transition-colors hover:border-slate-700"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 font-bold text-xs">
                          {idx + 1}
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">{m.title}</h4>
                          <p className="text-xs text-slate-400">
                            {m.lessonsCount || 4} Interactive Lessons · Hands-on Coding Lab
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-xs text-slate-400">
                          <Clock className="h-3 w-3" /> {m.durationMinutes} mins
                        </span>
                        <button className="rounded-lg bg-slate-800 p-2 text-slate-300 hover:text-white">
                          <Play className="h-3.5 w-3.5 text-indigo-400" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {modules.length === 0 && (
                    <div className="rounded-xl border border-dashed border-slate-800 p-8 text-center text-xs text-slate-400">
                      No modules added to this course yet. Click 'Add Module' to build the syllabus.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal: Create Course */}
        {showCourseModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <h3 className="text-lg font-bold text-white">Create New LMS Course</h3>
                <button onClick={() => setShowCourseModal(false)} className="text-slate-400 hover:text-white">
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateCourse} className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase">Course Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. Distributed Database Architecture & Consensus Algorithms"
                    className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase">Course Description</label>
                  <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Deep-dive into Paxos, Raft, Vector Clocks, and Partition Tolerant systems..."
                    rows={3}
                    className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase">Difficulty Level</label>
                    <select
                      value={level}
                      onChange={e => setLevel(e.target.value as CourseLevel)}
                      className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
                    >
                      <option value={CourseLevel.BEGINNER}>Beginner</option>
                      <option value={CourseLevel.INTERMEDIATE}>Intermediate</option>
                      <option value={CourseLevel.ADVANCED}>Advanced</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase">Price (INR)</label>
                    <input
                      type="number"
                      value={price}
                      onChange={e => setPrice(Number(e.target.value))}
                      className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCourseModal(false)}
                    className="rounded-xl px-4 py-2 text-sm font-medium text-slate-300 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-indigo-500 disabled:opacity-50"
                  >
                    {creating ? 'Creating...' : 'Publish Course'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Add Module */}
        {showModuleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <h3 className="text-lg font-bold text-white">Add Curriculum Module</h3>
                <button onClick={() => setShowModuleModal(false)} className="text-slate-400 hover:text-white">
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddModule} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase">Module Title</label>
                  <input
                    type="text"
                    value={moduleTitle}
                    onChange={e => setModuleTitle(e.target.value)}
                    placeholder="e.g. Quorum Replication & Conflict Resolution"
                    className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase">Estimated Duration (Mins)</label>
                  <input
                    type="number"
                    value={moduleDuration}
                    onChange={e => setModuleDuration(Number(e.target.value))}
                    className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none"
                    required
                  />
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModuleModal(false)}
                    className="rounded-xl px-4 py-2 text-sm font-medium text-slate-300 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-indigo-600 px-6 py-2 text-sm font-semibold text-white shadow-lg transition-all hover:bg-indigo-500"
                  >
                    Add Module
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
