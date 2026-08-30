import { test, describe } from 'node:test';
import assert from 'node:assert';
import { MissionPlanningService } from '../../src/modules/robotics/missionPlanningService';
import { RoboticsRepository } from '../../src/repositories/RoboticsRepository';
import { MissionStatus } from '@codeforge/shared';

describe('Phase 30: Robotics Mission Planning Service Unit Tests', () => {
  const repo = new RoboticsRepository();
  const service = new MissionPlanningService(repo);

  test('should plan missions with coordinates waypoints', async () => {
    const mission = await service.planMission('test-user-id', {
      missionName: 'Warehouse Spatial Invariant Sweep',
      assignedRobotIds: ['robot-seed-1'],
      waypointsList: [
        { x: 10.0, y: 15.0, z: 0.0, actionDescription: 'Perform visual pose check' },
        { x: 20.0, y: 25.0, z: 1.2, actionDescription: 'Confirm telemetry' },
      ],
    });

    assert.ok(mission.id);
    assert.strictEqual(mission.missionName, 'Warehouse Spatial Invariant Sweep');
    assert.strictEqual(mission.status, MissionStatus.PENDING);
  });

  test('should list planned missions and update status', async () => {
    const list = await service.fetchUserMissions('test-user-id');
    assert.ok(list.length > 0);

    const updated = await service.updateMissionState('mission-seed-1', MissionStatus.COMPLETED);
    assert.strictEqual(updated.status, MissionStatus.COMPLETED);
    assert.ok(updated.completedAt);
  });
});
