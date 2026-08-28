import { test, describe } from 'node:test';
import assert from 'node:assert';
import { DocumentIntelligenceService } from '../../src/modules/agents/documentIntelligenceService';
import { DocumentType } from '@codeforge/shared';

describe('Document Intelligence 2.0 Unit Tests', () => {
  const createMockRepo = () => {
    const docs = new Map<string, any>();

    return {
      docs,
      async createDocument(userId: string, data: any) {
        const doc = {
          id: `doc-${Date.now()}-${Math.random()}`,
          userId,
          title: data.title,
          documentType: data.documentType,
          summary: data.summary,
          extractedSkills: data.extractedSkills || [],
          extractedActions: data.extractedActions || [],
          flashcards: data.flashcards || [],
          keyFindings: data.keyFindings || [],
          metadata: data.metadata || {},
          createdAt: new Date().toISOString(),
        };
        docs.set(doc.id, doc);
        return doc;
      },
      async getDocumentById(docId: string, userId: string) {
        const d = docs.get(docId);
        if (d && d.userId === userId) return d;
        return null;
      },
      async listDocuments(userId: string) {
        return Array.from(docs.values()).filter(d => d.userId === userId);
      },
      async deleteDocument(docId: string, userId: string) {
        const d = docs.get(docId);
        if (d && d.userId === userId) {
          docs.delete(docId);
          return true;
        }
        return false;
      },
    };
  };

  test('1. analyzes technical resume document and extracts senior competencies', async () => {
    const mockRepo = createMockRepo();
    const service = new DocumentIntelligenceService(mockRepo as any);

    const doc = await service.analyzeDocument('user-doc-1', {
      title: 'Senior Systems Architect Resume',
      documentType: DocumentType.RESUME,
      rawTextContent: 'Expert in Rust, Tokio async, Raft distributed consensus, PostgreSQL, and eBPF tracing.',
    });

    assert.ok(doc.id);
    assert.strictEqual(doc.documentType, DocumentType.RESUME);
    assert.ok(doc.summary.includes('distributed architecture'));
    assert.ok(doc.extractedSkills.includes('Rust Systems Programming'));
  });

  test('2. analyzes research paper RFC and extracts consensus invariants', async () => {
    const mockRepo = createMockRepo();
    const service = new DocumentIntelligenceService(mockRepo as any);

    const doc = await service.analyzeDocument('user-doc-2', {
      title: 'Raft Linearizable Consensus Protocol',
      documentType: DocumentType.RESEARCH_PAPER,
      rawTextContent: 'Proving safety under network partitions with strict quorum write-ahead logs.',
    });

    assert.ok(doc.summary.includes('linearizable write protocols'));
    assert.ok(doc.keyFindings.length >= 2);
  });

  test('3. generates interactive study flashcards with tags', async () => {
    const mockRepo = createMockRepo();
    const service = new DocumentIntelligenceService(mockRepo as any);

    const doc = await service.analyzeDocument('user-doc-3', {
      title: 'Distributed Storage Compaction',
      documentType: DocumentType.COURSE_MATERIAL,
      rawTextContent: 'LSM compaction, MemTables, SSTables, Bloom filters.',
    });

    assert.ok(doc.flashcards.length >= 3);
    const card = doc.flashcards[0];
    assert.ok(card.question.length > 5);
    assert.ok(card.answer.length > 5);
    assert.ok(card.tag);
  });

  test('4. extracts actionable takeaways checklist from technical material', async () => {
    const mockRepo = createMockRepo();
    const service = new DocumentIntelligenceService(mockRepo as any);

    const doc = await service.analyzeDocument('user-doc-4', {
      title: 'Post-Mortem Latency Spike Notes',
      documentType: DocumentType.INTERVIEW_NOTES,
      rawTextContent: 'Lock contention identified on WAL write buffer during peak traffic bursts.',
    });

    assert.ok(doc.extractedActions.length >= 2);
    assert.ok(doc.extractedActions.some(a => a.includes('zero-copy') || a.includes('SLAs')));
  });

  test('5. identifies domain-specific skills from text content', async () => {
    const mockRepo = createMockRepo();
    const service = new DocumentIntelligenceService(mockRepo as any);

    const doc = await service.analyzeDocument('user-doc-5', {
      title: 'Cloud Architecture Spec',
      documentType: DocumentType.ENTERPRISE_REPORT,
      rawTextContent: 'Configured gRPC protobuf RPC services with Postgres SQL backend.',
    });

    assert.ok(doc.extractedSkills.includes('gRPC & Protobuf RPCs'));
    assert.ok(doc.extractedSkills.includes('Relational Database Engineering'));
  });

  test('6. deletes document cleanly', async () => {
    const mockRepo = createMockRepo();
    const service = new DocumentIntelligenceService(mockRepo as any);

    const doc = await service.analyzeDocument('user-doc-6', {
      title: 'Temporary Doc',
      documentType: DocumentType.RESUME,
      rawTextContent: 'Temporary content',
    });

    const deleted = await service.deleteDocument(doc.id, 'user-doc-6');
    assert.strictEqual(deleted, true);

    const fetched = await service.getDocument(doc.id, 'user-doc-6');
    assert.strictEqual(fetched, null);
  });

  test('7. isolates documents per user id', async () => {
    const mockRepo = createMockRepo();
    const service = new DocumentIntelligenceService(mockRepo as any);

    const doc = await service.analyzeDocument('user-A', {
      title: 'User A Secret Resume',
      documentType: DocumentType.RESUME,
      rawTextContent: 'Secret content',
    });

    const userBDocs = await service.listDocuments('user-B');
    assert.strictEqual(userBDocs.length, 0);
  });
});
