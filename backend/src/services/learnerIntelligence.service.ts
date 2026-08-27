import {
  ILearnerIntelligenceRepository,
  UserTopicPerformanceEvidence,
} from '../repositories/interfaces/ILearnerIntelligenceRepository';
import { ICurriculumRepository } from '../repositories/interfaces/ICurriculumRepository';
import { IGamificationRepository } from '../repositories/interfaces/IGamificationRepository';
import {
  LearnerIntelligenceProfileDto,
  TopicMasteryDetailDto,
  ConceptualMasteryLevel,
  WeaknessItemDto,
  AdaptiveDifficultyDto,
  LearningPathItemDto,
  RecommendationDto,
  LearningAnalyticsDto,
  LanguageId,
  ProblemDifficulty,
} from '@codeforge/shared';

export class LearnerIntelligenceService {
  constructor(
    private readonly intelligenceRepo: ILearnerIntelligenceRepository,
    private readonly curriculumRepo: ICurriculumRepository,
    private readonly gamificationRepo: IGamificationRepository,
  ) {}

  public async getLearnerProfile(
    userId: string,
    languageId?: LanguageId,
  ): Promise<LearnerIntelligenceProfileDto> {
    const langId = languageId || LanguageId.PYTHON;
    const activeLang = await this.curriculumRepo.getLanguageBySlug(langId);
    const topicEvidences = await this.intelligenceRepo.getUserTopicPerformanceEvidences(
      userId,
      langId,
    );
    const quizHistory = await this.intelligenceRepo.getUserQuizHistory(userId, 50);
    const subHistory = await this.intelligenceRepo.getUserSubmissionHistory(userId, 50);
    const gamification = await this.gamificationRepo.getGamificationSummary(userId);

    // 1. Calculate overall mastery
    const topicMasteries = this.calculateTopicMasteries(topicEvidences);
    const overallMasteryScore =
      topicMasteries.length > 0
        ? Math.round(
            topicMasteries.reduce((sum, t) => sum + t.masteryScore, 0) / topicMasteries.length,
          )
        : 0;

    // 2. Skill level derivation
    let overallSkillLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert' = 'beginner';
    if (overallMasteryScore >= 85) overallSkillLevel = 'expert';
    else if (overallMasteryScore >= 65) overallSkillLevel = 'advanced';
    else if (overallMasteryScore >= 35) overallSkillLevel = 'intermediate';

    // 3. Quiz accuracy
    let quizAccuracyPercentage = 0;
    if (quizHistory.length > 0) {
      quizAccuracyPercentage = Math.round(
        quizHistory.reduce((sum, q) => sum + q.scorePercentage, 0) / quizHistory.length,
      );
    }

    // 4. Problem solve rate
    let problemSolvingSuccessRate = 0;
    if (subHistory.length > 0) {
      const acceptedCount = subHistory.filter(s => s.status === 'accepted').length;
      problemSolvingSuccessRate = Math.round((acceptedCount / subHistory.length) * 100);
    }

    // 5. Activity counts in last 7 days
    const [xpVelocity7Days, activitiesCount7Days] = await Promise.all([
      this.intelligenceRepo.getUserXpEarnedInDays(userId, 7),
      this.intelligenceRepo.getUserActivitiesCountInDays(userId, 7),
    ]);

    const lessonsLast7Days = topicEvidences.reduce(
      (sum, t) => (t.lastActivityAt && this.isWithinDays(t.lastActivityAt, 7) ? sum + t.lessonsCompleted : sum),
      0,
    );
    const quizzesLast7Days = quizHistory.filter(q => this.isWithinDays(q.attemptedAt, 7)).length;
    const subsLast7Days = subHistory.filter(s => this.isWithinDays(s.createdAt, 7)).length;

    // 6. Confidence Level
    const streakBonus = Math.min(20, gamification.currentStreak * 4);
    const confidenceLevel = Math.min(
      100,
      Math.round(
        (quizAccuracyPercentage * 0.4) +
        (problemSolvingSuccessRate * 0.4) +
        streakBonus +
        (overallMasteryScore * 0.2),
      ),
    );

    // 7. Strengths and Weaknesses
    const strengths = topicMasteries
      .filter(t => t.masteryScore >= 70)
      .map(t => t.topicTitle);
    const weaknesses = topicMasteries
      .filter(t => t.masteryScore > 0 && t.masteryScore < 50)
      .map(t => t.topicTitle);

    return {
      userId,
      overallSkillLevel,
      overallMasteryScore,
      confidenceLevel,
      learningVelocity: activitiesCount7Days,
      quizAccuracyPercentage,
      problemSolvingSuccessRate,
      currentStreakDays: gamification.currentStreak,
      totalXp: gamification.totalXp,
      activeLanguage: activeLang,
      strengths: strengths.length > 0 ? strengths : ['Curriculum Fundamentals'],
      weaknesses: weaknesses.length > 0 ? weaknesses : [],
      recentActivitySummary: {
        lessonsCompletedLast7Days: lessonsLast7Days,
        quizzesAttemptedLast7Days: quizzesLast7Days,
        problemsSubmittedLast7Days: subsLast7Days,
      },
    };
  }

