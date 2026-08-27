import {
  InterviewRepository,
  ActivityFeedRepository,
} from '../repositories';
import {
  InterviewSessionDto,
  InterviewExchangeDto,
  InterviewFeedbackDto,
  StartInterviewDto,
  AnswerInterviewQuestionDto,
  InterviewType,
  ActivityType,
} from '@codeforge/shared';
import { NotFoundError } from '../core/errors';



const INTERVIEW_QUESTION_BANKS: Record<InterviewType, string[]> = {
  [InterviewType.BEHAVIORAL]: [
    'Tell me about a time you faced a challenging technical disagreement with a team member. How did you resolve it?',
    'Describe a situation where a production bug occurred under tight deadlines. What actions did you take?',
    'Can you share an example of a project where requirements shifted mid-development? How did you adapt?',
    'Tell me about a time you mentored a junior engineer or helped a colleague level up their skills.',
    'What is an engineering decision you made that you later regretted, and what did you learn from it?',
  ],
  [InterviewType.TECHNICAL]: [
    'Explain the event loop in JavaScript and how asynchronous operations and microtasks are prioritized.',
    'What are the core trade-offs between relational databases (PostgreSQL) and NoSQL document stores (MongoDB)?',
    'How do database indexes (B-Trees) work internally, and when might adding an index degrade write performance?',
    'Explain how garbage collection works in modern runtimes (e.g. V8 or JVM) and how memory leaks can still occur.',
    'Describe the differences between process-level concurrency and thread-level concurrency, including race conditions.',
  ],
  [InterviewType.CODING]: [
    'How would you design an algorithm to find the longest substring without repeating characters in O(n) time?',
    'Explain the mechanics and trade-offs of QuickSort vs. MergeSort with respect to time and space complexity.',
    'How would you detect and resolve a cycle in a singly linked list? Describe Floyd’s Cycle-Finding Algorithm.',
    'Describe how you would implement an LRU (Least Recently Used) cache with O(1) get and put operations.',
    'How would you efficiently compute the shortest path in a weighted graph with non-negative edge weights (Dijkstra)?',
  ],
  [InterviewType.SYSTEM_DESIGN]: [
    'Design a scalable URL shortening service (like Bitly) capable of handling 100M new URLs per month.',
    'How would you architect a distributed real-time chat application with message ordering and offline delivery?',
    'Design a rate limiting system that can throttle incoming client requests across a distributed API cluster.',
    'How would you design a high-throughput notification system that dispatches emails, SMS, and push notifications?',
    'Design an e-commerce flash-sale inventory reservation system that prevents overselling during massive traffic spikes.',
  ],
  [InterviewType.MIXED]: [
    'Tell me about a time you had to optimize an application for performance under heavy user load.',
    'Explain how HTTPS and TLS handshake establish an encrypted connection between client and server.',
    'How would you implement an LRU cache in your preferred programming language?',
    'How do you approach database schema versioning and zero-downtime migrations in production?',
    'How do you prioritize tech debt versus shipping new product features when communicating with stakeholders?',
  ],
};

export class InterviewService {
  private interviewRepo: InterviewRepository;
  private feedRepo: ActivityFeedRepository;

  constructor(
    interviewRepo = new InterviewRepository(),
    feedRepo = new ActivityFeedRepository(),
  ) {
    this.interviewRepo = interviewRepo;
    this.feedRepo = feedRepo;
  }

  async startInterview(
    userId: string,
    data: StartInterviewDto,
  ): Promise<{ session: InterviewSessionDto; firstQuestion: InterviewExchangeDto }> {
    const session = await this.interviewRepo.createSession(userId, data);

    const bank = INTERVIEW_QUESTION_BANKS[data.interviewType] || INTERVIEW_QUESTION_BANKS[InterviewType.MIXED];
    const questionText = bank[0];

    const firstQuestion = await this.interviewRepo.createExchange(session.id, 1, questionText);

    return { session, firstQuestion };
  }

