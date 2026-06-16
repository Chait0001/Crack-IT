import React from 'react';
import { X, Palette, Type, AlignJustify } from 'lucide-react';
import { useResumeStore } from '../../store/resumeStore';

const TEMPLATES = [
  { id: 'modern',    label: 'Modern',    gradient: 'from-primary-500 to-violet-500' },
  { id: 'classic',   label: 'Classic',   gradient: 'from-slate-700 to-slate-900' },
  { id: 'minimal',   label: 'Minimal',   gradient: 'from-gray-400 to-gray-600' },
  { id: 'creative',  label: 'Creative',  gradient: 'from-rose-500 to-orange-500' },
  { id: 'executive', label: 'Executive', gradient: 'from-amber-600 to-yellow-700' },
];

const COLORS = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#ef4444', '#06b6d4'];
const FONTS = ['Inter', 'Georgia', 'Roboto', 'Playfair Display'];
const SPACINGS = ['compact', 'standard', 'spacious'];

export default function StylePanel({ onClose }) {
  const { template, colorTheme, fontFamily, spacing, setTemplate, setColorTheme, setFontFamily, setSpacing } = useResumeStore();

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">Customize Style</h3>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
      </div>

      {/* Templates */}
      <div>
        <label className="input-label flex items-center gap-1"><Palette className="w-3 h-3" />Template</label>
        <div className="grid grid-cols-2 gap-2 mt-1">
          {TEMPLATES.map(t => (
            <button
              key={t.id}
              onClick={() => setTemplate(t.id)}
              className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border-2 transition-all text-xs ${template === t.id ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/30' : 'border-slate-200 dark:border-slate-700 hover:border-primary-300'}`}
            >
              <div className={`w-full h-8 rounded-lg bg-gradient-to-br ${t.gradient}`} />
              <span className={template === t.id ? 'text-primary-600 font-semibold' : 'text-slate-500'}>{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Color */}
      <div>
        <label className="input-label">Accent Color</label>
        <div className="flex gap-2 mt-1 flex-wrap">
          {COLORS.map(c => (
            <button
              key={c}
              onClick={() => setColorTheme(c)}
              className={`w-7 h-7 rounded-full border-4 transition-all ${colorTheme === c ? 'border-slate-900 dark:border-white scale-110' : 'border-transparent hover:scale-105'}`}
              style={{ backgroundColor: c }}
              title={c}
            />
          ))}
          <input type="color" value={colorTheme} onChange={e => setColorTheme(e.target.value)}
            className="w-7 h-7 rounded-full border-0 cursor-pointer p-0 overflow-hidden" title="Custom color" />
        </div>
      </div>

      {/* Font */}
      <div>
        <label className="input-label flex items-center gap-1"><Type className="w-3 h-3" />Font Family</label>
        <div className="grid grid-cols-1 gap-1.5 mt-1">
          {FONTS.map(f => (
            <button
              key={f}
              onClick={() => setFontFamily(f)}
              className={`text-left px-3 py-2 rounded-xl border text-sm transition-all ${fontFamily === f ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/30 text-primary-600 font-medium' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-primary-300'}`}
              style={{ fontFamily: f }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Spacing */}
      <div>
        <label className="input-label flex items-center gap-1"><AlignJustify className="w-3 h-3" />Spacing</label>
        <div className="flex gap-2 mt-1">
          {SPACINGS.map(s => (
            <button
              key={s}
              onClick={() => setSpacing(s)}
              className={`flex-1 py-2 rounded-xl border text-xs capitalize transition-all ${spacing === s ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/30 text-primary-600 font-semibold' : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:border-primary-300'}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
