import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import {
  appStore,
  savePersistedStore,
  findUserByEmail,
  findUserById,
  createUser,
  saveUser,
  createVerificationToken,
  findVerificationToken,
  markVerificationTokenUsed,
  createPasswordResetToken,
  findPasswordResetToken,
  markPasswordResetTokenUsed,
  UserRecord,
  LEGACY_DEFAULT_ADMIN_PASSWORD_HASH
} from '../database/persistence';
import { query, isDbConnected } from '../database/db';
import {
  AUTH_COOKIE_NAME,
  ADMIN_EMAIL,
  getJwtSecret,
  requireAdmin,
  requireAuth,
  authRateLimiter
} from '../middleware/authorization';
import { isEmailConfigured, sendVerificationEmail, sendPasswordResetEmail } from '../services/email.service';

const router = Router();

// Helper to hash tokens with SHA-256 for secure storage
function hashToken(rawToken: string): string {
  return crypto.createHash('sha256').update(rawToken).digest('hex');
}

router.get('/config', (_req: Request, res: Response) => {
  return res.json({
    googleEnabled: Boolean(process.env.GOOGLE_CLIENT_ID),
    registrationEnabled: isEmailConfigured(),
  });
});

// Cookie setting helper
function setSessionCookie(res: Response, token: string) {
  res.cookie(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  });
}

// ==========================================
// 1. GET /api/auth/session — Check Active Session
// ==========================================
router.get('/session', (req: Request, res: Response) => {
  if (req.user) {
    const isSoleAdmin = req.user.role === 'admin' && req.user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
    return res.json({
      authenticated: true,
      role: isSoleAdmin ? 'admin' : 'visitor',
      isAdmin: isSoleAdmin,
      user: {
        id: req.user.id,
        fullName: req.user.fullName || (isSoleAdmin ? 'AYushMan' : 'Visitor'),
        role: isSoleAdmin ? 'admin' : 'visitor',
        avatarUrl: req.user.avatarUrl || '/assets/profile/ayushman.jpg',
      },
    });
  }

  return res.json({
    authenticated: false,
    role: 'guest',
    isAdmin: false,
    user: null,
  });
});

