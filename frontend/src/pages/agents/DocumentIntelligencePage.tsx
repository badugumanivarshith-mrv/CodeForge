import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { agenticWorkspaceApi } from '../../services/agenticWorkspaceApi';
import {
  WorkspaceDocumentDto,
  DocumentType,
} from '@codeforge/shared';

export const DocumentIntelligencePage: React.FC = () => {
  const [documents, setDocuments] = useState<WorkspaceDocumentDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [documentType, setDocumentType] = useState<DocumentType>(DocumentType.RESUME);
  const [rawText, setRawText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const data = await agenticWorkspaceApi.listDocuments();
      setDocuments(data);
    } catch (err) {
      console.error('Failed to load documents:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !rawText.trim()) return;
    try {
      setAnalyzing(true);
      const doc = await agenticWorkspaceApi.analyzeDocument({
        title,
        documentType,
        rawTextContent: rawText,
      });
      setDocuments(prev => [doc, ...prev]);
      setTitle('');
      setRawText('');
    } catch (err) {
      console.error('Failed to analyze document:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  const toggleCard = (cardKey: string) => {
    setFlippedCards(prev => ({ ...prev, [cardKey]: !prev[cardKey] }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-lg font-medium text-slate-300">Loading Document Intelligence...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center space-x-2">
              <Link to="/ai-command-center" className="text-xs text-indigo-400 hover:underline">
                ← AI Command Center
              </Link>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-400">Document Extraction</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white mt-1">
              AI Document Intelligence 2.0
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Extract skills, action items, executive summaries, and interactive flashcards from technical documents.
            </p>
          </div>
        </div>

        {/* Ingestion Sandbox Form */}
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-5">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>📄</span> Ingest & Analyze Technical Document
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Upload or paste resumes, system architecture RFCs, research papers, or interview notes.
            </p>
          </div>

          <form onSubmit={handleAnalyze} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-slate-400 block mb-1">Document Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Distributed Invariants & Consensus Whitepaper"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1">Document Type</label>
                <select
                  value={documentType}
                  onChange={e => setDocumentType(e.target.value as DocumentType)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value={DocumentType.RESUME}>Resume / CV</option>
                  <option value={DocumentType.RESEARCH_PAPER}>Research Paper / RFC</option>
                  <option value={DocumentType.INTERVIEW_NOTES}>Interview Notes / Feedback</option>
                  <option value={DocumentType.COURSE_MATERIAL}>Course Material / Lecture Notes</option>
                  <option value={DocumentType.ENTERPRISE_REPORT}>Enterprise Architecture Report</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Raw Text / Markdown Content</label>
              <textarea
                value={rawText}
                onChange={e => setRawText(e.target.value)}
                placeholder="Paste the contents of your technical document here..."
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 h-32 resize-none"
                required
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={analyzing}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-xs font-bold text-white hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/20 disabled:opacity-50 transition-all"
              >
                {analyzing ? 'Extracting Intelligence...' : '⚡ Analyze Document & Generate Flashcards'}
              </button>
            </div>
          </form>
        </div>

        {/* Analyzed Documents List */}
        <div className="space-y-8">
          {documents.map(doc => (
            <div
              key={doc.id}
              className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6"
            >
              {/* Doc Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-indigo-500/20 text-indigo-400">
                      {doc.documentType}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white">{doc.title}</h3>
                </div>
              </div>

              {/* Summary */}
              <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 text-xs text-indigo-200 leading-relaxed">
                <strong>Intelligence Summary:</strong> {doc.summary}
              </div>

              {/* Extracted Skills & Action Items */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <span>💡</span> Extracted Technical Competencies
                  </h4>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {doc.extractedSkills.map((sk, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-900 border border-slate-800 text-slate-200"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <h4 className="text-xs font-bold text-purple-400 flex items-center gap-1">
                    <span>✅</span> Actionable Takeaways
                  </h4>
                  <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                    {doc.extractedActions.map((act, idx) => (
                      <li key={idx}>{act}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Interactive Flashcards */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  🧠 Spaced Repetition Study Flashcards (Click Card to Flip)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {doc.flashcards.map((card, cIdx) => {
                    const cardKey = `${doc.id}-${cIdx}`;
                    const isFlipped = !!flippedCards[cardKey];
                    return (
                      <div
                        key={cIdx}
                        onClick={() => toggleCard(cardKey)}
                        className={`p-5 rounded-2xl border transition-all cursor-pointer min-h-[140px] flex flex-col justify-between ${
                          isFlipped
                            ? 'bg-gradient-to-br from-indigo-950/40 to-purple-950/40 border-indigo-500/50'
                            : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between text-[10px] text-slate-500 mb-2">
                            <span className="font-bold text-indigo-400">{card.tag}</span>
                            <span>{isFlipped ? 'Answer' : 'Question (Click to flip)'}</span>
                          </div>
                          <p className="text-xs font-semibold text-white">
                            {isFlipped ? card.answer : card.question}
                          </p>
                        </div>
                        <div className="text-[10px] text-right text-slate-500 pt-2">
                          {isFlipped ? '✓ Review Completed' : '↺ Tap to reveal'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
