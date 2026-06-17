import dotenv from 'dotenv';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';

dotenv.config();

const isGoogleConfigured = process.env.GOOGLE_CLIENT_ID &&
  process.env.GOOGLE_CLIENT_ID !== 'your_google_client_id' &&
  process.env.GOOGLE_CLIENT_SECRET &&
  process.env.GOOGLE_CLIENT_SECRET !== 'your_google_client_secret';

if (isGoogleConfigured) {
  const callbackURL = process.env.GOOGLE_CALLBACK_URL || `http://localhost:${process.env.PORT || 5000}/api/auth/google/callback`;

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ googleId: profile.id });

          if (!user) {
            // Check if email already exists
            user = await User.findOne({ email: profile.emails[0].value });
            if (user) {
              // Link Google account to existing account
              user.googleId = profile.id;
              user.avatar = user.avatar || profile.photos[0]?.value;
              await user.save();
            } else {
              // Create new user
              user = await User.create({
                googleId: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value,
                avatar: profile.photos[0]?.value,
              });
            }
          }

          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );
} else {
  console.log('⚠️  Google OAuth not configured — set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env');
}

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default passport;
