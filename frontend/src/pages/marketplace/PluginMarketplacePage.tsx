import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ecosystemApi } from '../../services/ecosystemApi';
import {
  PluginDto,
  PluginInstallDto,
} from '@codeforge/shared';

export const PluginMarketplacePage: React.FC = () => {
  const [plugins, setPlugins] = useState<PluginDto[]>([]);
  const [installs, setInstalls] = useState<PluginInstallDto[]>([]);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  useEffect(() => {
    loadPluginsData();
  }, [selectedType]);

  const loadPluginsData = async () => {
    try {
      setLoading(true);
      const [pluginsData, installsData] = await Promise.all([
        ecosystemApi.listPlugins(selectedType !== 'all' ? selectedType : undefined),
        ecosystemApi.listUserInstalls(),
      ]);
      setPlugins(pluginsData);
      setInstalls(installsData);
    } catch (err) {
      console.error('Failed to load plugins', err);
    } finally {
      setLoading(false);
    }
  };

  const isInstalled = (pluginId: string) => {
    return installs.some(i => i.pluginId === pluginId);
  };

  const getInstall = (pluginId: string) => {
    return installs.find(i => i.pluginId === pluginId);
  };

  const handleInstall = async (pluginId: string) => {
    try {
      setActionInProgress(pluginId);
      const install = await ecosystemApi.installPlugin({ pluginId });
      setInstalls(prev => [...prev, install]);
      setPlugins(prev =>
        prev.map(p => (p.id === pluginId ? { ...p, downloadCount: p.downloadCount + 1 } : p))
      );
    } catch (err) {
      console.error('Install plugin failed', err);
    } finally {
      setActionInProgress(null);
    }
  };

  const handleToggle = async (installId: string, currentEnabled: boolean) => {
    try {
      setActionInProgress(installId);
      const updated = await ecosystemApi.togglePlugin(installId, !currentEnabled);
      setInstalls(prev => prev.map(i => (i.id === installId ? updated : i)));
    } catch (err) {
      console.error('Toggle plugin failed', err);
    } finally {
      setActionInProgress(null);
    }
  };

  const handleUninstall = async (pluginId: string) => {
    try {
      setActionInProgress(pluginId);
      await ecosystemApi.uninstallPlugin(pluginId);
      setInstalls(prev => prev.filter(i => i.pluginId !== pluginId));
    } catch (err) {
      console.error('Uninstall plugin failed', err);
    } finally {
      setActionInProgress(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10">
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-3xl">🔌</span>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                Plugin Ecosystem & Sandboxed Extensions
              </h1>
            </div>
            <p className="text-slate-400 mt-1">
              Extend your autonomous agents with database profilers, CI/CD telemetry, and compliance guards.
            </p>
          </div>
          <Link
            to="/marketplace"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold rounded-lg transition-all"
          >
            ← Back to Marketplace
          </Link>
        </div>

        {/* Plugin Types Navigation */}
        <div className="flex flex-wrap gap-2 mt-6">
          {['all', 'ai_tool', 'integration', 'workflow_extension', 'enterprise_extension'].map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                selectedType === type
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {type.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="p-16 text-center text-slate-400">
            <div className="animate-spin w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full mx-auto mb-3" />
            Loading plugins registry...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {plugins.map(plugin => {
              const installed = isInstalled(plugin.id);
              const installData = getInstall(plugin.id);

              return (
                <div
                  key={plugin.id}
                  className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all"
                >
                  <div>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded text-[11px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800 uppercase">
                          {plugin.pluginType.replace('_', ' ')}
                        </span>
                        <span className="text-xs text-slate-400">v{plugin.latestVersion || '1.0.0'}</span>
                      </div>
                      <span className="flex items-center gap-1 text-amber-400 text-xs font-semibold">
                        ★ {plugin.ratingAverage.toFixed(1)}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-100 mt-2">{plugin.name}</h3>
                    <p className="text-slate-400 text-xs mt-1 leading-relaxed">{plugin.description}</p>

                    {/* Permissions Sandbox */}
                    <div className="mt-4 pt-3 border-t border-slate-800/60">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                        Required Permissions (Sandboxed)
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {plugin.requiredPermissions.map((perm, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 bg-slate-950 border border-slate-800 text-indigo-300 text-[10px] rounded font-mono"
                          >
                            {perm}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions & Status */}
                  <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between">
                    <span className="text-xs text-slate-500">📥 {plugin.downloadCount} active installs</span>

                    <div className="flex items-center gap-2">
                      {!installed ? (
                        <button
                          onClick={() => handleInstall(plugin.id)}
                          disabled={actionInProgress === plugin.id}
                          className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded-lg shadow transition-colors"
                        >
                          {actionInProgress === plugin.id ? 'Installing...' : 'Install Plugin'}
                        </button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggle(installData!.id, installData!.isEnabled)}
                            disabled={actionInProgress === installData!.id}
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                              installData?.isEnabled
                                ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800 hover:bg-emerald-900/60'
                                : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                            }`}
                          >
                            {installData?.isEnabled ? '● Active' : '○ Disabled'}
                          </button>
                          <button
                            onClick={() => handleUninstall(plugin.id)}
                            disabled={actionInProgress === plugin.id}
                            className="px-3 py-1.5 text-xs font-medium text-rose-400 hover:text-rose-300 bg-rose-950/40 border border-rose-900/60 rounded-lg hover:bg-rose-900/40 transition-colors"
                          >
                            Uninstall
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
