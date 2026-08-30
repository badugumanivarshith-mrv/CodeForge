import React, { useEffect, useState } from 'react';
import { researchUniversityApi } from '../../services/researchUniversityApi';
import { PublicationDto, ResearchProgramDto, AcademicDepartment, PublicationType, PublicationStatus } from '@codeforge/shared';

export const PublicationsEnginePage: React.FC = () => {
  const [pubs, setPubs] = useState<PublicationDto[]>([]);
  const [programs, setPrograms] = useState<ResearchProgramDto[]>([]);
  const [activePubId, setActivePubId] = useState<string | null>(null);

  // New publication draft form state
  const [title, setTitle] = useState('');
  const [abstract, setAbstract] = useState('');
  const [programId, setProgramId] = useState('');
  const [dept, setDept] = useState<AcademicDepartment>(AcademicDepartment.ARTIFICIAL_INTELLIGENCE);
  const [pubType, setPubType] = useState<PublicationType>(PublicationType.RESEARCH_PAPER);
  const [showDraftForm, setShowDraftForm] = useState(false);

  useEffect(() => {
    loadPublications();
    loadPrograms();
  }, []);

  async function loadPublications() {
    try {
      const data = await researchUniversityApi.listPublications();
      setPubs(data);
      if (data.length > 0 && !activePubId) {
        setActivePubId(data[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function loadPrograms() {
    try {
      const data = await researchUniversityApi.listPrograms();
      setPrograms(data);
      if (data.length > 0) setProgramId(data[0].id);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDraftPublication(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !abstract || !programId) return;
    try {
      await researchUniversityApi.draftPublication({
        programId,
        title,
        abstract,
        department: dept,
        publicationType: pubType,
      });
      setTitle('');
      setAbstract('');
      setShowDraftForm(false);
      loadPublications();
    } catch (err) {
      console.error(err);
    }
  }

  async function handlePublishPaper(id: string) {
    try {
      await researchUniversityApi.publishPaper(id);
      loadPublications();
    } catch (err) {
      console.error(err);
    }
  }

  const activePub = pubs.find((p) => p.id === activePubId);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      {/* Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-indigo-900/40 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-amber-400">
            Publications Engine & Citation Index
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Browse published articles, compile peer-review pre-prints, and trace citation velocity across academic networks.
          </p>
        </div>
        <button
          onClick={() => setShowDraftForm(!showDraftForm)}
          className="px-4 py-2 rounded-lg bg-indigo-900/60 hover:bg-indigo-900 border border-indigo-500/30 text-indigo-200 text-sm font-semibold transition-all"
        >
          {showDraftForm ? 'Close Draft Workspace' : '+ Draft New Publication'}
        </button>
      </div>

      {/* Draft Form Workspace */}
      {showDraftForm && (
        <form onSubmit={handleDraftPublication} className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4 max-w-2xl">
          <h3 className="font-bold text-slate-200">Autonomous Publication Drafting Workspace</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-slate-400 font-semibold uppercase">Publication Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Hamiltonian Multi-Agent Lattice Invariance"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-100 focus:border-indigo-500 outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-400 font-semibold uppercase">Parent Program</label>
              <select
                value={programId}
                onChange={(e) => setProgramId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-100 focus:border-indigo-500 outline-none"
              >
                {programs.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name.slice(0, 35)}...
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-slate-400 font-semibold uppercase">Academic Discipline</label>
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
            <div className="space-y-1">
              <label className="text-xs text-slate-400 font-semibold uppercase">Publication Type</label>
              <select
                value={pubType}
                onChange={(e) => setPubType(e.target.value as PublicationType)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-100 focus:border-indigo-500 outline-none"
              >
                {Object.values(PublicationType).map((t) => (
                  <option key={t} value={t}>
                    {t.replace('_', ' ').toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-400 font-semibold uppercase">Abstract Summary</label>
            <textarea
              value={abstract}
              onChange={(e) => setAbstract(e.target.value)}
              rows={4}
              placeholder="Provide mathematical context or empirical claims..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-100 focus:border-indigo-500 outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 font-semibold text-white transition-all text-sm"
          >
            Compile & Draft Paper
          </button>
        </form>
      )}

      {/* Catalog & Markdown Reader */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left list: Publication list */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-200">Publications Catalog</h2>
          <div className="space-y-3">
            {pubs.map((pub) => (
              <div
                key={pub.id}
                onClick={() => setActivePubId(pub.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  activePubId === pub.id
                    ? 'bg-slate-900 border-indigo-500/50'
                    : 'bg-slate-900/40 border-slate-950 hover:border-slate-800'
                }`}
              >
                <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider">
                  {pub.department.replace('_', ' ')}
                </span>
                <h3 className="font-bold text-sm text-slate-100 mt-1 line-clamp-1">{pub.title}</h3>
                <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono mt-3">
                  <span>Citations: {pub.citationCount}</span>
                  <span className={`uppercase font-bold ${
                    pub.status === PublicationStatus.PUBLISHED ? 'text-emerald-400' : 'text-slate-500'
                  }`}>
                    {pub.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center/Right: Markdown reader workspace */}
        <div className="lg:col-span-2 p-6 rounded-xl bg-slate-900/40 border border-slate-900 shadow-2xl space-y-6">
          {activePub ? (
            <div className="space-y-6">
              {/* Paper metadata */}
              <div className="border-b border-slate-800 pb-4 space-y-2">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider">{activePub.department.replace('_', ' ')}</span>
                    <h2 className="text-xl font-black text-slate-100 mt-1">{activePub.title}</h2>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950/60 border border-indigo-500/30 text-indigo-300">
                      DOI: {activePub.doi}
                    </span>
                    {activePub.status === PublicationStatus.ACCEPTED && (
                      <button
                        onClick={() => handlePublishPaper(activePub.id)}
                        className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold transition-all shadow-md shadow-emerald-950/20"
                      >
                        Publish Paper ➔
                      </button>
                    )}
                  </div>
                </div>

                <div className="text-xs text-slate-400">
                  <span className="font-semibold text-slate-300">Authors:</span> {activePub.authors.join(', ')}
                </div>
              </div>

              {/* Abstract */}
              <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-850">
                <span className="text-[10px] font-mono text-indigo-400 block uppercase font-bold tracking-wider">Abstract</span>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{activePub.abstract}</p>
              </div>

              {/* Manuscript Preview */}
              <div className="space-y-2">
                <span className="text-xs text-slate-500 font-bold block uppercase tracking-wider">Manuscript Markdown Preview</span>
                <div className="p-5 rounded-lg bg-slate-950 border border-slate-900 font-mono text-xs text-slate-300 h-72 overflow-y-auto whitespace-pre-wrap leading-relaxed shadow-inner">
                  {activePub.fullMarkdownContent}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-24 text-slate-500">No active publication selected.</div>
          )}
        </div>
      </div>
    </div>
  );
};
