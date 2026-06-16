import express from 'express';
import { protect } from '../middleware/auth.js';
import { aiLimiter } from '../middleware/rateLimiter.js';
import { improveBullet, fixGrammar, generateSummary, generateCoverLetter, adjustTone, atsScore } from '../controllers/aiController.js';

const router = express.Router();
router.use(protect);
router.use(aiLimiter);

router.post('/improve-bullet', improveBullet);
router.post('/fix-grammar', fixGrammar);
router.post('/generate-summary', generateSummary);
router.post('/cover-letter', generateCoverLetter);
router.post('/adjust-tone', adjustTone);
router.post('/ats-score', atsScore);

export default router;
