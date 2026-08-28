import React, { useState, useEffect } from 'react';
import {
  Clock,
  ArrowRight,
  Plus,
  Users,
} from 'lucide-react';
import { enterpriseApi } from '../services/enterpriseApi';
import { LearningPathDto } from '@codeforge/shared';

export const LearningPathPage: React.FC = () => {
  const [paths, setPaths] = useState<LearningPathDto[]>([]);
  const [selectedPath, setSelectedPath] = useState<LearningPathDto | null>(null);
  const [loading, setLoading] = useState(true);

  // Create path modal
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetRole, setTargetRole] = useState('Senior Full-Stack Architect');
  const [estimatedHours, setEstimatedHours] = useState(60);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadPaths();
  }, []);

  const loadPaths = async () => {
    try {
      setLoading(true);
      const data = await enterpriseApi.listLearningPaths();
      setPaths(data);
      if (data.length > 0) {
        setSelectedPath(data[0]);
      }
    } catch (err) {
      console.error('Failed to load learning paths:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePath = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !targetRole) return;
    try {
      setCreating(true);
      const newPath = await enterpriseApi.createLearningPath({
        title,
        description,
        targetRole,
        estimatedHours,
        courseIds: [],
      });
      setPaths([newPath, ...paths]);
      setSelectedPath(newPath);
      setShowModal(false);
      setTitle('');
      setDescription('');
    } catch (err) {
      console.error('Failed to create learning path:', err);
    } finally {
      setCreating(false);
    }
  };

  if (loading && paths.length === 0) {
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
              <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-400">
                Workforce Upskilling Paths
              </span>
              <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs text-emerald-400">
                Outcome-Driven Career Tracks
              </span>
            </div>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Role-Based Career Learning Paths
            </h1>
            <p className="mt-1 text-slate-400">
              Structured multi-course career roadmaps aligned with enterprise talent specifications.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-5 py-2.5 font-semibold text-white shadow-lg transition-all hover:bg-cyan-500"
          >
            <Plus className="h-4 w-4" /> Create Career Path
          </button>
        </div>

        {/* Path Directory & Detailed Roadmap */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Paths List */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white">Career Tracks</h2>
            <div className="space-y-3">
              {paths.map(p => (
                <div
                  key={p.id}
                  onClick={() => setSelectedPath(p)}
                  className={`cursor-pointer rounded-2xl border p-5 transition-all ${
                    selectedPath?.id === p.id
                      ? 'border-cyan-500 bg-slate-900/80 shadow-lg ring-1 ring-cyan-500/30'
                      : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-xs font-semibold text-cyan-400">
                      {p.targetRole}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      <Clock className="h-3 w-3" /> {p.estimatedHours}h
                    </span>
                  </div>

                  <h3 className="mt-2 text-base font-bold text-white">{p.title}</h3>
                  <p className="mt-1 text-xs text-slate-400 line-clamp-2">{p.description}</p>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-800/80 pt-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" /> {p.enrolledCount || 45} Trainees Enrolled
                    </span>
                    <span className="text-cyan-400 font-semibold flex items-center gap-1">
                      View Roadmap <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Path Roadmap */}
          {selectedPath && (
            <div className="space-y-6 lg:col-span-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div>
                    <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-bold uppercase text-cyan-400">
                      Target Role: {selectedPath.targetRole}
                    </span>
                    <h2 className="mt-2 text-2xl font-bold text-white">{selectedPath.title}</h2>
                    <p className="mt-1 text-sm text-slate-300">{selectedPath.description}</p>
                  </div>
                  <button className="rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 px-6 py-2.5 font-semibold text-white shadow-lg transition-all hover:opacity-90">
                    Start Learning Path
                  </button>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-4 border-t border-slate-800 pt-4 text-center">
                  <div>
                    <p className="text-xs text-slate-400">Estimated Duration</p>
                    <p className="mt-1 text-xl font-bold text-white">{selectedPath.estimatedHours} Hours</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Curriculum Milestones</p>
                    <p className="mt-1 text-xl font-bold text-cyan-400">4 Modules</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Graduation Readiness</p>
                    <p className="mt-1 text-xl font-bold text-emerald-400">Industry Ready</p>
                  </div>
                </div>
              </div>

              {/* Milestone Roadmap */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
                <h3 className="text-lg font-bold text-white">Curriculum Progression Roadmap</h3>
                <div className="mt-6 space-y-6">
                  {[
                    {
                      phase: 'Phase 1: Foundational Systems & Algorithmic Rigor',
                      desc: 'Advanced data structures, time complexity profiling, memory layout, and system modeling.',
                      duration: '15 Hours',
                      skills: ['Algorithms', 'Data Structures', 'C++', 'Rust'],
                    },
                    {
                      phase: 'Phase 2: High-Throughput Distributed Backends',
                      desc: 'Event loops, microservices, gRPC, message queues, Kafka pipelines, and Redis caching.',
                      duration: '20 Hours',
                      skills: ['Node.js', 'Distributed Systems', 'Kafka', 'PostgreSQL'],
                    },
                    {
                      phase: 'Phase 3: Cloud Native & Infrastructure Orchestration',
                      desc: 'Containerization, Kubernetes clustering, CI/CD automated gates, and observability.',
                      duration: '15 Hours',
                      skills: ['Docker', 'Kubernetes', 'AWS/GCP', 'OpenTelemetry'],
                    },
                    {
                      phase: 'Phase 4: Capstone Engineering & Production Defense',
                      desc: 'Architect and deploy an enterprise-scale distributed system and defend against chaos engineering.',
                      duration: '10 Hours',
                      skills: ['System Design', 'Chaos Testing', 'Production Readiness'],
                    },
                  ].map((m, idx) => (
                    <div key={idx} className="relative flex gap-4">
                      {/* Timeline Dot */}
                      <div className="flex flex-col items-center">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-400 font-bold text-xs ring-4 ring-slate-950">
                          {idx + 1}
                        </div>
                        {idx < 3 && <div className="h-full w-0.5 bg-slate-800"></div>}
                      </div>

                      {/* Content */}
                      <div className="flex-1 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-white">{m.phase}</h4>
                          <span className="text-xs text-slate-400">{m.duration}</span>
                        </div>
                        <p className="mt-1 text-xs text-slate-400">{m.desc}</p>
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {m.skills.map((s, sIdx) => (
                            <span key={sIdx} className="rounded-md bg-slate-800 px-2 py-0.5 text-[11px] text-slate-300">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Create Path Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <h3 className="text-lg font-bold text-white">Create Career Learning Path</h3>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreatePath} className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase">Path Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. Enterprise AI Platform Engineer"
                    className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-cyan-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase">Target Role Title</label>
                  <input
                    type="text"
                    value={targetRole}
                    onChange={e => setTargetRole(e.target.value)}
                    placeholder="e.g. Lead Machine Learning Systems Engineer"
                    className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-cyan-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase">Description</label>
                  <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Comprehensive learning roadmap for engineers mastering transformer architectures and scalable LLM inference..."
                    rows={3}
                    className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase">Estimated Hours</label>
                  <input
                    type="number"
                    value={estimatedHours}
                    onChange={e => setEstimatedHours(Number(e.target.value))}
                    className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-cyan-500 focus:outline-none"
                    required
                  />
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="rounded-xl px-4 py-2 text-sm font-medium text-slate-300 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="rounded-xl bg-cyan-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-cyan-500 disabled:opacity-50"
                  >
                    {creating ? 'Creating...' : 'Publish Career Path'}
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
