import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useResumeStore } from '../../store/resumeStore';

export default function CustomSectionEditor() {
  const { sections, updateSection } = useResumeStore();
  const items = sections?.customSection || [];
  const add = () => updateSection('customSection', [...items, { title: '', content: '' }]);
  const update = (i, f, v) => { const l = [...items]; l[i] = { ...l[i], [f]: v }; updateSection('customSection', l); };
  const remove = (i) => updateSection('customSection', items.filter((_, j) => j !== i));
  return (
    <div className="space-y-3 pt-2">
      {items.map((item, i) => (
        <div key={i} className="border border-slate-200 dark:border-slate-700 rounded-xl p-3 space-y-2">
          <div className="flex items-center gap-2">
            <input value={item.title || ''} onChange={e => update(i, 'title', e.target.value)} className="input flex-1" placeholder="Section title (e.g. Languages, Volunteering...)" />
            <button onClick={() => remove(i)} className="text-slate-300 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
          </div>
          <textarea value={item.content || ''} onChange={e => update(i, 'content', e.target.value)} rows={3} className="input resize-none" placeholder="Section content..." />
        </div>
      ))}
      <button onClick={add} className="btn-secondary w-full text-xs gap-1 py-2.5"><Plus className="w-3.5 h-3.5" /> Add Custom Section</button>
    </div>
  );
}
