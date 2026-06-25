import React from 'react';

const BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || '';

function formatDate(d) {
  if (!d) return '';
  try { return new Date(d + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }); } catch { return d; }
}

function Dot({ filled, color }) {
  return <span className="inline-block w-2 h-2 rounded-full mx-0.5" style={{ backgroundColor: filled ? color : '#e2e8f0' }} />;
}

export default function ModernTemplate({ sections: s = {}, accentColor = '#6366f1', spacingScale = 1 }) {
  const pi = s.personalInfo || {};
  const photoSrc = pi.photo
    ? (pi.photo.startsWith('http://') || pi.photo.startsWith('https://') ? pi.photo : `${BASE}${pi.photo}`)
    : null;
  const sp = `${Math.round(8 * spacingScale)}px`;
  const levelMap = { Beginner: 1, Intermediate: 2, Expert: 3 };

  return (
    <div className="min-h-[297mm] bg-white text-slate-800 text-[13px] leading-relaxed" style={{ fontFamily: 'inherit' }}>
      {/* Header */}
      <div className="flex items-start gap-5 p-8 pb-6" style={{ borderBottom: `3px solid ${accentColor}` }}>
        {photoSrc && (
          <img src={photoSrc} alt="Profile" className="w-20 h-20 rounded-full object-cover border-4 shrink-0" style={{ borderColor: accentColor }} />
        )}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-slate-900 leading-none mb-1">{pi.name || 'Your Name'}</h1>
          {s.experience?.[0]?.role && <p className="text-base font-medium mb-3" style={{ color: accentColor }}>{s.experience[0].role}</p>}
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
            {pi.email && (
              <span>
                ✉ <a href={`mailto:${pi.email}`} className="hover:underline">{pi.email}</a>
              </span>
            )}
            {pi.phone && (
              <span>
                📱 <a href={`tel:${pi.phone}`} className="hover:underline">{pi.phone}</a>
              </span>
            )}
            {pi.location && <span>📍 {pi.location}</span>}
            {pi.linkedin && (
              <span>
                🔗{' '}
                <a
                  href={pi.linkedin.startsWith('http') ? pi.linkedin : `https://${pi.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline font-semibold"
                >
                  LinkedIn
                </a>
              </span>
            )}
            {pi.portfolio && (
              <span>
                🌐{' '}
                <a
                  href={pi.portfolio.startsWith('http') ? pi.portfolio : `https://${pi.portfolio}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline font-semibold"
                >
                  Portfolio
                </a>
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex min-h-0">
        {/* Right (main) */}
        <div className="flex-1 p-8 pt-6 space-y-5">
          {/* Summary */}
          {s.summary?.text && (
            <Section title="Summary" color={accentColor}>
              <p className="text-slate-600 leading-relaxed">{s.summary.text}</p>
            </Section>
          )}

          {/* Experience */}
          {(s.experience || []).length > 0 && (
            <Section title="Experience" color={accentColor}>
              {s.experience.map((exp, i) => (
                <div key={i} className="mb-4 last:mb-0">
                  <div className="flex items-start justify-between flex-wrap gap-1">
                    <div>
                      <span className="font-bold text-slate-900">{exp.role}</span>
                      {exp.company && <span className="text-slate-500"> · {exp.company}</span>}
                    </div>
                    <span className="text-xs text-slate-400 shrink-0">
                      {formatDate(exp.startDate)} – {exp.current ? 'Present' : formatDate(exp.endDate)}
                    </span>
                  </div>
                  {(exp.bullets || []).length > 0 && (
                    <ul className="mt-1.5 space-y-0.5">
                      {exp.bullets.map((b, j) => b && (
                        <li key={j} className="flex gap-2 text-slate-600">
                          <span style={{ color: accentColor }} className="shrink-0 mt-0.5">▸</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </Section>
          )}

          {/* Projects */}
          {(s.projects || []).length > 0 && (
            <Section title="Projects" color={accentColor}>
              {s.projects.map((p, i) => (
                <div key={i} className="mb-3 last:mb-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{p.name}</span>
                    {p.link && <a href={p.link} className="text-xs underline" style={{ color: accentColor }}>{p.link}</a>}
                  </div>
                  {p.techStack?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {p.techStack.map(t => <span key={t} className="text-xs px-1.5 py-0.5 rounded font-medium" style={{ background: `${accentColor}18`, color: accentColor }}>{t}</span>)}
                    </div>
                  )}
                  {p.description && <p className="text-slate-600 mt-1 text-xs">{p.description}</p>}
                </div>
              ))}
            </Section>
          )}

          {/* Education */}
          {(s.education || []).length > 0 && (
            <Section title="Education" color={accentColor}>
              {s.education.map((e, i) => (
                <div key={i} className="flex justify-between flex-wrap gap-1 mb-2 last:mb-0">
                  <div>
                    <span className="font-bold text-slate-900">{e.degree}{e.field ? ` in ${e.field}` : ''}</span>
                    {e.institution && <div className="text-slate-500 text-xs">{e.institution}{e.gpa ? ` · GPA: ${e.gpa}` : ''}</div>}
                  </div>
                  <span className="text-xs text-slate-400">{formatDate(e.startDate)} – {formatDate(e.endDate)}</span>
                </div>
              ))}
            </Section>
          )}

          {/* Certifications */}
          {(s.certifications || []).length > 0 && (
            <Section title="Certifications" color={accentColor}>
              {s.certifications.map((c, i) => (
                <div key={i} className="flex justify-between text-xs mb-1 last:mb-0">
                  <span className="font-medium text-slate-800">{c.name} <span className="text-slate-400">— {c.issuer}</span></span>
                  <span className="text-slate-400 shrink-0">{formatDate(c.date)}</span>
                </div>
              ))}
            </Section>
          )}

          {/* Custom */}
          {(s.customSection || []).map((cs, i) => cs.title && (
            <Section key={i} title={cs.title} color={accentColor}>
              <p className="text-slate-600 whitespace-pre-wrap">{cs.content}</p>
            </Section>
          ))}
        </div>

        {/* Sidebar */}
        <div className="w-48 shrink-0 p-6 space-y-5" style={{ background: `${accentColor}08`, borderLeft: `1px solid ${accentColor}20` }}>
          {/* Skills */}
          {(s.skills || []).length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: accentColor }}>Skills</h3>
              <div className="space-y-2">
                {s.skills.map((sk, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="text-xs text-slate-700 font-medium">{sk.name}</span>
                    </div>
                    <div className="flex gap-0.5">
                      {[1,2,3].map(n => <Dot key={n} filled={n <= (levelMap[sk.level] || 2)} color={accentColor} />)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({ title, color, children }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <h2 className="text-xs font-extrabold uppercase tracking-widest" style={{ color }}>{title}</h2>
        <div className="flex-1 h-px" style={{ background: `${color}40` }} />
      </div>
      {children}
    </div>
  );
}
