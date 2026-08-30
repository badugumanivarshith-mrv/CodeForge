import { ISoftwareFactoryRepository } from '../../repositories/interfaces/ISoftwareFactoryRepository';
import { EngineeringTaskDto, EngineeringTaskType, EngineeringTaskStatus } from '@codeforge/shared';

export class EngineeringWorkflowService {
  constructor(private repo: ISoftwareFactoryRepository) {}

  async createBacklogTasks(projectId: string): Promise<EngineeringTaskDto[]> {
    const project = await this.repo.getProjectById(projectId);
    if (!project) throw new Error(`Project ${projectId} not found`);

    const standardTasks = [
      {
        title: 'Define Project Architecture & Endpoint Routes',
        description: 'Establish layout components, schemas mappings, and gateway routing targets.',
        taskType: EngineeringTaskType.ARCHITECTURE,
        assignedAgent: 'Architect Agent Pro',
        estimatedHours: 6,
      },
      {
        title: 'Generate Controller & Routing Files',
        description: 'Generate standard API controllers, schema validators, and middleware guards.',
        taskType: EngineeringTaskType.CODING,
        assignedAgent: 'Software Engineer Agent Code-A',
        estimatedHours: 12,
      },
      {
        title: 'Write Integration Test Suites',
        description: 'Implement assertions verifying routes latency and DB responses.',
        taskType: EngineeringTaskType.TESTING,
        assignedAgent: 'QA Verification Agent V-1',
        estimatedHours: 8,
      },
    ];

    const created: EngineeringTaskDto[] = [];
    for (const t of standardTasks) {
      const task = await this.repo.createTask({
        projectId,
        title: t.title,
        description: t.description,
        taskType: t.taskType,
        assignedAgent: t.assignedAgent,
        estimatedHours: t.estimatedHours,
      });
      created.push(task);
    }

    return created;
  }

  async startTask(taskId: string): Promise<EngineeringTaskDto> {
    const updated = await this.repo.updateTask(taskId, {
      status: EngineeringTaskStatus.IN_PROGRESS,
    });
    if (!updated) throw new Error(`Task ${taskId} not found`);
    return updated;
  }

  async submitTaskForReview(taskId: string, hoursSpent: number): Promise<EngineeringTaskDto> {
    const updated = await this.repo.updateTask(taskId, {
      status: EngineeringTaskStatus.REVIEW,
      actualHoursSpent: hoursSpent,
    });
    if (!updated) throw new Error(`Task ${taskId} not found`);
    return updated;
  }

  async completeTask(taskId: string): Promise<EngineeringTaskDto> {
    const updated = await this.repo.updateTask(taskId, {
      status: EngineeringTaskStatus.COMPLETED,
    });
    if (!updated) throw new Error(`Task ${taskId} not found`);
    return updated;
  }

  async listTasks(projectId: string): Promise<EngineeringTaskDto[]> {
    return this.repo.listTasksByProject(projectId);
  }
}
