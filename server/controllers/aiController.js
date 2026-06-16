import Resume from '../models/Resume.js';
import { AppError } from '../middleware/errorHandler.js';
import { analyzeATS } from '../services/atsService.js';
import {
  streamBulletPoints, streamGrammarFix, streamSummary,
  streamCoverLetter, streamToneAdjust,
} from '../services/aiService.js';

export const improveBullet = async (req, res, next) => {
  try {
    const { role, company, description } = req.body;
    if (!role) throw new AppError('role is required', 400);
    await streamBulletPoints(res, { role, company: company || '', description: description || '' });
  } catch (err) { next(err); }
};

export const fixGrammar = async (req, res, next) => {
  try {
    const { text, mode } = req.body;
    if (!text) throw new AppError('text is required', 400);
    await streamGrammarFix(res, { text, mode: mode || 'grammar' });
  } catch (err) { next(err); }
};

export const generateSummary = async (req, res, next) => {
  try {
    const { resumeId } = req.body;
    const resume = await Resume.findOne({ _id: resumeId, userId: req.user._id });
    if (!resume) throw new AppError('Resume not found', 404);
    const { experience, skills, personalInfo } = resume.sections;
    await streamSummary(res, {
      experience: experience || [],
      skills: skills || [],
      name: personalInfo?.name || '',
    });
  } catch (err) { next(err); }
};

export const generateCoverLetter = async (req, res, next) => {
  try {
    const { resumeId, jobTitle, company, jobDescription } = req.body;
    const resume = await Resume.findOne({ _id: resumeId, userId: req.user._id });
    if (!resume) throw new AppError('Resume not found', 404);
    await streamCoverLetter(res, { resumeData: resume, jobTitle, company, jobDescription });
  } catch (err) { next(err); }
};

export const adjustTone = async (req, res, next) => {
  try {
    const { text, tone } = req.body;
    if (!text) throw new AppError('text is required', 400);
    await streamToneAdjust(res, { text, tone: tone || 'professional' });
  } catch (err) { next(err); }
};

export const atsScore = async (req, res, next) => {
  try {
    const { resumeId, jobDescription } = req.body;
    if (!jobDescription) throw new AppError('jobDescription is required', 400);
    const resume = await Resume.findOne({ _id: resumeId, userId: req.user._id });
    if (!resume) throw new AppError('Resume not found', 404);

    const result = analyzeATS(resume.sections, jobDescription);

    // Persist ATS score
    resume.atsScore = result.score;
    await resume.save();

    res.json({ success: true, ...result });
  } catch (err) { next(err); }
};
