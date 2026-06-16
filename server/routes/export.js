import express from 'express';
import { protect } from '../middleware/auth.js';
import { exportPDF, exportDOCX } from '../controllers/exportController.js';

const router = express.Router();
router.use(protect);

router.get('/:id/pdf', exportPDF);
router.get('/:id/docx', exportDOCX);

export default router;