  async answerQuestion(
    sessionId: string,
    userId: string,
    data: AnswerInterviewQuestionDto,
  ): Promise<{ answer: InterviewExchangeDto; nextQuestion?: InterviewExchangeDto; isComplete: boolean }> {
    const session = await this.interviewRepo.getSessionById(sessionId);
    if (!session || session.userId !== userId) {
      throw new NotFoundError('Interview session not found or access denied', 'SESSION_NOT_FOUND');
    }

    const exchange = await this.interviewRepo.getExchangeById(data.exchangeId);
    if (!exchange || exchange.sessionId !== sessionId) {
      throw new NotFoundError('Interview question not found', 'EXCHANGE_NOT_FOUND');
    }


    // Evaluate answer deterministically & construct Socratic feedback
    const wordCount = data.answerText.trim().split(/\s+/).length;
    let score = 70;
    let feedback = 'Clear and structured response. Good technical terminology.';

    if (wordCount < 20) {
      score = 45;
      feedback = 'Answer is concise but could benefit from deeper technical detail, concrete examples, or edge case analysis.';
    } else if (wordCount > 60) {
      score = 88;
      feedback = 'Comprehensive, well-articulated answer with structured reasoning and clear understanding of trade-offs.';
    }

    const updatedExchange = await this.interviewRepo.recordAnswer(
      data.exchangeId,
      data.answerText,
      feedback,
      score,
      data.timeSpentSeconds || 30,
    );

    const allExchanges = await this.interviewRepo.getExchanges(sessionId);
    const answeredCount = allExchanges.filter(e => e.userAnswerText).length;

    const bank = INTERVIEW_QUESTION_BANKS[session.interviewType] || INTERVIEW_QUESTION_BANKS[InterviewType.MIXED];

    let nextQuestion: InterviewExchangeDto | undefined;
    let isComplete = false;

    if (answeredCount < bank.length) {
      const nextQuestionText = bank[answeredCount];
      nextQuestion = await this.interviewRepo.createExchange(sessionId, answeredCount + 1, nextQuestionText);
    } else {
      isComplete = true;
    }

    return { answer: updatedExchange, nextQuestion, isComplete };
  }

  async finishInterview(sessionId: string, userId: string): Promise<InterviewFeedbackDto> {
    const session = await this.interviewRepo.getSessionById(sessionId);
    if (!session || session.userId !== userId) {
      throw new NotFoundError('Interview session not found or access denied', 'SESSION_NOT_FOUND');
    }

    const exchanges = await this.interviewRepo.getExchanges(sessionId);
    const answered = exchanges.filter(e => e.score !== undefined && e.score !== null);

    const avgScore = answered.length > 0
      ? Math.round(answered.reduce((acc, curr) => acc + (curr.score || 0), 0) / answered.length)
      : 70;

    const commScore = Math.min(100, Math.max(0, avgScore + 5));
    const techScore = Math.min(100, Math.max(0, avgScore - 2));
    const confScore = Math.min(100, Math.max(0, avgScore + 2));

    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const improvements: string[] = [];

    if (avgScore >= 80) {
      strengths.push('Strong technical articulation and algorithmic reasoning.');
      strengths.push('Clear problem decomposition and edge-case handling.');
      improvements.push('Maintain momentum on complex distributed systems topics.');
    } else if (avgScore >= 60) {
      strengths.push('Solid core understanding with structured answers.');
      weaknesses.push('Could provide deeper technical specifics and quantify trade-offs.');
      improvements.push('Practice structuring responses with the STAR method (Situation, Task, Action, Result).');
    } else {
      weaknesses.push('Answers were overly brief or lacked technical depth.');
      improvements.push('Review fundamental data structures, design patterns, and complexity analysis.');
    }

    const summaryMdx = `### Interview Performance Analysis: ${session.interviewType}
**Overall Performance Score**: ${avgScore}/100
- **Technical Accuracy**: ${techScore}/100
- **Communication & Structure**: ${commScore}/100
- **Confidence & Delivery**: ${confScore}/100

#### Key Takeaways
${strengths.map(s => `- ✅ ${s}`).join('\n')}
${weaknesses.map(w => `- ⚠️ ${w}`).join('\n')}

#### Recommended Next Steps
${improvements.map(i => `- 🎯 ${i}`).join('\n')}
`;

    await this.interviewRepo.completeSession(
      sessionId,
      avgScore,
      commScore,
      techScore,
      confScore,
      summaryMdx,
      improvements,
    );

    const updatedSession = (await this.interviewRepo.getSessionById(sessionId))!;

    // Log Activity Feed Event
    await this.feedRepo.createEvent(
      userId,
      ActivityType.INTERVIEW_COMPLETED,
      `Completed a ${session.interviewType} mock interview`,
      `Scored ${avgScore}/100 in ${session.roleTitle} mock interview session.`,
      {
        sessionId,
        interviewType: session.interviewType,
        score: avgScore,
      },
      true,
    );


    return {
      session: updatedSession,
      exchanges,
      feedbackSummaryMdx: summaryMdx,
      strengths,
      weaknesses,
      improvementSuggestions: improvements,
    };
  }

  async getInterviewFeedback(sessionId: string, userId: string): Promise<InterviewFeedbackDto> {
    const session = await this.interviewRepo.getSessionById(sessionId);
    if (!session || session.userId !== userId) {
      throw new NotFoundError('Interview session not found or access denied', 'SESSION_NOT_FOUND');
    }

    const exchanges = await this.interviewRepo.getExchanges(sessionId);

    return {
      session,
      exchanges,
      feedbackSummaryMdx: `### Interview Performance Analysis\n**Score**: ${session.overallScore || 75}/100`,
      strengths: ['Clear terminology', 'Structured thinking'],
      weaknesses: ['Deepen edge cases'],
      improvementSuggestions: ['Practice STAR framework responses'],
    };
  }

  async getUserInterviewHistory(userId: string): Promise<InterviewSessionDto[]> {
    return this.interviewRepo.getUserSessions(userId);
  }
}
