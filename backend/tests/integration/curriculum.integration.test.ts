import { test, describe } from 'node:test';
import assert from 'node:assert';
import {
  CurriculumRepository,
  ProblemRepository,
  QuizRepository,
  ProgressRepository,
} from '../../src/repositories';
import { CurriculumService } from '../../src/services';
import { LanguageId } from '@codeforge/shared';

describe('Curriculum Integration Tests', () => {
  const curriculumRepo = new CurriculumRepository();
  const problemRepo = new ProblemRepository();
  const quizRepo = new QuizRepository();
  const progressRepo = new ProgressRepository();

  const curriculumService = new CurriculumService(
    curriculumRepo,
    problemRepo,
    quizRepo,
    progressRepo,
  );

  test('1. Get all active Tier-1 languages', async () => {
    const languages = await curriculumService.getAllLanguages();
    assert.strictEqual(languages.length, 6);
    const slugs = languages.map(l => l.slug);
    assert.ok(slugs.includes('python'));
    assert.ok(slugs.includes('javascript'));
    assert.ok(slugs.includes('typescript'));
    assert.ok(slugs.includes('java'));
    assert.ok(slugs.includes('c'));
    assert.ok(slugs.includes('cpp'));
  });

  test('2. Get Python language roadmap (10 sequenced topics)', async () => {
    const roadmap = await curriculumService.getLanguageRoadmap('python');
    assert.ok(roadmap.language);
    assert.strictEqual(roadmap.language.id, LanguageId.PYTHON);
    assert.strictEqual(roadmap.topics.length, 10);
    assert.strictEqual(roadmap.topics[0].sequence, 1);
    assert.strictEqual(roadmap.topics[0].title, 'Syntax & Literals');
    assert.strictEqual(roadmap.topics[0].isUnlocked, true);
  });

  test('3. Get Topic detail for python-syntax-literals', async () => {
    const detail = await curriculumService.getTopicDetail('python', 'python-syntax-literals');
    assert.ok(detail.topic);
    assert.strictEqual(detail.topic.slug, 'python-syntax-literals');
    assert.ok(detail.lessons.length >= 1);
    assert.ok(detail.quiz !== null);
    assert.ok(detail.problems.length >= 1);
  });

  test('4. Get Lesson detail with MDX sections and code examples', async () => {
    const topicDetail = await curriculumService.getTopicDetail('python', 'python-syntax-literals');
    assert.ok(topicDetail.lessons.length > 0);

    const lessonId = topicDetail.lessons[0].id;
    const lessonDetail = await curriculumService.getLessonDetail(lessonId);

    assert.ok(lessonDetail);
    assert.strictEqual(lessonDetail.lesson.id, lessonId);
    assert.ok(lessonDetail.sections.length > 0);
    assert.ok(lessonDetail.sections[0].contentMdx.length > 10);
    assert.ok(lessonDetail.examples.length > 0);
    assert.ok(lessonDetail.examples[0].codeTemplate.length > 5);
  });
});
