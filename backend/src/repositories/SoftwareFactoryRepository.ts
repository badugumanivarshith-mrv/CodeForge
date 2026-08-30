import { randomUUID } from 'crypto';
import {
  SoftwareProjectDto,
  CreateSoftwareProjectDto,
  EngineeringTaskDto,
  CreateEngineeringTaskDto,
  GeneratedArtifactDto,
  CreateGeneratedArtifactDto,
  ArchitectureBlueprintDto,
  CreateArchitectureBlueprintDto,
  SoftwareFactoryMetricsDto,
  SoftwareProjectType,
  SoftwareProjectStatus,
  EngineeringTaskType,
  EngineeringTaskStatus,
  ArtifactType,
  BlueprintComplexity,
} from '@codeforge/shared';
import { ISoftwareFactoryRepository } from './interfaces/ISoftwareFactoryRepository';

export class SoftwareFactoryRepository implements ISoftwareFactoryRepository {
  private projects: Map<string, SoftwareProjectDto> = new Map();
  private tasks: Map<string, EngineeringTaskDto> = new Map();
  private artifacts: Map<string, GeneratedArtifactDto> = new Map();
  private blueprints: Map<string, ArchitectureBlueprintDto> = new Map();
  private metrics!: SoftwareFactoryMetricsDto;

  constructor() {
    this.seedDefaults();
  }

