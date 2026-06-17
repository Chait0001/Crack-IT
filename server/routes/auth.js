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
router.get('/google', (req, res, next) => {
  const isGoogleConfigured = process.env.GOOGLE_CLIENT_ID &&
                             process.env.GOOGLE_CLIENT_ID !== 'your_google_client_id' &&
                             process.env.GOOGLE_CLIENT_SECRET &&
                             process.env.GOOGLE_CLIENT_SECRET !== 'your_google_client_secret';

  if (!isGoogleConfigured) {
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    return res.redirect(`${clientUrl}/login?error=google_not_configured`);
  }

  passport.authenticate('google', { scope: ['profile', 'email'], session: false })(req, res, next);
});

router.get('/google/callback', (req, res, next) => {
  const isGoogleConfigured = process.env.GOOGLE_CLIENT_ID &&
                             process.env.GOOGLE_CLIENT_ID !== 'your_google_client_id' &&
                             process.env.GOOGLE_CLIENT_SECRET &&
                             process.env.GOOGLE_CLIENT_SECRET !== 'your_google_client_secret';

  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

  if (!isGoogleConfigured) {
    return res.redirect(`${clientUrl}/login?error=google_not_configured`);
  }

  passport.authenticate('google', { session: false }, (err, user, info) => {
    if (err) {
      console.error('Google OAuth Error:', err);
      return res.redirect(`${clientUrl}/login?error=oauth_error&message=${encodeURIComponent(err.message || 'Authentication failed')}`);
    }

    if (!user) {
      const message = info?.message || 'User authentication failed';
      return res.redirect(`${clientUrl}/login?error=oauth_failed&message=${encodeURIComponent(message)}`);
    }

    req.user = user;
    googleCallback(req, res, next);
  })(req, res, next);
});

export default router;
