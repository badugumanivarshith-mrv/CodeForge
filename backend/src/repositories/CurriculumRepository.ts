import { eq, and, asc } from 'drizzle-orm';
import { db } from '../database/connection';
import {
  languages,
  topics,
  lessons,
  lessonSections,
  learningExamples,
  userProgress,
} from '../database/schema';
import { ICurriculumRepository } from './interfaces/ICurriculumRepository';
import {
  LanguageDto,
  TopicDto,
  LessonDto,
  LessonDetailDto,
  LessonSectionDto,
  LearningExampleDto,
  LanguageId,
  TopicDifficulty,
  ContentStatus,
} from '@codeforge/shared';

export class CurriculumRepository implements ICurriculumRepository {
  public async getAllLanguages(): Promise<LanguageDto[]> {
    const rows = await db
      .select()
      .from(languages)
      .where(eq(languages.isActive, true))
      .orderBy(asc(languages.displayOrder));

    return rows.map(r => ({
      id: r.id as LanguageId,
      slug: r.slug,
      name: r.name,
      monacoId: r.monacoId,
      compilerId: r.compilerId,
      version: r.version,
      isActive: r.isActive,
      displayOrder: r.displayOrder,
    }));
  }

  public async getLanguageById(id: LanguageId): Promise<LanguageDto | null> {
    const [row] = await db
      .select()
      .from(languages)
      .where(eq(languages.id, id))
      .limit(1);

    if (!row) return null;
    return {
      id: row.id as LanguageId,
      slug: row.slug,
      name: row.name,
      monacoId: row.monacoId,
      compilerId: row.compilerId,
      version: row.version,
      isActive: row.isActive,
      displayOrder: row.displayOrder,
    };
  }

  public async getLanguageBySlug(slug: string): Promise<LanguageDto | null> {
    const normalizedSlug = slug.toLowerCase().trim();
    const [row] = await db
      .select()
      .from(languages)
      .where(eq(languages.slug, normalizedSlug))
      .limit(1);

    if (!row) return null;
    return {
      id: row.id as LanguageId,
      slug: row.slug,
      name: row.name,
      monacoId: row.monacoId,
      compilerId: row.compilerId,
      version: row.version,
      isActive: row.isActive,
      displayOrder: row.displayOrder,
    };
  }

  public async getTopicsByLanguage(languageId: LanguageId): Promise<TopicDto[]> {
    const rows = await db
      .select()
      .from(topics)
      .where(eq(topics.languageId, languageId))
      .orderBy(asc(topics.sequence));

    return rows.map(r => ({
      id: r.id,
      languageId: r.languageId as LanguageId,
      slug: r.slug,
      sequence: r.sequence,
      title: r.title,
      description: r.description,
      difficulty: r.difficulty as TopicDifficulty,
      estimatedHours: r.estimatedHours,
    }));
  }

  public async getTopicBySlug(languageId: LanguageId, slug: string): Promise<TopicDto | null> {
    const normalizedSlug = slug.toLowerCase().trim();
    const [row] = await db
      .select()
      .from(topics)
      .where(and(eq(topics.languageId, languageId), eq(topics.slug, normalizedSlug)))
      .limit(1);

    if (!row) return null;
    return {
      id: row.id,
      languageId: row.languageId as LanguageId,
      slug: row.slug,
      sequence: row.sequence,
      title: row.title,
      description: row.description,
      difficulty: row.difficulty as TopicDifficulty,
      estimatedHours: row.estimatedHours,
    };
  }

  public async getTopicById(topicId: string): Promise<TopicDto | null> {
    const [row] = await db.select().from(topics).where(eq(topics.id, topicId)).limit(1);
    if (!row) return null;
    return {
      id: row.id,
      languageId: row.languageId as LanguageId,
      slug: row.slug,
      sequence: row.sequence,
      title: row.title,
      description: row.description,
      difficulty: row.difficulty as TopicDifficulty,
      estimatedHours: row.estimatedHours,
    };
  }

  public async getLessonsByTopic(topicId: string): Promise<LessonDto[]> {
    const rows = await db
      .select()
      .from(lessons)
      .where(eq(lessons.topicId, topicId))
      .orderBy(asc(lessons.sequence));

    return rows.map(r => ({
      id: r.id,
      topicId: r.topicId,
      sequence: r.sequence,
      slug: r.slug,
      title: r.title,
      description: r.description,
      readTimeMinutes: r.readTimeMinutes,
      status: r.status as ContentStatus,
    }));
  }

