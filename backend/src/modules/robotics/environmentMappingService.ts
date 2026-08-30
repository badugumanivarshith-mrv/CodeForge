import { IRoboticsRepository } from '../../repositories/interfaces/IRoboticsRepository';
import { SimulationRunDto, CreateSimulationRunDto } from '@codeforge/shared';

export class EnvironmentMappingService {
  constructor(private repo: IRoboticsRepository) {}

  public async runSimulation(userId: string, dto: CreateSimulationRunDto): Promise<SimulationRunDto> {
    return this.repo.createSimulationRun(userId, dto);
  }

  public async listSimulations(userId: string): Promise<SimulationRunDto[]> {
    return this.repo.listSimulationRuns(userId);
  }

  public async generateMeshMap(robotId: string): Promise<{
    robotId: string;
    octomapResolutionMeters: number;
    voxelsCount: number;
    invariantsPassed: boolean;
  }> {
    return {
      robotId,
      octomapResolutionMeters: 0.05,
      voxelsCount: 42000,
      invariantsPassed: true,
    };
  }
}
