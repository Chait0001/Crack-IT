import React from 'react';

const BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
function formatDate(d) { if (!d) return ''; try { return new Date(d + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }); } catch { return d; } }

export default function MinimalTemplate({ sections: s = {}, accentColor = '#6366f1', spacingScale = 1 }) {
  const pi = s.personalInfo || {};
  const photoSrc = pi.photo ? `${BASE}${pi.photo}` : null;

  return (
    <div className="min-h-[297mm] bg-white text-slate-700 px-12 py-10 text-[13px] leading-relaxed">
      {/* Name */}
      {photoSrc && <img src={photoSrc} alt="" className="w-14 h-14 rounded-full object-cover mb-4 border" />}
      <h1 className="text-4xl font-extralight tracking-tight text-slate-900 mb-1">{pi.name || 'Your Name'}</h1>
      <div className="flex flex-wrap gap-x-4 text-xs text-slate-400 mb-8">
        {[pi.email, pi.phone, pi.location, pi.linkedin, pi.portfolio].filter(Boolean).map((v, i) => <span key={i}>{v}</span>)}
      </div>

      {s.summary?.text && <p className="text-slate-500 mb-8 text-sm max-w-2xl leading-loose border-l-2 pl-4" style={{ borderColor: accentColor }}>{s.summary.text}</p>}

      {(s.experience || []).length > 0 && <Section title="Experience">{s.experience.map((e, i) => (
        <div key={i} className="mb-5">
          <div className="flex items-baseline justify-between"><span className="font-semibold text-slate-800">{e.role}</span><span className="text-xs text-slate-400">{formatDate(e.startDate)} – {e.current ? 'Present' : formatDate(e.endDate)}</span></div>
          <div className="text-xs text-slate-400 mb-2">{e.company}</div>
          {(e.bullets || []).map((b, j) => b && <div key={j} className="text-slate-500 text-xs mb-1 pl-3 relative before:absolute before:left-0 before:top-1.5 before:w-1 before:h-1 before:rounded-full" style={{ '--tw-before-bg': accentColor }}><span className="inline-block w-1 h-1 rounded-full mr-2 -mb-0.5" style={{ backgroundColor: accentColor }} />{b}</div>)}
        </div>
      ))}</Section>}

      {(s.education || []).length > 0 && <Section title="Education">{s.education.map((e, i) => (
        <div key={i} className="flex justify-between mb-2 text-sm"><div><span className="font-medium text-slate-800">{e.degree}{e.field ? ` in ${e.field}` : ''}</span><div className="text-xs text-slate-400">{e.institution}</div></div><span className="text-xs text-slate-400">{formatDate(e.endDate)}</span></div>
      ))}</Section>}

      {(s.skills || []).length > 0 && <Section title="Skills"><div className="flex flex-wrap gap-2">{s.skills.map((sk, i) => <span key={i} className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded">{sk.name}</span>)}</div></Section>}

      {(s.projects || []).length > 0 && <Section title="Projects">{s.projects.map((p, i) => (
        <div key={i} className="mb-3"><span className="font-medium text-slate-800 text-sm">{p.name}</span>{p.techStack?.length > 0 && <span className="text-xs text-slate-400 ml-2">{p.techStack.join(', ')}</span>}<p className="text-xs text-slate-500 mt-0.5">{p.description}</p></div>
      ))}</Section>}

      {(s.certifications || []).length > 0 && <Section title="Certifications">{s.certifications.map((c, i) => <div key={i} className="flex justify-between text-xs mb-1"><span className="text-slate-700">{c.name} <span className="text-slate-400">— {c.issuer}</span></span><span className="text-slate-400">{formatDate(c.date)}</span></div>)}</Section>}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="mb-7">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-300 mb-3">{title}</p>
      {children}
    </div>
  );
}
