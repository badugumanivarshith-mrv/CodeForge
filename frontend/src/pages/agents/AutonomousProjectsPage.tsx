import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { agenticWorkspaceApi } from '../../services/agenticWorkspaceApi';
import {
  AutonomousProjectDto,
} from '@codeforge/shared';

export const AutonomousProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<AutonomousProjectDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [goal, setGoal] = useState('');
  const [weeks, setWeeks] = useState(8);
  const [techStack, setTechStack] = useState('Rust, Tokio, PostgreSQL, Docker, Criterion');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await agenticWorkspaceApi.listProjects();
      setProjects(data);
    } catch (err) {
      console.error('Failed to load autonomous projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !goal.trim()) return;
    try {
      setCreating(true);
      const stackArray = techStack.split(',').map(s => s.trim()).filter(Boolean);
      const created = await agenticWorkspaceApi.createProject({
        title,
        goal,
        targetTimelineWeeks: weeks,
        preferredTechStack: stackArray,
      });
      setProjects(prev => [created, ...prev]);
      setTitle('');
      setGoal('');
    } catch (err) {
      console.error('Failed to create autonomous project:', err);
    } finally {
      setCreating(false);
    }
  };

  const handleToggleObjective = async (projectId: string, weekNumber: number) => {
    try {
      const updated = await agenticWorkspaceApi.completeProjectObjective(projectId, weekNumber);
      setProjects(prev => prev.map(p => (p.id === projectId ? updated : p)));
    } catch (err) {
      console.error('Failed to update objective:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-lg font-medium text-slate-300">Loading Autonomous Projects...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center space-x-2">
              <Link to="/ai-command-center" className="text-xs text-indigo-400 hover:underline">
                ← AI Command Center
              </Link>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-400">Autonomous Execution</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white mt-1">
              Autonomous Project Execution
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              AI project planning, Gantt roadmaps, sprint breakdown, and progress tracking.
            </p>
          </div>
        </div>

        {/* Project Generator Form */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-5">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>🚀</span> Generate Autonomous Project Roadmap
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Specify your project ambition. Agents will construct multi-phase roadmaps, 2-week sprints, and risk matrices.
            </p>
          </div>

          <form onSubmit={handleCreateProject} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Project Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Raft Distributed In-Memory Key-Value Store"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">High-Level Goal</label>
                <input
                  type="text"
                  value={goal}
                  onChange={e => setGoal(e.target.value)}
                  placeholder="e.g. Build linearizable consensus engine passing Jepsen partition tests"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Target Timeline (Weeks)</label>
                <input
                  type="number"
                  min="2"
                  max="24"
                  value={weeks}
                  onChange={e => setWeeks(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Preferred Tech Stack (Comma Separated)</label>
                <input
                  type="text"
                  value={techStack}
                  onChange={e => setTechStack(e.target.value)}
                  placeholder="Rust, Tokio, PostgreSQL, Docker"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={creating}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-xs font-bold text-white hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/20 disabled:opacity-50 transition-all"
              >
                {creating ? 'Planning Autonomous Roadmap...' : '⚡ Generate Project Plan & Sprints'}
              </button>
            </div>
          </form>
        </div>

        {/* Projects List */}
        <div className="space-y-6">
          {projects.map(project => (
            <div
              key={project.id}
              className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6"
            >
              {/* Project Header */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-indigo-500/20 text-indigo-400">
                      {project.status.toUpperCase()}
                    </span>
                    <h3 className="text-xl font-bold text-white">{project.title}</h3>
                  </div>
                  <p className="text-xs text-slate-400">{project.description}</p>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="text-xs text-slate-400">Project Progress</div>
                    <div className="text-2xl font-extrabold text-emerald-400">{project.progressPercentage}%</div>
                  </div>
                  <div className="w-24 bg-slate-800 rounded-full h-3 overflow-hidden border border-slate-700">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${project.progressPercentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Multi-Phase Roadmap */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  🗺️ Multi-Phase Gantt Roadmap ({project.roadmap.length} Phases)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {project.roadmap.map((phase, pIdx) => (
                    <div key={pIdx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-indigo-400">Phase {pIdx + 1}</span>
                        <span className="text-[10px] text-slate-500 font-mono">~{phase.estimatedWeeks} wks</span>
                      </div>
                      <h4 className="text-xs font-semibold text-slate-200">{phase.phase}</h4>
                      <ul className="text-[11px] text-slate-400 space-y-1 list-disc list-inside">
                        {phase.milestones.map((m, mIdx) => (
                          <li key={mIdx}>{m}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sprint Plan Timeline */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  🏃 2-Week Sprint Cadence ({project.sprintPlan.length} Sprints)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {project.sprintPlan.map((sprint, sIdx) => (
                    <div key={sIdx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-purple-400">Sprint {sprint.sprintNumber}</span>
                        <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded ${
                          sprint.status === 'in_progress' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {sprint.status}
                        </span>
                      </div>
                      <h4 className="text-xs font-semibold text-slate-200">{sprint.name}</h4>
                      <div className="text-[11px] text-slate-400 space-y-0.5">
                        {sprint.deliverables.map((del, dIdx) => (
                          <div key={dIdx}>• {del}</div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weekly Objectives & Progress Toggles */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  ✅ Weekly Objectives & Key Results (Click to Complete)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {project.weeklyObjectives.map((obj, oIdx) => (
                    <div
                      key={oIdx}
                      onClick={() => handleToggleObjective(project.id, obj.weekNumber)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start space-x-3 ${
                        obj.completed
                          ? 'bg-emerald-950/20 border-emerald-500/40 text-slate-300'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={obj.completed}
                        onChange={() => {}}
                        className="mt-1 h-4 w-4 rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-0 cursor-pointer"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-indigo-400">Week {obj.weekNumber}</span>
                          <h4 className={`text-xs font-bold ${obj.completed ? 'line-through text-slate-400' : 'text-white'}`}>
                            {obj.objective}
                          </h4>
                        </div>
                        <div className="text-[11px] text-slate-400">
                          KRs: {obj.keyResults.join(' • ')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resource Allocation & Risk Matrix */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-800 text-xs">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <span className="font-bold text-indigo-300">⚡ Resource Allocation:</span>
                  <div className="text-slate-400">
                    Recommended: <strong>{project.resourceAllocation?.recommendedHoursPerWeek || 15} hrs/week</strong>
                  </div>
                  <div className="text-slate-400">
                    Primary Tools: {project.resourceAllocation?.primaryTools?.join(', ')}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/20 space-y-1.5">
                  <span className="font-bold text-rose-300">⚠️ Risk Analysis & Mitigations:</span>
                  <ul className="text-slate-400 space-y-0.5 list-disc list-inside">
                    {project.riskFactors.map((rf, rIdx) => (
                      <li key={rIdx}>{rf}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
