import Resume from '../models/Resume.js';
import ResumeVersion from '../models/ResumeVersion.js';
import { AppError } from '../middleware/errorHandler.js';
import { calculateResumeScore } from '../services/atsService.js';
import { v4 as uuidv4 } from 'uuid';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    
    const readable = new Readable();
    readable._read = () => {};
    readable.push(buffer);
    readable.push(null);
    readable.pipe(stream);
  });
};

// GET /api/resumes
export const getAllResumes = async (req, res, next) => {
  try {
    const resumes = await Resume.find({ userId: req.user._id })
      .select('title template colorTheme updatedAt createdAt isPublic viewCount resumeScore atsScore')
      .sort({ updatedAt: -1 });
    res.json({ success: true, resumes });
  } catch (err) { next(err); }
};

// POST /api/resumes
export const createResume = async (req, res, next) => {
  try {
    const { title, template, duplicateFrom } = req.body;

    if (duplicateFrom) {
      const source = await Resume.findOne({ _id: duplicateFrom, userId: req.user._id });
      if (!source) throw new AppError('Source resume not found', 404);
      const copy = await Resume.create({
        userId: req.user._id,
        title: `${source.title} (Copy)`,
        template: source.template,
        colorTheme: source.colorTheme,
        fontFamily: source.fontFamily,
        spacing: source.spacing,
        sections: source.sections,
        shareId: uuidv4(),
      });
      return res.status(201).json({ success: true, resume: copy });
    }

    const resume = await Resume.create({
      userId: req.user._id,
      title: title || 'Untitled Resume',
      template: template || 'modern',
    });
    res.status(201).json({ success: true, resume });
  } catch (err) { next(err); }
};

// GET /api/resumes/:id
export const getResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
    if (!resume) throw new AppError('Resume not found', 404);
    res.json({ success: true, resume });
  } catch (err) { next(err); }
};

// PUT /api/resumes/:id
export const updateResume = async (req, res, next) => {
  try {
    const { title, template, colorTheme, fontFamily, spacing, sections, isPublic } = req.body;
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
    if (!resume) throw new AppError('Resume not found', 404);

    if (title !== undefined) resume.title = title;
    if (template !== undefined) resume.template = template;
    if (colorTheme !== undefined) resume.colorTheme = colorTheme;
    if (fontFamily !== undefined) resume.fontFamily = fontFamily;
    if (spacing !== undefined) resume.spacing = spacing;
    if (isPublic !== undefined) resume.isPublic = isPublic;
    if (sections !== undefined) {
      resume.sections = sections;
      // Recalculate score
      const { score } = calculateResumeScore(sections, resume.atsScore);
      resume.resumeScore = score;
    }

    await resume.save();

    // Auto-save version every 10 minutes
    const tenMinsAgo = new Date(Date.now() - 10 * 60 * 1000);
    if (!resume.lastAutoSaved || resume.lastAutoSaved < tenMinsAgo) {
      await ResumeVersion.create({ resumeId: resume._id, snapshot: resume.toObject(), label: 'Auto-save', isManual: false });
      resume.lastAutoSaved = new Date();
      await resume.save();
    }

    res.json({ success: true, resume });
  } catch (err) { next(err); }
};

// DELETE /api/resumes/:id
export const deleteResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!resume) throw new AppError('Resume not found', 404);
    await ResumeVersion.deleteMany({ resumeId: req.params.id });
    res.json({ success: true, message: 'Resume deleted' });
  } catch (err) { next(err); }
};

// GET /api/resumes/:id/versions
export const getVersions = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
    if (!resume) throw new AppError('Resume not found', 404);
    const versions = await ResumeVersion.find({ resumeId: req.params.id })
      .select('label savedAt isManual')
      .sort({ savedAt: -1 })
      .limit(50);
    res.json({ success: true, versions });
  } catch (err) { next(err); }
};

// POST /api/resumes/:id/versions
export const saveVersion = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
    if (!resume) throw new AppError('Resume not found', 404);
    const version = await ResumeVersion.create({
      resumeId: resume._id,
      snapshot: resume.toObject(),
      label: req.body.label || `Manual save — ${new Date().toLocaleString()}`,
      isManual: true,
    });
    res.status(201).json({ success: true, version });
  } catch (err) { next(err); }
};

// POST /api/resumes/:id/restore/:versionId
export const restoreVersion = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
    if (!resume) throw new AppError('Resume not found', 404);
    const version = await ResumeVersion.findOne({ _id: req.params.versionId, resumeId: req.params.id });
    if (!version) throw new AppError('Version not found', 404);

    const snap = version.snapshot;
    resume.title = snap.title || resume.title;
    resume.template = snap.template || resume.template;
    resume.colorTheme = snap.colorTheme || resume.colorTheme;
    resume.fontFamily = snap.fontFamily || resume.fontFamily;
    resume.spacing = snap.spacing || resume.spacing;
    resume.sections = snap.sections || resume.sections;

    await resume.save();
    res.json({ success: true, resume });
  } catch (err) { next(err); }
};

// PUT /api/resumes/:id/share
export const toggleShare = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
    if (!resume) throw new AppError('Resume not found', 404);
    resume.isPublic = !resume.isPublic;
    if (!resume.shareId) resume.shareId = uuidv4();
    await resume.save();
    res.json({ success: true, isPublic: resume.isPublic, shareId: resume.shareId });
  } catch (err) { next(err); }
};

// POST /api/resumes/:id/photo
export const uploadPhoto = async (req, res, next) => {
  try {
    if (!req.file) throw new AppError('No file uploaded', 400);
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
    if (!resume) throw new AppError('Resume not found', 404);
    
    const photoUrl = await uploadToCloudinary(req.file.buffer, 'resume_photos');
    
    resume.sections.personalInfo.photo = photoUrl;
    resume.markModified('sections');
    await resume.save();
    res.json({ success: true, photoUrl });
  } catch (err) { next(err); }
};
