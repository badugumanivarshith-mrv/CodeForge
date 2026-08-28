import { test, describe } from 'node:test';
import assert from 'node:assert';
import { AuthService } from '../../src/services/auth.service';
import { MentorService } from '../../src/modules/mentors/mentorService';
import { MentorSessionStatus } from '@codeforge/shared';

describe('Faculty & Mentor Ecosystem Integration Tests', () => {
  const authService = new AuthService();
  const mentorService = new MentorService();

  let mentorUserId = '';
  let menteeUserId = '';
  let registeredMentorId = '';
  let bookedSessionId = '';

  test('Setup: Create mentor and mentee test users', async () => {
    const unique = Date.now();
    const u1 = await authService.register({
      email: `faculty_prof_${unique}@university.edu`,
      username: `faculty_prof_${unique}`,
      password: 'StrongPassword123!',
      fullName: 'Prof. David Chen',
    });
    mentorUserId = u1.user.id;

    const u2 = await authService.register({
      email: `mentee_stud_${unique}@university.edu`,
      username: `mentee_stud_${unique}`,
      password: 'StrongPassword123!',
      fullName: 'Ananya Gupta',
    });
    menteeUserId = u2.user.id;

    assert.ok(mentorUserId);
    assert.ok(menteeUserId);
  });

  test('1. Register faculty mentor profile with specializations and hourly rate', async () => {
    const mentor = await mentorService.registerMentor(mentorUserId, {
      specialization: ['Distributed Systems', 'Go', 'High-Throughput Backends'],
      bio: 'Associate Professor of Computer Science & ex-Staff Infrastructure Engineer.',
      hourlyRate: 1500,
      isAvailable: true,
    });

    assert.ok(mentor);
    assert.strictEqual(mentor.userId, mentorUserId);
    assert.strictEqual(mentor.hourlyRate, 1500);
    assert.ok(mentor.specialization.includes('Distributed Systems'));
    registeredMentorId = mentor.id;
  });

  test('2. Retrieve mentor profile by ID and list all available mentors', async () => {
    const profile = await mentorService.getMentorById(registeredMentorId);
    assert.ok(profile);
    assert.strictEqual(profile.id, registeredMentorId);

    const mentors = await mentorService.listMentors();
    assert.ok(Array.isArray(mentors));
    assert.ok(mentors.some(m => m.id === registeredMentorId));
  });

  test('3. Book 1:1 mentorship session with scheduled timestamp and meeting URL', async () => {
    const sessionTime = new Date(Date.now() + 48 * 60 * 60 * 1000);
    const session = await mentorService.bookSession(menteeUserId, {
      mentorId: registeredMentorId,
      topic: 'Distributed Consensus & Raft Protocol Debugging',
      scheduledAt: sessionTime.toISOString(),
      durationMinutes: 45,
      notes: 'Need guidance preparing for Senior Backend interview.',
    });

    assert.ok(session);
    assert.strictEqual(session.mentorId, registeredMentorId);
    assert.strictEqual(session.menteeUserId, menteeUserId);
    assert.strictEqual(session.durationMinutes, 45);
    assert.strictEqual(session.status, MentorSessionStatus.SCHEDULED);
    assert.ok(session.meetingUrl);
    bookedSessionId = session.id;
  });

  test('4. List mentor sessions and verify query by mentor and mentee', async () => {
    const mentorSessions = await mentorService.listSessions(registeredMentorId);
    assert.ok(mentorSessions.some(s => s.id === bookedSessionId));

    const menteeSessions = await mentorService.listSessions(undefined, menteeUserId);
    assert.ok(menteeSessions.some(s => s.id === bookedSessionId));
  });

  test('5. Submit session review feedback and verify session status updated to COMPLETED', async () => {
    const updated = await mentorService.submitFeedback(bookedSessionId, {
      rating: 5,
      feedback: 'Outstanding mentorship! Deep insights into leader election and quorum replication.',
    });

    assert.ok(updated);
    assert.strictEqual(updated.id, bookedSessionId);
    assert.strictEqual(updated.status, MentorSessionStatus.COMPLETED);
    assert.strictEqual(updated.rating, 5);
    assert.ok(updated.feedback?.includes('Outstanding'));
  });

  test('6. Create long-term student mentorship with milestone goals', async () => {
    const mentorship = await mentorService.createMentorship(registeredMentorId, menteeUserId, [
      'Master Rust Concurrency',
      'Publish Open-Source Distributed Key-Value Store',
      'Crack FAANG Staff Level System Design Interview',
    ]);

    assert.ok(mentorship);
    assert.strictEqual(mentorship.mentorId, registeredMentorId);
    assert.ok(mentorship.studentId);
    assert.strictEqual(mentorship.status, 'active');
    assert.strictEqual(mentorship.goals.length, 3);
  });
});