  public async getTopicMasteries(
    userId: string,
    languageId?: LanguageId,
  ): Promise<TopicMasteryDetailDto[]> {
    const topicEvidences = await this.intelligenceRepo.getUserTopicPerformanceEvidences(
      userId,
      languageId,
    );
    return this.calculateTopicMasteries(topicEvidences);
  }

  public async getWeaknesses(
    userId: string,
    languageId?: LanguageId,
  ): Promise<WeaknessItemDto[]> {
    const topicEvidences = await this.intelligenceRepo.getUserTopicPerformanceEvidences(
      userId,
      languageId,
    );
    const weaknesses: WeaknessItemDto[] = [];

    for (let i = 0; i < topicEvidences.length; i++) {
      const top = topicEvidences[i];
      const prevTopic = i > 0 ? topicEvidences[i - 1] : null;

      // 1. Check Prerequisite Gap (topic attempted but prevTopic not mastered)
      if (
        prevTopic &&
        (top.lessonsCompleted > 0 || top.quizAttemptsCount > 0 || top.problemsSolved > 0)
      ) {
        const prevMastery = this.computeSingleTopicMasteryScore(prevTopic);
        if (prevMastery < 70) {
          weaknesses.push({
            id: `prereq-${top.topicId}`,
            topicId: top.topicId,
            topicTitle: top.topicTitle,
            topicSequence: top.topicSequence,
            languageId: top.languageId,
            weaknessScore: 85,
            category: 'prerequisite_gap',
            evidence: `Prerequisite "${prevTopic.topicTitle}" mastery is at ${prevMastery}% (< 70%).`,
            recommendedRemediation: `Review and complete prerequisite topics before advancing further into ${top.topicTitle}.`,
            priority: 'high',
          });
        }
      }

      // 2. Check Quiz Concept Failure
      if (top.quizAttemptsCount > 0 && top.quizBestScore < 70) {
        weaknesses.push({
          id: `quiz-${top.topicId}`,
          topicId: top.topicId,
          topicTitle: top.topicTitle,
          topicSequence: top.topicSequence,
          languageId: top.languageId,
          weaknessScore: Math.round(100 - top.quizBestScore),
          category: 'quiz_concept_failure',
          evidence: `Best quiz score is ${top.quizBestScore}% across ${top.quizAttemptsCount} attempt(s).`,
          recommendedRemediation: `Review the lesson code examples and retake the checkpoint quiz to solidify core syntax.`,
          priority: top.quizBestScore < 50 ? 'high' : 'medium',
        });
      }

      // 3. Check Problem Failures
      if (top.problemFailedAttempts >= 2 && top.problemsSolved === 0) {
        weaknesses.push({
          id: `prob-${top.topicId}`,
          topicId: top.topicId,
          topicTitle: top.topicTitle,
          topicSequence: top.topicSequence,
          languageId: top.languageId,
          weaknessScore: 75,
          category: 'problem_failure',
          evidence: `${top.problemFailedAttempts} non-passing submissions with 0 accepted solutions.`,
          recommendedRemediation: `Use the Socratic AI Tutor hint tier in the workspace or review sample test case outputs.`,
          priority: 'medium',
        });
      }

      // 4. Inactivity Decay (if activity was > 21 days ago and topic was in progress)
      if (
        top.lastActivityAt &&
        (top.lessonsCompleted > 0 || top.problemsSolved > 0) &&
        !this.isWithinDays(top.lastActivityAt, 21)
      ) {
        weaknesses.push({
          id: `decay-${top.topicId}`,
          topicId: top.topicId,
          topicTitle: top.topicTitle,
          topicSequence: top.topicSequence,
          languageId: top.languageId,
          weaknessScore: 40,
          category: 'inactivity_decay',
          evidence: `No practice activity logged on this topic for over 21 days.`,
          recommendedRemediation: `Perform a quick review or solve a sample arena problem to prevent knowledge decay.`,
          priority: 'low',
        });
      }
    }

    return weaknesses.sort((a, b) => b.weaknessScore - a.weaknessScore);
  }

