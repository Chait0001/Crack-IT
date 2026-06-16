import React, { useState } from 'react';
import { Plus, Trash2, GripVertical, Zap, ChevronDown, ChevronRight, X, Check } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useResumeStore } from '../../store/resumeStore';
import { streamSSE, AI_ENDPOINTS } from '../../utils/streamer';
import toast from 'react-hot-toast';

function BulletItem({ bullet, index, onUpdate, onDelete }) {
  return (
    <div className="flex items-start gap-2 group">
      <span className="text-slate-300 mt-2.5 text-xs shrink-0">•</span>
      <input
        value={bullet}
        onChange={e => onUpdate(index, e.target.value)}
        className="input py-1.5 text-xs flex-1"
        placeholder="Describe achievement with impact..."
      />
      <button onClick={() => onDelete(index)} className="mt-1.5 text-slate-300 hover:text-red-400 transition-colors shrink-0">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

function ExperienceItem({ exp, index, onUpdate, onDelete }) {
  const [open, setOpen] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [showAiInput, setShowAiInput] = useState(false);

  const update = (field, value) => onUpdate(index, { ...exp, [field]: value });
  const updateBullet = (bi, value) => {
    const bullets = [...(exp.bullets || [])];
    bullets[bi] = value;
    update('bullets', bullets);
  };
  const addBullet = () => update('bullets', [...(exp.bullets || []), '']);
  const deleteBullet = (bi) => update('bullets', (exp.bullets || []).filter((_, i) => i !== bi));

  const generateBullets = async () => {
    if (!exp.role) { toast.error('Add a role name first'); return; }
    setAiLoading(true);
    let result = '';
    await streamSSE(AI_ENDPOINTS.bullet, { role: exp.role, company: exp.company, description: aiInput }, {
      onChunk: (c) => {
        result += c;
        const lines = result.split('\n').filter(l => l.trim().startsWith('•'));
        update('bullets', lines.map(l => l.replace(/^•\s*/, '')));
      },
      onDone: () => { setAiLoading(false); setShowAiInput(false); setAiInput(''); toast.success('Bullets generated!'); },
      onError: (e) => { toast.error(e.message); setAiLoading(false); },
    });
  };

  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
      <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800 cursor-pointer" onClick={() => setOpen(!open)}>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{exp.role || 'New Experience'}</p>
          <p className="text-xs text-slate-500 truncate">{exp.company}</p>
        </div>
        <button onClick={e => { e.stopPropagation(); onDelete(index); }} className="text-slate-300 hover:text-red-400 shrink-0">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
        {open ? <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" /> : <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />}
      </div>

      {open && (
        <div className="p-3 space-y-2.5 animate-fade-in">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="input-label">Role / Title</label>
              <input value={exp.role || ''} onChange={e => update('role', e.target.value)} className="input" placeholder="Software Engineer" />
            </div>
            <div>
              <label className="input-label">Company</label>
              <input value={exp.company || ''} onChange={e => update('company', e.target.value)} className="input" placeholder="Acme Corp" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="input-label">Start Date</label>
              <input type="month" value={exp.startDate || ''} onChange={e => update('startDate', e.target.value)} className="input" />
            </div>
            <div>
              <label className="input-label">End Date</label>
              <input type="month" value={exp.endDate || ''} onChange={e => update('endDate', e.target.value)} className="input" disabled={exp.current} />
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-600 dark:text-slate-400">
            <input type="checkbox" checked={!!exp.current} onChange={e => update('current', e.target.checked)} className="rounded accent-primary-500" />
            Currently working here
          </label>

          {/* Bullets */}
          <div>
            <label className="input-label mb-2">Bullet Points</label>
            <div className="space-y-1.5">
              {(exp.bullets || []).map((b, bi) => (
                <BulletItem key={bi} bullet={b} index={bi} onUpdate={updateBullet} onDelete={deleteBullet} />
              ))}
            </div>
            <button onClick={addBullet} className="btn-ghost btn-sm mt-2 text-xs gap-1">
              <Plus className="w-3 h-3" /> Add Bullet
            </button>
          </div>

          {/* AI Bullets */}
          {showAiInput ? (
            <div className="bg-violet-50 dark:bg-violet-950/30 rounded-xl p-3 space-y-2">
              <label className="input-label text-violet-600">Describe your work (optional)</label>
              <textarea value={aiInput} onChange={e => setAiInput(e.target.value)} rows={2}
                className="input text-xs resize-none" placeholder="e.g. built payment system, led team of 5, improved perf by 40%..." />
              <div className="flex gap-2">
                <button onClick={generateBullets} disabled={aiLoading} className="btn-ai btn-sm flex-1 text-xs gap-1">
                  {aiLoading ? <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Zap className="w-3 h-3" />}
                  Generate
                </button>
                <button onClick={() => setShowAiInput(false)} className="btn-ghost btn-sm text-xs">Cancel</button>
              </div>
            </div>
          ) : (
            <button onClick={() => setShowAiInput(true)} className="btn-ai w-full text-xs gap-1 py-2">
              <Zap className="w-3 h-3" /> ✨ Generate Bullets with AI
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function ExperienceSection() {
  const { sections, updateSection } = useResumeStore();
  const experience = sections?.experience || [];

  const addExperience = () => {
    updateSection('experience', [...experience, { company: '', role: '', startDate: '', endDate: '', current: false, bullets: [''], order: experience.length }]);
  };

  const updateItem = (index, updated) => {
    const list = [...experience];
    list[index] = updated;
    updateSection('experience', list);
  };

  const deleteItem = (index) => {
    updateSection('experience', experience.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3 pt-2">
      {experience.map((exp, i) => (
        <ExperienceItem key={i} exp={exp} index={i} onUpdate={updateItem} onDelete={deleteItem} />
      ))}
      <button onClick={addExperience} className="btn-secondary w-full text-xs gap-1 py-2.5">
        <Plus className="w-3.5 h-3.5" /> Add Experience
      </button>
    </div>
  );
}
