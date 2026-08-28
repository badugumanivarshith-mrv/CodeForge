import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ecosystemApi } from '../../services/ecosystemApi';
import {
  IntegrationDto,
  IntegrationProvider,
  IntegrationStatus,
} from '@codeforge/shared';

export const IntegrationHubPage: React.FC = () => {
  const [connected, setConnected] = useState<IntegrationDto[]>([]);
  const [catalog, setCatalog] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [syncingProvider, setSyncingProvider] = useState<string | null>(null);
  const [syncMessage, setSyncMessage] = useState<{ provider: string; text: string } | null>(null);

  useEffect(() => {
    loadIntegrations();
  }, []);

  const loadIntegrations = async () => {
    try {
      setLoading(true);
      const data = await ecosystemApi.listIntegrations();
      setConnected(data.connected);
      setCatalog(data.catalog);
    } catch (err) {
      console.error('Failed to load integrations', err);
    } finally {
      setLoading(false);
    }
  };

  const isConnected = (provider: IntegrationProvider) => {
    return connected.some(c => c.provider === provider && c.status === IntegrationStatus.CONNECTED);
  };

  const getIntegration = (provider: IntegrationProvider) => {
    return connected.find(c => c.provider === provider);
  };

  const handleConnect = async (provider: IntegrationProvider) => {
    try {
      const integration = await ecosystemApi.connectIntegration({
        provider,
        config: { autoSyncIntervalMinutes: 30, authDate: new Date().toISOString() },
      });
      setConnected(prev => [...prev.filter(c => c.provider !== provider), integration]);
    } catch (err) {
      console.error('Connect failed', err);
    }
  };

  const handleSync = async (provider: IntegrationProvider) => {
    try {
      setSyncingProvider(provider);
      const res = await ecosystemApi.syncIntegration(provider);
      setSyncMessage({ provider, text: res.details });
      const item = getIntegration(provider);
      if (item) {
        setConnected(prev =>
          prev.map(c => (c.provider === provider ? { ...c, lastSyncedAt: res.syncedAt } : c))
        );
      }
    } catch (err) {
      console.error('Sync failed', err);
    } finally {
      setSyncingProvider(null);
    }
  };

  const handleDisconnect = async (provider: IntegrationProvider) => {
    try {
      await ecosystemApi.disconnectIntegration(provider);
      setConnected(prev => prev.filter(c => c.provider !== provider));
      if (syncMessage?.provider === provider) setSyncMessage(null);
    } catch (err) {
      console.error('Disconnect failed', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10">
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-3xl">⚡</span>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                External Integrations Hub
              </h1>
            </div>
            <p className="text-slate-400 mt-1">
              Connect external developer tools, project trackers, and communications into your multi-agent workflows.
            </p>
          </div>
          <Link
            to="/marketplace"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold rounded-lg transition-all"
          >
            ← Back to Marketplace
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Sync Toast if any */}
        {syncMessage && (
          <div className="p-4 bg-emerald-950/60 border border-emerald-800/80 rounded-2xl flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-3">
              <span className="text-xl">✓</span>
              <div>
                <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">
                  {syncMessage.provider} Synced Successfully
                </span>
                <p className="text-xs text-slate-200 mt-0.5">{syncMessage.text}</p>
              </div>
            </div>
            <button
              onClick={() => setSyncMessage(null)}
              className="text-xs text-slate-400 hover:text-slate-200"
            >
              ✕
            </button>
          </div>
        )}

        {loading ? (
          <div className="p-16 text-center text-slate-400">
            <div className="animate-spin w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full mx-auto mb-3" />
            Loading integration providers...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {catalog.map((item: any) => {
              const connectedState = isConnected(item.provider);
              const integrationInfo = getIntegration(item.provider);

              return (
                <div
                  key={item.provider}
                  className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all"
                >
                  <div>
                    <div className="flex justify-between items-start">
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 uppercase">
                        {item.category}
                      </span>
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          connectedState
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/80'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {connectedState ? '● Connected' : 'Disconnected'}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-100 mt-3">{item.name}</h3>
                    <p className="text-slate-400 text-xs mt-1 leading-relaxed">{item.description}</p>
                  </div>

                  {/* Actions & Last Synced */}
                  <div className="pt-4 border-t border-slate-800/60 space-y-3">
                    {connectedState && integrationInfo?.lastSyncedAt && (
                      <span className="text-[11px] text-slate-500 block">
                        Last synced: {new Date(integrationInfo.lastSyncedAt).toLocaleTimeString()}
                      </span>
                    )}

                    <div className="flex items-center justify-between">
                      {!connectedState ? (
                        <button
                          onClick={() => handleConnect(item.provider)}
                          className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded-xl shadow transition-colors"
                        >
                          Connect {item.name}
                        </button>
                      ) : (
                        <div className="flex items-center gap-2 w-full">
                          <button
                            onClick={() => handleSync(item.provider)}
                            disabled={syncingProvider === item.provider}
                            className="flex-1 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold rounded-lg transition-colors"
                          >
                            {syncingProvider === item.provider ? 'Syncing...' : '↻ Sync Now'}
                          </button>
                          <button
                            onClick={() => handleDisconnect(item.provider)}
                            className="px-3 py-1.5 text-xs text-rose-400 hover:text-rose-300 bg-rose-950/30 border border-rose-900/60 rounded-lg transition-colors"
                          >
                            Disconnect
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
