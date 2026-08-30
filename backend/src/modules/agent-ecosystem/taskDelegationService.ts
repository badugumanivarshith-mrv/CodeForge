import { IAgentEcosystemRepository } from '../../repositories/interfaces/IAgentEcosystemRepository';
import { EcosystemAgentTaskDto, CreateEcosystemAgentTaskDto, AgentTaskStatus } from '@codeforge/shared';

export class TaskDelegationService {
  constructor(private repo: IAgentEcosystemRepository) {}

  public async delegateTask(userId: string, dto: CreateEcosystemAgentTaskDto): Promise<EcosystemAgentTaskDto> {
    const task = await this.repo.createTask(userId, dto);

    // Simulate asynchronous task resolution by the autonomous agent
    setTimeout(async () => {
      try {
        await this.repo.updateTaskStatus(
          task.id,
          AgentTaskStatus.SUCCESS,
          { outputResult: 'Task completed successfully by the autonomous coprocessor.' }
        );
      } catch (err) {
        // Safe check
      }
    }, 100);

    return task;
  }

  public async fetchTasks(agentId: string): Promise<EcosystemAgentTaskDto[]> {
    return this.repo.listTasks(agentId);
  }
}
