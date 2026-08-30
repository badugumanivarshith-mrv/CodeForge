import { test, describe } from 'node:test';
import assert from 'node:assert';
import { AnalyticsEngineService } from '../../src/modules/data-intelligence/analyticsEngineService';
import { DataIntelligenceRepository } from '../../src/repositories/DataIntelligenceRepository';
import { AnalyticsJobStatus } from '@codeforge/shared';

describe('Phase 27: Analytics Engine Service Unit Tests', () => {
  const repo = new DataIntelligenceRepository();
  const engineService = new AnalyticsEngineService(repo);

  test('should trigger and run analytics job successfully', async () => {
    const job = await engineService.triggerJob({
      sourceId: 'source-seed-1',
      jobName: 'Cluster Inference Check',
    });

    assert.ok(job.id);
    assert.strictEqual(job.jobName, 'Cluster Inference Check');
    assert.strictEqual(job.status, AnalyticsJobStatus.SUCCESS);
    assert.ok(job.executionTimeMs >= 0);
  });

  test('should fetch single job by ID', async () => {
    const job = await engineService.getJob('job-seed-1');
    assert.ok(job);
    assert.strictEqual(job.jobName, 'Weekly Active Users Cohort Aggregation');
  });

  test('should list all executed analytics jobs', async () => {
    const jobs = await engineService.listJobs();
    assert.ok(jobs.length >= 1);
  });
});
