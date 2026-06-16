import express from 'express';
import { getPublicResume } from '../controllers/publicController.js';

const router = express.Router();
router.get('/:shareId', getPublicResume);

export default router;
