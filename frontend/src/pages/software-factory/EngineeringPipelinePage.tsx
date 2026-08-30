import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { softwareFactoryApi } from '../../services/softwareFactoryApi';
import { SoftwareFactoryOverviewDto, EngineeringTaskStatus } from '@codeforge/shared';

export const EngineeringPipelinePage: React.FC = () => {
  const [overview, setOverview] = useState<SoftwareFactoryOverviewDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await softwareFactoryApi.getOverview();
        setOverview(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Loading Engineering Pipeline...</div>;
  }

  const tasks = overview?.recentTasks || [];

  const columns: { label: string; status: EngineeringTaskStatus; bg: string; border: string }[] = [
    { label: 'Backlog / Requirements', status: EngineeringTaskStatus.BACKLOG, bg: 'bg-slate-900/40', border: 'border-slate-850' },
    { label: 'In Progress Coding', status: EngineeringTaskStatus.IN_PROGRESS, bg: 'bg-indigo-950/10', border: 'border-indigo-900/30' },
    { label: 'Code Review & QA', status: EngineeringTaskStatus.REVIEW, bg: 'bg-purple-950/10', border: 'border-purple-900/30' },
    { label: 'Completed & Deployed', status: EngineeringTaskStatus.COMPLETED, bg: 'bg-emerald-950/10', border: 'border-emerald-900/30' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-indigo-900/40 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-3xl">📈</span>
            <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-amber-400">
              Scrum Engineering Pipeline
            </h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Track developer agent backlogs, sprint hours, and code validation reviews in real-time.
          </p>
        </div>
      </div>

      {/* Navigation Quick Links */}
      <div className="flex flex-wrap gap-2 pt-1">
        {[
          { label: 'Factory Dashboard', path: '/software-factory', icon: '⚙️' },
          { label: 'Project Generator', path: '/software-factory/generate', icon: '🚀' },
          { label: 'Architecture Studio', path: '/software-factory/architecture', icon: '📐' },
          { label: 'Engineering Pipeline', path: '/software-factory/pipeline', icon: '📈' },
        ].map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="px-3.5 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/80 text-xs font-semibold text-slate-300 transition-all flex items-center gap-1.5 shadow-md"
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {columns.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.status);
          return (
            <div key={col.status} className={`p-4 rounded-xl border ${col.border} ${col.bg} min-h-[500px] flex flex-col space-y-4`}>
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <h3 className="text-xs font-black uppercase text-slate-300 tracking-wider">{col.label}</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-950 border border-slate-800 text-slate-400">
                  {colTasks.length}
                </span>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto">
                {colTasks.map((t) => (
                  <div key={t.id} className="p-4 rounded-lg bg-slate-950 border border-slate-900 hover:border-indigo-500/20 transition-all space-y-3">
                    <div>
                      <span className="text-[8px] font-mono text-indigo-400 uppercase tracking-wider">{t.taskType}</span>
                      <h4 className="text-xs font-bold text-slate-100 mt-1 leading-normal">{t.title}</h4>
                      <p className="text-slate-500 text-[10px] mt-1 line-clamp-2">{t.description}</p>
                    </div>

                    <div className="border-t border-slate-900/60 pt-2 flex justify-between items-center text-[9px] font-mono text-slate-500">
                      <span>👤 {t.assignedAgent.replace(' Agent', '')}</span>
                      <span>⏱️ {t.estimatedHours}h</span>
                    </div>
                  </div>
                ))}

                {colTasks.length === 0 && (
                  <div className="h-40 flex items-center justify-center text-[10px] text-slate-650 border border-dashed border-slate-900 rounded-lg">
                    No active tasks
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
