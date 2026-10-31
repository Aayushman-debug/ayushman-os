import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';

import { initDatabaseConnection, isDbConnected } from './database/db';
import authRoutes from './routes/auth.routes';
import academicsRoutes from './routes/academics.routes';
import productivityRoutes from './routes/productivity.routes';
import entertainmentRoutes from './routes/entertainment.routes';
import gamingRoutes from './routes/gaming.routes';
import developerRoutes from './routes/developer.routes';
import vaultRoutes from './routes/vault.routes';
import socialRoutes from './routes/social.routes';
import {
  populateSession,
  rejectProductionWritesWithoutDurableStorage,
} from './middleware/authorization';

dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const HOST = process.env.HOST || '0.0.0.0';

export function isOriginAllowed(
  origin: string | undefined,
  rawAllowedOrigins: string = process.env.CORS_ORIGIN || process.env.CLIENT_URL || '',
  nodeEnv: string = process.env.NODE_ENV || 'development'
): boolean {
  if (!origin) return true;
  const normalizedOrigin = origin.trim().replace(/\/+$/, '');
  const allowedList = rawAllowedOrigins
    .split(',')
    .map((o) => o.trim().replace(/\/+$/, ''))
    .filter(Boolean);

  if (allowedList.includes('*') || allowedList.includes(normalizedOrigin)) {
    return true;
  }

  if (nodeEnv !== 'production') {
    if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(normalizedOrigin)) {
      return true;
    }
  }

  return false;
}

// Middlewares
app.use(
  cors({
    origin: (origin, callback) => {
      if (isOriginAllowed(origin)) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(populateSession);
app.use(rejectProductionWritesWithoutDurableStorage);

// Health Check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'online',
    system: 'AYushMan API',
    database: isDbConnected() ? 'available' : 'unavailable',
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/academics', academicsRoutes);
app.use('/api/productivity', productivityRoutes);
app.use('/api/entertainment', entertainmentRoutes);
app.use('/api/gaming', gamingRoutes);
app.use('/api/developer', developerRoutes);
app.use('/api/vault', vaultRoutes);
app.use('/api/social', socialRoutes);

// Global Error Handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[Server Error]:', err);
  res.status(500).json({ success: false, error: err.message || 'Internal Server Error' });
});

// Boot Server
export async function startServer() {
  await initDatabaseConnection();

  app.listen(PORT, HOST, () => {
    console.log(`[AYushMan API] Server online and listening at http://${HOST}:${PORT}`);
    console.log(`[AYushMan API] Ready for client connections.`);
  });
}

if (require.main === module) {
  startServer();
}

export { app };
