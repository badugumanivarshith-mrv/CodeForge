import { test, describe } from 'node:test';
import assert from 'node:assert';
import { AuthService } from '../../src/services/auth.service';
import { LmsService } from '../../src/modules/lms/lmsService';
import { CertificationService } from '../../src/modules/lms/certificationService';
import { CourseLevel, CourseStatus, CourseEnrollmentStatus, CertificationStatus } from '@codeforge/shared';

describe('Enterprise LMS & Certification Engine Integration Tests', () => {
  const authService = new AuthService();
  const lmsService = new LmsService();
  const certService = new CertificationService();

  let learnerUserId = '';
  let testCourseId = '';
  let testEnrollmentId = '';
  let issuedCertId = '';
  let issuedCertHash = '';
  let issuedCertNumber = '';

  test('Setup: Create student learner for course enrollment & certification', async () => {
    const unique = Date.now();
    const u = await authService.register({
      email: `learner_lms_${unique}@codeforge.dev`,
      username: `learner_lms_${unique}`,
      password: 'StrongPassword123!',
      fullName: 'Priya Patel',
    });
    learnerUserId = u.user.id;
    assert.ok(learnerUserId);
  });

  test('1. Create LMS course and author curriculum module sequence', async () => {
    const unique = Date.now();
    const course = await lmsService.createCourse({
      title: `Scalable Microservices Architecture ${unique}`,
      description: 'Production design with gRPC, Docker, and Kafka message brokers.',
      level: CourseLevel.ADVANCED,
      price: 0,
      status: CourseStatus.PUBLISHED,
    });

    assert.ok(course);
    assert.ok(course.id);
    assert.strictEqual(course.level, CourseLevel.ADVANCED);
    testCourseId = course.id;

    const mod1 = await lmsService.addModule(testCourseId, {
      title: 'gRPC Protocol Buffers & High-Speed Serialization',
      durationMinutes: 75,
      sequence: 1,
    });

    assert.ok(mod1);
    assert.strictEqual(mod1.courseId, testCourseId);
    assert.strictEqual(mod1.sequence, 1);

    const modules = await lmsService.listModules(testCourseId);
    assert.ok(modules.length >= 1);
  });

  test('2. Enroll learner in course and track learning progress', async () => {
    const enrollment = await lmsService.enroll(learnerUserId, testCourseId);

    assert.ok(enrollment);
    assert.strictEqual(enrollment.userId, learnerUserId);
    assert.strictEqual(enrollment.courseId, testCourseId);
    assert.strictEqual(enrollment.progressPercentage, 0);
    assert.strictEqual(enrollment.status, CourseEnrollmentStatus.ENROLLED);
    testEnrollmentId = enrollment.id;

    // Update progress to 50%
    const inProgress = await lmsService.updateProgress(testEnrollmentId, 50);
    assert.ok(inProgress);
    assert.strictEqual(inProgress.progressPercentage, 50);
    assert.strictEqual(inProgress.status, CourseEnrollmentStatus.IN_PROGRESS);

    // Complete course (100%)
    const completed = await lmsService.updateProgress(testEnrollmentId, 100);
    assert.ok(completed);
    assert.strictEqual(completed.progressPercentage, 100);
    assert.strictEqual(completed.status, CourseEnrollmentStatus.COMPLETED);
    assert.ok(completed.completedAt);
  });

  test('3. Create and list role-based Career Learning Path', async () => {
    const unique = Date.now();
    const path = await lmsService.createLearningPath({
      title: `Staff Backend Systems Engineer Track ${unique}`,
      targetRole: 'Staff Distributed Systems Engineer',
      description: 'Comprehensive 4-stage track to master scalable distributed architectures.',
      estimatedHours: 80,
      courseIds: [testCourseId],
    });

    assert.ok(path);
    assert.strictEqual(path.targetRole, 'Staff Distributed Systems Engineer');
    assert.strictEqual(path.estimatedHours, 80);

    const paths = await lmsService.listLearningPaths();
    assert.ok(paths.some(p => p.id === path.id));
  });

  test('4. Create digital certificate template and issue verifiable credential', async () => {
    const template = await certService.createTemplate({
      name: 'Certified Distributed Systems Engineer',
      issuerName: 'CodeForge Enterprise Academy',
      criteriaJson: { minScore: 85, proctored: true },
    });

    assert.ok(template);
    assert.strictEqual(template.issuerName, 'CodeForge Enterprise Academy');

    const cert = await certService.issueCertificate({
      recipientUserId: learnerUserId,
      courseId: testCourseId,
      templateId: template.id,
      skillName: 'Distributed Systems & Fault Tolerant Architecture',
      score: 98,
      expiresInDays: 365,
    });

    assert.ok(cert);
    assert.ok(cert.id);
    assert.ok(cert.certificateNumber.startsWith('CF-CERT-'));
    assert.ok(cert.verificationHash);
    assert.ok(cert.qrCodeUrl.includes(cert.verificationHash));
    assert.strictEqual(cert.score, 98);
    assert.strictEqual(cert.status, CertificationStatus.ACTIVE);

    issuedCertId = cert.id;
    issuedCertHash = cert.verificationHash;
    issuedCertNumber = cert.certificateNumber;
  });

  test('5. Public cryptographic verification of certificate via SHA-256 hash & cert number', async () => {
    // Verify via hash
    const resultByHash = await certService.verifyCertificate(issuedCertHash, '127.0.0.1', 'Mozilla/5.0');
    assert.ok(resultByHash);
    assert.strictEqual(resultByHash.isValid, true);
    assert.ok(resultByHash.certificate);
    assert.strictEqual(resultByHash.certificate.id, issuedCertId);

    // Verify via certificate number
    const resultByNum = await certService.verifyCertificate(issuedCertNumber, '127.0.0.1', 'Mozilla/5.0');
    assert.ok(resultByNum);
    assert.strictEqual(resultByNum.isValid, true);

    // Invalid hash verification
    const invalidResult = await certService.verifyCertificate('fake_tampered_hash_123456');
    assert.strictEqual(invalidResult.isValid, false);
    assert.ok(invalidResult.reason);
  });

  test('6. List user earned certifications', async () => {
    const certs = await certService.listUserCertificates(learnerUserId);
    assert.ok(Array.isArray(certs));
    assert.ok(certs.some(c => c.id === issuedCertId));
  });

  test('7. Revoke certificate and verify subsequent verification fails', async () => {
    const revoked = await certService.revokeCertificate(issuedCertId);
    assert.strictEqual(revoked, true);

    const checkResult = await certService.verifyCertificate(issuedCertHash);
    assert.strictEqual(checkResult.isValid, false);
    assert.ok(checkResult.reason?.includes('revoked'));
  });
});
