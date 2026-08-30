import React, { useEffect, useState } from 'react';
import { researchUniversityApi } from '../../services/researchUniversityApi';
import { CollaboratorDto, ResearchProgramDto, AcademicDepartment } from '@codeforge/shared';

export const GlobalCollaborationPage: React.FC = () => {
  const [collaborators, setCollaborators] = useState<CollaboratorDto[]>([]);
  const [programs, setPrograms] = useState<ResearchProgramDto[]>([]);

  // New collaborator invite state
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [institution, setInstitution] = useState('');
  const [leadInvestigator, setLeadInvestigator] = useState('');
  const [dept, setDept] = useState<AcademicDepartment>(AcademicDepartment.ARTIFICIAL_INTELLIGENCE);

  useEffect(() => {
    loadCollaborators();
    loadPrograms();
  }, []);

  async function loadCollaborators() {
    try {
      const data = await researchUniversityApi.listCollaborators();
      setCollaborators(data);
    } catch (err) {
      console.error(err);
    }
  }

  async function loadPrograms() {
    try {
      const data = await researchUniversityApi.listPrograms();
      setPrograms(data);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleInviteCollaborator(e: React.FormEvent) {
    e.preventDefault();
    if (!institution || !leadInvestigator) return;
    try {
      await researchUniversityApi.registerCollaborator({
        institutionName: institution,
        country: 'Global Network',
        leadInvestigator: leadInvestigator,
        primaryDepartment: dept,
        reputationScore: 95.0,
      });
      setInstitution('');
      setLeadInvestigator('');
      setShowInviteForm(false);
      loadCollaborators();
    } catch (err) {
      console.error(err);
    }
  }

  async function handleLinkProject(collabId: string, progId: string) {
    try {
      await researchUniversityApi.linkCollaboratorProject(collabId, progId);
      loadCollaborators();
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
            Global Collaboration Network
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Coordinate with international research centers, allocate joint resources, and link projects across academic institutions.
          </p>
        </div>
        <button
          onClick={() => setShowInviteForm(!showInviteForm)}
          className="px-4 py-2 rounded-lg bg-indigo-900/60 hover:bg-indigo-900 border border-indigo-500/30 text-indigo-200 text-sm font-semibold transition-all"
        >
          {showInviteForm ? 'Close Invite Panel' : '+ Invite Peer Institution'}
        </button>
      </div>

      {/* Invite form */}
      {showInviteForm && (
        <form onSubmit={handleInviteCollaborator} className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4 max-w-2xl">
          <h3 className="font-bold text-slate-200">Invite Peer Academic Institution</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-slate-400 font-semibold uppercase">Institution Name</label>
              <input
                type="text"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                placeholder="e.g., CERN Scientific Network"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-100 focus:border-indigo-500 outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-400 font-semibold uppercase">Lead Investigator Agent</label>
              <input
                type="text"
                value={leadInvestigator}
                onChange={(e) => setLeadInvestigator(e.target.value)}
                placeholder="e.g., Dr. Werner Heisenberg Agent"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-100 focus:border-indigo-500 outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-400 font-semibold uppercase">Collaborative Department Focus</label>
            <select
              value={dept}
              onChange={(e) => setDept(e.target.value as AcademicDepartment)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-100 focus:border-indigo-500 outline-none"
            >
              {Object.values(AcademicDepartment).map((d) => (
                <option key={d} value={d}>
                  {d.replace('_', ' ').toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 font-semibold text-white transition-all text-sm"
          >
            Dispatch Invitation
          </button>
        </form>
      )}

      {/* Collaborators list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collaborators.map((collab) => (
          <div key={collab.id} className="p-6 rounded-xl bg-slate-900/60 border border-slate-850 hover:border-indigo-500/20 transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-start gap-4">
                <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider">{collab.primaryDepartment.replace('_', ' ')}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-400 border border-indigo-500/20">
                  Reputation: {collab.reputationScore}%
                </span>
              </div>
              <h3 className="font-bold text-sm text-slate-100">{collab.institutionName}</h3>
              <p className="text-xs text-slate-400">Lead Investigator: <span className="font-semibold">{collab.leadInvestigator}</span></p>
            </div>

            {/* Linked Programs indicator */}
            <div className="space-y-2 pt-2 border-t border-slate-950 text-[10px] font-mono text-slate-500">
              <span className="font-bold text-slate-400 block uppercase">Linked Initiatives</span>
              {!collab.activeSharedProjects || collab.activeSharedProjects.length === 0 ? (
                <span className="italic block">No linked initiatives. Link below to start.</span>
              ) : (
                <div className="space-y-1">
                  {collab.activeSharedProjects.map((pid: string) => {
                    const prog = programs.find((p) => p.id === pid);
                    return (
                      <span key={pid} className="block p-1 rounded bg-slate-950 text-slate-400 border border-slate-900 truncate">
                        {prog ? prog.name : pid}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Link trigger */}
            {programs.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-950">
                <label className="text-[9px] text-slate-400 font-bold block uppercase">Select Program to Link</label>
                <div className="flex gap-1.5">
                  <select
                    id={`link-prog-select-${collab.id}`}
                    className="bg-slate-950 border border-slate-800 rounded p-1.5 text-[10px] text-slate-300 outline-none w-full"
                  >
                    {programs.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name.slice(0, 25)}...
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => {
                      const sel = document.getElementById(`link-prog-select-${collab.id}`) as HTMLSelectElement;
                      if (sel) handleLinkProject(collab.id, sel.value);
                    }}
                    className="px-3 py-1.5 rounded bg-indigo-600 hover:bg-indigo-500 font-bold text-[9px] text-white transition-all shrink-0"
                  >
                    Link
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
