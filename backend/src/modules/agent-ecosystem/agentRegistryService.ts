import { IAgentEcosystemRepository } from '../../repositories/interfaces/IAgentEcosystemRepository';
import { EcosystemAgentDto, CreateEcosystemAgentDto, AgentOverviewDto, AgentMetricsDto } from '@codeforge/shared';

export class AgentRegistryService {
  constructor(private repo: IAgentEcosystemRepository) {}

  public async registerAgent(userId: string, dto: CreateEcosystemAgentDto): Promise<EcosystemAgentDto> {
    return this.repo.registerAgent(userId, dto);
  }

  public async listAgents(userId: string): Promise<EcosystemAgentDto[]> {
    return this.repo.listAgents(userId);
  }

  public async getAgent(id: string): Promise<EcosystemAgentDto | null> {
    return this.repo.getAgent(id);
  }

  public async getOverview(userId: string): Promise<AgentOverviewDto> {
    return this.repo.getOverview(userId);
  }

  public async getMetrics(userId: string): Promise<AgentMetricsDto> {
    return this.repo.getMetrics(userId);
  }
}
