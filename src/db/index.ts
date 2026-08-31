import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

// Lazy database initialization that handles missing DATABASE_URL
let dbInstance: any = null;

export function getDb() {
  if (dbInstance) return dbInstance;
  
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.warn('DATABASE_URL not set, database operations will fail');
    return null;
  }
  
  try {
    const sql = neon(databaseUrl);
    dbInstance = drizzle({ client: sql });
    return dbInstance;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    return null;
  }
}

// Legacy export for compatibility
export const db = getDb();
