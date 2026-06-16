import React, { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronRight, X } from 'lucide-react';
import { useResumeStore } from '../../store/resumeStore';

function ProjectItem({ proj, index, onUpdate, onDelete }) {
  const [open, setOpen] = useState(true);
  const [tag, setTag] = useState('');
  const update = (f, v) => onUpdate(index, { ...proj, [f]: v });

  const addTag = () => {
    if (!tag.trim()) return;
    update('techStack', [...(proj.techStack || []), tag.trim()]);
    setTag('');
  };

  const removeTag = (ti) => update('techStack', (proj.techStack || []).filter((_, i) => i !== ti));

  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
      <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800 cursor-pointer" onClick={() => setOpen(!open)}>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{proj.name || 'New Project'}</p>
        </div>
        <button onClick={e => { e.stopPropagation(); onDelete(index); }} className="text-slate-300 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
        {open ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
      </div>
      {open && (
        <div className="p-3 space-y-2.5 animate-fade-in">
          <div>
            <label className="input-label">Project Name</label>
            <input value={proj.name || ''} onChange={e => update('name', e.target.value)} className="input" placeholder="Open Source Dashboard" />
          </div>
          <div>
            <label className="input-label">Description</label>
            <textarea value={proj.description || ''} onChange={e => update('description', e.target.value)} rows={2} className="input resize-none" placeholder="Brief description of the project and its impact..." />
          </div>
          <div>
            <label className="input-label">Tech Stack</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {(proj.techStack || []).map((t, ti) => (
                <span key={ti} className="badge badge-purple flex items-center gap-1">
                  {t} <button onClick={() => removeTag(ti)}><X className="w-2.5 h-2.5" /></button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={tag} onChange={e => setTag(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTag()} className="input flex-1" placeholder="React, Node.js, AWS..." />
              <button onClick={addTag} className="btn-secondary btn-sm">Add</button>
            </div>
          </div>
          <div>
            <label className="input-label">Link</label>
            <input value={proj.link || ''} onChange={e => update('link', e.target.value)} className="input" placeholder="github.com/you/project" />
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProjectsSection() {
  const { sections, updateSection } = useResumeStore();
  const projects = sections?.projects || [];
  const add = () => updateSection('projects', [...projects, { name: '', description: '', techStack: [], link: '' }]);
  const update = (i, v) => { const l = [...projects]; l[i] = v; updateSection('projects', l); };
  const remove = (i) => updateSection('projects', projects.filter((_, j) => j !== i));
  return (
    <div className="space-y-3 pt-2">
      {projects.map((p, i) => <ProjectItem key={i} proj={p} index={i} onUpdate={update} onDelete={remove} />)}
      <button onClick={add} className="btn-secondary w-full text-xs gap-1 py-2.5"><Plus className="w-3.5 h-3.5" /> Add Project</button>
    </div>
  );
}