  public async getAdaptiveDifficulty(
    userId: string,
    topicId: string,
  ): Promise<AdaptiveDifficultyDto> {
    const topicEvidences = await this.intelligenceRepo.getUserTopicPerformanceEvidences(userId);
    const targetTopic = topicEvidences.find(t => t.topicId === topicId) || topicEvidences[0];

    const subHistory = await this.intelligenceRepo.getUserSubmissionHistory(userId, 10);
    const topicSubs = subHistory.filter(s => s.topicId === targetTopic.topicId);

    // Calculate consecutive successes and failures
    let consecutiveSuccesses = 0;
    let consecutiveFailures = 0;

    for (const sub of topicSubs.length > 0 ? topicSubs : subHistory) {
      if (sub.status === 'accepted') {
        if (consecutiveFailures === 0) consecutiveSuccesses++;
        else break;
      } else {
        if (consecutiveSuccesses === 0) consecutiveFailures++;
        else break;
      }
    }

    const currentMasteryScore = this.computeSingleTopicMasteryScore(targetTopic);

    let recommendedDifficulty: ProblemDifficulty = ProblemDifficulty.MEDIUM;
    let rationale = '';

    if (consecutiveSuccesses >= 2 || currentMasteryScore >= 80) {
      recommendedDifficulty = ProblemDifficulty.DIFFICULT;
      rationale = `Learner demonstrated strong topic proficiency (${currentMasteryScore}% mastery, ${consecutiveSuccesses} consecutive passes). Advancing to Difficult challenge.`;
    } else if (consecutiveFailures >= 2 || (targetTopic.quizAttemptsCount > 0 && targetTopic.quizBestScore < 60)) {
      recommendedDifficulty = ProblemDifficulty.EASY;
      rationale = `Detected recent struggle (${consecutiveFailures} consecutive non-passing submissions). Adapting to Easy difficulty to build foundational confidence.`;
    } else {
      recommendedDifficulty = ProblemDifficulty.MEDIUM;
      rationale = `Performance is balanced (${currentMasteryScore}% mastery). Standard Medium difficulty recommended.`;
    }

    return {
      topicId: targetTopic.topicId,
      topicTitle: targetTopic.topicTitle,
      currentMasteryScore,
      recommendedDifficulty,
      rationale,
      metrics: {
        recentSubmissionsCount: topicSubs.length,
        consecutiveSuccesses,
        consecutiveFailures,
        quizAccuracy: targetTopic.quizBestScore,
      },
    };
  }

