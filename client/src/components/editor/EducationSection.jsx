import React from 'react';
import { Plus, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { useResumeStore } from '../../store/resumeStore';

function EduItem({ edu, index, onUpdate, onDelete }) {
  const [open, setOpen] = useState(true);
  const update = (f, v) => onUpdate(index, { ...edu, [f]: v });
  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
      <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800 cursor-pointer" onClick={() => setOpen(!open)}>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{edu.degree || 'New Education'}</p>
          <p className="text-xs text-slate-500 truncate">{edu.institution}</p>
        </div>
        <button onClick={e => { e.stopPropagation(); onDelete(index); }} className="text-slate-300 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
        {open ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
      </div>
      {open && (
        <div className="p-3 space-y-2.5 animate-fade-in">
          <div>
            <label className="input-label">Institution</label>
            <input value={edu.institution || ''} onChange={e => update('institution', e.target.value)} className="input" placeholder="MIT" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="input-label">Degree</label>
              <input value={edu.degree || ''} onChange={e => update('degree', e.target.value)} className="input" placeholder="Bachelor of Science" />
            </div>
            <div>
              <label className="input-label">Field</label>
              <input value={edu.field || ''} onChange={e => update('field', e.target.value)} className="input" placeholder="Computer Science" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="input-label">Start</label>
              <input type="month" value={edu.startDate || ''} onChange={e => update('startDate', e.target.value)} className="input" />
            </div>
            <div>
              <label className="input-label">End</label>
              <input type="month" value={edu.endDate || ''} onChange={e => update('endDate', e.target.value)} className="input" />
            </div>
            <div>
              <label className="input-label">GPA</label>
              <input value={edu.gpa || ''} onChange={e => update('gpa', e.target.value)} className="input" placeholder="3.9" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function EducationSection() {
  const { sections, updateSection } = useResumeStore();
  const education = sections?.education || [];
  const add = () => updateSection('education', [...education, { institution: '', degree: '', field: '', startDate: '', endDate: '', gpa: '' }]);
  const update = (i, v) => { const l = [...education]; l[i] = v; updateSection('education', l); };
  const remove = (i) => updateSection('education', education.filter((_, j) => j !== i));
  return (
    <div className="space-y-3 pt-2">
      {education.map((e, i) => <EduItem key={i} edu={e} index={i} onUpdate={update} onDelete={remove} />)}
      <button onClick={add} className="btn-secondary w-full text-xs gap-1 py-2.5"><Plus className="w-3.5 h-3.5" /> Add Education</button>
    </div>
  );
}
