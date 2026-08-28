import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  agenticWorkspaceApi,
} from '../../services/agenticWorkspaceApi';
import {
  AgentDto,
  AgentTaskDto,
  CommandCenterOverviewDto,
  AgentType,
  AgentStatus,
  AgentTaskPriority,
} from '@codeforge/shared';

export const AICommandCenterPage: React.FC = () => {
  const [overview, setOverview] = useState<CommandCenterOverviewDto | null>(null);
  const [agents, setAgents] = useState<AgentDto[]>([]);
  const [tasks, setTasks] = useState<AgentTaskDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [goalInput, setGoalInput] = useState('');
  const [selectedAgentType, setSelectedAgentType] = useState<AgentType>(AgentType.CODING_AGENT);
  const [decomposedSteps, setDecomposedSteps] = useState<any[] | null>(null);
  const [executingTaskId, setExecutingTaskId] = useState<string | null>(null);
  const [dispatchStatus, setDispatchStatus] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [overviewData, agentsData, tasksData] = await Promise.all([
        agenticWorkspaceApi.getOverview(),
        agenticWorkspaceApi.listAgents(),
        agenticWorkspaceApi.listTasks(),
      ]);
      setOverview(overviewData);
      setAgents(agentsData);
      setTasks(tasksData);
    } catch (err) {
      console.error('Failed to load command center data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDecompose = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalInput.trim()) return;
    try {
      const steps = await agenticWorkspaceApi.decomposeGoal(goalInput, selectedAgentType);
      setDecomposedSteps(steps);
    } catch (err) {
      console.error('Failed to decompose goal:', err);
    }
  };

  const handleConvertStepToTask = async (step: any) => {
    const targetAgent = agents.find(a => a.type === selectedAgentType) || agents[0];
    if (!targetAgent) return;
    try {
      const newTask = await agenticWorkspaceApi.createTask({
        agentId: targetAgent.id,
        title: step.title,
        description: `Autonomous execution of subtask for: ${goalInput}`,
        priority: step.priority || AgentTaskPriority.MEDIUM,
        dependencies: step.dependencies || [],
        toolsUsed: step.toolsUsed || [],
      });
      setTasks(prev => [newTask, ...prev]);
    } catch (err) {
      console.error('Failed to create task from step:', err);
    }
  };

  const handleExecuteTask = async (taskId: string) => {
    try {
      setExecutingTaskId(taskId);
      const updated = await agenticWorkspaceApi.executeTask(taskId);
      setTasks(prev => prev.map(t => (t.id === taskId ? updated : t)));
      const freshOverview = await agenticWorkspaceApi.getOverview();
      setOverview(freshOverview);
    } catch (err) {
      console.error('Failed to execute task:', err);
    } finally {
      setExecutingTaskId(null);
    }
  };

  const handleSimulateBusDispatch = async () => {
    try {
      setDispatchStatus('Dispatching inter-agent telemetry payload...');
      const res = await agenticWorkspaceApi.dispatchMessage(
        AgentType.CAREER_AGENT,
        AgentType.CODING_AGENT,
        'Sync Raft consensus milestone progress with Digital Twin promotion readiness vector'
      );
      setDispatchStatus(`Delivered: ${res.responsePayload?.summary}`);
      setTimeout(() => setDispatchStatus(null), 5000);
    } catch (err) {
      console.error('Bus dispatch error:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-lg font-medium text-slate-300">Synchronizing AI Command Center...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <div className="flex items-center space-x-3">
              <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-400 border border-indigo-500/30">
                Phase 13 • Work OS
              </span>
              <span className="flex items-center text-xs text-emerald-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-1.5"></span>
                8 Agents Autonomous
              </span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white mt-2">
              Personal AI Command Center
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Autonomous multi-agent orchestration, goal decomposition, background task execution, and work telemetry.
            </p>
          </div>

          {/* Quick Sub-portal Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/ai-workspace/workflows"
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-indigo-500 transition-all"
            >
              🔄 Workflows
            </Link>
            <Link
              to="/ai-workspace/projects"
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-indigo-500 transition-all"
            >
              🚀 Projects
            </Link>
            <Link
              to="/ai-workspace/research"
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-indigo-500 transition-all"
            >
              🔬 Research
            </Link>
            <Link
              to="/ai-workspace/knowledge-graph"
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-indigo-500 transition-all"
            >
              🕸️ Knowledge Graph
            </Link>
            <Link
              to="/ai-workspace/documents"
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-indigo-500 transition-all"
            >
              📄 Documents
            </Link>
            <Link
              to="/ai-workspace/analytics"
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 shadow-md shadow-indigo-500/20 transition-all"
            >
              📊 Productivity ROI
            </Link>
          </div>
        </div>

        {/* Overview Stats Cards */}
        {overview && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-800/80 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Agents</span>
                <span className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 text-lg">🤖</span>
              </div>
              <div className="mt-3 flex items-baseline space-x-2">
                <span className="text-3xl font-extrabold text-white">{overview.activeAgentsCount}</span>
                <span className="text-xs text-emerald-400 font-medium">/ 8 System Agents</span>
              </div>
              <div className="mt-2 text-xs text-slate-400">Career, Coding, Research, Learning, Placement...</div>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-800/80 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Running / Pending Tasks</span>
                <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 text-lg">⚡</span>
              </div>
              <div className="mt-3 flex items-baseline space-x-2">
                <span className="text-3xl font-extrabold text-white">{overview.runningTasksCount}</span>
                <span className="text-xs text-amber-400 font-medium">{tasks.length} total recorded</span>
              </div>
              <div className="mt-2 text-xs text-slate-400">Autonomous tool invocation queue</div>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-800/80 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Workflows</span>
                <span className="p-2 rounded-xl bg-purple-500/10 text-purple-400 text-lg">🔄</span>
              </div>
              <div className="mt-3 flex items-baseline space-x-2">
                <span className="text-3xl font-extrabold text-white">{overview.activeWorkflowsCount}</span>
                <span className="text-xs text-purple-400 font-medium">Cron & Triggered</span>
              </div>
              <div className="mt-2 text-xs text-slate-400">Weekly reviews & pipeline automations</div>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-800/80 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Productivity Score</span>
                <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 text-lg">📈</span>
              </div>
              <div className="mt-3 flex items-baseline space-x-2">
                <span className="text-3xl font-extrabold text-white">{overview.productivityScore}</span>
                <span className="text-xs text-emerald-400 font-medium">/ 100 Optimal</span>
              </div>
              <div className="mt-2 text-xs text-slate-400">+14% velocity vs prior sprint</div>
            </div>
          </div>
        )}

        {/* Multi-Agent Communication Bus & Alerts Banner */}
        <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <span className="text-xl">📡</span>
            <div>
              <h4 className="text-sm font-bold text-indigo-300">Multi-Agent Communication Bus</h4>
              <p className="text-xs text-slate-400">
                Autonomous agents exchange state payloads via asynchronous memory hooks and pub/sub channels.
              </p>
            </div>
          </div>
          <button
            onClick={handleSimulateBusDispatch}
            className="px-4 py-2 rounded-xl bg-indigo-600/80 hover:bg-indigo-500 text-xs font-semibold text-white shadow-md transition-all whitespace-nowrap"
          >
            Dispatch Agent Telemetry Message
          </button>
        </div>

        {dispatchStatus && (
          <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-300 flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>{dispatchStatus}</span>
          </div>
        )}

        {/* Goal Decomposition Section */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>🎯</span> Autonomous Goal Decomposition Engine
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Input any complex engineering or career goal to generate an automated multi-step dependency graph.
              </p>
            </div>
          </div>

          <form onSubmit={handleDecompose} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <input
                type="text"
                value={goalInput}
                onChange={e => setGoalInput(e.target.value)}
                placeholder="e.g. Build fault-tolerant Raft distributed key-value store with Jepsen tests in Rust"
                className="md:col-span-3 px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <select
                value={selectedAgentType}
                onChange={e => setSelectedAgentType(e.target.value as AgentType)}
                className="px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value={AgentType.CODING_AGENT}>Autonomous Coding Agent</option>
                <option value={AgentType.RESEARCH_AGENT}>Deep Research Copilot</option>
                <option value={AgentType.CAREER_AGENT}>Career Trajectory Agent</option>
                <option value={AgentType.LEARNING_AGENT}>Adaptive Learning Agent</option>
                <option value={AgentType.INTERVIEW_AGENT}>Mock Interviewer Agent</option>
              </select>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-xs font-bold text-white hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/20 transition-all"
              >
                ⚡ Decompose Goal into Sequential Subtasks
              </button>
            </div>
          </form>

          {decomposedSteps && (
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Generated Subtask Execution Graph ({decomposedSteps.length} Steps)
              </h4>
              <div className="grid grid-cols-1 gap-3">
                {decomposedSteps.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-indigo-500/20 text-indigo-400">
                          Step {idx + 1}
                        </span>
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-purple-500/20 text-purple-300">
                          {step.priority}
                        </span>
                        <h4 className="text-sm font-semibold text-slate-200">{step.title}</h4>
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 pt-1">
                        <span>Tools:</span>
                        {step.toolsUsed.map((tool: string, tIdx: number) => (
                          <span key={tIdx} className="px-2 py-0.2 text-[10px] rounded-full bg-slate-900 border border-slate-800 text-slate-300">
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => handleConvertStepToTask(step)}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs font-medium text-indigo-400 border border-indigo-500/30 whitespace-nowrap transition-all"
                    >
                      + Add to Active Tasks
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 8 Agent Fleet Monitoring Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>🤖</span> Autonomous Agent Fleet (8 Registered Agents)
              </h2>
              <p className="text-xs text-slate-400">Real-time status, capabilities, success rate, and execution telemetry.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {agents.map(agent => (
              <div
                key={agent.id}
                className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-indigo-500/50 transition-all space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-400">{agent.type}</span>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {agent.status}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white">{agent.name}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2">{agent.systemPrompt}</p>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {agent.capabilities.slice(0, 3).map((cap, cIdx) => (
                      <span
                        key={cIdx}
                        className="px-2 py-0.5 text-[9px] font-medium rounded-md bg-slate-950 text-slate-400 border border-slate-800"
                      >
                        {cap}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span>Success: <strong className="text-emerald-400">{agent.stats.successRate}%</strong></span>
                  <span>Tasks: <strong className="text-white">{agent.stats.tasksCompleted}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Running Tasks Execution Feed */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>⚡</span> Active Tasks & Autonomous Execution Queue
              </h2>
              <p className="text-xs text-slate-400">Execute tasks with tool invocations, lint verifications, and latency metrics.</p>
            </div>
          </div>

          <div className="divide-y divide-slate-800/80">
            {tasks.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-sm">
                No active tasks in queue. Decompose a goal above to generate new tasks!
              </div>
            ) : (
              tasks.map(task => (
                <div key={task.id} className="py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                        task.status === AgentStatus.COMPLETED ? 'bg-emerald-500/20 text-emerald-400' :
                        task.status === AgentStatus.EXECUTING ? 'bg-amber-500/20 text-amber-400 animate-pulse' :
                        'bg-indigo-500/20 text-indigo-400'
                      }`}>
                        {task.status}
                      </span>
                      <span className="text-xs font-bold text-purple-400">{task.priority}</span>
                      <h4 className="text-sm font-semibold text-slate-200">{task.title}</h4>
                    </div>
                    <p className="text-xs text-slate-400">{task.description}</p>
                    {task.outputResult && (
                      <div className="mt-2 p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-emerald-300 font-mono">
                        ✓ {String((task.outputResult as any)?.summary || 'Task completed successfully')} (Execution: {task.executionTimeMs}ms)
                      </div>
                    )}
                  </div>

                  {task.status !== AgentStatus.COMPLETED && (
                    <button
                      onClick={() => handleExecuteTask(task.id)}
                      disabled={executingTaskId === task.id}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-md disabled:opacity-50 whitespace-nowrap transition-all"
                    >
                      {executingTaskId === task.id ? '⚡ Executing...' : '▶ Execute Autonomous Step'}
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Multi-Channel Alerts Grid */}
        {overview?.alerts && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-5 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-2">
              <h3 className="text-sm font-bold text-indigo-300 flex items-center gap-1.5">
                <span>🎯</span> Career OS Momentum Alerts
              </h3>
              <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                {overview.alerts.careerAlerts.map((alt, i) => (
                  <li key={i}>{alt}</li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-purple-950/30 border border-purple-500/30 space-y-2">
              <h3 className="text-sm font-bold text-purple-300 flex items-center gap-1.5">
                <span>🧠</span> Adaptive Learning Alerts
              </h3>
              <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                {overview.alerts.learningAlerts.map((alt, i) => (
                  <li key={i}>{alt}</li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-2">
              <h3 className="text-sm font-bold text-emerald-300 flex items-center gap-1.5">
                <span>💼</span> Enterprise Talent Pipeline Alerts
              </h3>
              <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                {overview.alerts.hiringAlerts.map((alt, i) => (
                  <li key={i}>{alt}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
