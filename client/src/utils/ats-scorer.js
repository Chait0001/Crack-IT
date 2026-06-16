// Client-side ATS scorer (mirrors server logic for real-time scoring)
const STOPWORDS = new Set([
  'a','an','the','and','or','but','in','on','at','to','for','of','with','by',
  'from','is','are','was','were','be','been','has','have','had','do','does',
  'did','will','would','could','should','may','might','shall','can','that',
  'this','these','those','it','its','we','you','they','he','she','our','your',
  'their','as','if','so','not','no','nor','yet',
]);

const BUZZWORDS = [
  'synergy','leverage','paradigm','disruptive','innovative','passionate',
  'guru','ninja','rockstar','wizard','thought leader','game changer',
  'value add','circle back','deep dive','bandwidth','move the needle',
  'low-hanging fruit','boil the ocean','think outside the box',
];

function getResumeText(sections) {
  const parts = [];
  const s = sections || {};
  if (s.personalInfo?.name) parts.push(s.personalInfo.name);
  if (s.summary?.text) parts.push(s.summary.text);
  (s.experience || []).forEach(e => {
    parts.push(e.role, e.company);
    (e.bullets || []).forEach(b => parts.push(b));
  });
  (s.education || []).forEach(e => parts.push(e.institution, e.degree, e.field));
  (s.skills || []).forEach(s => parts.push(s.name));
  (s.projects || []).forEach(p => { parts.push(p.name, p.description); (p.techStack||[]).forEach(t=>parts.push(t)); });
  (s.certifications || []).forEach(c => parts.push(c.name, c.issuer));
  return parts.filter(Boolean).join(' ');
}

export const calculateResumeScore = (sections, atsScore = 0) => {
  let score = 0;
  const breakdown = [];
  const s = sections || {};

  // Summary > 50 words (+15)
  const summaryWords = (s.summary?.text || '').split(/\s+/).filter(Boolean).length;
  const sumEarned = summaryWords >= 50 ? 15 : summaryWords >= 20 ? 8 : summaryWords > 5 ? 3 : 0;
  score += sumEarned;
  breakdown.push({ label: 'Professional summary (50+ words)', points: 15, earned: sumEarned, status: sumEarned === 15 ? 'good' : sumEarned > 0 ? 'partial' : 'missing' });

  // 2+ experience (+20)
  const expCount = (s.experience || []).length;
  const expEarned = expCount >= 2 ? 20 : expCount === 1 ? 10 : 0;
  score += expEarned;
  breakdown.push({ label: 'Work experience (2+ entries)', points: 20, earned: expEarned, status: expEarned === 20 ? 'good' : expEarned > 0 ? 'partial' : 'missing' });

  // Each exp has 3+ bullets (+15)
  const expWithBullets = (s.experience || []).filter(e => (e.bullets || []).length >= 3).length;
  const bulletEarned = expCount > 0 ? Math.round((expWithBullets / expCount) * 15) : 0;
  score += bulletEarned;
  breakdown.push({ label: 'Bullet points (3+ per role)', points: 15, earned: bulletEarned, status: bulletEarned >= 15 ? 'good' : bulletEarned > 0 ? 'partial' : 'missing' });

  // 5+ skills (+10)
  const skillCount = (s.skills || []).length;
  const skillEarned = skillCount >= 5 ? 10 : Math.floor(skillCount / 5 * 10);
  score += skillEarned;
  breakdown.push({ label: 'Skills section (5+ skills)', points: 10, earned: skillEarned, status: skillEarned === 10 ? 'good' : skillEarned > 0 ? 'partial' : 'missing' });

  // Education (+10)
  const hasEdu = (s.education || []).length > 0;
  score += hasEdu ? 10 : 0;
  breakdown.push({ label: 'Education section', points: 10, earned: hasEdu ? 10 : 0, status: hasEdu ? 'good' : 'missing' });

  // Contact complete (+10)
  const pi = s.personalInfo || {};
  const contactFields = [pi.name, pi.email, pi.phone, pi.location];
  const filledContact = contactFields.filter(Boolean).length;
  const contactEarned = filledContact * 2;
  score += contactEarned;
  breakdown.push({ label: 'Contact info complete', points: 10, earned: Math.min(10, contactEarned), status: filledContact === 4 ? 'good' : filledContact > 0 ? 'partial' : 'missing' });

  // No buzzwords (+10)
  const resumeText = getResumeText(s).toLowerCase();
  const buzzFound = BUZZWORDS.filter(b => resumeText.includes(b));
  const buzzEarned = buzzFound.length === 0 ? 10 : 0;
  score += buzzEarned;
  breakdown.push({ label: buzzFound.length ? `Buzzwords: ${buzzFound.slice(0,2).join(', ')}` : 'No buzzwords detected', points: 10, earned: buzzEarned, status: buzzEarned ? 'good' : 'bad' });

  // ATS match 70%+ (+10)
  const atsEarned = atsScore >= 70 ? 10 : 0;
  score += atsEarned;
  breakdown.push({ label: 'ATS job match 70%+', points: 10, earned: atsEarned, status: atsScore >= 70 ? 'good' : atsScore > 0 ? 'partial' : 'missing' });

  return { score: Math.min(100, score), breakdown };
};
