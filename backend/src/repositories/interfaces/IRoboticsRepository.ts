import {
  RobotDto,
  CreateRobotDto,
  RobotMissionDto,
  CreateRobotMissionDto,
  SensorStreamDto,
  CreateSensorStreamDto,
  SimulationRunDto,
  CreateSimulationRunDto,
  RoboticsMetricsDto,
  RoboticsOverviewDto,
  RobotStatus,
  MissionStatus,
} from '@codeforge/shared';

export interface IRoboticsRepository {
  registerRobot(userId: string, dto: CreateRobotDto): Promise<RobotDto>;
  listRobots(userId: string): Promise<RobotDto[]>;
  getRobot(id: string): Promise<RobotDto | null>;
  updateRobotStatus(id: string, status: RobotStatus, batteryLevelPercent?: number): Promise<RobotDto>;
  updateRobotCoordinates(id: string, x: number, y: number, z: number): Promise<RobotDto>;

  createMission(userId: string, dto: CreateRobotMissionDto): Promise<RobotMissionDto>;
  getMission(id: string): Promise<RobotMissionDto | null>;
  listMissions(userId: string): Promise<RobotMissionDto[]>;
  updateMissionStatus(id: string, status: MissionStatus): Promise<RobotMissionDto>;

  logSensorStream(dto: CreateSensorStreamDto): Promise<SensorStreamDto>;
  listSensorStreams(robotId: string): Promise<SensorStreamDto[]>;

  createSimulationRun(userId: string, dto: CreateSimulationRunDto): Promise<SimulationRunDto>;
  listSimulationRuns(userId: string): Promise<SimulationRunDto[]>;

  getOverview(userId: string): Promise<RoboticsOverviewDto>;
  getMetrics(userId: string): Promise<RoboticsMetricsDto>;
}
