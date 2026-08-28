import React, { useState, useEffect } from 'react';
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Search,
  Plus,
} from 'lucide-react';
import { enterpriseApi } from '../services/enterpriseApi';
import {
  CertificateTemplateDto,
  CertificateVerificationResultDto,
} from '@codeforge/shared';

export const CertificationPage: React.FC = () => {
  const [templates, setTemplates] = useState<CertificateTemplateDto[]>([]);
  const [verificationInput, setVerificationInput] = useState('');
  const [verificationResult, setVerificationResult] = useState<CertificateVerificationResultDto | null>(null);
  const [verifying, setVerifying] = useState(false);

  // Issue modal
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [recipientUserId, setRecipientUserId] = useState('');
  const [skillName, setSkillName] = useState('Full-Stack Distributed Systems Master');
  const [score, setScore] = useState(96);
  const [issuing, setIssuing] = useState(false);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const data = await enterpriseApi.listCertificateTemplates();
      setTemplates(data);
    } catch (err) {
      console.error('Failed to load certificate templates:', err);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationInput.trim()) return;
    try {
      setVerifying(true);
      const res = await enterpriseApi.verifyCertificatePublic(verificationInput.trim());
      setVerificationResult(res);
    } catch (err) {
      console.error('Failed to verify certificate:', err);
      setVerificationResult({
        isValid: false,
        reason: 'Verification request failed or certificate not found.',
        verifiedAt: new Date().toISOString(),
      });
    } finally {
      setVerifying(false);
    }
  };

  const handleIssueCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientUserId || !skillName) return;
    try {
      setIssuing(true);
      await enterpriseApi.issueCertificate({
        recipientUserId,
        skillName,
        score,
      });
      setShowIssueModal(false);
    } catch (err) {
      console.error('Failed to issue certificate:', err);
    } finally {
      setIssuing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 border-b border-slate-800 pb-6 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-400">
                Digital Credential Engine
              </span>
              <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs text-emerald-400">
                <ShieldCheck className="h-3 w-3" /> Cryptographically Verifiable
              </span>
            </div>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Enterprise Certification & Public Verification
            </h1>
            <p className="mt-1 text-slate-400">
              Tamper-resistant digital skill badges, instant QR validation, and verifiable competence credentials.
            </p>
          </div>

          <button
            onClick={() => setShowIssueModal(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 font-semibold text-white shadow-lg transition-all hover:bg-amber-500"
          >
            <Plus className="h-4 w-4" /> Issue Skill Certificate
          </button>
        </div>

        {/* Public Verification Box */}
        <div className="mt-8 rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/90 to-slate-950/90 p-8 backdrop-blur-xl shadow-2xl">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center justify-center rounded-2xl bg-amber-500/10 p-3 text-amber-400">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <h2 className="mt-4 text-2xl font-bold text-white">Public Certificate Verification Portal</h2>
            <p className="mt-1 text-sm text-slate-400">
              Enter any Certificate Number or SHA-256 Verification Hash to cryptographically validate authenticity.
            </p>

            <form onSubmit={handleVerify} className="mt-6 flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  value={verificationInput}
                  onChange={e => setVerificationInput(e.target.value)}
                  placeholder="e.g. CF-CERT-L8X2-9K1F or SHA-256 Hash..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-12 pr-4 text-sm text-white focus:border-amber-500 focus:outline-none"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={verifying}
                className="rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 px-8 py-3 font-semibold text-white shadow-lg transition-all hover:opacity-90 disabled:opacity-50"
              >
                {verifying ? 'Verifying...' : 'Verify Credential'}
              </button>
            </form>

            {/* Verification Result Display */}
            {verificationResult && (
              <div className="mt-8 text-left">
                {verificationResult.isValid && verificationResult.certificate ? (
                  <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-6 backdrop-blur-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                        <div>
                          <h3 className="text-lg font-bold text-white">Official Credential Authenticated</h3>
                          <p className="text-xs text-emerald-400">Verified by CodeForge Root Authority</p>
                        </div>
                      </div>
                      <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400">
                        ACTIVE & VALID
                      </span>
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-4 border-t border-emerald-500/20 pt-4 sm:grid-cols-2 lg:grid-cols-3 text-sm">
                      <div>
                        <p className="text-xs text-slate-400 uppercase font-semibold">Recipient</p>
                        <p className="font-bold text-white mt-1">
                          {verificationResult.certificate.recipientName || 'Verified Candidate'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 uppercase font-semibold">Skill Certified</p>
                        <p className="font-bold text-amber-400 mt-1">{verificationResult.certificate.skillName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 uppercase font-semibold">Competency Score</p>
                        <p className="font-bold text-emerald-400 mt-1">{verificationResult.certificate.score}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 uppercase font-semibold">Certificate Number</p>
                        <p className="font-mono text-xs text-slate-200 mt-1">
                          {verificationResult.certificate.certificateNumber}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 uppercase font-semibold">Issue Date</p>
                        <p className="text-slate-200 mt-1">
                          {new Date(verificationResult.certificate.issueDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 uppercase font-semibold">Cryptographic Hash</p>
                        <p className="font-mono text-[10px] text-slate-400 truncate mt-1">
                          {verificationResult.certificate.verificationHash}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-red-500/30 bg-red-950/20 p-6">
                    <div className="flex items-center gap-3">
                      <XCircle className="h-8 w-8 text-red-400" />
                      <div>
                        <h3 className="text-lg font-bold text-white">Verification Failed</h3>
                        <p className="text-xs text-red-400">{verificationResult.reason}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Certificate Templates */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-white">Available Accreditation Templates</h2>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {templates.map(t => (
              <div key={t.id} className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                    <Award className="h-5 w-5" />
                  </div>
                  <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-xs text-slate-300">
                    {t.issuerName}
                  </span>
                </div>
                <h3 className="mt-4 text-base font-bold text-white">{t.name}</h3>
                <p className="mt-1 text-xs text-slate-400">Standard criteria: score ≥ 80%, verified proctored code challenge.</p>
              </div>
            ))}
          </div>
        </div>

        {/* Issue Certificate Modal */}
        {showIssueModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <h3 className="text-lg font-bold text-white">Issue Digital Certificate</h3>
                <button onClick={() => setShowIssueModal(false)} className="text-slate-400 hover:text-white">
                  ✕
                </button>
              </div>

              <form onSubmit={handleIssueCertificate} className="mt-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase">Recipient User ID</label>
                  <input
                    type="text"
                    value={recipientUserId}
                    onChange={e => setRecipientUserId(e.target.value)}
                    placeholder="Enter recipient UUID or User ID"
                    className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase">Skill / Program Name</label>
                  <input
                    type="text"
                    value={skillName}
                    onChange={e => setSkillName(e.target.value)}
                    placeholder="e.g. Distributed Systems & High-Scale Cloud Architecture"
                    className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase">Assessment Score (%)</label>
                  <input
                    type="number"
                    value={score}
                    onChange={e => setScore(Number(e.target.value))}
                    min={60}
                    max={100}
                    className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none"
                    required
                  />
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowIssueModal(false)}
                    className="rounded-xl px-4 py-2 text-sm font-medium text-slate-300 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={issuing}
                    className="rounded-xl bg-amber-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-amber-500 disabled:opacity-50"
                  >
                    {issuing ? 'Generating SHA-256 Credential...' : 'Issue & Sign Certificate'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
