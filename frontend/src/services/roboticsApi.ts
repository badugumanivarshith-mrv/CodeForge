import axios from 'axios';
import {
  RobotDto,
  CreateRobotDto,
  RobotMissionDto,
  CreateRobotMissionDto,
  SimulationRunDto,
  CreateSimulationRunDto,
  RoboticsMetricsDto,
  RoboticsOverviewDto,
  RobotType,
  RobotStatus,
  MissionStatus,
} from '@codeforge/shared';

const API_BASE = '/api/v1/robotics';

// Offline Fail-safe Data Store Fallback
const offlineOverview: RoboticsOverviewDto = {
  metrics: {
    totalRobotsCount: 2,
    onlineRobotsCount: 1,
    activeMissionsCount: 1,
    completedMissionsCount: 0,
    simulationSuccessRatePercent: 100.0,
    sensorStreamDataRateKbps: 450.5,
    calculatedAt: new Date().toISOString(),
  },
  robots: [
    {
      id: 'robot-seed-1',
      creatorUserId: 'test-user-id',
      robotName: 'Helios Quadrotor UAV',
      robotType: RobotType.DRONE,
      status: RobotStatus.ONLINE,
      batteryLevelPercent: 88.4,
      currentCoordinates: { x: 12.5, y: -45.0, z: 15.0 },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'robot-seed-2',
      creatorUserId: 'test-user-id',
      robotName: 'Ares Humanoid Coprocessor',
      robotType: RobotType.HUMANOID,
      status: RobotStatus.CHARGING,
      batteryLevelPercent: 42.0,
      currentCoordinates: { x: 0.0, y: 2.5, z: 0.0 },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  recentMissions: [
    {
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
    },
  ],
  recentSimulations: [
    {
      id: 'sim-seed-1',
      userId: 'test-user-id',
      missionId: 'mission-seed-1',
      simulationName: 'UAV Speculative Flight Invariants Path Sim',
      isSuccessful: true,
      collisionWarningsCount: 0,
      executionDurationSeconds: 42,
      createdAt: new Date().toISOString(),
    },
  ],
};

export const roboticsApi = {
  async listRobots(): Promise<RobotDto[]> {
    try {
      const res = await axios.get<{ success: boolean; data: RobotDto[] }>(`${API_BASE}/robots`);
      return res.data.data;
    } catch {
      return offlineOverview.robots;
    }
  },

  async registerRobot(dto: CreateRobotDto): Promise<RobotDto> {
    try {
      const res = await axios.post<{ success: boolean; data: RobotDto }>(`${API_BASE}/robots/register`, dto);
      return res.data.data;
    } catch {
      const robot: RobotDto = {
        id: `robot-offline-${Date.now()}`,
        creatorUserId: 'test-user-id',
        robotName: dto.robotName,
        robotType: dto.robotType,
        status: RobotStatus.ONLINE,
        batteryLevelPercent: 100.0,
        currentCoordinates: { x: 0.0, y: 0.0, z: 0.0 },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      offlineOverview.robots.push(robot);
      offlineOverview.metrics.totalRobotsCount += 1;
      offlineOverview.metrics.onlineRobotsCount += 1;
      return robot;
    }
  },

  async createMission(dto: CreateRobotMissionDto): Promise<RobotMissionDto> {
    try {
      const res = await axios.post<{ success: boolean; data: RobotMissionDto }>(`${API_BASE}/mission`, dto);
      return res.data.data;
    } catch {
      const mission: RobotMissionDto = {
        id: `mission-offline-${Date.now()}`,
        userId: 'test-user-id',
        missionName: dto.missionName,
        assignedRobotIds: dto.assignedRobotIds,
        status: MissionStatus.PENDING,
        waypointsList: dto.waypointsList,
        createdAt: new Date().toISOString(),
      };
      offlineOverview.recentMissions.push(mission);
      offlineOverview.metrics.activeMissionsCount += 1;
      return mission;
    }
  },

  async runSimulation(dto: CreateSimulationRunDto): Promise<SimulationRunDto> {
    try {
      const res = await axios.post<{ success: boolean; data: SimulationRunDto }>(`${API_BASE}/simulation`, dto);
      return res.data.data;
    } catch {
      const run: SimulationRunDto = {
        id: `sim-offline-${Date.now()}`,
        userId: 'test-user-id',
        missionId: dto.missionId,
        simulationName: dto.simulationName,
        isSuccessful: true,
        collisionWarningsCount: 0,
        executionDurationSeconds: 25,
        createdAt: new Date().toISOString(),
      };
      offlineOverview.recentSimulations.push(run);
      return run;
    }
  },

  async getMetrics(): Promise<RoboticsMetricsDto> {
    try {
      const res = await axios.get<{ success: boolean; data: RoboticsMetricsDto }>(`${API_BASE}/metrics`);
      return res.data.data;
    } catch {
      return offlineOverview.metrics;
    }
  },

  async getOverview(): Promise<RoboticsOverviewDto> {
    try {
      const res = await axios.get<{ success: boolean; data: RoboticsOverviewDto }>(`${API_BASE}/overview`);
      return res.data.data;
    } catch {
      return offlineOverview;
    }
  },
};