  public async getPersonalizedLearningPath(
    userId: string,
    languageId?: LanguageId,
  ): Promise<LearningPathItemDto[]> {
    const topicEvidences = await this.intelligenceRepo.getUserTopicPerformanceEvidences(
      userId,
      languageId,
    );
    const weaknesses = await this.getWeaknesses(userId, languageId);
    const items: LearningPathItemDto[] = [];
    let sequence = 1;

    for (let i = 0; i < topicEvidences.length; i++) {
      const top = topicEvidences[i];
      const prevTopic = i > 0 ? topicEvidences[i - 1] : null;
      const topicWeakness = weaknesses.find(w => w.topicId === top.topicId);

      // Check if prerequisite topic has a severe gap
      if (prevTopic) {
        const prevMastery = this.computeSingleTopicMasteryScore(prevTopic);
        if (prevMastery < 60 && (top.lessonsCompleted > 0 || top.quizAttemptsCount > 0)) {
          items.push({
            id: `path-prereq-${prevTopic.topicId}`,
            sequence: sequence++,
            actionType: 'revisit_prerequisite',
            targetType: 'topic',
            targetId: prevTopic.topicId,
            targetTitle: prevTopic.topicTitle,
            topicTitle: prevTopic.topicTitle,
            priority: 'urgent',
            reason: `Prerequisite knowledge gap detected (${prevMastery}% mastery).`,
            expectedBenefit: `Solidify foundational syntax before proceeding further into ${top.topicTitle}.`,
            estimatedMinutes: 15,
            isCompleted: false,
            actionUrl: `/learn/${prevTopic.languageId}`,
          });
        }
      }

      // Check uncompleted lessons
      if (top.lessonsCompleted < top.lessonsTotal) {
        items.push({
          id: `path-lesson-${top.topicId}`,
          sequence: sequence++,
          actionType: 'continue_lesson',
          targetType: 'lesson',
          targetId: top.topicId,
          targetTitle: `Complete Remaining Lessons (${top.lessonsCompleted}/${top.lessonsTotal})`,
          topicTitle: top.topicTitle,
          priority: i === 0 || (prevTopic && this.computeSingleTopicMasteryScore(prevTopic) >= 60) ? 'high' : 'normal',
          reason: `Topic has ${top.lessonsTotal - top.lessonsCompleted} uncompleted lesson(s).`,
          expectedBenefit: `Acquire structured theoretical concepts and executable code examples.`,
          estimatedMinutes: (top.lessonsTotal - top.lessonsCompleted) * 5,
          isCompleted: false,
          actionUrl: `/learn/${top.languageId}`,
        });
      } else if (top.quizId && (!top.quizPassed || top.quizBestScore < 80)) {
        // Lessons complete, take checkpoint quiz
        items.push({
          id: `path-quiz-${top.topicId}`,
          sequence: sequence++,
          actionType: 'take_quiz',
          targetType: 'quiz',
          targetId: top.topicId,
          targetTitle: `Pass Topic Checkpoint Quiz`,
          topicTitle: top.topicTitle,
          priority: 'high',
          reason: top.quizAttemptsCount === 0
            ? `All lessons completed. Ready for knowledge verification.`
            : `Quiz score is ${top.quizBestScore}%. Passing threshold is 80%.`,
          expectedBenefit: `Verify recall, unlock +50 XP, and solidify concept mastery.`,
          estimatedMinutes: 8,
          isCompleted: false,
          actionUrl: `/quiz/topic/${top.topicId}`,
        });
      } else if (top.problemsTotal > 0 && top.problemsSolved === 0) {
        // Quiz passed, practice arena problem
        items.push({
          id: `path-prob-${top.topicId}`,
          sequence: sequence++,
          actionType: 'practice_problem',
          targetType: 'problem',
          targetId: top.topicId,
          targetTitle: `Solve Coding Arena Challenge`,
          topicTitle: top.topicTitle,
          priority: 'high',
          reason: `Apply learned syntax into hands-on algorithmic problem solving.`,
          expectedBenefit: `Gain algorithmic implementation experience and earn arena XP.`,
          estimatedMinutes: 20,
          isCompleted: false,
          actionUrl: `/workspace`,
        });
      } else if (top.lessonsCompleted === top.lessonsTotal && top.quizPassed && top.problemsSolved > 0) {
        // Topic mastered
        items.push({
          id: `path-advance-${top.topicId}`,
          sequence: sequence++,
          actionType: 'advance_topic',
          targetType: 'topic',
          targetId: top.topicId,
          targetTitle: `Topic Mastered`,
          topicTitle: top.topicTitle,
          priority: 'optional',
          reason: `All topic criteria satisfied with high mastery.`,
          expectedBenefit: `Continue advancing through the curriculum roadmap.`,
          estimatedMinutes: 0,
          isCompleted: true,
          actionUrl: `/learn/${top.languageId}`,
        });
      }
    }

    return items;
  }