  private seedDefaults() {
    const id1 = 'proj-seed-1';
    const proj1: SoftwareProjectDto = {
      id: id1,
      name: 'Planetary Web Ledger API Gateway',
      description: 'Distributed high-throughput API gateway routing and telemetry collection for web ledgers.',
      projectType: SoftwareProjectType.API_SERVICE,
      status: SoftwareProjectStatus.GENERATING,
      complexity: BlueprintComplexity.COMPLEX,
      targetPlatform: 'Kubernetes / GCP',
      frameworks: ['Nest.js', 'TypeScript', 'Drizzle ORM'],
      dependencies: ['@nestjs/core', 'pg', 'drizzle-orm', 'zod'],
      linesOfCodeGenerated: 8500,
      buildStatus: 'SUCCESS',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.projects.set(id1, proj1);

    const bp1: ArchitectureBlueprintDto = {
      id: 'bp-seed-1',
      projectId: id1,
      diagramMermaid: `graph TD
  Gateway[API Gateway] --> Auth[Auth Service]
  Gateway --> Ledger[Ledger Router]
  Ledger --> DB[(PostgreSQL Cluster)]`,
      componentLayout: { Gateway: 'NestJS', Auth: 'OAuth2/JWT', Ledger: 'Express', DB: 'Postgres' },
      apiGateways: [
        { route: '/v1/ledger/records', targetService: 'Ledger Router', method: 'POST' },
        { route: '/v1/auth/token', targetService: 'Auth Service', method: 'POST' },
      ],
      databaseSchemas: {
        ledger_records: 'id UUID PRIMARY KEY, value NUMERIC, owner_id UUID, timestamp TIMESTAMPTZ',
      },
      deploymentSpecs: { replicas: 3, cpuLimit: '1000m', memoryLimit: '2Gi' },
      designedAt: new Date().toISOString(),
    };
    this.blueprints.set(id1, bp1);

    const task1: EngineeringTaskDto = {
      id: 'task-seed-1',
      projectId: id1,
      title: 'Initialize Workspace & Repository Structure',
      description: 'Set up package.json, tsconfig, and folder scaffolding for modules.',
      taskType: EngineeringTaskType.REQUIREMENTS,
      status: EngineeringTaskStatus.COMPLETED,
      assignedAgent: 'Senior Dev Copilot Agent',
      estimatedHours: 4,
      actualHoursSpent: 3.5,
      completedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const task2: EngineeringTaskDto = {
      id: 'task-seed-2',
      projectId: id1,
      title: 'Generate Nest.js Gateway Controllers',
      description: 'Generate standard API routers, middleware validation filters, and route guards.',
      taskType: EngineeringTaskType.CODING,
      status: EngineeringTaskStatus.IN_PROGRESS,
      assignedAgent: 'Scrum Developer Agent',
      estimatedHours: 8,
      actualHoursSpent: 4.5,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.tasks.set(task1.id, task1);
    this.tasks.set(task2.id, task2);

    const art1: GeneratedArtifactDto = {
      id: 'art-seed-1',
      projectId: id1,
      taskId: task1.id,
      filePath: 'src/main.ts',
      artifactType: ArtifactType.SOURCE_CODE,
      fileContent: `import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();`,
      fileSizeCharacters: 212,
      checksum: 'sha256-a1b2c3d4',
      generatedAt: new Date().toISOString(),
    };
    this.artifacts.set(art1.id, art1);

    this.metrics = {
      totalProjects: 1,
      activeProjects: 1,
      totalLinesOfCode: 8500,
      buildSuccessRate: 100.0,
      activeAgentsCount: 2,
      averageTaskCompletionHours: 3.5,
      completedTasksCount: 1,
      failedTasksCount: 0,
      calculatedAt: new Date().toISOString(),
    };
  }

  // 1. Projects
  async createProject(dto: CreateSoftwareProjectDto): Promise<SoftwareProjectDto> {
    const id = randomUUID();
    const project: SoftwareProjectDto = {
      id,
      ...dto,
      status: SoftwareProjectStatus.PLANNING,
      linesOfCodeGenerated: 0,
      buildStatus: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.projects.set(id, project);

    // Update metrics
    this.metrics.totalProjects += 1;
    this.metrics.activeProjects += 1;

    return project;
  }

  async getProjectById(id: string): Promise<SoftwareProjectDto | null> {
    return this.projects.get(id) || null;
  }

  async listProjects(projectType?: SoftwareProjectType): Promise<SoftwareProjectDto[]> {
    const list = Array.from(this.projects.values());
    if (projectType) {
      return list.filter((p) => p.projectType === projectType);
    }
    return list;
  }

  async updateProject(id: string, updates: Partial<SoftwareProjectDto>): Promise<SoftwareProjectDto | null> {
    const existing = this.projects.get(id);
    if (!existing) return null;
    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.projects.set(id, updated);
    return updated;
  }

  // 2. Tasks
  async createTask(dto: CreateEngineeringTaskDto): Promise<EngineeringTaskDto> {
    const id = randomUUID();
    const task: EngineeringTaskDto = {
      id,
      ...dto,
      status: EngineeringTaskStatus.BACKLOG,
      actualHoursSpent: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.tasks.set(id, task);
    return task;
  }

  async getTaskById(id: string): Promise<EngineeringTaskDto | null> {
    return this.tasks.get(id) || null;
  }

  async listTasksByProject(projectId: string): Promise<EngineeringTaskDto[]> {
    return Array.from(this.tasks.values()).filter((t) => t.projectId === projectId);
  }

  async updateTask(id: string, updates: Partial<EngineeringTaskDto>): Promise<EngineeringTaskDto | null> {
    const existing = this.tasks.get(id);
    if (!existing) return null;
    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.tasks.set(id, updated);

    // If completed
    if (updates.status === EngineeringTaskStatus.COMPLETED && !existing.completedAt) {
      updated.completedAt = new Date().toISOString();
      this.metrics.completedTasksCount += 1;
    } else if (updates.status === EngineeringTaskStatus.FAILED) {
      this.metrics.failedTasksCount += 1;
    }

    return updated;
  }

  // 3. Artifacts
  async createArtifact(dto: CreateGeneratedArtifactDto): Promise<GeneratedArtifactDto> {
    const id = randomUUID();
    const artifact: GeneratedArtifactDto = {
      id,
      ...dto,
      fileSizeCharacters: dto.fileContent.length,
      checksum: 'sha256-' + randomUUID().substring(0, 8),
      generatedAt: new Date().toISOString(),
    };
    this.artifacts.set(id, artifact);

    // Update lines of code generated counter
    const proj = this.projects.get(dto.projectId);
    if (proj) {
      const loc = dto.fileContent.split('\n').length;
      proj.linesOfCodeGenerated += loc;
      this.metrics.totalLinesOfCode += loc;
    }

    return artifact;
  }

  async getArtifactById(id: string): Promise<GeneratedArtifactDto | null> {
    return this.artifacts.get(id) || null;
  }

  async listArtifactsByProject(projectId: string): Promise<GeneratedArtifactDto[]> {
    return Array.from(this.artifacts.values()).filter((a) => a.projectId === projectId);
  }

  // 4. Blueprints
  async createBlueprint(dto: CreateArchitectureBlueprintDto): Promise<ArchitectureBlueprintDto> {
    const id = randomUUID();
    const bp: ArchitectureBlueprintDto = {
      id,
      ...dto,
      designedAt: new Date().toISOString(),
    };
    this.blueprints.set(dto.projectId, bp);
    return bp;
  }

  async getBlueprintByProject(projectId: string): Promise<ArchitectureBlueprintDto | null> {
    return this.blueprints.get(projectId) || null;
  }

  // 5. Metrics
  async getMetrics(): Promise<SoftwareFactoryMetricsDto> {
    return this.metrics;
  }

  async updateMetrics(updates: Partial<SoftwareFactoryMetricsDto>): Promise<SoftwareFactoryMetricsDto> {
    this.metrics = {
      ...this.metrics,
      ...updates,
      calculatedAt: new Date().toISOString(),
    };
    return this.metrics;
  }
}
export const softwareFactoryRepository = new SoftwareFactoryRepository();
