import React, { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import { useResumeStore } from '../../store/resumeStore';

function CertItem({ cert, index, onUpdate, onDelete }) {
  const [open, setOpen] = useState(false);
  const update = (f, v) => onUpdate(index, { ...cert, [f]: v });
  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
      <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800 cursor-pointer" onClick={() => setOpen(!open)}>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{cert.name || 'New Certification'}</p>
          <p className="text-xs text-slate-500">{cert.issuer}</p>
        </div>
        <button onClick={e => { e.stopPropagation(); onDelete(index); }} className="text-slate-300 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
        {open ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
      </div>
      {open && (
        <div className="p-3 space-y-2 animate-fade-in">
          <div>
            <label className="input-label">Certification Name</label>
            <input value={cert.name || ''} onChange={e => update('name', e.target.value)} className="input" placeholder="AWS Certified Solutions Architect" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="input-label">Issuer</label>
              <input value={cert.issuer || ''} onChange={e => update('issuer', e.target.value)} className="input" placeholder="Amazon Web Services" />
            </div>
            <div>
              <label className="input-label">Date</label>
              <input type="month" value={cert.date || ''} onChange={e => update('date', e.target.value)} className="input" />
            </div>
          </div>
          <div>
            <label className="input-label">Credential URL</label>
            <input value={cert.link || ''} onChange={e => update('link', e.target.value)} className="input" placeholder="https://..." />
          </div>
        </div>
      )}
    </div>
  );
}

export default function CertificationsSection() {
  const { sections, updateSection } = useResumeStore();
  const certifications = sections?.certifications || [];
  const add = () => updateSection('certifications', [...certifications, { name: '', issuer: '', date: '', link: '' }]);
  const update = (i, v) => { const l = [...certifications]; l[i] = v; updateSection('certifications', l); };
  const remove = (i) => updateSection('certifications', certifications.filter((_, j) => j !== i));
  return (
    <div className="space-y-3 pt-2">
      {certifications.map((c, i) => <CertItem key={i} cert={c} index={i} onUpdate={update} onDelete={remove} />)}
      <button onClick={add} className="btn-secondary w-full text-xs gap-1 py-2.5"><Plus className="w-3.5 h-3.5" /> Add Certification</button>
    </div>
  );
}
