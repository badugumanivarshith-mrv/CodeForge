import { IRoboticsRepository } from '../../repositories/interfaces/IRoboticsRepository';
import { RobotMissionDto, CreateRobotMissionDto, MissionStatus } from '@codeforge/shared';

export class MissionPlanningService {
  constructor(private repo: IRoboticsRepository) {}

  public async planMission(userId: string, dto: CreateRobotMissionDto): Promise<RobotMissionDto> {
    return this.repo.createMission(userId, dto);
  }

  public async fetchMission(id: string): Promise<RobotMissionDto | null> {
    return this.repo.getMission(id);
  }

  public async fetchUserMissions(userId: string): Promise<RobotMissionDto[]> {
    return this.repo.listMissions(userId);
  }

  public async updateMissionState(id: string, status: MissionStatus): Promise<RobotMissionDto> {
    return this.repo.updateMissionStatus(id, status);
  }
}
