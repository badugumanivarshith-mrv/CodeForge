import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ResearchUniversityRepository } from '../../src/repositories/ResearchUniversityRepository';
import { PeerReviewNetworkService } from '../../src/modules/research-university/peerReviewNetworkService';
import { PeerReviewRole, PeerReviewVerdict, PublicationStatus } from '@codeforge/shared';

describe('Phase 22: Autonomous Peer Review Network Unit Tests', () => {
  it('should conduct multi-agent rubric review and determine verdict', async () => {
    const repo = new ResearchUniversityRepository();
    const service = new PeerReviewNetworkService(repo);

    const review = await service.conductAutonomousReview(
      'pub-topological-invariance',
      PeerReviewRole.METHOD_REVIEWER
    );

    assert.ok(review);
    assert.ok(review.id);
    assert.strictEqual(review.publicationId, 'pub-topological-invariance');
    assert.strictEqual(review.reviewerRole, PeerReviewRole.METHOD_REVIEWER);
    assert.ok(review.overallScore >= 70.0);
    assert.ok(review.methodologyScore >= 80.0);
    assert.ok(review.soundnessScore >= 80.0);
    assert.ok(review.reproducibilityScore >= 85.0);
    assert.ok(review.strengths.length >= 2);
    assert.ok(review.weaknesses.length >= 1);
  });

  it('should calculate consensus across multiple peer review rounds', async () => {
    const repo = new ResearchUniversityRepository();
    const service = new PeerReviewNetworkService(repo);

    await service.conductAutonomousReview('pub-topological-invariance', PeerReviewRole.STATISTICAL_REVIEWER);
    await service.conductAutonomousReview('pub-topological-invariance', PeerReviewRole.DOMAIN_REVIEWER);

    const consensus = await service.getReviewConsensus('pub-topological-invariance');
    assert.ok(consensus);
    assert.strictEqual(consensus.publicationId, 'pub-topological-invariance');
    assert.ok(consensus.totalReviews >= 2);
    assert.ok(consensus.averageScore >= 75.0);
    assert.ok([PeerReviewVerdict.ACCEPT, PeerReviewVerdict.MINOR_REVISION].includes(consensus.finalConsensus));
  });
});
