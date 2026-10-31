import mysql, { Pool } from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

export function buildDbConfig(env: NodeJS.ProcessEnv = process.env): mysql.PoolOptions {
  const useSsl = env.DB_SSL === 'true' || env.DB_SSL === '1';
  const rejectUnauthorized =
    env.DB_SSL_REJECT_UNAUTHORIZED !== 'false' &&
    env.DB_SSL_REJECT_UNAUTHORIZED !== '0';

  return {
    host: env.DB_HOST || 'localhost',
    port: parseInt(env.DB_PORT || '3306', 10),
    user: env.DB_USER || 'root',
    password: env.DB_PASSWORD || '',
    database: env.DB_NAME || 'ayushman_os',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ...(useSsl
      ? {
          ssl: {
            rejectUnauthorized,
          },
        }
      : {}),
  };
}

let pool: Pool | null = null;
let isConnected = false;

export async function initDatabaseConnection(): Promise<boolean> {
  const dbConfig = buildDbConfig(process.env);
  try {
    pool = mysql.createPool(dbConfig);
    const conn = await pool.getConnection();
    await conn.ping();
    conn.release();
    isConnected = true;
    console.log('[MySQL] Database connection available.');
    return true;
  } catch (error: any) {
    console.warn('[MySQL Notice] Database connection unavailable; using fallback memory store.');
    isConnected = false;
    return false;
  }
}

export function getPool(): Pool | null {
  return pool;
}

export function isDbConnected(): boolean {
  return isConnected;
}

/**
 * Execute parameterized SQL query safely
 */
export async function query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  if (pool && isConnected) {
    const [rows] = await pool.query(sql, params);
    return rows as T[];
  }
  return [];
}
