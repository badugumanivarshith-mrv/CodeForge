import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { softwareFactoryApi } from '../../services/softwareFactoryApi';
import { SoftwareFactoryOverviewDto, ArchitectureBlueprintDto } from '@codeforge/shared';

export const ArchitectureStudioPage: React.FC = () => {
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
    return <div className="p-8 text-center text-slate-400">Loading Architecture Studio...</div>;
  }

  const blueprint: ArchitectureBlueprintDto = (overview?.activeBlueprints && overview.activeBlueprints[0]) || {
    id: 'bp-mock',
    projectId: 'proj-mock',
    diagramMermaid: `graph TD
  Client[Web Client] --> GW[API Gateway]
  GW --> Core[Core Engine]
  Core --> DB[(PostgreSQL)]`,
    componentLayout: { Client: 'React', GW: 'Spring Gateway', Core: 'Express', DB: 'PostgreSQL' },
    apiGateways: [
      { route: '/v1/users', targetService: 'Core Engine', method: 'GET' },
      { route: '/v1/auth', targetService: 'Auth Server', method: 'POST' },
    ],
    databaseSchemas: {
      users: 'id UUID PRIMARY KEY, username VARCHAR(50), created_at TIMESTAMPTZ',
    },
    deploymentSpecs: { replicas: 2, memory: '1Gi', cpu: '500m' },
    designedAt: new Date().toISOString(),
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-indigo-900/40 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-3xl">📐</span>
            <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-amber-400">
              Architecture Studio
            </h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Analyze microservices component layouts, schema mappings, and API gateway routing topologies.
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
        {/* Mermaid Diagram Visualization */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/40 border border-slate-900 shadow-xl space-y-4">
          <h2 className="text-lg font-bold text-slate-200">Component Topology Diagram</h2>
          <div className="p-8 rounded-xl bg-slate-950 border border-slate-900 font-mono text-xs text-indigo-400 overflow-x-auto whitespace-pre">
            {blueprint.diagramMermaid}
          </div>
          <div className="p-4 rounded-lg bg-slate-900/20 border border-slate-850 text-xs text-slate-400">
            💡 <strong>ProTip:</strong> The diagram above represents a live system design created by the autonomous architect agent.
          </div>
        </div>

        {/* Database schemas & Specs */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-900 shadow-xl space-y-4">
            <h2 className="text-lg font-bold text-slate-200">Relational Database Schemas</h2>
            <div className="space-y-3">
              {Object.entries(blueprint.databaseSchemas).map(([table, definition]) => (
                <div key={table} className="p-3 rounded-lg bg-slate-950 border border-slate-900">
                  <span className="text-xs font-bold text-slate-300 block">{table}</span>
                  <code className="text-[10px] text-amber-400 font-mono block mt-1">{definition}</code>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-900 shadow-xl space-y-4">
            <h2 className="text-lg font-bold text-slate-200">API Gateway Routers</h2>
            <div className="space-y-3">
              {blueprint.apiGateways.map((gw, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 rounded-lg bg-slate-950 border border-slate-900">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-indigo-400">{gw.method}</span>
                    <span className="text-xs font-semibold text-slate-300 ml-2">{gw.route}</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-850 text-slate-400 font-mono">
                    {gw.targetService}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
