import OpenAI from 'openai';

const MOCK_MODE = !process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key';

let openai;
if (!MOCK_MODE) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: 'https://api.groq.com/openai/v1'
  });
}

const MOCK_DELAYS = [30, 50, 40, 35, 45]; // ms between tokens in mock mode

async function streamMockResponse(res, text) {
  const words = text.split(' ');
  for (let i = 0; i < words.length; i++) {
    const chunk = (i === 0 ? '' : ' ') + words[i];
    res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`);
    await new Promise((r) => setTimeout(r, MOCK_DELAYS[i % MOCK_DELAYS.length]));
  }
  res.write(`data: [DONE]\n\n`);
  res.end();
}

function startSSE(res) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();
}

async function streamOpenAI(res, messages, systemPrompt) {
  const stream = await openai.chat.completions.create({
    model: 'llama3-8b-8192',
    messages: [{ role: 'system', content: systemPrompt }, ...messages],
    stream: true,
    max_tokens: 1024,
    temperature: 0.7,
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content;
    if (content) {
      res.write(`data: ${JSON.stringify({ content })}\n\n`);
    }
    if (chunk.choices[0]?.finish_reason === 'stop') {
      break;
    }
  }
  res.write(`data: [DONE]\n\n`);
  res.end();
}

export const streamBulletPoints = async (res, { role, company, description }) => {
  startSSE(res);

  if (MOCK_MODE) {
    const mock = `• Led cross-functional team of 8 engineers to deliver ${role} projects at ${company}, reducing time-to-market by 35%\n• Architected scalable microservices infrastructure handling 2M+ daily requests with 99.9% uptime\n• Implemented automated testing pipeline reducing bug rate by 60% and saving 20+ hours/week\n• Collaborated with product and design teams to launch 3 major features that increased user retention by 28%\n• Mentored 4 junior developers, conducting weekly code reviews and accelerating their onboarding by 50%`;
    return streamMockResponse(res, mock);
  }

  const prompt = `Generate 4-5 powerful resume bullet points for someone who worked as ${role} at ${company}. 
Context: ${description}
Requirements:
- Start each with a strong action verb (Led, Built, Architected, Implemented, etc.)
- Include quantified impact where possible (%, $, numbers)
- Be concise and ATS-friendly
- Format as bullet points starting with •`;

  return streamOpenAI(res, [{ role: 'user', content: prompt }],
    'You are an expert resume writer who crafts compelling, quantified bullet points.');
};

export const streamGrammarFix = async (res, { text, mode }) => {
  startSSE(res);

  const modeInstructions = {
    grammar: 'Fix all grammar and spelling errors while keeping the same meaning and tone.',
    confident: 'Rewrite with a more confident, assertive tone using active voice and powerful verbs.',
    concise: 'Make it more concise — remove filler words, be direct and crisp.',
    formal: 'Rewrite in a professional, formal tone suitable for a senior-level resume.',
  };

  if (MOCK_MODE) {
    const mocks = {
      grammar: `${text} (grammar corrected)`,
      confident: `Successfully ${text.toLowerCase().replace(/^i /, '')} delivering measurable results.`,
      concise: text.split(' ').slice(0, Math.ceil(text.split(' ').length * 0.7)).join(' ') + '.',
      formal: `Demonstrated proficiency in ${text.toLowerCase()} within a professional capacity.`,
    };
    return streamMockResponse(res, mocks[mode] || text);
  }

  return streamOpenAI(res, [{ role: 'user', content: `Text: "${text}"\n\nTask: ${modeInstructions[mode]}` }],
    'You are an expert resume editor. Return only the rewritten text, no explanations.');
};

export const streamSummary = async (res, { experience, skills, name }) => {
  startSSE(res);

  if (MOCK_MODE) {
    const mock = `Results-driven ${experience[0]?.role || 'professional'} with ${experience.length}+ years of experience building scalable solutions and leading high-impact initiatives. Proven track record of delivering measurable business outcomes through technical excellence and cross-functional collaboration. Passionate about ${skills.slice(0, 3).map(s => s.name).join(', ')} and committed to continuous innovation.`;
    return streamMockResponse(res, mock);
  }

  const expSummary = experience.map(e => `${e.role} at ${e.company}`).join(', ');
  const skillList = skills.map(s => s.name).join(', ');

  return streamOpenAI(res,
    [{ role: 'user', content: `Write a 3-sentence professional summary for a resume.\nExperience: ${expSummary}\nSkills: ${skillList}\nName: ${name}\n\nMake it compelling, specific, and ATS-optimized.` }],
    'You are an expert resume writer. Write only the summary text, no labels or quotes.');
};

export const streamCoverLetter = async (res, { resumeData, jobTitle, company, jobDescription }) => {
  startSSE(res);

  if (MOCK_MODE) {
    const name = resumeData?.sections?.personalInfo?.name || 'Applicant';
    const role = resumeData?.sections?.experience?.[0]?.role || 'professional';
    const mock = `Dear Hiring Manager,\n\nI am writing to express my strong interest in the ${jobTitle} position at ${company}. As a seasoned ${role} with a passion for delivering exceptional results, I am confident my background aligns perfectly with your team's goals.\n\nThroughout my career, I have consistently demonstrated the ability to drive measurable impact. I have led cross-functional teams, architected scalable systems, and delivered projects that directly contribute to business growth. My experience maps directly to the requirements outlined in your job description.\n\nI am excited about the opportunity to bring my expertise to ${company} and contribute to your continued success. I would welcome the chance to discuss how my skills can benefit your team.\n\nSincerely,\n${name}`;
    return streamMockResponse(res, mock);
  }

  const sections = resumeData?.sections || {};
  const name = sections.personalInfo?.name || 'Applicant';
  const expSummary = (sections.experience || []).map(e => `${e.role} at ${e.company}: ${e.bullets?.join('; ')}`).join('\n');
  const skills = (sections.skills || []).map(s => s.name).join(', ');

  return streamOpenAI(res,
    [{ role: 'user', content: `Write a tailored cover letter for:\nApplicant: ${name}\nPosition: ${jobTitle} at ${company}\nJob Description: ${jobDescription}\n\nApplicant's Background:\n${expSummary}\nSkills: ${skills}\n\nWrite 3-4 paragraphs, professional tone, mention specific alignment with job requirements.` }],
    'You are an expert career coach writing personalized cover letters.');
};

export const streamToneAdjust = async (res, { text, tone }) => {
  startSSE(res);

  if (MOCK_MODE) {
    const mocks = {
      professional: `Demonstrated expertise in ${text.split(' ').slice(0, 4).join(' ')} across enterprise environments.`,
      confident: `Drove significant impact by ${text.toLowerCase()}, delivering outstanding results.`,
      creative: `Pioneered innovative approaches to ${text.split(' ').slice(0, 3).join(' ')}, transforming how the team operates.`,
      concise: text.split(' ').slice(0, Math.ceil(text.split(' ').length * 0.6)).join(' ') + '.',
    };
    return streamMockResponse(res, mocks[tone] || text);
  }

  const toneGuides = {
    professional: 'formal, clear, industry-standard language',
    confident: 'assertive, achievement-focused, strong action verbs',
    creative: 'innovative, distinctive, memorable phrasing',
    concise: 'brief, direct, no filler words',
  };

  return streamOpenAI(res,
    [{ role: 'user', content: `Rewrite this resume text with a ${tone} tone (${toneGuides[tone]}):\n\n"${text}"\n\nReturn only the rewritten text.` }],
    'You are an expert resume editor focused on tone and style.');
};
