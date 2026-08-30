import { IRoboticsRepository } from '../../repositories/interfaces/IRoboticsRepository';
import { SensorStreamDto, CreateSensorStreamDto } from '@codeforge/shared';

export class SensorFusionService {
  constructor(private repo: IRoboticsRepository) {}

  public async logTelemetry(dto: CreateSensorStreamDto): Promise<SensorStreamDto> {
    const stream = await this.repo.logSensorStream(dto);
    // Speculative kinematics drift calculation
    if (dto.telemetryPayload.velocityVec) {
      const vec = dto.telemetryPayload.velocityVec;
      const x = Number(vec.x ?? 0);
      const y = Number(vec.y ?? 0);
      const z = Number(vec.z ?? 0);
      await this.repo.updateRobotCoordinates(dto.robotId, x, y, z);
    }
    return stream;
  }

  public async getSensorData(robotId: string): Promise<SensorStreamDto[]> {
    return this.repo.listSensorStreams(robotId);
  }
}
