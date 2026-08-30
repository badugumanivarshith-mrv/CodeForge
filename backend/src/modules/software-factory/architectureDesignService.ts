import { ISoftwareFactoryRepository } from '../../repositories/interfaces/ISoftwareFactoryRepository';
import { ArchitectureBlueprintDto, BlueprintComplexity, SoftwareProjectType } from '@codeforge/shared';

export class ArchitectureDesignService {
  constructor(private repo: ISoftwareFactoryRepository) {}

  async designBlueprint(projectId: string): Promise<ArchitectureBlueprintDto> {
    const project = await this.repo.getProjectById(projectId);
    if (!project) {
      throw new Error(`Project ${projectId} not found`);
    }

    // Determine blueprint complexity and platform options
    const compText = project.complexity.toUpperCase();
    const diagramMermaid = `graph TD
  Client[Client Platform: ${project.targetPlatform}] --> GW[API Gateway Routing]
  GW --> Core[Core API Service: ${project.frameworks.join(' & ')}]
  Core --> DB[(Relational Datastore: PostgreSQL)]`;

    const componentLayout = {
      Client: project.targetPlatform,
      Gateway: 'Zuul / Spring Cloud Gateway',
      Core: project.frameworks[0] || 'NodeJS Server',
      DB: 'PostgreSQL Database Cluster',
    };

    const apiGateways = [
      { route: '/api/v1/health', targetService: 'Core API Service', method: 'GET' },
      { route: '/api/v1/resources', targetService: 'Core API Service', method: 'POST' },
    ];

    const databaseSchemas = {
      users: 'id UUID PRIMARY KEY, email VARCHAR(255) UNIQUE, password_hash TEXT',
      system_resources: 'id UUID PRIMARY KEY, name VARCHAR(100), metadata JSONB',
    };

    const deploymentSpecs = {
      replicas: project.complexity === BlueprintComplexity.ENTERPRISE ? 5 : 2,
      cpuLimit: project.complexity === BlueprintComplexity.ENTERPRISE ? '2000m' : '500m',
      memoryLimit: project.complexity === BlueprintComplexity.ENTERPRISE ? '4Gi' : '1Gi',
    };

    const blueprint = await this.repo.createBlueprint({
      projectId,
      diagramMermaid,
      componentLayout,
      apiGateways,
      databaseSchemas,
      deploymentSpecs,
    });

    return blueprint;
  }

  async getBlueprint(projectId: string): Promise<ArchitectureBlueprintDto | null> {
    return this.repo.getBlueprintByProject(projectId);
  }
}