  public async getRecommendations(
    userId: string,
    languageId?: LanguageId,
  ): Promise<RecommendationDto[]> {
    const recommendations: RecommendationDto[] = [];
    const gamification = await this.gamificationRepo.getGamificationSummary(userId);
    const learningPath = await this.getPersonalizedLearningPath(userId, languageId);
    const weaknesses = await this.getWeaknesses(userId, languageId);

    // 1. Maintain Streak Recommendation
    if (gamification.currentStreak > 0) {
      recommendations.push({
        id: 'rec-streak',
        type: 'MAINTAIN_STREAK',
        title: `Keep Your ${gamification.currentStreak}-Day Streak Alive!`,
        reason: `Complete at least one lesson or quiz today to maintain your daily streak and earn streak multiplier rewards.`,
        priority: 'urgent',
        targetId: 'streak',
        ctaText: 'Continue Streak',
        ctaUrl: `/learn/${languageId || 'python'}`,
        badgeText: '🔥 Daily Habit',
      });
    }

    // 2. High-Priority Weakness Recommendation
    if (weaknesses.length > 0 && weaknesses[0].priority === 'high') {
      const w = weaknesses[0];
      recommendations.push({
        id: `rec-weakness-${w.id}`,
        type: w.category === 'prerequisite_gap' ? 'REVISIT_PREREQUISITE' : 'REVIEW_TOPIC',
        title: `Remediate: ${w.topicTitle}`,
        reason: w.evidence + ' ' + w.recommendedRemediation,
        priority: 'high',
        targetId: w.topicId,
        ctaText: 'Review Concept',
        ctaUrl: `/learn/${w.languageId}`,
        badgeText: '🎯 Targeted Focus',
      });
    }

    // 3. Learning Path Next Actions
    const uncompletedPathItems = learningPath.filter(p => !p.isCompleted);
    for (const item of uncompletedPathItems.slice(0, 3)) {
      let type: RecommendationDto['type'] = 'CONTINUE_LESSON';
      if (item.actionType === 'take_quiz') type = 'TAKE_QUIZ';
      else if (item.actionType === 'practice_problem') type = 'PRACTICE_PROBLEM';
      else if (item.actionType === 'revisit_prerequisite') type = 'REVISIT_PREREQUISITE';
      else if (item.actionType === 'advance_topic') type = 'ADVANCE_TOPIC';

      recommendations.push({
        id: `rec-path-${item.id}`,
        type,
        title: `${item.topicTitle}: ${item.targetTitle}`,
        reason: item.reason,
        priority: item.priority === 'urgent' ? 'urgent' : item.priority === 'high' ? 'high' : 'normal',
        targetId: item.targetId,
        ctaText: item.actionType === 'take_quiz' ? 'Start Quiz' : item.actionType === 'practice_problem' ? 'Open Arena' : 'Continue Lesson',
        ctaUrl: item.actionUrl,
        badgeText: `Topic ${item.sequence}`,
      });
    }

    return recommendations.slice(0, 5);
  }

