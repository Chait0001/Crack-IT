import React, { useState, useRef } from 'react';
import { X, Zap, Download, Edit } from 'lucide-react';
import { streamSSE, AI_ENDPOINTS } from '../../utils/streamer';
import toast from 'react-hot-toast';

export default function CoverLetterModal({ resumeId, onClose }) {
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const controllerRef = useRef(null);

  const generate = async () => {
    if (!jobTitle || !company) { toast.error('Add job title and company'); return; }
    setLoading(true);
    setCoverLetter('');
    controllerRef.current?.abort();
    controllerRef.current = new AbortController();
    let result = '';

    await streamSSE(AI_ENDPOINTS.cover,
      { resumeId, jobTitle, company, jobDescription },
      {
        onChunk: (c) => { result += c; setCoverLetter(result); },
        onDone: () => { setLoading(false); toast.success('Cover letter generated!'); },
        onError: (e) => { toast.error(e.message); setLoading(false); },
        signal: controllerRef.current.signal,
      }
    );
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetter).then(() => toast.success('Copied to clipboard!'));
  };

  const handleDownload = () => {
    const blob = new Blob([coverLetter], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Cover_Letter_${company.replace(/\s/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box max-w-3xl">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
              <Zap className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white">Cover Letter Generator</h2>
              <p className="text-xs text-slate-400">AI writes a tailored cover letter using your resume</p>
            </div>
          </div>
          <button onClick={onClose} className="btn-ghost p-2 rounded-xl"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="input-label">Job Title</label>
              <input value={jobTitle} onChange={e => setJobTitle(e.target.value)} className="input" placeholder="Senior Software Engineer" />
            </div>
            <div>
              <label className="input-label">Company Name</label>
              <input value={company} onChange={e => setCompany(e.target.value)} className="input" placeholder="Google" />
            </div>
          </div>
          <div>
            <label className="input-label">Job Description (optional but recommended)</label>
            <textarea value={jobDescription} onChange={e => setJobDescription(e.target.value)} rows={4} className="input resize-none text-xs" placeholder="Paste the job description for a more tailored letter..." />
          </div>

          <button onClick={generate} disabled={loading || !jobTitle || !company} className="btn-ai w-full gap-2">
            {loading ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Generating...</> : <><Zap className="w-4 h-4" />Generate Cover Letter</>}
          </button>

          {coverLetter && (
            <div className="animate-fade-in">
              <div className="flex items-center justify-between mb-2">
                <label className="input-label m-0">Cover Letter</label>
                <div className="flex gap-2">
                  <button onClick={() => setEditing(!editing)} className="btn-ghost btn-sm gap-1 text-xs"><Edit className="w-3 h-3" />{editing ? 'Lock' : 'Edit'}</button>
                  <button onClick={handleCopy} className="btn-secondary btn-sm text-xs">Copy</button>
                  <button onClick={handleDownload} className="btn-secondary btn-sm gap-1 text-xs"><Download className="w-3 h-3" />Download</button>
                </div>
              </div>
              {editing ? (
                <textarea value={coverLetter} onChange={e => setCoverLetter(e.target.value)} rows={16} className="input resize-none text-xs font-mono" />
              ) : (
                <div className={`input text-xs whitespace-pre-wrap min-h-48 max-h-96 overflow-y-auto leading-relaxed ${loading ? 'typewriter' : ''}`}>
                  {coverLetter}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
