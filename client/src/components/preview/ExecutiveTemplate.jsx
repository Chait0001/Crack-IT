import React from 'react';

const BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
function formatDate(d) { if (!d) return ''; try { return new Date(d + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }); } catch { return d; } }

export default function ExecutiveTemplate({ sections: s = {}, accentColor = '#92400e', spacingScale = 1 }) {
  const pi = s.personalInfo || {};
  const photoSrc = pi.photo
    ? (pi.photo.startsWith('http://') || pi.photo.startsWith('https://') ? pi.photo : `${BASE}${pi.photo}`)
    : null;

  return (
    <div className="min-h-[297mm] bg-white text-[13px] leading-relaxed">
      {/* Top bar */}
      <div className="h-2" style={{ backgroundColor: accentColor }} />

      <div className="px-10 py-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-8 pb-6 border-b-2" style={{ borderColor: accentColor }}>
          <div>
            {photoSrc && <img src={photoSrc} alt="" className="w-16 h-16 rounded object-cover mb-3 border-2" style={{ borderColor: accentColor }} />}
            <h1 className="text-4xl font-black tracking-tight text-slate-900">{pi.name || 'Your Name'}</h1>
            {s.experience?.[0]?.role && <p className="text-lg font-light mt-1 tracking-wide" style={{ color: accentColor }}>{s.experience[0].role}</p>}
          </div>
          <div className="text-right text-xs text-slate-500 space-y-0.5">
            {pi.email && (
              <div>
                <a href={`mailto:${pi.email}`} className="hover:underline">{pi.email}</a>
              </div>
            )}
            {pi.phone && (
              <div>
                <a href={`tel:${pi.phone}`} className="hover:underline">{pi.phone}</a>
              </div>
            )}
            {pi.location && <div>{pi.location}</div>}
            {pi.linkedin && (
              <div>
                <a
                  href={pi.linkedin.startsWith('http') ? pi.linkedin : `https://${pi.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline font-semibold"
                >
                  LinkedIn
                </a>
              </div>
            )}
            {pi.portfolio && (
              <div>
                <a
                  href={pi.portfolio.startsWith('http') ? pi.portfolio : `https://${pi.portfolio}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline font-semibold"
                >
                  Portfolio
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Summary */}
        {s.summary?.text && (
          <div className="mb-8">
            <SHead title="Executive Summary" color={accentColor} />
            <p className="text-slate-600 leading-loose">{s.summary.text}</p>
          </div>
        )}

        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2 space-y-6">
            {/* Experience */}
            {(s.experience || []).length > 0 && (
              <div>
                <SHead title="Professional Experience" color={accentColor} />
                {s.experience.map((e, i) => (
                  <div key={i} className="mb-5 pl-4 border-l-4" style={{ borderColor: accentColor }}>
                    <div className="flex items-start justify-between flex-wrap gap-1 mb-1">
                      <div>
                        <span className="font-extrabold text-slate-900 text-sm">{e.role}</span>
                        <div className="text-xs font-semibold" style={{ color: accentColor }}>{e.company}</div>
                      </div>
                      <span className="text-xs text-slate-400 bg-slate-50 px-2 py-0.5 rounded">{formatDate(e.startDate)} – {e.current ? 'Present' : formatDate(e.endDate)}</span>
                    </div>
                    {(e.bullets || []).map((b, j) => b && <div key={j} className="flex gap-2 text-slate-600 text-xs mb-1"><span className="shrink-0 font-black" style={{ color: accentColor }}>›</span>{b}</div>)}
                  </div>
                ))}
              </div>
            )}

            {/* Projects */}
            {(s.projects || []).length > 0 && (
              <div>
                <SHead title="Key Projects" color={accentColor} />
                {s.projects.map((p, i) => (
                  <div key={i} className="mb-3">
                    <span className="font-bold text-slate-800">{p.name}</span>
                    {p.techStack?.length > 0 && <span className="text-xs text-slate-400 ml-2">[{p.techStack.join(', ')}]</span>}
                    {p.description && <p className="text-xs text-slate-500 mt-0.5">{p.description}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-5">
            {/* Skills */}
            {(s.skills || []).length > 0 && (
              <div>
                <SHead title="Core Competencies" color={accentColor} />
                <div className="space-y-1.5">
                  {s.skills.map((sk, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: accentColor }} />
                      <span className="text-xs text-slate-700">{sk.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {(s.education || []).length > 0 && (
              <div>
                <SHead title="Education" color={accentColor} />
                {s.education.map((e, i) => (
                  <div key={i} className="mb-2">
                    <div className="font-bold text-xs text-slate-800">{e.degree}{e.field ? ` in ${e.field}` : ''}</div>
                    <div className="text-xs text-slate-400">{e.institution}</div>
                    <div className="text-xs text-slate-400">{formatDate(e.endDate)}{e.gpa ? ` · ${e.gpa} GPA` : ''}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Certs */}
            {(s.certifications || []).length > 0 && (
              <div>
                <SHead title="Certifications" color={accentColor} />
                {s.certifications.map((c, i) => <div key={i} className="text-xs text-slate-600 mb-1"><span className="font-medium">{c.name}</span><br /><span className="text-slate-400">{c.issuer}</span></div>)}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="h-2 mt-4" style={{ backgroundColor: accentColor }} />
    </div>
  );
}

function SHead({ title, color }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <h2 className="text-xs font-extrabold uppercase tracking-widest whitespace-nowrap" style={{ color }}>{title}</h2>
      <div className="flex-1 h-px" style={{ background: color + '30' }} />
    </div>
  );
}
