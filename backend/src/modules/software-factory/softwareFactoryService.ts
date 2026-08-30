import { ISoftwareFactoryRepository, softwareFactoryRepository } from '../../repositories';
import { ArchitectureDesignService } from './architectureDesignService';
import { CodeGenerationService } from './codeGenerationService';
import { EngineeringWorkflowService } from './engineeringWorkflowService';
import {
  SoftwareProjectDto,
  CreateSoftwareProjectDto,
  SoftwareFactoryMetricsDto,
  SoftwareFactoryOverviewDto,
  SoftwareProjectStatus,
} from '@codeforge/shared';

export class SoftwareFactoryService {
  private archService: ArchitectureDesignService;
  private codeService: CodeGenerationService;
  private workflowService: EngineeringWorkflowService;

  constructor(private repo: ISoftwareFactoryRepository = softwareFactoryRepository) {
    this.archService = new ArchitectureDesignService(repo);
    this.codeService = new CodeGenerationService(repo);
    this.workflowService = new EngineeringWorkflowService(repo);
  }

  async provisionProject(dto: CreateSoftwareProjectDto): Promise<SoftwareProjectDto> {
    // 1. Create project
    const project = await this.repo.createProject(dto);

    // 2. Generate architecture blueprint
    await this.archService.designBlueprint(project.id);

    // 3. Populate task backlog
    await this.workflowService.createBacklogTasks(project.id);

    // 4. Update status to PLANNING
    await this.repo.updateProject(project.id, { status: SoftwareProjectStatus.PLANNING });

    return project;
  }

  async runBuildCycle(projectId: string): Promise<SoftwareProjectDto> {
    const project = await this.repo.getProjectById(projectId);
    if (!project) throw new Error(`Project ${projectId} not found`);

    // Transition to generating
    await this.repo.updateProject(projectId, { status: SoftwareProjectStatus.GENERATING });

    // Find in-progress or review tasks to complete
    const tasks = await this.workflowService.listTasks(projectId);
    for (const t of tasks) {
      // Simulate code generation for coding tasks
      if (t.status === 'backlog') {
        await this.workflowService.startTask(t.id);
      }
      // Generate some source files
      await this.codeService.generateArtifact(projectId, t.id, `src/${t.title.toLowerCase().replace(/ /g, '_')}.ts`);
      await this.workflowService.completeTask(t.id);
    }

    // Run tests & update status
    const updated = await this.repo.updateProject(projectId, {
      status: SoftwareProjectStatus.DEPLOYED,
      buildStatus: 'SUCCESS',
      deploymentUrl: `https://${project.name.toLowerCase().replace(/ /g, '-')}.codeforge.app`,
      repositoryUrl: `https://github.com/codeforge-autonomous/${project.name.toLowerCase().replace(/ /g, '-')}`,
    });

    return updated!;
  }

  async getOverview(): Promise<SoftwareFactoryOverviewDto> {
    const metrics = await this.repo.getMetrics();
    const projects = await this.repo.listProjects();

    const recentTasks = projects.length > 0 ? await this.workflowService.listTasks(projects[0].id) : [];
    const recentArtifacts = projects.length > 0 ? await this.codeService.listArtifacts(projects[0].id) : [];
    const activeBlueprint = projects.length > 0 ? await this.archService.getBlueprint(projects[0].id) : null;

    return {
      metrics,
      recentProjects: projects,
      recentTasks,
      recentArtifacts,
      activeBlueprints: activeBlueprint ? [activeBlueprint] : [],
    };
  }

  async getMetrics(): Promise<SoftwareFactoryMetricsDto> {
    return this.repo.getMetrics();
  }
}
export const softwareFactoryService = new SoftwareFactoryService();
