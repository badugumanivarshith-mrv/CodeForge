import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { multimodalApi } from '../../services/multimodalApi';
import { AnalysisResultDto, MediaAssetDto } from '@codeforge/shared';

export const ImageAnalyzerPage: React.FC = () => {
  const [name, setName] = useState('system_architecture_diagram.png');
  const [storageUrl, setStorageUrl] = useState('https://storage.googleapis.com/codeforge-assets/diagram.png');
  const [fileSize, setFileSize] = useState(15000);
  const [loading, setLoading] = useState(false);
  const [asset, setAsset] = useState<MediaAssetDto | null>(null);
  const [result, setResult] = useState<AnalysisResultDto | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const outcome = await multimodalApi.analyzeImage({
        name,
        storageUrl,
        fileSizeCharacters: fileSize,
      });
      setAsset(outcome.asset);
      setResult(outcome.result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-indigo-900/40 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-3xl">🖼️</span>
            <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-amber-400">
              Image Vision Analyzer
            </h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Detect graphic structures, parse text contents, and map components boundaries.
          </p>
        </div>
      </div>

      {/* Navigation Quick Links */}
      <div className="flex flex-wrap gap-2 pt-1">
        {[
          { label: 'Intelligence Overview', path: '/multimodal', icon: '☁️' },
          { label: 'Image Analyzer', path: '/multimodal/analyze-image', icon: '🖼️' },
          { label: 'Document Intelligence', path: '/multimodal/analyze-document', icon: '📄' },
          { label: 'Reasoning Studio', path: '/multimodal/reason', icon: '🧠' },
        ].map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="px-3.5 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/80 text-xs font-semibold text-slate-300 transition-all flex items-center gap-1.5 shadow-md"
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <form onSubmit={handleAnalyze} className="lg:col-span-2 space-y-6 bg-slate-900/40 border border-slate-900 p-8 rounded-2xl shadow-xl">
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase text-slate-400">Image Asset File Name</label>
            <input
              type="text"
              required
              className="w-full bg-slate-950 border border-slate-850 focus:border-indigo-500 rounded-lg p-3 text-sm text-slate-100 font-medium transition-all focus:outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase text-slate-400">GCS Storage Destination URL</label>
            <input
              type="url"
              required
              className="w-full bg-slate-950 border border-slate-850 focus:border-indigo-500 rounded-lg p-3 text-sm text-slate-100 font-medium transition-all focus:outline-none"
              value={storageUrl}
              onChange={(e) => setStorageUrl(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase text-slate-400">Size (Characters Representation)</label>
            <input
              type="number"
              required
              className="w-full bg-slate-950 border border-slate-850 focus:border-indigo-500 rounded-lg p-3 text-sm text-slate-100 font-medium transition-all focus:outline-none"
              value={fileSize}
              onChange={(e) => setFileSize(Number(e.target.value))}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-amber-500 hover:opacity-90 font-bold text-white text-sm tracking-wider uppercase transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2"
          >
            {loading ? 'Performing Vision Model Pass...' : '🖼️ Execute Vision Analysis ➔'}
          </button>
        </form>

        <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-900 shadow-2xl h-fit space-y-4">
          <h2 className="text-lg font-bold text-slate-200">Analysis Results</h2>
          {result ? (
            <div className="space-y-4 text-xs font-mono">
              {asset && (
                <div>
                  <span className="text-[10px] text-slate-500 block">Registered Asset ID</span>
                  <span className="text-[11px] text-indigo-400 font-bold block mt-0.5">{asset.id}</span>
                </div>
              )}
              <div>
                <span className="text-[10px] text-slate-500 block">Consensus Score</span>
                <span className="text-sm font-bold text-emerald-400 mt-0.5 block">{result.confidenceScore * 100}%</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Detected Graphic Elements</span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {result.detectedTags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-900/40 text-[10px]">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              {result.ocrText && (
                <div>
                  <span className="text-[10px] text-slate-500 block">Parsed OCR Transcription</span>
                  <p className="text-[11px] text-slate-300 leading-relaxed mt-1">{result.ocrText}</p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-slate-500 leading-normal">Submit an image asset storage URL to run simulated tag localization.</p>
          )}
        </div>
      </div>
    </div>
  );
};