  public async getLearningAnalytics(
    userId: string,
    languageId?: LanguageId,
  ): Promise<LearningAnalyticsDto> {
    const topicEvidences = await this.intelligenceRepo.getUserTopicPerformanceEvidences(
      userId,
      languageId,
    );
    const quizHistory = await this.intelligenceRepo.getUserQuizHistory(userId, 100);
    const subHistory = await this.intelligenceRepo.getUserSubmissionHistory(userId, 100);
    const gamification = await this.gamificationRepo.getGamificationSummary(userId);
    const xpVelocity7Days = await this.intelligenceRepo.getUserXpEarnedInDays(userId, 7);
    const activitiesCount = await this.intelligenceRepo.getUserActivitiesCountInDays(userId, 30);

    const topicMasteries = this.calculateTopicMasteries(topicEvidences);

    const lessonsCompletedCount = topicEvidences.reduce((sum, t) => sum + t.lessonsCompleted, 0);
    const quizzesAttemptedCount = quizHistory.length;
    const quizzesPassedCount = quizHistory.filter(q => q.isPassed).length;
    const averageQuizScore =
      quizHistory.length > 0
        ? Math.round(quizHistory.reduce((sum, q) => sum + q.scorePercentage, 0) / quizHistory.length)
        : 0;

    const problemsAttemptedCount = subHistory.length;
    const solvedProblemIds = new Set(
      subHistory.filter(s => s.status === 'accepted').map(s => s.problemId),
    );
    const problemsSolvedCount = solvedProblemIds.size;
    const problemSuccessRatePercentage =
      subHistory.length > 0
        ? Math.round((subHistory.filter(s => s.status === 'accepted').length / subHistory.length) * 100)
        : 0;

    const sortedTopics = [...topicMasteries].sort((a, b) => b.masteryScore - a.masteryScore);
    const strongestTopics = sortedTopics.slice(0, 3).map(t => ({
      topicId: t.topicId,
      title: t.topicTitle,
      score: t.masteryScore,
    }));
    const weakestTopics = sortedTopics
      .filter(t => t.masteryScore > 0)
      .slice(-3)
      .map(t => ({
        topicId: t.topicId,
        title: t.topicTitle,
        score: t.masteryScore,
      }));

    const distribution = {
      notStarted: 0,
      learning: 0,
      developing: 0,
      proficient: 0,
      mastered: 0,
    };

    for (const t of topicMasteries) {
      if (t.conceptualState === 'not_started') distribution.notStarted++;
      else if (t.conceptualState === 'learning') distribution.learning++;
      else if (t.conceptualState === 'developing') distribution.developing++;
      else if (t.conceptualState === 'proficient') distribution.proficient++;
      else if (t.conceptualState === 'mastered') distribution.mastered++;
    }

    const consistencyScore = Math.min(
      100,
      Math.round((gamification.currentStreak * 10) + (activitiesCount * 2)),
    );

    return {
      userId,
      totalActivitiesCount: activitiesCount,
      lessonsCompletedCount,
      quizzesAttemptedCount,
      quizzesPassedCount,
      averageQuizScore,
      problemsAttemptedCount,
      problemsSolvedCount,
      problemSuccessRatePercentage,
      totalXp: gamification.totalXp,
      xpVelocityLast7Days: xpVelocity7Days,
      currentStreakDays: gamification.currentStreak,
      learningConsistencyScore: consistencyScore,
      strongestTopics,
      weakestTopics,
      topicMasteryDistribution: distribution,
    };
  }

