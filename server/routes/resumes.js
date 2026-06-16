import express from 'express';
import multer from 'multer';
import { protect } from '../middleware/auth.js';
import {
  getAllResumes, createResume, getResume, updateResume, deleteResume,
  getVersions, saveVersion, restoreVersion, toggleShare, uploadPhoto,
} from '../controllers/resumeController.js';

const router = express.Router();

const photoUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
});

router.use(protect);

router.get('/', getAllResumes);
router.post('/', createResume);
router.get('/:id', getResume);
router.put('/:id', updateResume);
router.delete('/:id', deleteResume);

router.get('/:id/versions', getVersions);
router.post('/:id/versions', saveVersion);
router.post('/:id/restore/:versionId', restoreVersion);
router.put('/:id/share', toggleShare);
router.post('/:id/photo', photoUpload.single('photo'), uploadPhoto);

export default router;
