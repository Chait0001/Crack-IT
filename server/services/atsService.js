// ATS scoring service — keyword extraction and resume matching

const STOPWORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been',
  'has', 'have', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
  'should', 'may', 'might', 'shall', 'can', 'that', 'this', 'these',
  'those', 'it', 'its', 'we', 'you', 'they', 'he', 'she', 'our', 'your',
  'their', 'as', 'if', 'so', 'not', 'no', 'nor', 'yet', 'both', 'either',
]);

const BUZZWORDS = [
  'synergy', 'leverage', 'paradigm', 'disruptive', 'innovative', 'passionate',
  'guru', 'ninja', 'rockstar', 'wizard', 'thought leader', 'game changer',
  'value add', 'circle back', 'deep dive', 'bandwidth', 'move the needle',
  'low-hanging fruit', 'boil the ocean', 'think outside the box',
];

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s+#.]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w));
}

function extractKeyPhrases(text) {
  const words = tokenize(text);
  const freq = {};
  words.forEach((w) => { freq[w] = (freq[w] || 0) + 1; });

  // Extract bigrams
  const bigrams = [];
  for (let i = 0; i < words.length - 1; i++) {
    const bigram = `${words[i]} ${words[i + 1]}`;
    bigrams.push(bigram);
  }

  // Score: single keywords by frequency, bigrams always included
  const scored = Object.entries(freq)
    .filter(([, count]) => count >= 1)
    .sort(([, a], [, b]) => b - a)
    .map(([word]) => word);

  return [...new Set([...bigrams.slice(0, 20), ...scored.slice(0, 30)])].slice(0, 40);
}

function getResumeText(sections) {
  const parts = [];

  if (sections.personalInfo?.name) parts.push(sections.personalInfo.name);
  if (sections.summary?.text) parts.push(sections.summary.text);

  (sections.experience || []).forEach((exp) => {
    parts.push(exp.role, exp.company);
    (exp.bullets || []).forEach((b) => parts.push(b));
  });

  (sections.education || []).forEach((edu) => {
    parts.push(edu.institution, edu.degree, edu.field);
  });

  (sections.skills || []).forEach((s) => parts.push(s.name));
  (sections.projects || []).forEach((p) => {
    parts.push(p.name, p.description);
    (p.techStack || []).forEach((t) => parts.push(t));
  });

  (sections.certifications || []).forEach((c) => parts.push(c.name, c.issuer));

  return parts.filter(Boolean).join(' ');
}

export const analyzeATS = (resumeSections, jobDescription) => {
  const resumeText = getResumeText(resumeSections).toLowerCase();
  const jobKeywords = extractKeyPhrases(jobDescription);

  const found = [];
  const missing = [];

  jobKeywords.forEach((kw) => {
    if (resumeText.includes(kw.toLowerCase())) {
      found.push(kw);
    } else {
      missing.push(kw);
    }
  });

  const matchPercent = jobKeywords.length > 0
    ? Math.round((found.length / jobKeywords.length) * 100)
    : 0;

  // Detect buzzwords in resume
  const detectedBuzzwords = BUZZWORDS.filter((bw) => resumeText.includes(bw.toLowerCase()));

  return {
    score: matchPercent,
    found,
    missing,
    totalKeywords: jobKeywords.length,
    buzzwordsFound: detectedBuzzwords,
  };
};

export const calculateResumeScore = (sections, atsScore = 0) => {
  let score = 0;
  const breakdown = [];

  // Summary > 50 words (+15)
  const summaryWords = (sections.summary?.text || '').split(/\s+/).filter(Boolean).length;
  if (summaryWords >= 50) {
    score += 15;
    breakdown.push({ label: 'Professional summary', points: 15, earned: 15, status: 'good' });
  } else {
    breakdown.push({ label: 'Professional summary (need 50+ words)', points: 15, earned: summaryWords > 10 ? 5 : 0, status: summaryWords > 10 ? 'partial' : 'missing' });
    score += summaryWords > 10 ? 5 : 0;
  }

  // At least 2 experience entries (+20)
  const expCount = (sections.experience || []).length;
  if (expCount >= 2) {
    score += 20;
    breakdown.push({ label: 'Work experience (2+ entries)', points: 20, earned: 20, status: 'good' });
  } else {
    breakdown.push({ label: 'Work experience (need 2+ entries)', points: 20, earned: expCount * 5, status: expCount > 0 ? 'partial' : 'missing' });
    score += expCount * 5;
  }

  // Each experience has 3+ bullets (+15)
  const expWithBullets = (sections.experience || []).filter((e) => (e.bullets || []).length >= 3).length;
  const bulletPoints = expCount > 0 ? Math.round((expWithBullets / expCount) * 15) : 0;
  score += bulletPoints;
  breakdown.push({ label: 'Experience bullet points (3+ each)', points: 15, earned: bulletPoints, status: bulletPoints >= 15 ? 'good' : bulletPoints > 0 ? 'partial' : 'missing' });

  // Skills 5+ (+10)
  const skillCount = (sections.skills || []).length;
  if (skillCount >= 5) {
    score += 10;
    breakdown.push({ label: 'Skills (5+ listed)', points: 10, earned: 10, status: 'good' });
  } else {
    breakdown.push({ label: 'Skills (need 5+ skills)', points: 10, earned: Math.floor(skillCount / 5 * 10), status: skillCount > 0 ? 'partial' : 'missing' });
    score += Math.floor(skillCount / 5 * 10);
  }

  // Education (+10)
  const hasEducation = (sections.education || []).length > 0;
  if (hasEducation) {
    score += 10;
    breakdown.push({ label: 'Education section', points: 10, earned: 10, status: 'good' });
  } else {
    breakdown.push({ label: 'Education section', points: 10, earned: 0, status: 'missing' });
  }

  // Contact info complete (+10)
  const info = sections.personalInfo || {};
  const hasFullContact = info.name && info.email && info.phone && info.location;
  if (hasFullContact) {
    score += 10;
    breakdown.push({ label: 'Contact information complete', points: 10, earned: 10, status: 'good' });
  } else {
    const partial = [info.name, info.email, info.phone, info.location].filter(Boolean).length;
    score += partial * 2;
    breakdown.push({ label: 'Contact information', points: 10, earned: partial * 2, status: partial > 0 ? 'partial' : 'missing' });
  }

  // No buzzwords (+10)
  const resumeText = getResumeText(sections).toLowerCase();
  const buzzFound = BUZZWORDS.filter((bw) => resumeText.includes(bw));
  if (buzzFound.length === 0) {
    score += 10;
    breakdown.push({ label: 'No buzzwords/clichés', points: 10, earned: 10, status: 'good' });
  } else {
    breakdown.push({ label: `Buzzwords found: ${buzzFound.slice(0, 3).join(', ')}`, points: 10, earned: 0, status: 'bad' });
  }

  // ATS job match > 70% (+10)
  if (atsScore >= 70) {
    score += 10;
    breakdown.push({ label: 'ATS job match score 70%+', points: 10, earned: 10, status: 'good' });
  } else {
    breakdown.push({ label: 'ATS job match score (run ATS check)', points: 10, earned: 0, status: 'missing' });
  }

  return { score: Math.min(100, score), breakdown };
};

export { BUZZWORDS };
