import React, { useState } from 'react';
import { X, Zap, Search, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { useResumeStore } from '../../store/resumeStore';

export default function ATSScoreModal({ resumeId, onClose }) {
  const { setAtsScore } = useResumeStore();
  const [jd, setJd] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleAnalyze = async () => {
    if (!jd.trim()) { toast.error('Paste a job description first'); return; }
    setLoading(true);
    try {
      const { data } = await api.post('/ai/ats-score', { resumeId, jobDescription: jd });
      setResult(data);
      setAtsScore(data.score);
      toast.success('ATS analysis complete!');
    } catch (e) { toast.error(e.response?.data?.message || 'Analysis failed'); } finally { setLoading(false); }
  };

  const scoreColor = result?.score >= 71 ? '#10b981' : result?.score >= 41 ? '#f59e0b' : '#ef4444';

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box max-w-2xl">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
              <Search className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white">ATS Score & Job Match</h2>
              <p className="text-xs text-slate-400">Paste a job description to see how your resume matches</p>
            </div>
          </div>
          <button onClick={onClose} className="btn-ghost p-2 rounded-xl"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6">
          {!result ? (
            <div className="space-y-4">
              <div>
                <label className="input-label">Job Description</label>
                <textarea
                  value={jd}
                  onChange={e => setJd(e.target.value)}
                  rows={10}
                  className="input resize-none font-mono text-xs"
                  placeholder="Paste the full job description here..."
                />
                <p className="text-xs text-slate-400 mt-1">{jd.trim().split(/\s+/).filter(Boolean).length} words</p>
              </div>
              <button onClick={handleAnalyze} disabled={loading || !jd.trim()} className="btn-ai w-full py-3 gap-2">
                {loading ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Analyzing...</> : <><Zap className="w-4 h-4" />Analyze Match</>}
              </button>
            </div>
          ) : (
            <div className="space-y-6 animate-fade-in">
              {/* Score */}
              <div className="flex items-center gap-6">
                <div className="relative w-28 h-28 shrink-0">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#e2e8f0" strokeWidth="8" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke={scoreColor} strokeWidth="8"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - result.score / 100)}`}
                      strokeLinecap="round" className="transition-all duration-1000" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black" style={{ color: scoreColor }}>{result.score}%</span>
                    <span className="text-xs text-slate-400">match</span>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-900 dark:text-white text-lg mb-1">
                    {result.score >= 71 ? '✅ Strong Match' : result.score >= 41 ? '⚠️ Partial Match' : '❌ Weak Match'}
                  </p>
                  <p className="text-sm text-slate-500">
                    Found {result.found?.length || 0} of {result.totalKeywords} keywords from the job description.
                    {result.score < 70 ? " Add the missing keywords to improve your ATS score." : " Your resume is well-optimized for this role!"}
                  </p>
                  {result.buzzwordsFound?.length > 0 && (
                    <p className="text-xs text-amber-500 mt-2">⚠️ Buzzwords found: {result.buzzwordsFound.join(', ')}</p>
                  )}
                </div>
              </div>

              {/* Keywords */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wide text-emerald-600 mb-2 flex items-center gap-1"><CheckCircle className="w-3 h-3" />Found ({result.found?.length})</h3>
                  <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto">
                    {(result.found || []).map(k => <span key={k} className="badge badge-green text-xs">{k}</span>)}
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wide text-red-500 mb-2 flex items-center gap-1"><AlertCircle className="w-3 h-3" />Missing ({result.missing?.length})</h3>
                  <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto">
                    {(result.missing || []).map(k => <span key={k} className="badge badge-red text-xs">{k}</span>)}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setResult(null)} className="btn-secondary flex-1">Try Another JD</button>
                <button onClick={onClose} className="btn-primary flex-1">Done</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
