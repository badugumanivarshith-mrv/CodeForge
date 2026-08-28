import React, { useState, useEffect } from 'react';
import {
  EventStreamDto,
  AutomationRuleDto,
  GlobalEventType,
} from '@codeforge/shared';
import { agentCloudApi } from '../../services/agentCloudApi';

export const AutomationCenterPage: React.FC = () => {
  const [events, setEvents] = useState<EventStreamDto[]>([]);
  const [rules, setRules] = useState<AutomationRuleDto[]>([]);
  const [selectedEventType, setSelectedEventType] = useState<GlobalEventType>(GlobalEventType.USER_ACTION);
  const [ruleName, setRuleName] = useState('');
  const [conditionExp, setConditionExp] = useState('');
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [eventsList, rulesList] = await Promise.all([
        agentCloudApi.listEvents(30),
        agentCloudApi.listAutomationRules(),
      ]);

      if (rulesList.length === 0) {
        const defaultRule = await agentCloudApi.createAutomationRule({
          name: 'Auto-Trigger Career Advancement on Assessment Passed',
          description: 'Dispatches technical career workflow when an assessment is successfully completed',
          triggerEvent: GlobalEventType.ASSESSMENT_COMPLETED,
          conditionExpression: "status == 'passed'",
        });
        setRules([defaultRule]);
      } else {
        setRules(rulesList);
      }

      setEvents(eventsList);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePublishTestEvent = async () => {
    try {
      setPublishing(true);
      const newEvent = await agentCloudApi.publishEvent({
        eventType: selectedEventType,
        payload: {
          status: 'passed',
          score: 95,
          topic: 'Distributed Systems & Multi-Agent Architecture',
          timestamp: new Date().toISOString(),
        },
        source: 'Automation Center UI Simulator',
      });
      setEvents([newEvent, ...events]);
    } catch (err) {
      console.error(err);
    } finally {
      setPublishing(false);
    }
  };

  const handleCreateRule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleName) return;
    try {
      const newRule = await agentCloudApi.createAutomationRule({
        name: ruleName,
        description: `Automated rule for ${selectedEventType}`,
        triggerEvent: selectedEventType,
        conditionExpression: conditionExp || undefined,
      });
      setRules([newRule, ...rules]);
      setRuleName('');
      setConditionExp('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 p-6 lg:p-10 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-amber-400 via-orange-300 to-yellow-400 bg-clip-text text-transparent">
              Event Bus & Automation Center
            </h1>
            <p className="text-sm text-slate-400">Global event-driven automation rules, instant triggers & workflow dispatching</p>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rules & Simulator Column */}
        <div className="lg:col-span-1 space-y-6">
          {/* Create Rule */}
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Create Automation Rule</h2>
            <form onSubmit={handleCreateRule} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Rule Name</label>
                <input
                  type="text"
                  required
                  value={ruleName}
                  onChange={e => setRuleName(e.target.value)}
                  placeholder="e.g. Trigger Recruiter on Resume Update"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Trigger Global Event</label>
                <select
                  value={selectedEventType}
                  onChange={e => setSelectedEventType(e.target.value as GlobalEventType)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500"
                >
                  {Object.values(GlobalEventType).map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Condition Expression (Optional)</label>
                <input
                  type="text"
                  value={conditionExp}
                  onChange={e => setConditionExp(e.target.value)}
                  placeholder="e.g. status == 'passed'"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold transition shadow-md shadow-amber-600/30"
              >
                + Register Automation Rule
              </button>
            </form>
          </div>

          {/* Event Dispatch Simulator */}
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-2">Event Dispatch Simulator</h2>
            <p className="text-xs text-slate-400 mb-4">Emit a synthetic event into the global event bus to test rule evaluation and triggers.</p>
            <button
              onClick={handlePublishTestEvent}
              disabled={publishing}
              className="w-full py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-lg text-xs font-semibold transition flex items-center justify-center gap-2"
            >
              {publishing ? 'Publishing Event...' : '⚡ Emit Event into Bus'}
            </button>
          </div>
        </div>

        {/* Live Event Stream & Configured Rules */}
        <div className="lg:col-span-2 space-y-6">
          {/* Rules Card */}
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4 flex items-center justify-between">
              <span>Configured Rules ({rules.length})</span>
              <span className="text-xs text-amber-400 font-mono">Real-Time Reactive</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rules.map(rule => (
                <div key={rule.id} className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-white text-sm">{rule.name}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 font-mono uppercase">
                      Active
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mb-3">{rule.description}</p>
                  <div className="text-[11px] text-slate-500 space-y-1 pt-2 border-t border-slate-800/80 font-mono">
                    <div>Trigger: <strong className="text-amber-400">{rule.triggerEvent}</strong></div>
                    {rule.conditionExpression && (
                      <div>Condition: <strong className="text-indigo-400">{rule.conditionExpression}</strong></div>
                    )}
                    <div>Executions: <strong className="text-white">{rule.executionCount}</strong></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live Event Stream Feed */}
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
                Global Event Stream Feed
              </h3>
              <button
                onClick={loadData}
                className="text-xs text-slate-400 hover:text-white transition flex items-center gap-1"
              >
                🔄 Refresh Feed
              </button>
            </div>

            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
              {events.map(ev => (
                <div key={ev.id} className="p-3 bg-slate-950/80 border border-slate-800/80 rounded-xl flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300 font-mono">
                        {ev.eventType}
                      </span>
                      <span className="text-xs text-slate-500">{new Date(ev.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1.5 font-mono">
                      Source: <span className="text-slate-300">{ev.source}</span>
                    </p>
                  </div>
                  <pre className="text-[11px] text-slate-400 bg-slate-900 p-2 rounded border border-slate-800 font-mono max-w-[220px] overflow-x-auto">
                    {JSON.stringify(ev.payload)}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
