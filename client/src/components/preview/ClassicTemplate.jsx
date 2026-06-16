import React from 'react';

const BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
function formatDate(d) { if (!d) return ''; try { return new Date(d + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }); } catch { return d; } }

export default function ClassicTemplate({ sections: s = {}, accentColor = '#1e293b', spacingScale = 1 }) {
  const pi = s.personalInfo || {};
  const photoSrc = pi.photo ? `${BASE}${pi.photo}` : null;

  return (
    <div className="min-h-[297mm] bg-white text-slate-800 p-10 text-[13px] leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
      {/* Header */}
      <div className="text-center border-b-2 pb-6 mb-6" style={{ borderColor: accentColor }}>
        {photoSrc && <img src={photoSrc} alt="" className="w-16 h-16 rounded-full object-cover mx-auto mb-3 border-2" style={{ borderColor: accentColor }} />}
        <h1 className="text-3xl font-bold tracking-wide" style={{ color: accentColor }}>{pi.name || 'Your Name'}</h1>
        <div className="flex justify-center flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-slate-500">
          {pi.email && <span>{pi.email}</span>}
          {pi.phone && <span>{pi.phone}</span>}
          {pi.location && <span>{pi.location}</span>}
          {pi.linkedin && <span>{pi.linkedin}</span>}
          {pi.portfolio && <span>{pi.portfolio}</span>}
        </div>
      </div>

      {/* Summary */}
      {s.summary?.text && <><SectionHead title="Professional Summary" color={accentColor} /><p className="mb-5 text-slate-700 italic">{s.summary.text}</p></>}

      {/* Experience */}
      {(s.experience || []).length > 0 && <>
        <SectionHead title="Professional Experience" color={accentColor} />
        {s.experience.map((e, i) => (
          <div key={i} className="mb-4">
            <div className="flex justify-between"><span className="font-bold">{e.role}</span><span className="text-xs text-slate-400">{formatDate(e.startDate)} – {e.current ? 'Present' : formatDate(e.endDate)}</span></div>
            <div className="text-sm italic text-slate-500 mb-1">{e.company}</div>
            {(e.bullets || []).map((b, j) => b && <div key={j} className="flex gap-2 text-slate-600 mb-0.5"><span>•</span><span>{b}</span></div>)}
          </div>
        ))}
      </>}

      {/* Education */}
      {(s.education || []).length > 0 && <>
        <SectionHead title="Education" color={accentColor} />
        {s.education.map((e, i) => (
          <div key={i} className="flex justify-between mb-2">
            <div><span className="font-bold">{e.degree}{e.field ? ` in ${e.field}` : ''}</span><div className="text-xs text-slate-500">{e.institution}{e.gpa ? ` — GPA: ${e.gpa}` : ''}</div></div>
            <span className="text-xs text-slate-400">{formatDate(e.startDate)} – {formatDate(e.endDate)}</span>
          </div>
        ))}
      </>}

      {/* Skills */}
      {(s.skills || []).length > 0 && <>
        <SectionHead title="Skills" color={accentColor} />
        <p className="mb-4 text-slate-700">{s.skills.map(sk => sk.name).join(' • ')}</p>
      </>}

      {/* Projects */}
      {(s.projects || []).length > 0 && <>
        <SectionHead title="Projects" color={accentColor} />
        {s.projects.map((p, i) => (
          <div key={i} className="mb-3"><span className="font-bold">{p.name}</span>{p.techStack?.length > 0 && <span className="text-xs text-slate-400"> [{p.techStack.join(', ')}]</span>}<p className="text-slate-600 text-xs mt-0.5">{p.description}</p></div>
        ))}
      </>}

      {/* Certifications */}
      {(s.certifications || []).length > 0 && <>
        <SectionHead title="Certifications" color={accentColor} />
        {s.certifications.map((c, i) => <div key={i} className="flex justify-between text-xs mb-1"><span className="font-medium">{c.name} — {c.issuer}</span><span className="text-slate-400">{formatDate(c.date)}</span></div>)}
      </>}
    </div>
  );
}

function SectionHead({ title, color }) {
  return <h2 className="font-bold text-sm uppercase tracking-widest mb-2 pb-0.5 border-b" style={{ color, borderColor: color }}>{title}</h2>;
}
