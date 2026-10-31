import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { isDbConnected } from '../database/db';

export const AUTH_COOKIE_NAME = 'ayushman_session';
export const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'pathakaayushman57@gmail.com').trim().toLowerCase();

export interface AuthUserPayload {
  id: number;
  email: string;
  role: 'admin' | 'visitor';
  fullName?: string;
  avatarUrl?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUserPayload | null;
    }
  }
}

export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET?.trim();
  if (!secret) {
    throw new Error('JWT_SECRET must be configured before issuing or verifying sessions.');
  }
  return secret;
}

/**
 * Extract token from HttpOnly cookie or Authorization Bearer header
 */
export function extractToken(req: Request): string | null {
  if (req.cookies && req.cookies[AUTH_COOKIE_NAME]) {
    return req.cookies[AUTH_COOKIE_NAME];
  }
  const authHeader = req.get('authorization') || '';
  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  if (match) {
    return match[1];
  }
  return null;
}

/**
 * Verify and parse session token.
 * Strictly guarantees that ONLY ADMIN_EMAIL can ever possess role: 'admin'.
 */
export function verifySessionToken(token: string): AuthUserPayload | null {
  try {
    const secret = getJwtSecret();
    const decoded = jwt.verify(token, secret) as any;
    if (!decoded || typeof decoded !== 'object' || !decoded.email) {
      return null;
    }

    const email = String(decoded.email).trim().toLowerCase();
    const isSoleAdmin = email === ADMIN_EMAIL.toLowerCase();

    // Enforce sole administrator policy at the cryptographic claim verification step
    const safeRole: 'admin' | 'visitor' = (isSoleAdmin && decoded.role === 'admin') ? 'admin' : 'visitor';

    return {
      id: Number(decoded.id) || 1,
      email,
      role: safeRole,
      fullName: decoded.fullName ? String(decoded.fullName) : undefined,
      avatarUrl: decoded.avatarUrl ? String(decoded.avatarUrl) : undefined,
    };
  } catch {
    return null;
  }
}

/**
 * Middleware that populates req.user if a valid session exists, but doesn't block unauthenticated requests.
 */
export function populateSession(req: Request, _res: Response, next: NextFunction): void {
  const token = extractToken(req);
  if (token) {
    req.user = verifySessionToken(token);
  } else {
    req.user = null;
  }
  next();
}

/**
 * Middleware requiring ANY authenticated session (visitor or admin).
 */
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const token = extractToken(req);
  if (!token) {
    res.status(401).json({ success: false, message: 'Authentication required. Please sign in.' });
    return;
  }

  const user = verifySessionToken(token);
  if (!user) {
    res.status(401).json({ success: false, message: 'Invalid or expired session. Please sign in again.' });
    return;
  }

  req.user = user;
  next();
}

/**
 * Middleware requiring verified ADMINISTRATOR session (pathakaayushman57@gmail.com).
 * Enforces admin authorization in both development and production.
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const token = extractToken(req);
  if (!token) {
    res.status(401).json({ success: false, message: 'Administrator authentication required.' });
    return;
  }

  const user = verifySessionToken(token);
  if (!user) {
    res.status(401).json({ success: false, message: 'Invalid or expired administrator session.' });
    return;
  }

  if (user.role !== 'admin' || user.email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
    res.status(403).json({
      success: false,
      message: 'Access denied: Administrator privileges required for this resource.',
    });
    return;
  }

  req.user = user;
  next();
}

// Retain requireAdminInProduction for backwards compatibility if referenced
export const requireAdminInProduction = requireAdmin;

/**
 * Simple in-memory rate limiter for authentication routes
 */
interface RateLimitEntry {
  count: number;
  resetTime: number;
}
const rateLimitMap = new Map<string, RateLimitEntry>();

export function authRateLimiter(windowMs: number = 5 * 60 * 1000, maxRequests: number = 15) {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const key = `${ip}:${req.path}`;
    const now = Date.now();

    let entry = rateLimitMap.get(key);
    if (!entry || now > entry.resetTime) {
      entry = { count: 1, resetTime: now + windowMs };
      rateLimitMap.set(key, entry);
      return next();
    }

    entry.count++;
    if (entry.count > maxRequests) {
      const waitSeconds = Math.ceil((entry.resetTime - now) / 1000);
      return res.status(429).json({
        success: false,
        message: `Too many attempts. Rate limit exceeded. Please try again in ${waitSeconds} seconds.`,
      });
    }

    next();
  };
}

export function rejectProductionWritesWithoutDurableStorage(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (
    process.env.NODE_ENV !== 'production' ||
    req.method === 'GET' ||
    req.method === 'HEAD' ||
    req.method === 'OPTIONS' ||
    (req.method === 'POST' && (req.path.startsWith('/api/auth/login') || req.path.startsWith('/api/auth/register') || req.path.startsWith('/api/auth/google') || req.path.startsWith('/api/auth/forgot-password') || req.path.startsWith('/api/auth/reset-password') || req.path.startsWith('/api/auth/verify-email')))
  ) {
    next();
    return;
  }

  requireAdmin(req, res, () => {
    if (!isDbConnected()) {
      res.status(503).json({
        success: false,
        message: 'Database unavailable; the requested write was not saved.',
      });
      return;
    }
    next();
  });
}
