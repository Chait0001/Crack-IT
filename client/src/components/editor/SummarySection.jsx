import React, { useState } from 'react';
import { Zap } from 'lucide-react';
import { useResumeStore } from '../../store/resumeStore';
import { streamSSE, AI_ENDPOINTS } from '../../utils/streamer';
import toast from 'react-hot-toast';

export default function SummarySection({ resumeId }) {
  const { sections, updateSection } = useResumeStore();
  const text = sections?.summary?.text || '';
  const [loading, setLoading] = useState(false);

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  const pct = Math.min(100, Math.round((wordCount / 150) * 100));
  const color = wordCount < 50 ? 'bg-red-400' : wordCount <= 150 ? 'bg-emerald-500' : 'bg-amber-500';

  const update = (val) => updateSection('summary', { text: val });

  const handleGenerate = async () => {
    if (!sections?.experience?.length) {
      toast.error('Add experience first so AI has context');
      return;
    }
    setLoading(true);
    update('');
    let result = '';
    const controller = new AbortController();

    await streamSSE(AI_ENDPOINTS.summary, { resumeId }, {
      onChunk: (c) => { result += c; update(result); },
      onDone: () => { setLoading(false); toast.success('Summary generated!'); },
      onError: (e) => { toast.error(e.message || 'AI error'); setLoading(false); },
      signal: controller.signal,
    });
  };

  return (
    <div className="space-y-2 pt-2">
      <div className="relative">
        <textarea
          value={text}
          onChange={e => update(e.target.value)}
          rows={5}
          placeholder="Write a compelling 3-sentence professional summary, or use AI to generate one..."
          className="input resize-none"
        />
      </div>

      {/* Word count bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-slate-400">
          <span>{wordCount} words</span>
          <span>Target: 80–150</span>
        </div>
        <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-300 ${color}`} style={{ width: `${pct}%` }} />
        </div>
        {wordCount < 50 && <p className="text-xs text-red-400">Too short — aim for 50+ words for a strong summary</p>}
        {wordCount > 150 && <p className="text-xs text-amber-400">A bit long — try to stay under 150 words</p>}
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="btn-ai w-full gap-2 text-xs py-2"
      >
        {loading ? (
          <><span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />Generating...</>
        ) : (
          <><Zap className="w-3.5 h-3.5" />Generate with AI</>
        )}
      </button>
    </div>
  );
}
