import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { generateTokens } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
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

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) throw new AppError('Name, email, and password are required', 400);
    if (password.length < 6) throw new AppError('Password must be at least 6 characters', 400);

    const existing = await User.findOne({ email });
    if (existing) throw new AppError('Email already in use', 400);

    const user = await User.create({ name, email, password });
    const { accessToken, refreshToken } = generateTokens(user._id);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    res.status(201).json({ success: true, accessToken, refreshToken, user });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) throw new AppError('Email and password are required', 400);

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      throw new AppError('Invalid email or password', 401);
    }

    const { accessToken, refreshToken } = generateTokens(user._id);
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    res.json({ success: true, accessToken, refreshToken, user });
  } catch (err) {
    next(err);
  }
};

export const refreshTokenHandler = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw new AppError('Refresh token required', 400);

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('+refreshToken');

    if (!user || user.refreshToken !== refreshToken) {
      throw new AppError('Invalid refresh token', 401);
    }

    const tokens = generateTokens(user._id);
    user.refreshToken = tokens.refreshToken;
    await user.save({ validateBeforeSave: false });

    res.json({ success: true, ...tokens });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { refreshToken: null });
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, bio } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (bio !== undefined) updates.bio = bio;
    
    if (req.file) {
      const avatarUrl = await uploadToCloudinary(req.file.buffer, 'user_avatars');
      updates.avatar = avatarUrl;
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

export const googleCallback = async (req, res, next) => {
  try {
    const { accessToken, refreshToken } = generateTokens(req.user._id);
    req.user.refreshToken = refreshToken;
    await req.user.save({ validateBeforeSave: false });

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    res.redirect(`${clientUrl}/auth/callback?token=${accessToken}&refresh=${refreshToken}`);
  } catch (err) {
    console.error('Google callback controller error:', err);
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    res.redirect(`${clientUrl}/login?error=oauth_error&message=${encodeURIComponent(err.message || 'Error saving user tokens')}`);
  }
};
