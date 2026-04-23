import { Router, Request, Response } from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy, VerifyCallback } from 'passport-google-oauth20';
import jwt from 'jsonwebtoken';
import { query } from '../config/database';

const router = Router();

// Configure Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/api/auth/google/callback',
  },
  async (accessToken: string, refreshToken: string, profile: any, done: VerifyCallback) => {
    try {
      const googleId = profile.id;
      const email = profile.emails?.[0]?.value;
      const name = profile.displayName || profile.name?.givenName || 'Unknown';

      // Check if user exists
      const userResult = await query('SELECT * FROM users WHERE google_id = $1', [googleId]);
      let user;

      if (userResult.rows.length === 0) {
        // Create new user
        const insertResult = await query(
          'INSERT INTO users (google_id, email, name, role) VALUES ($1, $2, $3, $4) RETURNING *',
          [googleId, email, name, 'viewer']
        );
        user = insertResult.rows[0];
      } else {
        user = userResult.rows[0];
      }

      return done(null, user);
    } catch (error) {
      return done(error as Error);
    }
  }
));

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const result = await query('SELECT * FROM users WHERE id = $1', [id]);
    done(null, result.rows[0] || null);
  } catch (error) {
    done(error);
  }
});

// Routes
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/api/auth/login' }),
  (req: Request, res: Response) => {
    const user = req.user as any;
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: '24h' }
    );
    res.json({ success: true, token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  }
);

router.get('/logout', (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.json({ message: 'Logged out successfully' });
  });
});

router.get('/user', (req: Request, res: Response) => {
  if (req.user) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

export default router;
