import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

export function resolveSqlFile(
  filename: string,
  cwd: string = process.cwd(),
  dir: string = __dirname
): string {
  const candidates = [
    path.resolve(dir, `../../../database/${filename}`),
    path.resolve(cwd, `../database/${filename}`),
    path.resolve(cwd, `database/${filename}`),
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return candidate;
  }
  return candidates[0];
}

export async function runMigrations() {
  const host = process.env.DB_HOST || 'localhost';
  const port = parseInt(process.env.DB_PORT || '3306', 10);
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const database = process.env.DB_NAME || 'ayushman_os';
  const useSsl = process.env.DB_SSL === 'true' || process.env.DB_SSL === '1';
  const rejectUnauthorized =
    process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false' &&
    process.env.DB_SSL_REJECT_UNAUTHORIZED !== '0';
  const sslOption = useSsl
    ? {
        ssl: {
          rejectUnauthorized,
        },
      }
    : {};

  console.log(`[Migration] Connecting to MySQL at ${host}:${port} as ${user}...`);

  try {
    // Initial connection without database to ensure database exists
    const rootConn = await mysql.createConnection({
      host,
      port,
      user,
      password,
      multipleStatements: true,
      ...sslOption,
    });
    console.log(`[Migration] Connected to MySQL. Ensuring database '${database}' exists...`);
    await rootConn.query(`CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    await rootConn.end();

    // Now connect to target database
    const dbConn = await mysql.createConnection({
      host,
      port,
      user,
      password,
      database,
      multipleStatements: true,
      ...sslOption,
    });

    const schemaPath = resolveSqlFile('schema.sql');
    const seedPath = resolveSqlFile('seed.sql');

    if (fs.existsSync(schemaPath)) {
      console.log(`[Migration] Executing schema.sql...`);
      const schemaSql = fs.readFileSync(schemaPath, 'utf-8');
      await dbConn.query(schemaSql);
      console.log(`[Migration] Schema created successfully!`);
    }

    if (fs.existsSync(seedPath)) {
      console.log(`[Migration] Executing seed.sql...`);
      const seedSql = fs.readFileSync(seedPath, 'utf-8');
      await dbConn.query(seedSql);
      console.log(`[Migration] Authentic seed data imported successfully!`);
    }

    await dbConn.end();
    console.log(`[Migration Completed] AYushMan database initialized perfectly!`);
  } catch (error: any) {
    console.error(`[Migration Error]:`, error.message);
  }
}

if (require.main === module) {
  runMigrations();
}
