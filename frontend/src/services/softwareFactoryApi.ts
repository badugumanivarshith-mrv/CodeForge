import {
  SoftwareProjectDto,
  CreateSoftwareProjectDto,
  SoftwareFactoryMetricsDto,
  SoftwareFactoryOverviewDto,
  SoftwareProjectType,
  SoftwareProjectStatus,
  EngineeringTaskType,
  EngineeringTaskStatus,
  ArtifactType,
  BlueprintComplexity,
} from '@codeforge/shared';

const API_BASE = '/api/v1/software-factory';

function getHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export const softwareFactoryApi = {
  // 1. Overview & Metrics
  async getOverview(): Promise<SoftwareFactoryOverviewDto> {
    try {
      const res = await fetch(`${API_BASE}/overview`, { headers: getHeaders() });
      if (res.ok) {
        const json = await res.json();
        return json.data || json;
      }
    } catch (e) {
      console.warn('API error, falling back to mock data', e);
    }

    return {
      metrics: {
        totalProjects: 2,
        activeProjects: 1,
        totalLinesOfCode: 24500,
        buildSuccessRate: 98.2,
        activeAgentsCount: 4,
        averageTaskCompletionHours: 4.2,
        completedTasksCount: 18,
        failedTasksCount: 1,
        calculatedAt: new Date().toISOString(),
      },
      recentProjects: [
        {
          id: 'proj-seed-1',
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
        },
      ],
      recentTasks: [
        {
          id: 'task-seed-1',
          projectId: 'proj-seed-1',
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
        },
        {
          id: 'task-seed-2',
          projectId: 'proj-seed-1',
          title: 'Generate Nest.js Gateway Controllers',
          description: 'Generate standard API routers, middleware validation filters, and route guards.',
          taskType: EngineeringTaskType.CODING,
          status: EngineeringTaskStatus.IN_PROGRESS,
          assignedAgent: 'Scrum Developer Agent',
          estimatedHours: 8,
          actualHoursSpent: 4.5,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      recentArtifacts: [
        {
          id: 'art-seed-1',
          projectId: 'proj-seed-1',
          taskId: 'task-seed-1',
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
        },
      ],
      activeBlueprints: [
        {
          id: 'bp-seed-1',
          projectId: 'proj-seed-1',
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
        },
      ],
    };
  },

  async getMetrics(): Promise<SoftwareFactoryMetricsDto> {
    const res = await fetch(`${API_BASE}/metrics`, { headers: getHeaders() });
    const json = await res.json();
    return json.data;
  },

  // 2. Projects & Generation
  async listProjects(projectType?: SoftwareProjectType): Promise<SoftwareProjectDto[]> {
    const url = projectType ? `${API_BASE}/projects?projectType=${projectType}` : `${API_BASE}/projects`;
    const res = await fetch(url, { headers: getHeaders() });
    const json = await res.json();
    return json.data;
  },

  async provisionProject(dto: CreateSoftwareProjectDto): Promise<SoftwareProjectDto> {
    const res = await fetch(`${API_BASE}/generate`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(dto),
    });
    const json = await res.json();
    return json.data;
  },

  async runBuildCycle(projectId: string): Promise<SoftwareProjectDto> {
    const res = await fetch(`${API_BASE}/architecture`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ projectId }),
    });
    const json = await res.json();
    return json.data;
  }
};
