import { test, describe } from 'node:test';
import assert from 'node:assert';
import { AuthService } from '../../src/services/auth.service';
import { UniversityService } from '../../src/modules/universities/universityService';
import { StudentPlacementStatus } from '@codeforge/shared';

describe('University Management & Student Placement Integration Tests', () => {
  const authService = new AuthService();
  const uniService = new UniversityService();

  let studentUserId = '';
  let testUniId = '';
  let testBatchId = '';
  let registeredStudentId = '';

  test('Setup: Create student user for university registration', async () => {
    const unique = Date.now();
    const u = await authService.register({
      email: `student_uni_${unique}@mit.edu`,
      username: `student_uni_${unique}`,
      password: 'StrongPassword123!',
      fullName: 'Vikram Sharma',
    });
    studentUserId = u.user.id;
    assert.ok(studentUserId);
  });

  test('1. Create university profile with ranking and accreditation', async () => {
    const unique = Date.now();
    const uni = await uniService.createUniversity({
      name: `Imperial Institute of Technology ${unique}`,
      website: 'https://iit-test.edu',
      state: 'Massachusetts',
      country: 'USA',
      accreditationGrade: 'A++',
      ranking: 5,
    });

    assert.ok(uni);
    assert.ok(uni.id);
    assert.ok(uni.slug);
    assert.strictEqual(uni.accreditationGrade, 'A++');
    testUniId = uni.id;
  });

  test('2. Create graduation batch under university', async () => {
    const batch = await uniService.createBatch(testUniId, {
      name: 'Class of 2026 - CS Specialization',
      graduationYear: 2026,
      totalStudents: 120,
    });

    assert.ok(batch);
    assert.strictEqual(batch.universityId, testUniId);
    assert.strictEqual(batch.graduationYear, 2026);
    testBatchId = batch.id;

    const batches = await uniService.listBatches(testUniId);
    assert.ok(batches.some(b => b.id === batch.id));
  });

  test('3. Register student profile with roll number and CGPA', async () => {
    const unique = Date.now().toString().slice(-4);
    const student = await uniService.registerStudent(studentUserId, {
      universityId: testUniId,
      batchId: testBatchId,
      studentRollNumber: `IIT-2026-${unique}`,
      cgpa: 9.15,
      semester: 6,
    });

    assert.ok(student);
    assert.strictEqual(student.userId, studentUserId);
    assert.strictEqual(student.universityId, testUniId);
    assert.strictEqual(student.studentRollNumber, `IIT-2026-${unique}`);
    assert.strictEqual(student.placementStatus, StudentPlacementStatus.UNPLACED);
    registeredStudentId = student.id;
  });

  test('4. Add and retrieve student academic records (SGPA, credits)', async () => {
    const record = await uniService.addAcademicRecord(registeredStudentId, {
      semester: 5,
      sgpa: 9.3,
      creditsCompleted: 24,
      backlogCount: 0,
    });

    assert.ok(record);
    assert.strictEqual(record.studentId, registeredStudentId);
    assert.strictEqual(record.semester, 5);
    assert.strictEqual(record.sgpa, 9.3);

    const records = await uniService.getAcademicRecords(registeredStudentId);
    assert.ok(records.length >= 1);
    assert.ok(records.some(r => r.id === record.id));
  });

  test('5. Record student placement offer and verify student status update', async () => {
    const placement = await uniService.recordPlacement({
      studentId: registeredStudentId,
      universityId: testUniId,
      companyName: 'Stripe Global',
      role: 'Software Development Engineer - Backend',
      packageLpa: 36.5,
      offerDate: new Date().toISOString(),
      status: 'accepted',
    });

    assert.ok(placement);
    assert.strictEqual(placement.studentId, registeredStudentId);
    assert.strictEqual(placement.packageLpa, 36.5);
    assert.strictEqual(placement.companyName, 'Stripe Global');

    // Verify student is now PLACED
    const updatedStudent = await uniService.getStudentById(registeredStudentId);
    assert.ok(updatedStudent);
    assert.strictEqual(updatedStudent.placementStatus, StudentPlacementStatus.PLACED);
  });

  test('6. Retrieve university analytics and verify placement KPIs', async () => {
    const analytics = await uniService.getUniversityAnalytics(testUniId);

    assert.ok(analytics);
    assert.strictEqual(analytics.universityId, testUniId);
    assert.ok(analytics.totalStudents >= 1);
    assert.ok(analytics.placedStudents >= 1);
    assert.ok(analytics.placementRatePercentage >= 50);
    assert.ok(analytics.highestPackageLpa >= 36.5);
    assert.ok(Array.isArray(analytics.departmentPerformance));
    assert.ok(Array.isArray(analytics.topHiringPartners));
  });
});
