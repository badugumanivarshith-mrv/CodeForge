import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ecosystemApi } from '../../services/ecosystemApi';
import {
  ApiKeyDto,
  WebhookDto,
  WebhookEvent,
} from '@codeforge/shared';

export const DeveloperPortalPage: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<ApiKeyDto[]>([]);
  const [webhooks, setWebhooks] = useState<WebhookDto[]>([]);
  const [sdkDocs, setSdkDocs] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'keys' | 'webhooks' | 'sdk'>('keys');

  // Key creation modal state
  const [showKeyModal, setShowKeyModal] = useState<boolean>(false);
  const [newKeyName, setNewKeyName] = useState<string>('');
  const [generatedKey, setGeneratedKey] = useState<ApiKeyDto | null>(null);

  // Webhook creation state
  const [showWebhookModal, setShowWebhookModal] = useState<boolean>(false);
  const [webhookUrl, setWebhookUrl] = useState<string>('');
  const [subscribedEvents, setSubscribedEvents] = useState<WebhookEvent[]>([
    WebhookEvent.AGENT_EXECUTED,
    WebhookEvent.TASK_COMPLETED,
  ]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [keysData, webhooksData, docsData] = await Promise.all([
        ecosystemApi.listApiKeys(),
        ecosystemApi.listWebhooks(),
        ecosystemApi.getSdkDocs(),
      ]);
      setApiKeys(keysData);
      setWebhooks(webhooksData);
      setSdkDocs(docsData);
    } catch (err) {
      console.error('Failed to load developer data', err);
    }
  };

  const handleGenerateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;
    try {
      const key = await ecosystemApi.generateApiKey({
        name: newKeyName,
        permissions: ['agents:*', 'workflows:*', 'research:*'],
        expiresInDays: 90,
      });
      setGeneratedKey(key);
      setApiKeys(prev => [key, ...prev]);
      setNewKeyName('');
    } catch (err) {
      console.error('Generate key failed', err);
    }
  };

  const handleRevokeKey = async (id: string) => {
    try {
      await ecosystemApi.revokeApiKey(id);
      setApiKeys(prev => prev.filter(k => k.id !== id));
    } catch (err) {
      console.error('Revoke key failed', err);
    }
  };

  const handleRegisterWebhook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!webhookUrl.trim()) return;
    try {
      const webhook = await ecosystemApi.registerWebhook({
        targetUrl: webhookUrl,
        subscribedEvents,
      });
      setWebhooks(prev => [webhook, ...prev]);
      setShowWebhookModal(false);
      setWebhookUrl('');
    } catch (err) {
      console.error('Register webhook failed', err);
    }
  };

  const handleDeleteWebhook = async (id: string) => {
    try {
      await ecosystemApi.deleteWebhook(id);
      setWebhooks(prev => prev.filter(w => w.id !== id));
    } catch (err) {
      console.error('Delete webhook failed', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10">
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-3xl">💻</span>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                Developer API Platform & Webhooks
              </h1>
            </div>
            <p className="text-slate-400 mt-1">
              Programmatically trigger autonomous agents, subscribe to real-time execution webhooks, and integrate SDKs.
            </p>
          </div>
          <Link
            to="/marketplace"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold rounded-lg transition-all"
          >
            ← Back to Marketplace
          </Link>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => setActiveTab('keys')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'keys'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            🔑 API Keys ({apiKeys.length})
          </button>
          <button
            onClick={() => setActiveTab('webhooks')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'webhooks'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            🔔 Webhooks ({webhooks.length})
          </button>
          <button
            onClick={() => setActiveTab('sdk')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'sdk'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            📚 SDK Documentation
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Tab 1: API Keys */}
        {activeTab === 'keys' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-bold text-slate-200">Active API Keys</h2>
              <button
                onClick={() => {
                  setShowKeyModal(true);
                  setGeneratedKey(null);
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow transition-colors"
              >
                + Create New API Key
              </button>
            </div>

            {/* Generated Key Alert Modal */}
            {generatedKey && (
              <div className="p-4 bg-emerald-950/80 border border-emerald-800 rounded-2xl space-y-2 animate-fade-in">
                <span className="text-xs font-bold text-emerald-300 block">
                  ✓ API Key Created Successfully (Copy it now, it will not be displayed again):
                </span>
                <div className="p-3 bg-slate-950 rounded-xl font-mono text-xs text-emerald-400 select-all border border-emerald-900/60">
                  {generatedKey.rawKey}
                </div>
              </div>
            )}

            {/* Modal */}
            {showKeyModal && (
              <form onSubmit={handleGenerateKey} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
                <h3 className="text-sm font-bold text-slate-100">Generate Secret API Token</h3>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Key Name / Environment</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Production CI/CD Runner"
                    value={newKeyName}
                    onChange={e => setNewKeyName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-200 outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowKeyModal(false)}
                    className="px-4 py-2 bg-slate-800 text-slate-300 text-xs rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl"
                  >
                    Generate Key
                  </button>
                </div>
              </form>
            )}

            {/* Table */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="p-4">Key Name</th>
                    <th className="p-4">Key Prefix</th>
                    <th className="p-4">Permissions</th>
                    <th className="p-4">Requests</th>
                    <th className="p-4">Created</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {apiKeys.map(k => (
                    <tr key={k.id} className="hover:bg-slate-800/30">
                      <td className="p-4 font-semibold text-slate-200">{k.name}</td>
                      <td className="p-4 font-mono text-indigo-300">{k.keyPrefix}...</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 bg-slate-950 border border-slate-800 rounded font-mono text-[11px]">
                          {k.permissions.join(', ')}
                        </span>
                      </td>
                      <td className="p-4 font-mono">{k.usageCount}</td>
                      <td className="p-4 text-slate-400">{new Date(k.createdAt).toLocaleDateString()}</td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleRevokeKey(k.id)}
                          className="px-3 py-1 bg-rose-950/40 text-rose-400 border border-rose-900/60 hover:bg-rose-900/60 text-xs rounded-lg transition-colors"
                        >
                          Revoke
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Webhooks */}
        {activeTab === 'webhooks' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-bold text-slate-200">Registered Webhook Endpoints</h2>
              <button
                onClick={() => setShowWebhookModal(true)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow transition-colors"
              >
                + Register Webhook
              </button>
            </div>

            {showWebhookModal && (
              <form onSubmit={handleRegisterWebhook} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
                <h3 className="text-sm font-bold text-slate-100">Register New Event Webhook</h3>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Target Endpoint URL (HTTPS)</label>
                  <input
                    type="url"
                    required
                    placeholder="https://api.yourdomain.com/webhooks/codeforge"
                    value={webhookUrl}
                    onChange={e => setWebhookUrl(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-200 outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Subscribed Events</label>
                  <div className="flex flex-wrap gap-2">
                    {Object.values(WebhookEvent).map(ev => {
                      const selected = subscribedEvents.includes(ev);
                      return (
                        <button
                          type="button"
                          key={ev}
                          onClick={() => {
                            if (selected) {
                              setSubscribedEvents(subscribedEvents.filter(e => e !== ev));
                            } else {
                              setSubscribedEvents([...subscribedEvents, ev]);
                            }
                          }}
                          className={`px-2.5 py-1 rounded text-[11px] font-mono border transition-all ${
                            selected
                              ? 'bg-indigo-950 text-indigo-300 border-indigo-800'
                              : 'bg-slate-950 text-slate-500 border-slate-800'
                          }`}
                        >
                          {selected ? '✓ ' : ''}{ev}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowWebhookModal(false)}
                    className="px-4 py-2 bg-slate-800 text-slate-300 text-xs rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl"
                  >
                    Save Webhook
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {webhooks.map(w => (
                <div key={w.id} className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800/80 rounded text-[10px] font-mono">
                      ACTIVE
                    </span>
                    <button
                      onClick={() => handleDeleteWebhook(w.id)}
                      className="text-xs text-slate-500 hover:text-rose-400"
                    >
                      Delete
                    </button>
                  </div>
                  <p className="font-mono text-xs text-indigo-300 truncate">{w.targetUrl}</p>
                  <div className="flex flex-wrap gap-1">
                    {w.subscribedEvents.map((ev, i) => (
                      <span key={i} className="px-2 py-0.5 bg-slate-950 text-slate-400 text-[10px] rounded font-mono">
                        {ev}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: SDK Documentation */}
        {activeTab === 'sdk' && (
          <div className="space-y-6">
            <h2 className="text-base font-bold text-slate-200">Official CodeForge SDK Libraries</h2>
            <div className="space-y-6">
              {sdkDocs.map((sdk, idx) => (
                <div key={idx} className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-slate-100 text-sm">{sdk.language}</h3>
                    <span className="px-2 py-0.5 bg-slate-800 text-slate-300 text-xs rounded font-mono">
                      {sdk.packageManager}
                    </span>
                  </div>
                  <pre className="p-4 bg-slate-950 rounded-xl font-mono text-xs text-emerald-400 overflow-x-auto leading-relaxed border border-slate-800">
                    {sdk.codeExample}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
