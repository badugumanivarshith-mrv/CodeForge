import { pgTable, uuid, varchar, timestamp, jsonb, doublePrecision, integer, boolean } from 'drizzle-orm/pg-core';
import { users } from './users';
import { robotTypeEnum, robotStatusEnum, missionStatusEnum } from './enums';

export const robots = pgTable('robots', {
  id: uuid('id').defaultRandom().primaryKey(),
  creatorUserId: uuid('creator_user_id').references(() => users.id).notNull(),
  robotName: varchar('robot_name', { length: 255 }).notNull(),
  robotType: robotTypeEnum('robot_type').notNull(),
  status: robotStatusEnum('robot_status').notNull(),
  batteryLevelPercent: doublePrecision('battery_level_percent').default(100.0).notNull(),
  currentCoordinates: jsonb('current_coordinates').default({ x: 0.0, y: 0.0, z: 0.0 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const missions = pgTable('missions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  missionName: varchar('mission_name', { length: 255 }).notNull(),
  assignedRobotIds: jsonb('assigned_robot_ids').default([]).notNull(), // array of strings/uuids
  status: missionStatusEnum('status').notNull(),
  waypointsList: jsonb('waypoints_list').default([]).notNull(), // array of waypoints objects
  createdAt: timestamp('created_at').defaultNow().notNull(),
  completedAt: timestamp('completed_at'),
});

export const sensorStreams = pgTable('sensor_streams', {
  id: uuid('id').defaultRandom().primaryKey(),
  robotId: uuid('robot_id').references(() => robots.id).notNull(),
  sensorType: varchar('sensor_type', { length: 50 }).notNull(), // 'lidar' | 'camera' | 'imu' | 'sonar'
  telemetryPayload: jsonb('telemetry_payload').default({}).notNull(),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
});

export const simulationRuns = pgTable('simulation_runs', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  missionId: uuid('mission_id').references(() => missions.id),
  simulationName: varchar('simulation_name', { length: 255 }).notNull(),
  isSuccessful: boolean('is_successful').default(true).notNull(),
  collisionWarningsCount: integer('collision_warnings_count').default(0).notNull(),
  executionDurationSeconds: integer('execution_duration_seconds').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
