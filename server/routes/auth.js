import express from 'express';
import passport from 'passport';
import multer from 'multer';
import {
  register, login, refreshTokenHandler, logout,
  getProfile, updateProfile, googleCallback,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Multer for avatar upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
});

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/refresh', refreshTokenHandler);
router.post('/logout', protect, logout);

router.get('/me', protect, getProfile);
router.put('/me', protect, upload.single('avatar'), updateProfile);

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));
router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.CLIENT_URL}/login?error=oauth_failed` }),
  googleCallback
);

export default router;
