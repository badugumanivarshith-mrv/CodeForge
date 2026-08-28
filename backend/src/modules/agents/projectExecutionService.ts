import { IAgenticWorkspaceRepository } from '../../repositories/interfaces/IAgenticWorkspaceRepository';
import { agenticWorkspaceRepository } from '../../repositories/AgenticWorkspaceRepository';
import {
  AutonomousProjectDto,
  CreateAutonomousProjectDto,
  ProjectRoadmapDto,
  ProjectSprintDto,
  ProjectObjectiveDto,
} from '@codeforge/shared';

export class ProjectExecutionService {
  constructor(private repo: IAgenticWorkspaceRepository = agenticWorkspaceRepository) {}

  /**
   * Generates a fully decomposed autonomous project plan with multi-phase roadmap, sprints, and risk analysis
   */
  async generateProjectPlan(userId: string, data: CreateAutonomousProjectDto): Promise<AutonomousProjectDto> {
    const title = data.title;
    const goal = data.goal;
    const weeks = data.targetTimelineWeeks || 8;
    const stack = data.preferredTechStack || ['TypeScript', 'Rust', 'PostgreSQL', 'Docker'];

    // 1. Roadmap Phases
    const roadmap: ProjectRoadmapDto[] = [
      {
        phase: 'Phase 1: Architecture RFC & Core State Machine',
        estimatedWeeks: 2,
        milestones: [
          'Design formal protocol specification and state invariants',
          'Implement core consensus / data structures with 100% unit test coverage',
        ],
        dependencies: [],
      },
      {
        phase: 'Phase 2: High-Throughput Engine & Storage Engine Integration',
        estimatedWeeks: 3,
        milestones: [
          'Integrate Write-Ahead Log (WAL) and memory-mapped LSM indexes',
          'Benchmark raw disk throughput and optimize cache line allocations',
        ],
        dependencies: ['Phase 1: Architecture RFC & Core State Machine'],
      },
      {
        phase: 'Phase 3: Network Layer, RPC & Chaos Stress Testing',
        estimatedWeeks: 2,
        milestones: [
          'Implement async gRPC / Tokio network communication layer',
          'Simulate split-brain partitions and verify zero data-loss guarantees',
        ],
        dependencies: ['Phase 2: High-Throughput Engine & Storage Engine Integration'],
      },
      {
        phase: 'Phase 4: Production Packaging, Telemetry & Open-Source Release',
        estimatedWeeks: 1,
        milestones: [
          'Instrument OpenTelemetry metrics, Grafana dashboards, and benchmarks',
          'Publish comprehensive README, architectural diagrams, and release binaries',
        ],
        dependencies: ['Phase 3: Network Layer, RPC & Chaos Stress Testing'],
      },
    ];

    // 2. Sprint Plans (2-week cadence)
    const sprintPlan: ProjectSprintDto[] = [
      {
        sprintNumber: 1,
        name: 'Sprint 1 — Core Invariants & State Storage',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 14 * 86400000).toISOString(),
        deliverables: ['Protocol Spec RFC', 'In-memory State Machine', 'Unit Test Harness'],
        status: 'in_progress',
      },
      {
        sprintNumber: 2,
        name: 'Sprint 2 — Persistence & High-Speed I/O',
        startDate: new Date(Date.now() + 14 * 86400000).toISOString(),
        endDate: new Date(Date.now() + 28 * 86400000).toISOString(),
        deliverables: ['WAL Append Engine', 'LSM-Tree Flush Subsystem', 'Zero-Copy Serialization'],
        status: 'pending',
      },
      {
        sprintNumber: 3,
        name: 'Sprint 3 — Distributed Consensus & Partitions',
        startDate: new Date(Date.now() + 28 * 86400000).toISOString(),
        endDate: new Date(Date.now() + 42 * 86400000).toISOString(),
        deliverables: ['Heartbeat Protocol', 'Dynamic Cluster Membership', 'Jepsen Chaos Test Suite'],
        status: 'pending',
      },
      {
        sprintNumber: 4,
        name: 'Sprint 4 — Production Hardening & Launch',
        startDate: new Date(Date.now() + 42 * 86400000).toISOString(),
        endDate: new Date(Date.now() + 56 * 86400000).toISOString(),
        deliverables: ['Docker Image Bundles', 'Benchmark Suite', 'Public Repository Release'],
        status: 'pending',
      },
    ];

    // 3. Weekly Objectives with Key Results
    const weeklyObjectives: ProjectObjectiveDto[] = [
      {
        weekNumber: 1,
        objective: 'Draft Architecture RFC and Define Wire Protocol',
        keyResults: ['Approved architecture RFC', 'Zero lint warnings on protocol types'],
        completed: true,
      },
      {
        weekNumber: 2,
        objective: 'Implement State Machine and Core Concurrency Primitives',
        keyResults: ['Passing test suite with 25+ unit tests', 'Thread sanitizer check passed'],
        completed: false,
      },
      {
        weekNumber: 3,
        objective: 'Build High-Performance WAL Storage Engine',
        keyResults: ['Sequential write throughput >= 120MB/s', 'Crash recovery verification'],
        completed: false,
      },
      {
        weekNumber: 4,
        objective: 'Implement LSM-Tree MemTable & SSTable Compaction',
        keyResults: ['p99 read latency < 2.5ms', 'Background compaction thread safety'],
        completed: false,
      },
    ];

    // 4. Resource Allocation & Risk Matrix
    const resourceAllocation = {
      recommendedHoursPerWeek: Math.min(25, Math.max(10, Math.round(weeks * 2.2))),
      primaryTools: ['VS Code / Neovim', 'Criterion.rs Benchmarking', 'Docker Compose', 'Valgrind / Miri'],
      suggestedLibraries: stack,
    };

    const riskFactors = [
      'Async deadlocks under high-concurrency lock contention',
      'Unbounded memory growth during bursty network packet spikes',
      'Disk write bottleneck if fsync interval is too aggressive',
    ];

    return this.repo.createProject(userId, {
      title,
      description: data.description || `Autonomous engineering plan to achieve: ${goal}`,
      goal,
      targetTimelineWeeks: weeks,
      preferredTechStack: stack,
      roadmap,
      sprintPlan,
      weeklyObjectives,
      resourceAllocation,
      riskFactors,
    });
  }

  /**
   * Advances project progress by completing a weekly objective and recalculating completion %
   */
  async completeWeeklyObjective(projectId: string, userId: string, weekNumber: number): Promise<AutonomousProjectDto | null> {
    const project = await this.repo.getProjectById(projectId, userId);
    if (!project) return null;

    const updatedObjectives = project.weeklyObjectives.map(obj => {
      if (obj.weekNumber === weekNumber) {
        return { ...obj, completed: true };
      }
      return obj;
    });

    const completedCount = updatedObjectives.filter(o => o.completed).length;
    const progressPercentage = Math.min(100, Math.round((completedCount / (updatedObjectives.length || 1)) * 100));

    const status = progressPercentage >= 100 ? 'completed' : 'in_progress';

    return this.repo.updateProject(projectId, userId, {
      weeklyObjectives: updatedObjectives,
      progressPercentage,
      status,
    });
  }

  async getProject(projectId: string, userId: string): Promise<AutonomousProjectDto | null> {
    return this.repo.getProjectById(projectId, userId);
  }

  async listProjects(userId: string): Promise<AutonomousProjectDto[]> {
    return this.repo.listProjects(userId);
  }

  async deleteProject(projectId: string, userId: string): Promise<boolean> {
    return this.repo.deleteProject(projectId, userId);
  }
}

export const projectExecutionService = new ProjectExecutionService();
