import { test, describe } from 'node:test';
import assert from 'node:assert';
import { RoboticsControlService } from '../../src/modules/robotics/roboticsControlService';
import { RoboticsRepository } from '../../src/repositories/RoboticsRepository';
import { RobotType, RobotStatus } from '@codeforge/shared';

describe('Phase 30: Robotics Control Service Unit Tests', () => {
  const repo = new RoboticsRepository();
  const service = new RoboticsControlService(repo);

  test('should register a new physical AI robot', async () => {
    const robot = await service.registerRobot('test-user-id', {
      robotName: 'Titan Bipedal Mech',
      robotType: RobotType.HUMANOID,
    });

    assert.ok(robot.id);
    assert.strictEqual(robot.robotName, 'Titan Bipedal Mech');
    assert.strictEqual(robot.robotType, RobotType.HUMANOID);
    assert.strictEqual(robot.status, RobotStatus.ONLINE);
  });

  test('should retrieve robots list and update status telemetry', async () => {
    const list = await service.listRobots('test-user-id');
    assert.ok(list.length > 0);

    const updated = await service.updateStatus('robot-seed-1', RobotStatus.CHARGING, 99.0);
    assert.strictEqual(updated.status, RobotStatus.CHARGING);
    assert.strictEqual(updated.batteryLevelPercent, 99.0);
  });
});
