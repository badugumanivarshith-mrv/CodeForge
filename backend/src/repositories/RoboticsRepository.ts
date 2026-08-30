import { IRoboticsRepository } from './interfaces/IRoboticsRepository';
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
  RobotType,
  RobotStatus,
  MissionStatus,
} from '@codeforge/shared';

export class RoboticsRepository implements IRoboticsRepository {
  private robotsMap = new Map<string, RobotDto>();
  private missionsMap = new Map<string, RobotMissionDto>();
  private streamsList: SensorStreamDto[] = [];
  private simulationsList: SimulationRunDto[] = [];

  constructor() {
    this.seedDefaultData();
  }

  private seedDefaultData() {
    const robot1: RobotDto = {
      id: 'robot-seed-1',
      creatorUserId: 'test-user-id',
      robotName: 'Helios Quadrotor UAV',
      robotType: RobotType.DRONE,
      status: RobotStatus.ONLINE,
      batteryLevelPercent: 88.4,
      currentCoordinates: { x: 12.5, y: -45.0, z: 15.0 },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const robot2: RobotDto = {
      id: 'robot-seed-2',
      creatorUserId: 'test-user-id',
      robotName: 'Ares Humanoid Coprocessor',
      robotType: RobotType.HUMANOID,
      status: RobotStatus.CHARGING,
      batteryLevelPercent: 42.0,
      currentCoordinates: { x: 0.0, y: 2.5, z: 0.0 },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.robotsMap.set(robot1.id, robot1);
    this.robotsMap.set(robot2.id, robot2);

    const mission1: RobotMissionDto = {
      id: 'mission-seed-1',
      userId: 'test-user-id',
      missionName: 'Planetary Invariant Assessment Mapping',
      assignedRobotIds: ['robot-seed-1'],
      status: MissionStatus.EXECUTING,
      waypointsList: [
        { x: 10.0, y: -40.0, z: 15.0, actionDescription: 'Ingest LIDAR frames scan' },
        { x: 15.0, y: -50.0, z: 15.0, actionDescription: 'Perform visual pose check' },
      ],
      createdAt: new Date().toISOString(),
    };

    this.missionsMap.set(mission1.id, mission1);

    const stream1: SensorStreamDto = {
      id: 'stream-seed-1',
      robotId: 'robot-seed-1',
      sensorType: 'lidar',
      telemetryPayload: { pointCount: 154000, maxRangeMeters: 120 },
      timestamp: new Date().toISOString(),
    };

    this.streamsList.push(stream1);

    const sim1: SimulationRunDto = {
      id: 'sim-seed-1',
      userId: 'test-user-id',
      missionId: 'mission-seed-1',
      simulationName: 'UAV Speculative Flight Invariants Path Sim',
      isSuccessful: true,
      collisionWarningsCount: 0,
      executionDurationSeconds: 42,
      createdAt: new Date().toISOString(),
    };

    this.simulationsList.push(sim1);
  }

  public async registerRobot(userId: string, dto: CreateRobotDto): Promise<RobotDto> {
    const robot: RobotDto = {
      id: `robot-${Date.now()}`,
      creatorUserId: userId,
      robotName: dto.robotName,
      robotType: dto.robotType,
      status: RobotStatus.ONLINE,
      batteryLevelPercent: 100.0,
      currentCoordinates: { x: 0.0, y: 0.0, z: 0.0 },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.robotsMap.set(robot.id, robot);
    return robot;
  }

  public async listRobots(userId: string): Promise<RobotDto[]> {
    return Array.from(this.robotsMap.values()).filter((r) => r.creatorUserId === userId);
  }

  public async getRobot(id: string): Promise<RobotDto | null> {
    return this.robotsMap.get(id) || null;
  }

  public async updateRobotStatus(id: string, status: RobotStatus, batteryLevelPercent?: number): Promise<RobotDto> {
    const robot = this.robotsMap.get(id);
    if (!robot) throw new Error(`Robot with ID ${id} not found.`);
    robot.status = status;
    if (batteryLevelPercent !== undefined) {
      robot.batteryLevelPercent = batteryLevelPercent;
    }
    robot.updatedAt = new Date().toISOString();
    this.robotsMap.set(id, robot);
    return robot;
  }

  public async updateRobotCoordinates(id: string, x: number, y: number, z: number): Promise<RobotDto> {
    const robot = this.robotsMap.get(id);
    if (!robot) throw new Error(`Robot with ID ${id} not found.`);
    robot.currentCoordinates = { x, y, z };
    robot.updatedAt = new Date().toISOString();
    this.robotsMap.set(id, robot);
    return robot;
  }

  public async createMission(userId: string, dto: CreateRobotMissionDto): Promise<RobotMissionDto> {
    const mission: RobotMissionDto = {
      id: `mission-${Date.now()}`,
      userId,
      missionName: dto.missionName,
      assignedRobotIds: dto.assignedRobotIds,
      status: MissionStatus.PENDING,
      waypointsList: dto.waypointsList,
      createdAt: new Date().toISOString(),
    };
    this.missionsMap.set(mission.id, mission);
    return mission;
  }

  public async getMission(id: string): Promise<RobotMissionDto | null> {
    return this.missionsMap.get(id) || null;
  }

  public async listMissions(userId: string): Promise<RobotMissionDto[]> {
    return Array.from(this.missionsMap.values()).filter((m) => m.userId === userId);
  }

  public async updateMissionStatus(id: string, status: MissionStatus): Promise<RobotMissionDto> {
    const mission = this.missionsMap.get(id);
    if (!mission) throw new Error(`Mission with ID ${id} not found.`);
    mission.status = status;
    if (status === MissionStatus.COMPLETED || status === MissionStatus.ABORTED) {
      mission.completedAt = new Date().toISOString();
    }
    this.missionsMap.set(id, mission);
    return mission;
  }

  public async logSensorStream(dto: CreateSensorStreamDto): Promise<SensorStreamDto> {
    const stream: SensorStreamDto = {
      id: `stream-${Date.now()}`,
      robotId: dto.robotId,
      sensorType: dto.sensorType,
      telemetryPayload: dto.telemetryPayload,
      timestamp: new Date().toISOString(),
    };
    this.streamsList.push(stream);
    return stream;
  }

  public async listSensorStreams(robotId: string): Promise<SensorStreamDto[]> {
    return this.streamsList.filter((s) => s.robotId === robotId);
  }

  public async createSimulationRun(userId: string, dto: CreateSimulationRunDto): Promise<SimulationRunDto> {
    const run: SimulationRunDto = {
      id: `sim-${Date.now()}`,
      userId,
      missionId: dto.missionId,
      simulationName: dto.simulationName,
      isSuccessful: Math.random() > 0.15,
      collisionWarningsCount: Math.floor(Math.random() * 4),
      executionDurationSeconds: Math.floor(Math.random() * 90) + 10,
      createdAt: new Date().toISOString(),
    };
    this.simulationsList.push(run);
    return run;
  }

  public async listSimulationRuns(userId: string): Promise<SimulationRunDto[]> {
    return this.simulationsList.filter((s) => s.userId === userId);
  }

  public async getOverview(userId: string): Promise<RoboticsOverviewDto> {
    const robots = await this.listRobots(userId);
    const recentMissions = await this.listMissions(userId);
    const recentSimulations = await this.listSimulationRuns(userId);
    const metrics = await this.getMetrics(userId);

    return {
      metrics,
      robots,
      recentMissions,
      recentSimulations,
    };
  }

  public async getMetrics(userId: string): Promise<RoboticsMetricsDto> {
    const robots = await this.listRobots(userId);
    const missions = await this.listMissions(userId);
    const simulations = await this.listSimulationRuns(userId);

    const onlineRobotsCount = robots.filter((r) => r.status === RobotStatus.ONLINE).length;
    const activeMissionsCount = missions.filter((m) => m.status === MissionStatus.EXECUTING).length;
    const completedMissionsCount = missions.filter((m) => m.status === MissionStatus.COMPLETED).length;

    const successfulSims = simulations.filter((s) => s.isSuccessful).length;
    const simSuccessRatePercent = simulations.length > 0 ? (successfulSims / simulations.length) * 100.0 : 100.0;

    return {
      totalRobotsCount: robots.length,
      onlineRobotsCount,
      activeMissionsCount,
      completedMissionsCount,
      simulationSuccessRatePercent: Number(simSuccessRatePercent.toFixed(1)),
      sensorStreamDataRateKbps: 450.5,
      calculatedAt: new Date().toISOString(),
    };
  }
}

export const roboticsRepository = new RoboticsRepository();
