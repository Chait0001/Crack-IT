import React from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { useResumeStore } from '../../store/resumeStore';

const LEVELS = ['Beginner', 'Intermediate', 'Expert'];
const LEVEL_DOTS = { Beginner: 1, Intermediate: 2, Expert: 3 };

function SkillDots({ level, onChange }) {
  const filled = LEVEL_DOTS[level] || 2;
  return (
    <div className="flex gap-1 items-center">
      {[1, 2, 3].map(n => (
        <button
          key={n}
          onClick={() => onChange(LEVELS[n - 1])}
          title={LEVELS[n - 1]}
          className={`w-3 h-3 rounded-full border-2 transition-all ${n <= filled ? 'border-primary-500 bg-primary-500' : 'border-slate-300 dark:border-slate-600 bg-transparent'}`}
        />
      ))}
    </div>
  );
}

export default function SkillsSection() {
  const { sections, updateSection } = useResumeStore();
  const skills = sections?.skills || [];

  const add = () => updateSection('skills', [...skills, { name: '', level: 'Intermediate', order: skills.length }]);
  const updateItem = (i, f, v) => {
    const list = [...skills];
    list[i] = { ...list[i], [f]: v };
    updateSection('skills', list);
  };
  const remove = (i) => updateSection('skills', skills.filter((_, j) => j !== i));

  return (
    <div className="space-y-2 pt-2">
      <div className="grid grid-cols-1 gap-2">
        {skills.map((skill, i) => (
          <div key={i} className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 rounded-xl px-3 py-2">
            <input
              value={skill.name || ''}
              onChange={e => updateItem(i, 'name', e.target.value)}
              placeholder="e.g. React, Python, AWS..."
              className="flex-1 bg-transparent border-0 outline-none text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400"
            />
            <SkillDots level={skill.level} onChange={v => updateItem(i, 'level', v)} />
            <span className="text-xs text-slate-400 w-20 text-right hidden sm:block">{skill.level}</span>
            <button onClick={() => remove(i)} className="text-slate-300 hover:text-red-400 transition-colors shrink-0">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {skills.length === 0 && (
        <p className="text-xs text-slate-400 text-center py-4">No skills added yet. Add your technical and soft skills.</p>
      )}

      <button onClick={add} className="btn-secondary w-full text-xs gap-1 py-2.5">
        <Plus className="w-3.5 h-3.5" /> Add Skill
      </button>
      <p className="text-xs text-slate-400">Click the dots to set proficiency: ● Beginner  ●● Intermediate  ●●● Expert</p>
    </div>
  );
}
