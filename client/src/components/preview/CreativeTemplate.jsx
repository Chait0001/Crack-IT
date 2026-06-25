import React from 'react';

const BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || '';
function formatDate(d) { if (!d) return ''; try { return new Date(d + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }); } catch { return d; } }

export default function CreativeTemplate({ sections: s = {}, accentColor = '#ec4899', spacingScale = 1 }) {
  const pi = s.personalInfo || {};
  const photoSrc = pi.photo
    ? (pi.photo.startsWith('http://') || pi.photo.startsWith('https://') ? pi.photo : `${BASE}${pi.photo}`)
    : null;

  return (
    <div className="min-h-[297mm] bg-white text-[13px] leading-relaxed flex">
      {/* Left sidebar */}
      <div className="w-56 shrink-0 p-6 space-y-6 text-white" style={{ background: `linear-gradient(160deg, ${accentColor}, ${accentColor}cc)` }}>
        {photoSrc ? (
          <img src={photoSrc} alt="" className="w-20 h-20 rounded-full object-cover border-4 border-white/30 mx-auto" />
        ) : (
          <div className="w-20 h-20 rounded-full bg-white/20 mx-auto flex items-center justify-center text-3xl font-bold">
            {pi.name?.[0] || '?'}
          </div>
        )}

        <div className="text-center">
          <h1 className="text-xl font-bold leading-tight">{pi.name || 'Your Name'}</h1>
          {s.experience?.[0]?.role && <p className="text-xs text-white/70 mt-1">{s.experience[0].role}</p>}
        </div>

        <div className="space-y-1.5 text-xs text-white/80">
          {pi.email && (
            <div className="flex items-start gap-2">
              <span className="shrink-0">✉</span>
              <a href={`mailto:${pi.email}`} className="break-all hover:underline hover:text-white text-white/95">{pi.email}</a>
            </div>
          )}
          {pi.phone && (
            <div className="flex items-center gap-2">
              <span>📱</span>
              <a href={`tel:${pi.phone}`} className="hover:underline hover:text-white text-white/95">{pi.phone}</a>
            </div>
          )}
          {pi.location && <div className="flex items-center gap-2"><span>📍</span><span>{pi.location}</span></div>}
          {pi.linkedin && (
            <div className="flex items-center gap-2">
              <span>🔗</span>
              <a
                href={pi.linkedin.startsWith('http') ? pi.linkedin : `https://${pi.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-200 hover:text-white underline font-semibold break-all"
              >
                LinkedIn
              </a>
            </div>
          )}
          {pi.portfolio && (
            <div className="flex items-center gap-2">
              <span>🌐</span>
              <a
                href={pi.portfolio.startsWith('http') ? pi.portfolio : `https://${pi.portfolio}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-200 hover:text-white underline font-semibold break-all"
              >
                Portfolio
              </a>
            </div>
          )}
        </div>

        {/* Skills sidebar */}
        {(s.skills || []).length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/60 mb-2">Skills</h3>
            <div className="flex flex-wrap gap-1">
              {s.skills.map((sk, i) => (
                <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-white/20 text-white">{sk.name}</span>
              ))}
            </div>
          </div>
        )}

        {(s.certifications || []).length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/60 mb-2">Certifications</h3>
            {s.certifications.map((c, i) => <p key={i} className="text-xs text-white/80 mb-1">{c.name}</p>)}
          </div>
        )}
      </div>

      {/* Right main */}
      <div className="flex-1 p-8 space-y-5">
        {s.summary?.text && (
          <div>
            <h2 className="text-xs font-extrabold uppercase tracking-widest mb-2" style={{ color: accentColor }}>Profile</h2>
            <p className="text-slate-600">{s.summary.text}</p>
          </div>
        )}

        {(s.experience || []).length > 0 && (
          <div>
            <h2 className="text-xs font-extrabold uppercase tracking-widest mb-3" style={{ color: accentColor }}>Experience</h2>
            {s.experience.map((e, i) => (
              <div key={i} className="mb-4 pl-3 border-l-2" style={{ borderColor: `${accentColor}50` }}>
                <div className="flex justify-between flex-wrap gap-1">
                  <span className="font-bold text-slate-900">{e.role}</span>
                  <span className="text-xs text-slate-400">{formatDate(e.startDate)} – {e.current ? 'Present' : formatDate(e.endDate)}</span>
                </div>
                <div className="text-xs italic text-slate-400 mb-1.5">{e.company}</div>
                {(e.bullets || []).map((b, j) => b && <div key={j} className="text-slate-600 text-xs mb-1">→ {b}</div>)}
              </div>
            ))}
          </div>
        )}

        {(s.education || []).length > 0 && (
          <div>
            <h2 className="text-xs font-extrabold uppercase tracking-widest mb-3" style={{ color: accentColor }}>Education</h2>
            {s.education.map((e, i) => (
              <div key={i} className="flex justify-between mb-2">
                <div><span className="font-semibold text-slate-800">{e.degree}{e.field ? ` in ${e.field}` : ''}</span><div className="text-xs text-slate-400">{e.institution}{e.gpa ? ` · GPA: ${e.gpa}` : ''}</div></div>
                <span className="text-xs text-slate-400">{formatDate(e.endDate)}</span>
              </div>
            ))}
          </div>
        )}

        {(s.projects || []).length > 0 && (
          <div>
            <h2 className="text-xs font-extrabold uppercase tracking-widest mb-3" style={{ color: accentColor }}>Projects</h2>
            {s.projects.map((p, i) => (
              <div key={i} className="mb-3">
                <div className="flex items-center gap-2"><span className="font-bold text-slate-900">{p.name}</span>{p.link && <a href={p.link} className="text-xs underline" style={{ color: accentColor }}>{p.link}</a>}</div>
                {p.techStack?.length > 0 && <div className="flex flex-wrap gap-1 mt-0.5">{p.techStack.map(t => <span key={t} className="text-xs px-1.5 py-0.5 rounded" style={{ background: `${accentColor}18`, color: accentColor }}>{t}</span>)}</div>}
                {p.description && <p className="text-xs text-slate-500 mt-1">{p.description}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
