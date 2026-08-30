import { pgTable, text, timestamp, uuid, integer, doublePrecision, boolean, jsonb } from 'drizzle-orm/pg-core';
import {
  ClusterRegion,
  ClusterStatus,
  ComputeNodeType,
  ComputeNodeStatus,
  DeploymentStatus,
  WorkloadType,
} from '@codeforge/shared';
import {
  clusterRegionEnum,
  clusterStatusEnum,
  computeNodeTypeEnum,
  computeNodeStatusEnum,
  deploymentStatusEnum,
  workloadTypeEnum,
} from './enums';

// 1. Cloud Clusters Table
export const cloudClusters = pgTable('cloud_clusters', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  region: clusterRegionEnum('region').notNull(),
  status: clusterStatusEnum('status').default(ClusterStatus.HEALTHY).notNull(),
  totalGpus: integer('total_gpus').default(0).notNull(),
  availableGpus: integer('available_gpus').default(0).notNull(),
  totalMemoryGb: integer('total_memory_gb').default(0).notNull(),
  availableMemoryGb: integer('available_memory_gb').default(0).notNull(),
  totalCpuCores: integer('total_cpu_cores').default(0).notNull(),
  availableCpuCores: integer('available_cpu_cores').default(0).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// 2. Compute Nodes Table
export const computeNodes = pgTable('compute_nodes', {
  id: uuid('id').defaultRandom().primaryKey(),
  clusterId: uuid('cluster_id')
    .notNull()
    .references(() => cloudClusters.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  nodeType: computeNodeTypeEnum('node_type').notNull(),
  status: computeNodeStatusEnum('status').default(ComputeNodeStatus.IDLE).notNull(),
  gpuUtilizationPercent: doublePrecision('gpu_utilization_percent').default(0).notNull(),
  memoryUtilizationPercent: doublePrecision('memory_utilization_percent').default(0).notNull(),
  cpuUtilizationPercent: doublePrecision('cpu_utilization_percent').default(0).notNull(),
  temperatureCelsius: doublePrecision('temperature_celsius').default(0).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// 3. Cloud Deployments Table
export const cloudDeployments = pgTable('cloud_deployments', {
  id: uuid('id').defaultRandom().primaryKey(),
  clusterId: uuid('cluster_id')
    .notNull()
    .references(() => cloudClusters.id, { onDelete: 'cascade' }),
  nodeId: uuid('node_id')
    .references(() => computeNodes.id, { onDelete: 'set null' }),
  workloadType: workloadTypeEnum('workload_type').notNull(),
  status: deploymentStatusEnum('status').default(DeploymentStatus.QUEUED).notNull(),
  replicaCount: integer('replica_count').default(1).notNull(),
  cpuLimit: doublePrecision('cpu_limit').default(1).notNull(),
  memoryLimitGb: doublePrecision('memory_limit_gb').default(1).notNull(),
  gpuLimit: integer('gpu_limit').default(0).notNull(),
  simulatedCostUsdPerHour: doublePrecision('simulated_cost_usd_per_hour').default(0).notNull(),
  logs: jsonb('logs').$type<string[]>().default([]).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// 4. Inference Requests Table
export const inferenceRequests = pgTable('inference_requests', {
  id: uuid('id').defaultRandom().primaryKey(),
  deploymentId: uuid('deployment_id')
    .notNull()
    .references(() => cloudDeployments.id, { onDelete: 'cascade' }),
  promptTokens: integer('prompt_tokens').default(0).notNull(),
  completionTokens: integer('completion_tokens').default(0).notNull(),
  latencyMs: doublePrecision('latency_ms').default(0).notNull(),
  statusCode: integer('status_code').default(200).notNull(),
  routedRegion: clusterRegionEnum('routed_region').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// 5. Resource Metrics Table
export const resourceMetrics = pgTable('resource_metrics', {
  id: uuid('id').defaultRandom().primaryKey(),
  clusterId: uuid('cluster_id')
    .notNull()
    .references(() => cloudClusters.id, { onDelete: 'cascade' }),
  timestamp: timestamp('timestamp', { withTimezone: true }).defaultNow().notNull(),
  cpuUsagePercent: doublePrecision('cpu_usage_percent').default(0).notNull(),
  memoryUsagePercent: doublePrecision('memory_usage_percent').default(0).notNull(),
  gpuUsagePercent: doublePrecision('gpu_usage_percent').default(0).notNull(),
  networkInboundGbps: doublePrecision('network_inbound_gbps').default(0).notNull(),
  networkOutboundGbps: doublePrecision('network_outbound_gbps').default(0).notNull(),
  estimatedCostUsd: doublePrecision('estimated_cost_usd').default(0).notNull(),
});