  // Helper calculation routines
  private calculateTopicMasteries(
    evidences: UserTopicPerformanceEvidence[],
  ): TopicMasteryDetailDto[] {
    return evidences.map(ev => {
      const masteryScore = this.computeSingleTopicMasteryScore(ev);
      const conceptualState = this.mapScoreToConceptualState(masteryScore, ev);
      const bktProbability = Math.min(1.0, Math.max(0.1, Number((masteryScore / 100).toFixed(2))));

      let daysAgo = 0;
      if (ev.lastActivityAt) {
        const diffMs = Date.now() - ev.lastActivityAt.getTime();
        daysAgo = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
      }

      const lessonPct =
        ev.lessonsTotal > 0 ? Math.round((ev.lessonsCompleted / ev.lessonsTotal) * 100) : 0;

      const explanation = this.buildMasteryExplanation(ev, masteryScore, conceptualState, daysAgo);

      return {
        topicId: ev.topicId,
        topicTitle: ev.topicTitle,
        topicSequence: ev.topicSequence,
        languageId: ev.languageId,
        masteryScore,
        conceptualState,
        bktProbability,
        evidence: {
          lessonsProgress: {
            completed: ev.lessonsCompleted,
            total: ev.lessonsTotal,
            percentage: lessonPct,
          },
          quizBestScore: ev.quizBestScore,
          problemsSolved: ev.problemsSolved,
          recencyDaysAgo: daysAgo,
        },
        explanation,
        lastActivityAt: ev.lastActivityAt?.toISOString() || new Date().toISOString(),
      };
    });
  }

  private computeSingleTopicMasteryScore(ev: UserTopicPerformanceEvidence): number {
    const lessonScore =
      ev.lessonsTotal > 0 ? (ev.lessonsCompleted / ev.lessonsTotal) * 100 : 0;
    const quizScore = ev.quizPassed ? 100 : ev.quizBestScore;
    const problemScore = ev.problemsTotal > 0 ? (ev.problemsSolved / ev.problemsTotal) * 100 : 0;

    let recencyScore = 60;
    if (ev.lastActivityAt) {
      const diffMs = Date.now() - ev.lastActivityAt.getTime();
      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      if (days <= 7) recencyScore = 100;
      else if (days <= 30) recencyScore = 80;
    }

    if (ev.lessonsCompleted === 0 && ev.quizAttemptsCount === 0 && ev.problemsSolved === 0) {
      return 0;
    }

    const raw =
      0.35 * lessonScore +
      0.35 * quizScore +
      0.20 * problemScore +
      0.10 * recencyScore;

    return Math.min(100, Math.round(raw));
  }

  private mapScoreToConceptualState(
    score: number,
    ev: UserTopicPerformanceEvidence,
  ): ConceptualMasteryLevel {
    if (score === 0) return 'not_started';
    if (score >= 90 && ev.lessonsCompleted === ev.lessonsTotal && ev.quizPassed) {
      return 'mastered';
    }
    if (score >= 70) return 'proficient';
    if (score >= 40) return 'developing';
    return 'learning';
  }

  private buildMasteryExplanation(
    ev: UserTopicPerformanceEvidence,
    score: number,
    state: ConceptualMasteryLevel,
    daysAgo: number,
  ): string {
    if (state === 'not_started') {
      return 'No activity logged for this topic yet.';
    }
    const lessonText = `${ev.lessonsCompleted}/${ev.lessonsTotal} lessons completed`;
    const quizText = ev.quizPassed
      ? `passed checkpoint quiz (${ev.quizBestScore}%)`
      : ev.quizAttemptsCount > 0
      ? `quiz attempt recorded (${ev.quizBestScore}%)`
      : 'quiz pending';
    const probText = `${ev.problemsSolved}/${ev.problemsTotal} arena problems solved`;
    const recencyText = daysAgo === 0 ? 'active today' : `active ${daysAgo} day(s) ago`;

    return `${state.toUpperCase()} state (${score}%): ${lessonText}, ${quizText}, ${probText}. Last ${recencyText}.`;
  }

  private isWithinDays(date: Date, days: number): boolean {
    const diffMs = Date.now() - date.getTime();
    return diffMs <= days * 24 * 60 * 60 * 1000;
  }
}
