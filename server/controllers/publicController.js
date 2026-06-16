import Resume from '../models/Resume.js';
import { AppError } from '../middleware/errorHandler.js';

export const getPublicResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ shareId: req.params.shareId, isPublic: true })
      .select('-userId');

    if (!resume) throw new AppError('Resume not found or sharing is disabled', 404);

    // Increment view count
    resume.viewCount = (resume.viewCount || 0) + 1;
    await resume.save();

    res.json({ success: true, resume });
  } catch (err) { next(err); }
};
