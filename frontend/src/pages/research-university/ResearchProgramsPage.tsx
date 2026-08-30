import React, { useEffect, useState } from 'react';
import { researchUniversityApi } from '../../services/researchUniversityApi';
import { ResearchProgramDto, AcademicDepartment, ResearchProgramStatus, ResearchProjectDto } from '@codeforge/shared';

export const ResearchProgramsPage: React.FC = () => {
  const [programs, setPrograms] = useState<ResearchProgramDto[]>([]);
  const [selectedDept, setSelectedDept] = useState<AcademicDepartment | 'ALL'>('ALL');
  const [showForm, setShowForm] = useState(false);

  // New program state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [department, setDepartment] = useState<AcademicDepartment>(AcademicDepartment.ARTIFICIAL_INTELLIGENCE);
  const [budget, setBudget] = useState(1000000);
  const [hypothesis, setHypothesis] = useState('');

  // Selected Program Projects state
  const [activeProgramId, setActiveProgramId] = useState<string | null>(null);
  const [projects, setProjects] = useState<ResearchProjectDto[]>([]);

  useEffect(() => {
    loadPrograms();
  }, [selectedDept]);

  async function loadPrograms() {
    try {
      const deptFilter = selectedDept === 'ALL' ? undefined : selectedDept;
      const data = await researchUniversityApi.listPrograms(deptFilter);
      setPrograms(data);
      if (data.length > 0 && !activeProgramId) {
        handleSelectProgram(data[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleSelectProgram(id: string) {
    setActiveProgramId(id);
    try {
      const data = await researchUniversityApi.listProjects(id);
      setProjects(data);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleProposeProgram(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !description) return;
    try {
      await researchUniversityApi.proposeProgram({
        name,
        description,
        department,
        allocatedBudgetUsd: budget,
        primaryHypothesis: hypothesis || undefined,
      });
      setName('');
      setDescription('');
      setHypothesis('');
      setShowForm(false);
      loadPrograms();
    } catch (err) {
      console.error(err);
    }
  }

  async function handleActivateProgram(id: string) {
    try {
      await researchUniversityApi.activateProgram(id);
      loadPrograms();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      {/* Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-indigo-900/40 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-amber-400">
            Research Programs Registry
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Propose academic initiatives, monitor critical path milestones, and coordinate faculty research agents.
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 rounded-lg bg-indigo-900/60 hover:bg-indigo-900 border border-indigo-500/30 text-indigo-200 text-sm font-semibold transition-all"
        >
          {showForm ? 'Close Proposal Form' : '+ Propose New Initiative'}
        </button>
      </div>

      {/* Filter by Department */}
      <div className="flex flex-wrap gap-2 pt-1 border-b border-slate-900 pb-4">
        <button
          onClick={() => setSelectedDept('ALL')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
            selectedDept === 'ALL'
              ? 'bg-indigo-600 border-indigo-500 text-white'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
          }`}
        >
          ALL DEPARTMENTS
        </button>
        {Object.values(AcademicDepartment).map((dept) => (
          <button
            key={dept}
            onClick={() => setSelectedDept(dept)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all uppercase ${
              selectedDept === dept
                ? 'bg-indigo-600 border-indigo-500 text-white'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            {dept.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Show proposal form */}
      {showForm && (
        <form onSubmit={handleProposeProgram} className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4 max-w-2xl">
          <h3 className="font-bold text-slate-200">Propose Academic Research Initiative</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-slate-400 font-semibold uppercase">Program Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Quantum Decoupling Operators"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-100 focus:border-indigo-500 outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-400 font-semibold uppercase">Disciplinary Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value as AcademicDepartment)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-100 focus:border-indigo-500 outline-none"
              >
                {Object.values(AcademicDepartment).map((dept) => (
                  <option key={dept} value={dept}>
                    {dept.replace('_', ' ').toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-slate-400 font-semibold uppercase">Primary Hypothesis Statement</label>
            <input
              type="text"
              value={hypothesis}
              onChange={(e) => setHypothesis(e.target.value)}
              placeholder="e.g., Quantum interference patterns suppress latency in non-Euclidean graph networks."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-100 focus:border-indigo-500 outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-slate-400 font-semibold uppercase">Program Vision & Scope</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Describe scientific objectives and targets..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-100 focus:border-indigo-500 outline-none"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-slate-400 font-semibold uppercase">Allocated Budget ($ USD)</label>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-100 focus:border-indigo-500 outline-none"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 font-semibold text-sm transition-all"
              >
                Submit Proposal
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Programs list */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-slate-200">Academic Programs Lifecycle</h2>
          <div className="space-y-4">
            {programs.length === 0 ? (
              <div className="text-center py-12 text-slate-500">No research programs match selected filter.</div>
            ) : (
              programs.map((prog) => (
                <div
                  key={prog.id}
                  onClick={() => handleSelectProgram(prog.id)}
                  className={`p-6 rounded-xl border transition-all cursor-pointer ${
                    activeProgramId === prog.id
                      ? 'bg-slate-900 border-indigo-500/50 shadow-indigo-950/20'
                      : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-wider">
                        {prog.department.replace('_', ' ')}
                      </span>
                      <h3 className="text-base font-bold text-slate-100 mt-1">{prog.name}</h3>
                      <p className="text-slate-400 text-xs mt-1">{prog.description}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className={`text-[10px] font-mono font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        prog.status === ResearchProgramStatus.ACTIVE
                          ? 'bg-emerald-950 border border-emerald-500/30 text-emerald-400'
                          : prog.status === ResearchProgramStatus.PEER_REVIEW
                          ? 'bg-amber-950 border border-amber-500/30 text-amber-400'
                          : 'bg-slate-900 border border-slate-800 text-slate-500'
                      }`}>
                        {prog.status}
                      </span>
                      {prog.status === ResearchProgramStatus.PROPOSED && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleActivateProgram(prog.id);
                          }}
                          className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 hover:underline"
                        >
                          Activate Program ➔
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-4 border-t border-slate-950 font-mono text-[10px] text-slate-500">
                    <div>
                      <span className="block text-slate-400 font-semibold">Faculty Agent</span>
                      <span className="truncate block mt-0.5">{prog.leadFacultyAgent}</span>
                    </div>
                    <div>
                      <span className="block text-slate-400 font-semibold">Budget Allocation</span>
                      <span className="mt-0.5 block text-slate-300">${prog.allocatedBudgetUsd.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="block text-slate-400 font-semibold">Active Scholars</span>
                      <span className="mt-0.5 block">{prog.activeResearchersCount} Agents</span>
                    </div>
                    <div>
                      <span className="block text-slate-400 font-semibold">Publications</span>
                      <span className="mt-0.5 block">{prog.publicationsCount} Papers</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Program detail sidebar */}
        <div className="p-6 rounded-xl bg-slate-900/40 border border-slate-900 shadow-2xl h-fit space-y-6">
          {activeProgramId ? (
            <>
              {(() => {
                const prog = programs.find((p) => p.id === activeProgramId);
                if (!prog) return null;
                return (
                  <div className="space-y-6">
                    <div>
                      <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider">{prog.department.replace('_', ' ')}</span>
                      <h3 className="text-base font-bold text-slate-100 mt-1">{prog.name}</h3>
                    </div>

                    {prog.primaryHypothesis && (
                      <div className="p-3.5 rounded-lg bg-indigo-950/20 border border-indigo-900/30">
                        <span className="text-[10px] font-mono text-indigo-400 font-bold block uppercase">Primary Hypothesis</span>
                        <p className="text-xs text-indigo-300 mt-1 italic">"{prog.primaryHypothesis}"</p>
                      </div>
                    )}

                    <div className="space-y-2">
                      <span className="text-xs text-slate-400 font-bold uppercase block">Target Milestones</span>
                      <ul className="space-y-2 text-xs text-slate-300">
                        {prog.targetMilestones.map((m, idx) => (
                          <li key={idx} className="flex gap-2 items-start">
                            <span className="text-indigo-400">✓</span>
                            <span>{m}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-slate-800">
                      <span className="text-xs text-slate-400 font-bold uppercase block">Sub-Projects</span>
                      {projects.length === 0 ? (
                        <div className="text-xs text-slate-500 italic">No sub-projects registered.</div>
                      ) : (
                        projects.map((proj) => (
                          <div key={proj.id} className="p-3 rounded bg-slate-950 border border-slate-900">
                            <h4 className="font-semibold text-xs text-slate-200">{proj.title}</h4>
                            <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">{proj.abstract}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })()}
            </>
          ) : (
            <div className="text-center py-12 text-slate-500 text-sm italic">Select a program to view details.</div>
          )}
        </div>
      </div>
    </div>
  );
};