// ==========================================
// 2. POST /api/auth/register — Email Registration
// ==========================================
router.post('/register', authRateLimiter(5 * 60 * 1000, 10), async (req: Request, res: Response) => {
  if (!isEmailConfigured()) {
    return res.status(503).json({
      success: false,
      message: 'Account registration is unavailable because email delivery is not configured.',
    });
  }

  const { email, password, fullName, username } = req.body || {};

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ success: false, message: 'A valid email address is required.' });
  }

  if (!password || typeof password !== 'string' || password.length < 8) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 8 characters in length.',
    });
  }

  const cleanEmail = email.trim().toLowerCase();
  const cleanFullName = (fullName || cleanEmail.split('@')[0]).trim();
  const cleanUsername = (username || cleanEmail.split('@')[0]).trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');

  // Check if user already exists
  let existingUser = findUserByEmail(cleanEmail);
  if (!existingUser && isDbConnected()) {
    try {
      const rows = await query<any>('SELECT id FROM users WHERE email = ? LIMIT 1', [cleanEmail]);
      if (rows && rows.length > 0) {
        return res.status(409).json({
          success: false,
          message: 'An account with this email address already exists.',
        });
      }
    } catch (e) {
      console.warn('[Auth Register] DB lookup error:', e);
    }
  }

  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: 'An account with this email address already exists.',
    });
  }

  // Hash password securely with bcrypt
  const passwordHash = await bcrypt.hash(password, 10);

  // Enforce sole administrator policy: ONLY ADMIN_EMAIL can have role 'admin'
  const isSoleAdmin = cleanEmail === ADMIN_EMAIL.toLowerCase();
  const assignedRole: 'admin' | 'visitor' = isSoleAdmin ? 'admin' : 'visitor';

  // Create user in persistence store
  const newUser = createUser({
    username: cleanUsername || `user_${Date.now()}`,
    email: cleanEmail,
    passwordHash,
    fullName: cleanFullName,
    role: assignedRole,
    emailVerified: false, // Must verify email before accessing authenticated session
    googleId: null,
    avatarUrl: isSoleAdmin ? '/assets/profile/ayushman.jpg' : '',
  });

  // If DB connected, mirror into MySQL
  if (isDbConnected()) {
    try {
      await query(
        `INSERT INTO users (username, email, password_hash, full_name, role, email_verified, avatar_url)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [newUser.username, newUser.email, newUser.passwordHash, newUser.fullName, newUser.role, 0, newUser.avatarUrl || '']
      );
    } catch (err) {
      console.warn('[Auth Register] Could not mirror user to MySQL:', err);
    }
  }

  // Generate secure 32-byte verification token (single use, 24h expiration)
  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  createVerificationToken(newUser.id, cleanEmail, rawToken, tokenHash, expiresAt);

  if (isDbConnected()) {
    try {
      await query(
        `INSERT INTO email_verifications (user_id, token_hash, expires_at) VALUES (?, ?, ?)`,
        [newUser.id, tokenHash, expiresAt]
      );
    } catch (err) {
      console.warn('[Auth Register] Could not mirror verification token to MySQL:', err);
    }
  }

  // Send verification email via email service
  const emailRes = await sendVerificationEmail(cleanEmail, rawToken, cleanFullName);
  if (!emailRes.success) {
    return res.status(502).json({
      success: false,
      message: 'The account was created but verification email delivery failed. Please try resending verification later.',
    });
  }

  return res.status(201).json({
    success: true,
    message: 'Account registered successfully. Please check your email to verify your address.',
    emailVerified: false,
  });
});

// ==========================================
// 3. GET /api/auth/verify-email — Verify Token
// ==========================================
router.get('/verify-email', async (req: Request, res: Response) => {
  const rawToken = String(req.query.token || '').trim();
  if (!rawToken) {
    return res.status(400).json({ success: false, message: 'Verification token is required.' });
  }

  const tokenHash = hashToken(rawToken);
  const now = new Date();

  // Check store
  let tokenRecord = findVerificationToken(tokenHash);

  // Check MySQL if not in store or for sync
  if (!tokenRecord && isDbConnected()) {
    try {
      const rows = await query<any>(
        'SELECT id, user_id, token_hash, expires_at, used_at FROM email_verifications WHERE token_hash = ? LIMIT 1',
        [tokenHash]
      );
      if (rows && rows.length > 0) {
        tokenRecord = {
          id: rows[0].id,
          userId: rows[0].user_id,
          email: '',
          tokenHash: rows[0].token_hash,
          token: rawToken,
          expiresAt: rows[0].expires_at.toISOString ? rows[0].expires_at.toISOString() : String(rows[0].expires_at),
          usedAt: rows[0].used_at,
          createdAt: '',
        };
      }
    } catch (err) {
      console.warn('[Auth Verify] DB lookup error:', err);
    }
  }

  if (!tokenRecord) {
    return res.status(400).json({ success: false, message: 'Invalid or unrecognized verification token.' });
  }

  if (tokenRecord.usedAt) {
    return res.status(400).json({ success: false, message: 'This verification token has already been used.' });
  }

  if (new Date(tokenRecord.expiresAt) < now) {
    return res.status(400).json({ success: false, message: 'This verification token has expired. Please request a new one.' });
  }

  // Mark token used
  markVerificationTokenUsed(tokenRecord.id);
  if (isDbConnected()) {
    try {
      await query('UPDATE email_verifications SET used_at = NOW() WHERE id = ?', [tokenRecord.id]);
    } catch (err) {
      console.warn('[Auth Verify] DB token update error:', err);
    }
  }

  // Mark user verified
  const user = findUserById(tokenRecord.userId);
  if (user) {
    user.emailVerified = true;
    if (user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      user.role = 'admin';
    }
    saveUser(user);
  }

  if (isDbConnected()) {
    try {
      await query('UPDATE users SET email_verified = 1 WHERE id = ?', [tokenRecord.userId]);
    } catch (err) {
      console.warn('[Auth Verify] DB user update error:', err);
    }
  }

  // Issue authenticated session cookie if user exists
  if (user) {
    const isSoleAdmin = user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
    const role: 'admin' | 'visitor' = isSoleAdmin ? 'admin' : 'visitor';
    const jwtSecret = getJwtSecret();
    const token = jwt.sign(
      { id: user.id, email: user.email, role, fullName: user.fullName, avatarUrl: user.avatarUrl },
      jwtSecret,
      { expiresIn: '7d' }
    );
    setSessionCookie(res, token);
  }

  return res.json({
    success: true,
    message: 'Your email address has been verified successfully. Your session is now active.',
    user: user ? {
      fullName: user.fullName,
      role: user.role,
      isAdmin: user.role === 'admin',
    } : null,
  });
});

// ==========================================
// 4. POST /api/auth/resend-verification
// ==========================================
router.post('/resend-verification', authRateLimiter(5 * 60 * 1000, 5), async (req: Request, res: Response) => {
  if (process.env.NODE_ENV === 'production' && !isDbConnected()) {
    return res.status(503).json({ success: false, message: 'Account storage is unavailable.' });
  }
  if (!isEmailConfigured()) {
    return res.status(503).json({
      success: false,
      message: 'Email verification delivery is not configured.',
    });
  }

  const { email } = req.body || {};
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ success: false, message: 'Email address is required.' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const user = findUserByEmail(cleanEmail);

  if (user && !user.emailVerified) {
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = hashToken(rawToken);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    createVerificationToken(user.id, cleanEmail, rawToken, tokenHash, expiresAt);
    const emailRes = await sendVerificationEmail(cleanEmail, rawToken, user.fullName);
    if (!emailRes.success) {
      return res.status(502).json({ success: false, message: 'Verification email delivery failed.' });
    }

    return res.json({
      success: true,
      message: 'A new verification link has been sent to your email address.',
    });
  }

  // Generic message to avoid email enumeration
  return res.json({
    success: true,
    message: 'If an unverified account exists with that address, a new verification link has been sent.',
  });
});

// ==========================================
// 5. POST /api/auth/login — Email/Password Sign-In
// ==========================================
router.post('/login', authRateLimiter(5 * 60 * 1000, 15), async (req: Request, res: Response) => {
  const { email, username, password } = req.body || {};
  const identifier = String(email || username || '').trim().toLowerCase();
  const plainPassword = String(password || '');

  if (!identifier || !plainPassword) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  // 1. Find user from store or MySQL
  let user: UserRecord | undefined = findUserByEmail(identifier) ||
    appStore.users.find((u) => u.username.toLowerCase() === identifier);

  if (!user && isDbConnected()) {
    try {
      const rows = await query<any>(
        'SELECT id, username, email, password_hash, full_name, role, email_verified, avatar_url FROM users WHERE email = ? OR username = ? LIMIT 1',
        [identifier, identifier]
      );
      if (rows && rows.length > 0) {
        const r = rows[0];
        user = {
          id: r.id,
          username: r.username,
          email: r.email,
          passwordHash: r.password_hash,
          fullName: r.full_name,
          role: r.email.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? 'admin' : 'visitor',
          emailVerified: Boolean(r.email_verified),
          avatarUrl: r.avatar_url,
          createdAt: '',
          updatedAt: '',
        };
      }
    } catch (err) {
      console.warn('[Auth Login] DB query failed:', err);
    }
  }

  // If user does not exist, return generic error
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid email or password.' });
  }

  if (
    user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase() &&
    user.passwordHash === LEGACY_DEFAULT_ADMIN_PASSWORD_HASH
  ) {
    return res.status(401).json({ success: false, message: 'Invalid email or password.' });
  }

  // 2. Validate password using bcrypt
  const isMatch = await bcrypt.compare(plainPassword, user.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Invalid email or password.' });
  }

  // 3. Require verified email before granting authenticated application session
  if (!user.emailVerified) {
    return res.status(403).json({
      success: false,
      emailUnverified: true,
      message: 'Please verify your email address before signing in. Check your inbox or click resend.',
    });
  }

  // 4. Enforce sole administrator policy
  const isSoleAdmin = user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
  const role: 'admin' | 'visitor' = isSoleAdmin ? 'admin' : 'visitor';

  // 5. Sign JWT session token
  const jwtSecret = getJwtSecret();
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role,
      fullName: user.fullName,
      avatarUrl: user.avatarUrl || (isSoleAdmin ? '/assets/profile/ayushman.jpg' : ''),
    },
    jwtSecret,
    { expiresIn: '7d' }
  );

  // Set secure HttpOnly cookie
  setSessionCookie(res, token);

  return res.json({
    success: true,
    message: isSoleAdmin ? 'Welcome back, Administrator.' : 'Welcome to AYushMan OS.',
    role,
    isAdmin: isSoleAdmin,
    user: {
      id: user.id,
      fullName: user.fullName,
      role,
      isAdmin: isSoleAdmin,
      avatarUrl: user.avatarUrl || (isSoleAdmin ? '/assets/profile/ayushman.jpg' : ''),
    },
  });
});

// ==========================================
// 6. POST /api/auth/google — Google OAuth Verification
// ==========================================
router.post('/google', authRateLimiter(5 * 60 * 1000, 15), async (req: Request, res: Response) => {
  const { credential, idToken } = req.body || {};
  const tokenToVerify = String(credential || idToken || '').trim();

  if (!tokenToVerify) {
    return res.status(400).json({ success: false, message: 'Google credential token is required.' });
  }

  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  if (!googleClientId) {
    return res.status(503).json({
      success: false,
      message: 'Google Sign-In is not configured on this server. Please set GOOGLE_CLIENT_ID in server environment variables.',
      missingConfig: true,
    });
  }

  try {
    const client = new OAuth2Client(googleClientId);
    const ticket = await client.verifyIdToken({
      idToken: tokenToVerify,
      audience: googleClientId,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return res.status(401).json({ success: false, message: 'Invalid Google token payload.' });
    }

    // Must validate provider-issued verified_email claim
    if (!payload.email_verified) {
      return res.status(403).json({
        success: false,
        message: 'Google account email is not verified with Google.',
      });
    }

    const cleanEmail = payload.email.trim().toLowerCase();
    const isSoleAdmin = cleanEmail === ADMIN_EMAIL.toLowerCase();
    const role: 'admin' | 'visitor' = isSoleAdmin ? 'admin' : 'visitor';

    // Find or provision user
    let user = findUserByEmail(cleanEmail);
    if (!user) {
      user = createUser({
        username: cleanEmail.split('@')[0],
        email: cleanEmail,
        passwordHash: '', // OAuth user
        fullName: payload.name || cleanEmail.split('@')[0],
        role,
        emailVerified: true,
        googleId: payload.sub,
        avatarUrl: payload.picture || (isSoleAdmin ? '/assets/profile/ayushman.jpg' : ''),
      });
    } else {
      user.emailVerified = true;
      user.googleId = payload.sub;
      user.role = role;
      if (payload.picture && !user.avatarUrl) {
        user.avatarUrl = payload.picture;
      }
      saveUser(user);
    }

    // Mirror to MySQL if connected
    if (isDbConnected()) {
      try {
        await query(
          `INSERT INTO users (username, email, password_hash, full_name, role, email_verified, google_id, avatar_url)
           VALUES (?, ?, ?, ?, ?, 1, ?, ?)
           ON DUPLICATE KEY UPDATE email_verified = 1, google_id = VALUES(google_id), role = VALUES(role)`,
          [user.username, user.email, user.passwordHash || '', user.fullName, role, payload.sub, user.avatarUrl || '']
        );
      } catch (err) {
        console.warn('[Auth Google] DB mirror error:', err);
      }
    }

    // Issue session token
    const jwtSecret = getJwtSecret();
    const sessionToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role,
        fullName: user.fullName,
        avatarUrl: user.avatarUrl,
      },
      jwtSecret,
      { expiresIn: '7d' }
    );

    setSessionCookie(res, sessionToken);

    return res.json({
      success: true,
      message: isSoleAdmin ? 'Google authentication confirmed. Administrator mode unlocked.' : 'Google sign-in confirmed. Welcome visitor.',
      role,
      isAdmin: isSoleAdmin,
      user: {
        id: user.id,
        fullName: user.fullName,
        role,
        isAdmin: isSoleAdmin,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (err: any) {
    console.error('[Auth Google] Token verification error:', err);
    return res.status(401).json({
      success: false,
      message: 'Failed to verify Google ID token. ' + (err.message || ''),
    });
  }
});

// ==========================================
// 7. POST /api/auth/forgot-password
// ==========================================
router.post('/forgot-password', authRateLimiter(5 * 60 * 1000, 5), async (req: Request, res: Response) => {
  if (process.env.NODE_ENV === 'production' && !isDbConnected()) {
    return res.status(503).json({ success: false, message: 'Account storage is unavailable.' });
  }
  if (!isEmailConfigured()) {
    return res.status(503).json({
      success: false,
      message: 'Password-reset email delivery is not configured.',
    });
  }

  const { email } = req.body || {};
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ success: false, message: 'A valid email address is required.' });
  }

  const cleanEmail = email.trim().toLowerCase();
  let user: Pick<UserRecord, 'id' | 'email' | 'fullName'> | undefined = findUserByEmail(cleanEmail);
  if (!user && isDbConnected()) {
    try {
      const rows = await query<any>(
        'SELECT id, email, full_name FROM users WHERE email = ? LIMIT 1',
        [cleanEmail]
      );
      if (rows.length > 0) {
        user = { id: rows[0].id, email: rows[0].email, fullName: rows[0].full_name };
      }
    } catch (err) {
      console.warn('[Auth Forgot-Password] Account lookup failed:', err);
      return res.status(503).json({ success: false, message: 'Account lookup is temporarily unavailable.' });
    }
  }

  if (user) {
    // Generate secure reset token (1 hour expiration, single use)
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = hashToken(rawToken);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    createPasswordResetToken(user.id, cleanEmail, rawToken, tokenHash, expiresAt);

    if (isDbConnected()) {
      try {
        await query(
          'INSERT INTO password_resets (user_id, token_hash, expires_at) VALUES (?, ?, ?)',
          [user.id, tokenHash, expiresAt]
        );
      } catch (err) {
        console.warn('[Auth Forgot-Password] DB mirror error:', err);
      }
    }

    const emailRes = await sendPasswordResetEmail(cleanEmail, rawToken, user.fullName);
    if (!emailRes.success) {
      return res.status(502).json({ success: false, message: 'Password-reset email delivery failed.' });
    }
    return res.json({
      success: true,
      message: 'If an account exists with that email address, a password reset link has been dispatched.',
    });
  }

  // Generic response to avoid user enumeration
  return res.json({
    success: true,
    message: 'If an account exists with that email address, a password reset link has been dispatched.',
  });
});

// ==========================================
// 8. POST /api/auth/reset-password
// ==========================================
router.post('/reset-password', authRateLimiter(5 * 60 * 1000, 5), async (req: Request, res: Response) => {
  const { token, newPassword } = req.body || {};

  if (!token || typeof token !== 'string') {
    return res.status(400).json({ success: false, message: 'Reset token is required.' });
  }

  if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 8) {
    return res.status(400).json({
      success: false,
      message: 'New password must be at least 8 characters long.',
    });
  }

  const tokenHash = hashToken(token.trim());
  const now = new Date();

  let resetRecord = findPasswordResetToken(tokenHash);

  if (!resetRecord && isDbConnected()) {
    try {
      const rows = await query<any>(
        'SELECT id, user_id, token_hash, expires_at, used_at FROM password_resets WHERE token_hash = ? LIMIT 1',
        [tokenHash]
      );
      if (rows && rows.length > 0) {
        resetRecord = {
          id: rows[0].id,
          userId: rows[0].user_id,
          email: '',
          tokenHash: rows[0].token_hash,
          token: token.trim(),
          expiresAt: rows[0].expires_at.toISOString ? rows[0].expires_at.toISOString() : String(rows[0].expires_at),
          usedAt: rows[0].used_at,
          createdAt: '',
        };
      }
    } catch (err) {
      console.warn('[Auth Reset-Password] DB lookup error:', err);
    }
  }

  if (!resetRecord) {
    return res.status(400).json({ success: false, message: 'Invalid password reset token.' });
  }

  if (resetRecord.usedAt) {
    return res.status(400).json({ success: false, message: 'This password reset token has already been used.' });
  }

  if (new Date(resetRecord.expiresAt) < now) {
    return res.status(400).json({ success: false, message: 'This password reset token has expired. Please request a new link.' });
  }

  // Mark token used
  markPasswordResetTokenUsed(resetRecord.id);
  if (isDbConnected()) {
    try {
      await query('UPDATE password_resets SET used_at = NOW() WHERE id = ?', [resetRecord.id]);
    } catch (err) {
      console.warn('[Auth Reset-Password] DB token update error:', err);
    }
  }

  // Hash new password and update user
  const passwordHash = await bcrypt.hash(newPassword, 10);
  const user = findUserById(resetRecord.userId);
  if (user) {
    user.passwordHash = passwordHash;
    user.emailVerified = true;
    saveUser(user);
  }

  if (isDbConnected()) {
    try {
      await query('UPDATE users SET password_hash = ?, email_verified = 1 WHERE id = ?', [passwordHash, resetRecord.userId]);
    } catch (err) {
      console.warn('[Auth Reset-Password] DB user update error:', err);
    }
  }

  // Invalidate any active session cookie
  res.clearCookie(AUTH_COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });

  return res.json({
    success: true,
    message: 'Your password has been successfully reset. Please sign in with your new password.',
  });
});

// ==========================================
// 9. POST /api/auth/logout — Sign Out
// ==========================================
router.post('/logout', (_req: Request, res: Response) => {
  res.clearCookie(AUTH_COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });

  return res.json({
    success: true,
    message: 'Signed out successfully.',
  });
});

// ==========================================
// 10. GET /api/auth/profile — Public vs Private Profile
// ==========================================
router.get('/profile', async (req: Request, res: Response) => {
  const isSoleAdmin = req.user && req.user.role === 'admin' && req.user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  // If authenticated administrator, return full personal records
  if (isSoleAdmin) {
    const adminUser = findUserByEmail(ADMIN_EMAIL);
    if (!adminUser) {
      return res.status(404).json({ success: false, message: 'Administrator profile is unavailable.' });
    }
    return res.json({
      success: true,
      role: 'admin',
      isAdmin: true,
      user: {
        id: adminUser?.id || 1,
        username: adminUser?.username || 'ayushman',
        fullName: adminUser?.fullName || 'AYushMan',
        fatherName: adminUser?.fatherName || 'Sanjay Kumar Pathak',
        collegeName: adminUser?.collegeName || 'Arya College of Engineering & Information Technology, Jaipur (Kukas)',
        branch: adminUser?.branch || 'Computer Science and Engineering',
        university: adminUser?.university || 'Rajasthan Technical University, Kota',
        rollNo: adminUser?.rollNo || '24EARCS003',
        enrollmentNo: adminUser?.enrollmentNo || '24E1ARCSM40P003',
        avatarUrl: adminUser?.avatarUrl || '/assets/profile/ayushman.jpg',
        bio: adminUser?.bio || 'Computer Science & Engineering student.',
        role: 'admin',
        emailVerified: true,
      },
    });
  }

  // For ordinary visitors or unauthenticated users:
  // Return ONLY public portfolio fields. Sensitive records (rollNo, enrollmentNo, fatherName, email) are omitted.
  const adminUser = findUserByEmail(ADMIN_EMAIL);
  return res.json({
    success: true,
    role: req.user ? 'visitor' : 'guest',
    isAdmin: false,
    user: {
      fullName: adminUser?.fullName || 'AYushMan',
      bio: adminUser?.bio || 'Computer Science & Engineering student.',
      avatarUrl: adminUser?.avatarUrl || '/assets/profile/ayushman.jpg',
    },
  });
});

// ==========================================
// 11. PUT /api/auth/profile — Admin Only Profile Update
// ==========================================
router.put('/profile', requireAdmin, async (req: Request, res: Response) => {
  const updates = req.body || {};
  const adminUser = findUserByEmail(ADMIN_EMAIL) || appStore.users[0];

  if (!adminUser) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  if (updates.fullName !== undefined) adminUser.fullName = String(updates.fullName).trim();
  if (updates.bio !== undefined) adminUser.bio = String(updates.bio).trim();
  if (updates.collegeName !== undefined) adminUser.collegeName = String(updates.collegeName).trim();
  if (updates.branch !== undefined) adminUser.branch = String(updates.branch).trim();

  saveUser(adminUser);

  if (isDbConnected()) {
    try {
      await query(
        'UPDATE users SET full_name = ?, bio = ?, college_name = ?, branch = ? WHERE email = ?',
        [adminUser.fullName, adminUser.bio, adminUser.collegeName, adminUser.branch, ADMIN_EMAIL]
      );
    } catch (err) {
      console.warn('[Auth Profile Update] DB mirror error:', err);
    }
  }

  return res.json({
    success: true,
    message: 'Profile updated successfully.',
    user: {
      fullName: adminUser.fullName,
      bio: adminUser.bio,
      collegeName: adminUser.collegeName,
      branch: adminUser.branch,
      avatarUrl: adminUser.avatarUrl,
    },
  });
});

// ==========================================
// 12. PUT /api/auth/change-password — Password Change
// ==========================================
router.put('/change-password', requireAuth, async (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body || {};
  if (!currentPassword || !newPassword || newPassword.length < 8) {
    return res.status(400).json({
      success: false,
      message: 'Current password and a new password (min 8 chars) are required.',
    });
  }

  const user = findUserById(req.user!.id) || findUserByEmail(req.user!.email);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }

  const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Incorrect current password.' });
  }

  user.passwordHash = await bcrypt.hash(newPassword, 10);
  saveUser(user);

  if (isDbConnected()) {
    try {
      await query('UPDATE users SET password_hash = ? WHERE id = ?', [user.passwordHash, user.id]);
    } catch (err) {
      console.warn('[Auth Change Password] DB mirror error:', err);
    }
  }

  return res.json({
    success: true,
    message: 'Password changed successfully.',
  });
});

export default router;
