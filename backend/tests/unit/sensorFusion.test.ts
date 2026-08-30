import { test, describe } from 'node:test';
import assert from 'node:assert';
import { SensorFusionService } from '../../src/modules/robotics/sensorFusionService';
import { RoboticsRepository } from '../../src/repositories/RoboticsRepository';

describe('Phase 30: Robotics Sensor Fusion Service Unit Tests', () => {
  const repo = new RoboticsRepository();
  const service = new SensorFusionService(repo);

  test('should ingest sensor stream telemetry and updates robot coordinates', async () => {
    const stream = await service.logTelemetry({
      robotId: 'robot-seed-1',
      sensorType: 'lidar',
      telemetryPayload: {
        pointsScannedCount: 2500,
        velocityVec: { x: 15.0, y: -40.0, z: 12.0 },
      },
    });

    assert.ok(stream.id);
    assert.strictEqual(stream.sensorType, 'lidar');

    const robot = await repo.getRobot('robot-seed-1');
    assert.ok(robot);
    assert.strictEqual(robot.currentCoordinates.x, 15.0);
    assert.strictEqual(robot.currentCoordinates.y, -40.0);
    assert.strictEqual(robot.currentCoordinates.z, 12.0);

    const history = await service.getSensorData('robot-seed-1');
    assert.ok(history.length > 0);
  });
});