  public async getLessonById(lessonId: string): Promise<LessonDto | null> {
    const [row] = await db.select().from(lessons).where(eq(lessons.id, lessonId)).limit(1);
    if (!row) return null;
    return {
      id: row.id,
      topicId: row.topicId,
      sequence: row.sequence,
      slug: row.slug,
      title: row.title,
      description: row.description,
      readTimeMinutes: row.readTimeMinutes,
      status: row.status as ContentStatus,
    };
  }

  public async getLessonDetail(lessonId: string): Promise<LessonDetailDto | null> {
    const [lessonRow] = await db.select().from(lessons).where(eq(lessons.id, lessonId)).limit(1);
    if (!lessonRow) return null;

    const [topicRow] = await db.select().from(topics).where(eq(topics.id, lessonRow.topicId)).limit(1);
    if (!topicRow) return null;

    const [langRow] = await db.select().from(languages).where(eq(languages.id, topicRow.languageId)).limit(1);
    if (!langRow) return null;

    // Fetch Sections
    const sectionRows = await db
      .select()
      .from(lessonSections)
      .where(eq(lessonSections.lessonId, lessonId))
      .orderBy(asc(lessonSections.sequence));

    // Fetch Examples
    const exampleRows = await db
      .select()
      .from(learningExamples)
      .where(eq(learningExamples.lessonId, lessonId))
      .orderBy(asc(learningExamples.sequence));

    // Find Previous and Next lessons in same topic
    const siblingLessons = await db
      .select({ id: lessons.id, sequence: lessons.sequence })
      .from(lessons)
      .where(eq(lessons.topicId, lessonRow.topicId))
      .orderBy(asc(lessons.sequence));

    const currentIndex = siblingLessons.findIndex(l => l.id === lessonId);
    const previousLessonId = currentIndex > 0 ? siblingLessons[currentIndex - 1].id : null;
    const nextLessonId =
      currentIndex >= 0 && currentIndex < siblingLessons.length - 1
        ? siblingLessons[currentIndex + 1].id
        : null;

    return {
      lesson: {
        id: lessonRow.id,
        topicId: lessonRow.topicId,
        sequence: lessonRow.sequence,
        slug: lessonRow.slug,
        title: lessonRow.title,
        description: lessonRow.description,
        readTimeMinutes: lessonRow.readTimeMinutes,
        status: lessonRow.status as ContentStatus,
      },
      topic: {
        id: topicRow.id,
        languageId: topicRow.languageId as LanguageId,
        slug: topicRow.slug,
        sequence: topicRow.sequence,
        title: topicRow.title,
        description: topicRow.description,
        difficulty: topicRow.difficulty as TopicDifficulty,
        estimatedHours: topicRow.estimatedHours,
      },
      language: {
        id: langRow.id as LanguageId,
        slug: langRow.slug,
        name: langRow.name,
        monacoId: langRow.monacoId,
        compilerId: langRow.compilerId,
        version: langRow.version,
        isActive: langRow.isActive,
        displayOrder: langRow.displayOrder,
      },
      sections: sectionRows.map(s => ({
        id: s.id,
        lessonId: s.lessonId,
        sequence: s.sequence,
        title: s.title,
        contentMdx: s.contentMdx,
        contentType: s.contentType as 'text' | 'code_sandbox' | 'video_callout' | 'quiz_checkpoint',
      })),
      examples: exampleRows.map(e => ({
        id: e.id,
        lessonId: e.lessonId,
        sequence: e.sequence,
        title: e.title,
        codeTemplate: e.codeTemplate,
        expectedOutput: e.expectedOutput,
        explanationMdx: e.explanationMdx,
      })),
      previousLessonId,
      nextLessonId,
      isCompleted: false, // Calculated by service based on auth user
    };
  }

  public async getUserCompletedLessonIds(userId: string): Promise<Set<string>> {
    const rows = await db
      .select({ lessonId: userProgress.lessonId })
      .from(userProgress)
      .where(and(eq(userProgress.userId, userId), eq(userProgress.isCompleted, true)));

    return new Set(rows.map(r => r.lessonId));
  }
}
