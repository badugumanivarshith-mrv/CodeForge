import { IRoboticsRepository } from '../../repositories/interfaces/IRoboticsRepository';
import { RobotDto, CreateRobotDto, RobotStatus } from '@codeforge/shared';

export class RoboticsControlService {
  constructor(private repo: IRoboticsRepository) {}

  public async registerRobot(userId: string, dto: CreateRobotDto): Promise<RobotDto> {
    return this.repo.registerRobot(userId, dto);
  }

  public async listRobots(userId: string): Promise<RobotDto[]> {
    return this.repo.listRobots(userId);
  }

  public async getRobot(id: string): Promise<RobotDto | null> {
    return this.repo.getRobot(id);
  }

  public async updateStatus(id: string, status: RobotStatus, batteryPercent?: number): Promise<RobotDto> {
    return this.repo.updateRobotStatus(id, status, batteryPercent);
  }
}
