import React, { useState } from 'react';
import { BarChart2, ChevronUp, ChevronDown, X } from 'lucide-react';
import { useResumeStore } from '../../store/resumeStore';

export default function ScoreWidget({ mini = false }) {
  const { resumeScore, scoreBreakdown } = useResumeStore();
  const [expanded, setExpanded] = useState(false);

  const color = resumeScore >= 71 ? 'text-emerald-500' : resumeScore >= 41 ? 'text-amber-500' : 'text-red-500';
  const bg = resumeScore >= 71 ? 'bg-emerald-500' : resumeScore >= 41 ? 'bg-amber-500' : 'bg-red-500';
  const ring = resumeScore >= 71 ? 'ring-emerald-400' : resumeScore >= 41 ? 'ring-amber-400' : 'ring-red-400';

  if (mini) {
    return (
      <button
        onClick={() => setExpanded(!expanded)}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ring-2 ${ring} bg-white dark:bg-slate-900 ${color} transition-all hover:scale-105`}
        title="Resume score"
      >
        <BarChart2 className="w-3 h-3" />
        {resumeScore}
        {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>
    );
  }

  if (!expanded) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 card shadow-2xl animate-slide-up">
      <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="10" />
              <circle
                cx="50" cy="50" r="40" fill="none"
                stroke={resumeScore >= 71 ? '#10b981' : resumeScore >= 41 ? '#f59e0b' : '#ef4444'}
                strokeWidth="10"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - resumeScore / 100)}`}
                strokeLinecap="round"
                className="transition-all duration-700"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-xs font-black ${color}`}>{resumeScore}</span>
            </div>
          </div>
          <div>
            <p className="font-bold text-slate-900 dark:text-white text-sm">Resume Score</p>
            <p className={`text-xs font-semibold ${color}`}>
              {resumeScore >= 71 ? 'Excellent!' : resumeScore >= 41 ? 'Getting There' : 'Needs Work'}
            </p>
          </div>
        </div>
        <button onClick={() => setExpanded(false)} className="btn-ghost p-1 rounded-lg">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-2 max-h-72 overflow-y-auto">
        {(scoreBreakdown || []).map((item, i) => (
          <div key={i} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className="shrink-0">
                {item.status === 'good' ? '✅' : item.status === 'partial' ? '⚠️' : item.status === 'bad' ? '❌' : '○'}
              </span>
              <span className="text-xs text-slate-600 dark:text-slate-400 truncate">{item.label}</span>
            </div>
            <span className={`text-xs font-bold shrink-0 ${item.earned === item.points ? 'text-emerald-600' : item.earned > 0 ? 'text-amber-600' : 'text-slate-300'}`}>
              {item.earned}/{item.points}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
