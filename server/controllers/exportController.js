import Resume from '../models/Resume.js';
import { AppError } from '../middleware/errorHandler.js';
import { generatePDF } from '../services/pdfService.js';
import { generateDOCX } from '../services/docxService.js';
import { generateTokens } from '../middleware/auth.js';

export const exportPDF = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
    if (!resume) throw new AppError('Resume not found', 404);

    const { accessToken } = generateTokens(req.user._id);
    const pdfBuffer = await generatePDF(req.params.id, accessToken);

    const filename = `${resume.title.replace(/[^a-z0-9]/gi, '_')}_Resume.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(pdfBuffer);
  } catch (err) { next(err); }
};

export const exportDOCX = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
    if (!resume) throw new AppError('Resume not found', 404);

    const buffer = await generateDOCX(resume);
    const filename = `${resume.title.replace(/[^a-z0-9]/gi, '_')}_Resume.docx`;

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(buffer);
  } catch (err) { next(err); }
};
