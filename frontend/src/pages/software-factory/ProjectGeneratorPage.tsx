import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { softwareFactoryApi } from '../../services/softwareFactoryApi';
import { SoftwareProjectType, BlueprintComplexity } from '@codeforge/shared';

export const ProjectGeneratorPage: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [projectType, setProjectType] = useState<SoftwareProjectType>(SoftwareProjectType.API_SERVICE);
  const [complexity, setComplexity] = useState<BlueprintComplexity>(BlueprintComplexity.MEDIUM);
  const [targetPlatform, setTargetPlatform] = useState('GCP Cloud Run');
  const [frameworks, setFrameworks] = useState<string[]>(['Express', 'TypeScript']);
  const [dependencies, setDependencies] = useState<string[]>(['pg', 'zod']);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const project = await softwareFactoryApi.provisionProject({
        name,
        description,
        projectType,
        complexity,
        targetPlatform,
        frameworks,
        dependencies,
      });

      // Run automated build cycle instantly
      await softwareFactoryApi.runBuildCycle(project.id);
      navigate('/software-factory');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-indigo-900/40 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-3xl">🚀</span>
            <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-amber-400">
              Project Blueprint Scaffolder
            </h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Specify technical stack configurations and dispatch autonomous developer agents.
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <form onSubmit={handleGenerate} className="lg:col-span-2 space-y-6 bg-slate-900/40 border border-slate-900 p-8 rounded-2xl shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase text-slate-400">Project Name</label>
              <input
                type="text"
                required
                className="w-full bg-slate-950 border border-slate-850 focus:border-indigo-500 rounded-lg p-3 text-sm text-slate-100 font-medium transition-all focus:outline-none"
                placeholder="e.g. distributed-ledger-broker"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase text-slate-400">Target Hosting Platform</label>
              <input
                type="text"
                required
                className="w-full bg-slate-950 border border-slate-850 focus:border-indigo-500 rounded-lg p-3 text-sm text-slate-100 font-medium transition-all focus:outline-none"
                value={targetPlatform}
                onChange={(e) => setTargetPlatform(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase text-slate-400">Description</label>
            <textarea
              required
              rows={3}
              className="w-full bg-slate-950 border border-slate-850 focus:border-indigo-500 rounded-lg p-3 text-sm text-slate-100 font-medium transition-all focus:outline-none"
              placeholder="e.g. Distributed API broker routing and caching ledger entries."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase text-slate-400">Project Type</label>
              <select
                className="w-full bg-slate-950 border border-slate-850 focus:border-indigo-500 rounded-lg p-3 text-sm text-slate-100 font-medium transition-all focus:outline-none"
                value={projectType}
                onChange={(e) => setProjectType(e.target.value as SoftwareProjectType)}
              >
                <option value={SoftwareProjectType.API_SERVICE}>REST API Service</option>
                <option value={SoftwareProjectType.WEB_APP}>Frontend Web App</option>
                <option value={SoftwareProjectType.CLI_TOOL}>Command Line Tool</option>
                <option value={SoftwareProjectType.MICROSERVICE}>Microservice Module</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase text-slate-400">Architecture Complexity</label>
              <select
                className="w-full bg-slate-950 border border-slate-850 focus:border-indigo-500 rounded-lg p-3 text-sm text-slate-100 font-medium transition-all focus:outline-none"
                value={complexity}
                onChange={(e) => setComplexity(e.target.value as BlueprintComplexity)}
              >
                <option value={BlueprintComplexity.SIMPLE}>Simple (Single Node)</option>
                <option value={BlueprintComplexity.MEDIUM}>Medium (Standard N-Tier)</option>
                <option value={BlueprintComplexity.COMPLEX}>Complex (Distributed)</option>
                <option value={BlueprintComplexity.ENTERPRISE}>Enterprise (Fault-Tolerant)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase text-slate-400">Frameworks / Libraries (comma-separated)</label>
              <input
                type="text"
                className="w-full bg-slate-950 border border-slate-850 focus:border-indigo-500 rounded-lg p-3 text-sm text-slate-100 font-medium transition-all focus:outline-none"
                value={frameworks.join(', ')}
                onChange={(e) => setFrameworks(e.target.value.split(',').map((x) => x.trim()))}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold uppercase text-slate-400">Core Dependencies (comma-separated)</label>
              <input
                type="text"
                className="w-full bg-slate-950 border border-slate-850 focus:border-indigo-500 rounded-lg p-3 text-sm text-slate-100 font-medium transition-all focus:outline-none"
                value={dependencies.join(', ')}
                onChange={(e) => setDependencies(e.target.value.split(',').map((x) => x.trim()))}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-amber-500 hover:opacity-90 font-bold text-white text-sm tracking-wider uppercase transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2"
          >
            {loading ? 'Executing Build Pipeline...' : '🚀 Initialize Provisioning ➔'}
          </button>
        </form>

        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-900 shadow-2xl h-fit space-y-4">
          <h2 className="text-lg font-bold text-slate-200">Provisioning Steps</h2>
          <div className="space-y-4 text-xs">
            <div className="flex gap-3">
              <div className="w-5 h-5 rounded-full bg-indigo-950 border border-indigo-500/30 text-[10px] font-mono flex items-center justify-center text-indigo-400 shrink-0">1</div>
              <div>
                <h4 className="font-semibold text-slate-300">Design Layout Blueprint</h4>
                <p className="text-slate-500 text-[11px] mt-0.5">Automated layout planning maps routing tables and configurations schemas.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-5 h-5 rounded-full bg-indigo-950 border border-indigo-500/30 text-[10px] font-mono flex items-center justify-center text-indigo-400 shrink-0">2</div>
              <div>
                <h4 className="font-semibold text-slate-300">Generate Backlog Checklist</h4>
                <p className="text-slate-500 text-[11px] mt-0.5">Scrum master creates user stories, estimates timelines, and assigns developer agents.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-5 h-5 rounded-full bg-indigo-950 border border-indigo-500/30 text-[10px] font-mono flex items-center justify-center text-indigo-400 shrink-0">3</div>
              <div>
                <h4 className="font-semibold text-slate-300">Deploy Code Artifacts</h4>
                <p className="text-slate-500 text-[11px] mt-0.5">Continuous compilation verifies modules and executes tests assertions.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
