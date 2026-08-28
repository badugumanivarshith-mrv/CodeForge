import React, { useState, useEffect } from 'react';
import {
  TaskGraphNodeDto,
  TaskOSPlanDto,
  TaskOSPriority,
} from '@codeforge/shared';
import { agentCloudApi } from '../../services/agentCloudApi';

export const TaskOSPage: React.FC = () => {
  const [tasks, setTasks] = useState<TaskGraphNodeDto[]>([]);
  const [smartPlan, setSmartPlan] = useState<TaskOSPlanDto | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskOSPriority>(TaskOSPriority.MEDIUM);
  const [hours, setHours] = useState(4);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const graph = await agentCloudApi.getTaskGraph();
      if (graph.nodes.length === 0) {
        // Create initial starter tasks
        const t1 = await agentCloudApi.createTaskNode({
          title: 'Implement Multi-Tenant Memory Fabric 2.0 Partitioning',
          description: 'Ensure cross-agent memory partitions maintain tenant isolation & zero-trust boundaries',
          priority: TaskOSPriority.CRITICAL,
          estimatedHours: 6,
          tags: ['architecture', 'security', 'memory'],
        });
        const t2 = await agentCloudApi.createTaskNode({
          title: 'Verify Autonomous Self-Healing Recovery Loop',
          description: 'Benchmark always-on agent recovery when handling simulated network interrupts',
          priority: TaskOSPriority.HIGH,
          estimatedHours: 4,
          tags: ['resilience', 'agents', 'telemetry'],
        });
        setTasks([t1, t2]);
      } else {
        setTasks(graph.nodes);
      }

      const plan = await agentCloudApi.getSmartPlan();
      setSmartPlan(plan);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    try {
      const newTask = await agentCloudApi.createTaskNode({
        title,
        description,
        priority,
        estimatedHours: Number(hours),
      });
      setTasks([newTask, ...tasks]);
      setTitle('');
      setDescription('');
      const updatedPlan = await agentCloudApi.getSmartPlan();
      setSmartPlan(updatedPlan);
    } catch (err) {
      console.error(err);
    }
  };

  const getPriorityBadge = (p: TaskOSPriority) => {
    switch (p) {
      case TaskOSPriority.CRITICAL:
        return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      case TaskOSPriority.HIGH:
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case TaskOSPriority.MEDIUM:
        return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 p-6 lg:p-10 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
              AI Task Operating System
            </h1>
            <p className="text-sm text-slate-400">Universal dependency graph, smart scheduling, critical path & AI deadline prediction</p>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Task Form & Plan Summary */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Enqueue Task Node</h2>
            <form onSubmit={handleCreateTask} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Audit Cloud Task Sandbox"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Task context, goals, and acceptance criteria..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={e => setPriority(e.target.value as TaskOSPriority)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-500"
                  >
                    {Object.values(TaskOSPriority).map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Est. Hours</label>
                  <input
                    type="number"
                    min={1}
                    value={hours}
                    onChange={e => setHours(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-500"
                  >
                  </input>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold transition shadow-md shadow-cyan-600/30"
              >
                + Register Task Node
              </button>
            </form>
          </div>

          {/* Smart Plan Summary Card */}
          {smartPlan && (
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">AI Critical Path Engine</h3>
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Total Workload</span>
                  <strong className="text-cyan-300">{smartPlan.totalEstimatedHours} Estimated Hours</strong>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Completion Rate</span>
                  <strong className="text-emerald-400">{Math.round(smartPlan.completionRate)}%</strong>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Critical Path Nodes</span>
                  <strong className="text-purple-400">{smartPlan.criticalPath.length} Nodes</strong>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Task Graph Nodes Column */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center justify-between">
            <span>Task Graph Nodes ({tasks.length})</span>
            <span className="text-xs text-cyan-400 font-mono">Autonomous Execution Queue</span>
          </h3>

          <div className="space-y-3">
            {tasks.map(task => (
              <div key={task.id} className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl hover:border-slate-700 transition">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <span className="font-semibold text-white text-base">{task.title}</span>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] border font-medium uppercase ${getPriorityBadge(task.priority)}`}>
                      {task.priority}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 font-mono uppercase">
                      {task.status}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-400 mb-4">{task.description}</p>
                <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-800/80 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <span>Est: <strong className="text-slate-300">{task.estimatedHours}h</strong></span>
                    <span>Alignment Score: <strong className="text-cyan-400">{Math.round(task.goalAlignmentScore * 100)}%</strong></span>
                  </div>
                  {task.tags && task.tags.length > 0 && (
                    <div className="flex gap-1.5">
                      {task.tags.map((t, i) => (
                        <span key={i} className="px-2 py-0.5 bg-slate-800 text-slate-400 text-[10px] rounded">
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
