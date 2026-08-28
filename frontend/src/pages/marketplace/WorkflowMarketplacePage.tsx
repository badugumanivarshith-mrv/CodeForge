import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ecosystemApi } from '../../services/ecosystemApi';
import {
  WorkflowTemplateDto,
  WorkflowCategory,
} from '@codeforge/shared';

export const WorkflowMarketplacePage: React.FC = () => {
  const [templates, setTemplates] = useState<WorkflowTemplateDto[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [cloningId, setCloningId] = useState<string | null>(null);
  const [clonedSuccess, setClonedSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadTemplates();
  }, [selectedCategory]);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const data = await ecosystemApi.listWorkflowTemplates(
        selectedCategory !== 'all' ? selectedCategory : undefined
      );
      setTemplates(data);
    } catch (err) {
      console.error('Failed to load workflow templates', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClone = async (templateId: string, title: string) => {
    try {
      setCloningId(templateId);
      await ecosystemApi.cloneWorkflowTemplate(templateId);
      setClonedSuccess(title);
      setTimeout(() => setClonedSuccess(null), 5000);
    } catch (err) {
      console.error('Clone failed', err);
    } finally {
      setCloningId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10">
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-3xl">🔄</span>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                Workflow Templates & Community Pipelines
              </h1>
            </div>
            <p className="text-slate-400 mt-1">
              Import production-tested multi-agent pipelines with automated step triggers, dependencies, and agent roles.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/ai-workspace/workflows"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded-lg shadow transition-all"
            >
              My Active Workflows →
            </Link>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mt-6">
          {['all', ...Object.values(WorkflowCategory)].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                selectedCategory === cat
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Success Alert */}
        {clonedSuccess && (
          <div className="p-4 bg-purple-950/70 border border-purple-800 rounded-2xl flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-3">
              <span className="text-xl">🚀</span>
              <div>
                <span className="text-xs font-bold text-purple-300 block">Workflow Cloned to Your Workspace!</span>
                <p className="text-xs text-slate-300">"{clonedSuccess}" is now live in your Automated Workflows engine.</p>
              </div>
            </div>
            <Link
              to="/ai-workspace/workflows"
              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-lg"
            >
              View in Workspace
            </Link>
          </div>
        )}

        {loading ? (
          <div className="p-16 text-center text-slate-400">
            <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-3" />
            Loading workflow templates...
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {templates.map(tmpl => (
              <div
                key={tmpl.id}
                className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl flex flex-col justify-between space-y-6 hover:border-slate-700 transition-all"
              >
                <div>
                  <div className="flex justify-between items-start">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-purple-950 text-purple-300 border border-purple-800 uppercase">
                      {tmpl.category.replace('_', ' ')}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-800 text-slate-400">
                      Trigger: {tmpl.triggerType}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-100 mt-3">{tmpl.title}</h3>
                  <p className="text-slate-400 text-xs mt-1 leading-relaxed">{tmpl.description}</p>

                  {/* Step Pipeline Visualization */}
                  <div className="mt-5 space-y-2">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Execution Steps Pipeline ({tmpl.steps.length} Steps)
                    </span>
                    <div className="space-y-2">
                      {tmpl.steps.map((step, idx) => (
                        <div
                          key={step.stepId}
                          className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center justify-between text-xs"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-5 h-5 rounded-full bg-purple-900/80 text-purple-300 font-mono text-[11px] flex items-center justify-center font-bold">
                              {idx + 1}
                            </span>
                            <div>
                              <span className="font-semibold text-slate-200 block">{step.action}</span>
                              <span className="text-[10px] text-slate-500 font-mono">
                                Assigned: {step.agentType}
                              </span>
                            </div>
                          </div>
                          {step.dependencies.length > 0 && (
                            <span className="text-[10px] text-slate-500">
                              Depends on Step {step.dependencies.join(', ')}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer and Clone Action */}
                <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="text-amber-400 font-semibold">★ {tmpl.ratingAverage.toFixed(1)}</span>
                    <span>📥 {tmpl.downloadCount} clones</span>
                  </div>

                  <button
                    onClick={() => handleClone(tmpl.id, tmpl.title)}
                    disabled={cloningId === tmpl.id}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium text-xs rounded-xl shadow-lg transition-all"
                  >
                    {cloningId === tmpl.id ? 'Cloning to Workspace...' : '⤓ Clone to My Workspace'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
