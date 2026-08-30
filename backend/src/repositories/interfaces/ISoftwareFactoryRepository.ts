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
} from '@codeforge/shared';

export interface ISoftwareFactoryRepository {
  // Software Projects
  createProject(dto: CreateSoftwareProjectDto): Promise<SoftwareProjectDto>;
  getProjectById(id: string): Promise<SoftwareProjectDto | null>;
  listProjects(projectType?: SoftwareProjectType): Promise<SoftwareProjectDto[]>;
  updateProject(id: string, updates: Partial<SoftwareProjectDto>): Promise<SoftwareProjectDto | null>;

  // Engineering Tasks
  createTask(dto: CreateEngineeringTaskDto): Promise<EngineeringTaskDto>;
  getTaskById(id: string): Promise<EngineeringTaskDto | null>;
  listTasksByProject(projectId: string): Promise<EngineeringTaskDto[]>;
  updateTask(id: string, updates: Partial<EngineeringTaskDto>): Promise<EngineeringTaskDto | null>;

  // Generated Artifacts
  createArtifact(dto: CreateGeneratedArtifactDto): Promise<GeneratedArtifactDto>;
  getArtifactById(id: string): Promise<GeneratedArtifactDto | null>;
  listArtifactsByProject(projectId: string): Promise<GeneratedArtifactDto[]>;

  // Architecture Blueprints
  createBlueprint(dto: CreateArchitectureBlueprintDto): Promise<ArchitectureBlueprintDto>;
  getBlueprintByProject(projectId: string): Promise<ArchitectureBlueprintDto | null>;

  // Metrics
  getMetrics(): Promise<SoftwareFactoryMetricsDto>;
  updateMetrics(updates: Partial<SoftwareFactoryMetricsDto>): Promise<SoftwareFactoryMetricsDto>;
}
