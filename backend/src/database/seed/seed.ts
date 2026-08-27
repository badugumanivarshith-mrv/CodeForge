import { db, queryClient } from '../connection';
import {
  languages,
  levels,
  achievements,
  topics,
  lessons,
  lessonSections,
  learningExamples,
  quizzes,
  quizQuestions,
  quizOptions,
  problems,
  problemExamples,
  problemConstraints,
  testCases,
  assessmentQuestions,
  contests,
  contestProblems,
  forumTags,
} from '../schema';
import { eq, and } from 'drizzle-orm';
import { seedLanguages } from './data/languages';
import { seedLevels } from './data/levels';
import { seedAchievements } from './data/achievements';
import { SEED_TOPICS } from './data/topics';
import { SEED_LESSONS } from './data/lessons';
import { SEED_QUIZZES } from './data/quizzes';
import { SEED_PROBLEMS } from './data/problems';
import { SEED_ASSESSMENT_QUESTIONS } from './data/assessments';
import { SEED_CONTESTS } from './data/contests';
import { SEED_FORUM_TAGS } from './data/community';
import { logger } from '../../core/utils/logger';



export const runSeed = async () => {
  logger.info('🌱 Starting CodeForge V2 Database Seeding...');

  try {
    // 1. Seed Languages
    logger.info('  -> Seeding Tier-1 Languages...');
    for (const lang of seedLanguages) {
      await db
        .insert(languages)
        .values(lang)
        .onConflictDoUpdate({
          target: languages.id,
          set: {
            name: lang.name,
            monacoId: lang.monacoId,
            compilerId: lang.compilerId,
            version: lang.version,
            isActive: lang.isActive,
            displayOrder: lang.displayOrder,
          },
        });
    }
    logger.info(`  ✓ Successfully seeded ${seedLanguages.length} Tier-1 languages.`);

    // 2. Seed Levels 1-50
    logger.info('  -> Seeding Levels 1 through 50...');
    for (const lvl of seedLevels) {
      await db
        .insert(levels)
        .values(lvl)
        .onConflictDoUpdate({
          target: levels.levelNumber,
          set: {
            minXpRequired: lvl.minXpRequired,
            title: lvl.title,
            badgeUrl: lvl.badgeUrl,
            rewardDescription: lvl.rewardDescription,
          },
        });
    }
    logger.info(`  ✓ Successfully seeded ${seedLevels.length} progression levels.`);

    // 3. Seed Achievements
    logger.info('  -> Seeding Base Achievements...');
    for (const ach of seedAchievements) {
      await db
        .insert(achievements)
        .values(ach)
        .onConflictDoUpdate({
          target: achievements.slug,
          set: {
            title: ach.title,
            description: ach.description,
            badgeIconUrl: ach.badgeIconUrl,
            achievementType: ach.achievementType,
            xpReward: ach.xpReward,
            criteriaJson: ach.criteriaJson,
          },
        });
    }
    logger.info(`  ✓ Successfully seeded ${seedAchievements.length} core achievements.`);

    // 4. Seed Topics
    logger.info('  -> Seeding Curriculum Topics...');
    const topicMap = new Map<string, string>(); // slug -> uuid
    for (const top of SEED_TOPICS) {
      const existing = await db
        .select()
        .from(topics)
        .where(eq(topics.slug, top.slug))
        .limit(1);

      let topicId: string;
      if (existing.length > 0) {
        topicId = existing[0].id;
        await db
          .update(topics)
          .set({
            title: top.title,
            description: top.description,
            sequence: top.sequence,
            difficulty: top.difficulty,
            estimatedHours: top.estimatedHours,
          })
          .where(eq(topics.id, topicId));
      } else {
        const [inserted] = await db
          .insert(topics)
          .values({
            languageId: top.languageId,
            slug: top.slug,
            sequence: top.sequence,
            title: top.title,
            description: top.description,
            difficulty: top.difficulty,
            estimatedHours: top.estimatedHours,
          })
          .returning({ id: topics.id });
        topicId = inserted.id;
      }
      topicMap.set(top.slug, topicId);
    }
    logger.info(`  ✓ Successfully seeded ${SEED_TOPICS.length} curriculum topics across 6 languages.`);

    // 5. Seed Lessons, Sections, Examples
    logger.info('  -> Seeding Lessons & Interactive Examples...');
    for (const lsn of SEED_LESSONS) {
      const topicId = topicMap.get(lsn.topicSlug);
      if (!topicId) continue;

      const existingLesson = await db
        .select()
        .from(lessons)
        .where(eq(lessons.slug, lsn.slug))
        .limit(1);

      let lessonId: string;
      if (existingLesson.length > 0) {
        lessonId = existingLesson[0].id;
        await db
          .update(lessons)
          .set({
            title: lsn.title,
            description: lsn.description,
            sequence: lsn.sequence,
            readTimeMinutes: lsn.readTimeMinutes,
            status: lsn.status,
          })
          .where(eq(lessons.id, lessonId));
      } else {
        const [inserted] = await db
          .insert(lessons)
          .values({
            topicId,
            slug: lsn.slug,
            sequence: lsn.sequence,
            title: lsn.title,
            description: lsn.description,
            readTimeMinutes: lsn.readTimeMinutes,
            status: lsn.status,
          })
          .returning({ id: lessons.id });
        lessonId = inserted.id;
      }

      // Sections
      await db.delete(lessonSections).where(eq(lessonSections.lessonId, lessonId));
      for (const sec of lsn.sections) {
        await db.insert(lessonSections).values({
          lessonId,
          sequence: sec.sequence,
          title: sec.title,
          contentMdx: sec.contentMdx,
          contentType: sec.contentType,
        });
      }

      // Examples
      await db.delete(learningExamples).where(eq(learningExamples.lessonId, lessonId));
      for (const ex of lsn.examples) {
        await db.insert(learningExamples).values({
          lessonId,
          sequence: ex.sequence,
          title: ex.title,
          codeTemplate: ex.codeTemplate,
          expectedOutput: ex.expectedOutput,
          explanationMdx: ex.explanationMdx,
        });
      }
    }
    logger.info(`  ✓ Successfully seeded ${SEED_LESSONS.length} comprehensive lessons with rich sections.`);

    // 6. Seed Checkpoint Quizzes
    logger.info('  -> Seeding Topic Checkpoint Quizzes...');
    for (const qz of SEED_QUIZZES) {
      const topicId = topicMap.get(qz.topicSlug);
      if (!topicId) continue;

      const existingQuiz = await db
        .select()
        .from(quizzes)
        .where(eq(quizzes.topicId, topicId))
        .limit(1);

      let quizId: string;
      if (existingQuiz.length > 0) {
        quizId = existingQuiz[0].id;
        await db
          .update(quizzes)
          .set({
            title: qz.title,
            description: qz.description,
            difficulty: qz.difficulty,
            passingScorePercentage: qz.passingScorePercentage,
          })
          .where(eq(quizzes.id, quizId));
      } else {
        const [inserted] = await db
          .insert(quizzes)
          .values({
            topicId,
            title: qz.title,
            description: qz.description,
            difficulty: qz.difficulty,
            passingScorePercentage: qz.passingScorePercentage,
          })
          .returning({ id: quizzes.id });
        quizId = inserted.id;
      }

      // Delete existing questions & options for clean idempotent re-seed
      await db.delete(quizQuestions).where(eq(quizQuestions.quizId, quizId));
      for (const q of qz.questions) {
        const [qInserted] = await db
          .insert(quizQuestions)
          .values({
            quizId,
            sequence: q.sequence,
            questionType: q.questionType,
            questionMdx: q.questionMdx,
            codeSnippet: q.codeSnippet,
            explanationMdx: q.explanationMdx,
            points: q.points,
          })
          .returning({ id: quizQuestions.id });

        for (const opt of q.options) {
          await db.insert(quizOptions).values({
            questionId: qInserted.id,
            sequence: opt.sequence,
            optionText: opt.optionText,
            isCorrect: opt.isCorrect,
          });
        }
      }
    }
    logger.info(`  ✓ Successfully seeded checkpoint quizzes with verified answer keys.`);

    // 7. Seed Algorithmic Problems
    logger.info('  -> Seeding Algorithmic Arena Problems...');
    const problemMap = new Map<string, string>();
    for (const prob of SEED_PROBLEMS) {
      const topicId = topicMap.get(prob.topicSlug);
      if (!topicId) continue;

      const existingProblem = await db
        .select()
        .from(problems)
        .where(eq(problems.slug, prob.slug))
        .limit(1);

      let problemId: string;
      if (existingProblem.length > 0) {
        problemId = existingProblem[0].id;
        await db
          .update(problems)
          .set({
            title: prob.title,
            difficulty: prob.difficulty,
            promptMdx: prob.promptMdx,
            starterCode: prob.starterCode,
            boilerplateCode: prob.boilerplateCode,
            memoryLimitMb: prob.memoryLimitMb,
            timeLimitMs: prob.timeLimitMs,
            isPublished: prob.isPublished,
          })
          .where(eq(problems.id, problemId));
      } else {
        const [inserted] = await db
          .insert(problems)
          .values({
            topicId,
            slug: prob.slug,
            title: prob.title,
            difficulty: prob.difficulty,
            promptMdx: prob.promptMdx,
            starterCode: prob.starterCode,
            boilerplateCode: prob.boilerplateCode,
            memoryLimitMb: prob.memoryLimitMb,
            timeLimitMs: prob.timeLimitMs,
            isPublished: prob.isPublished,
          })
          .returning({ id: problems.id });
        problemId = inserted.id;
      }
      problemMap.set(prob.slug, problemId);


      // Examples
      await db.delete(problemExamples).where(eq(problemExamples.problemId, problemId));
      for (const ex of prob.examples) {
        await db.insert(problemExamples).values({
          problemId,
          sequence: ex.sequence,
          inputData: ex.inputData,
          expectedOutput: ex.expectedOutput,
          explanationMdx: ex.explanationMdx,
        });
      }

      // Constraints
      await db.delete(problemConstraints).where(eq(problemConstraints.problemId, problemId));
      for (const con of prob.constraints) {
        await db.insert(problemConstraints).values({
          problemId,
          sequence: con.sequence,
          constraintText: con.constraintText,
        });
      }

      // Test Cases
      await db.delete(testCases).where(eq(testCases.problemId, problemId));
      for (const tc of prob.testCases) {
        await db.insert(testCases).values({
          problemId,
          sequence: tc.sequence,
          inputData: tc.inputData,
          expectedOutput: tc.expectedOutput,
          isHidden: tc.isHidden,
          isSample: tc.isSample,
          isEdgeCase: tc.isEdgeCase,
          weight: tc.weight,
        });
      }
    }
    logger.info(`  ✓ Successfully seeded Arena problems, test cases, and multi-language starter code.`);

    // 7. Seed Assessment Question Bank
    logger.info('  -> Seeding Assessment Question Bank...');
    for (const q of SEED_ASSESSMENT_QUESTIONS) {
      const topicId = topicMap.get(q.topicSlug);
      if (!topicId) continue;

      await db.insert(assessmentQuestions).values({
        questionType: q.questionType,
        topicId,
        difficulty: q.difficulty,
        promptMdx: q.promptMdx,
        optionsJson: q.options || [],
        codeSnippet: q.codeSnippet,
        starterCodeJson: q.starterCodeJson || {},
        supportedLanguagesJson: q.supportedLanguagesJson || ['python', 'javascript'],
        solutionCode: q.solutionCode,
        points: q.points,
        estimatedTimeSeconds: q.estimatedTimeSeconds,
        explanationMdx: q.explanationMdx,
        scoringRulesJson: q.scoringRulesJson || {},
        metadataJson: q.metadataJson || {},
      });
    }
    logger.info(`  ✓ Successfully seeded ${SEED_ASSESSMENT_QUESTIONS.length} Assessment Questions.`);

    // 8. Seed Contests
    logger.info('  -> Seeding Contests & Problem Sets...');
    for (const c of SEED_CONTESTS) {
      const startAt = new Date(Date.now() + c.startAtOffsetDays * 86400000);
      const endAt = new Date(Date.now() + c.endAtOffsetDays * 86400000);

      const existingContest = await db
        .select()
        .from(contests)
        .where(eq(contests.slug, c.slug))
        .limit(1);

      let contestId: string;
      if (existingContest.length > 0) {
        contestId = existingContest[0].id;
        await db
          .update(contests)
          .set({
            title: c.title,
            descriptionMdx: c.descriptionMdx,
            status: c.status,
            startAt,
            endAt,
            durationMinutes: c.durationMinutes,
            totalPoints: c.totalPoints,
            scoringFormula: c.scoringFormula,
          })
          .where(eq(contests.id, contestId));
      } else {
        const [inserted] = await db
          .insert(contests)
          .values({
            slug: c.slug,
            title: c.title,
            descriptionMdx: c.descriptionMdx,
            status: c.status,
            startAt,
            endAt,
            durationMinutes: c.durationMinutes,
            totalPoints: c.totalPoints,
            scoringFormula: c.scoringFormula,
          })
          .returning({ id: contests.id });
        contestId = inserted.id;
      }

      await db.delete(contestProblems).where(eq(contestProblems.contestId, contestId));
      for (const cp of c.problemSlugs) {
        const problemId = problemMap.get(cp.slug);
        if (problemId) {
          await db.insert(contestProblems).values({
            contestId,
            problemId,
            sequence: cp.sequence,
            points: cp.points,
            penaltyMinutes: cp.penaltyMinutes,
          });
        }
      }
    }
    // 9. Seed Forum Tags
    logger.info('  -> Seeding Forum Tags...');
    for (const tag of SEED_FORUM_TAGS) {
      await db
        .insert(forumTags)
        .values({
          name: tag.name,
          slug: tag.slug,
          description: tag.description,
          postsCount: 0,
        })
        .onConflictDoUpdate({
          target: forumTags.slug,
          set: {
            name: tag.name,
            description: tag.description,
          },
        });
    }
    logger.info(`  ✓ Successfully seeded ${SEED_FORUM_TAGS.length} Forum Tags.`);

    logger.info('🎉 Database seeding completed successfully!');

  } catch (error) {

    logger.error({ error }, '❌ Error during database seeding');
    throw error;
  } finally {
    await queryClient.end();
  }
};

if (require.main === module) {
  runSeed()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
