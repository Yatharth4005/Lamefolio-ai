import postgres from 'postgres';
import { env } from '../config/env.js';

export interface PortfolioRecord {
  id?: number;
  user_handle: string;
  notion_url: string;
  theme?: string;
  created_at?: Date;
}

export class DatabaseService {
  private sql;

  constructor() {
    // If no URL provided, we'll log a warning but won't crash until a query is made
    this.sql = postgres(env.NEON_DATABASE_URL || '', {
      ssl: 'require',
      connect_timeout: 10
    });
  }

  async init() {
    if (!env.NEON_DATABASE_URL) {
      console.warn('⚠️ NEON_DATABASE_URL not set. Database functionality will be disabled.');
      return;
    }

    try {
      await this.sql`
        CREATE TABLE IF NOT EXISTS portfolios (
          id SERIAL PRIMARY KEY,
          user_handle TEXT NOT NULL,
          notion_url TEXT NOT NULL,
          theme TEXT DEFAULT 'modern',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `;

      await this.sql`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          handle TEXT UNIQUE NOT NULL,
          display_name TEXT,
          points INTEGER DEFAULT 3,
          plan TEXT DEFAULT 'Free',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `;

      await this.sql`
        CREATE TABLE IF NOT EXISTS messages (
          id SERIAL PRIMARY KEY,
          user_handle TEXT NOT NULL,
          role TEXT NOT NULL,
          content TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `;
      console.log('✅ Database initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize database:', error);
    }
  }

  async savePortfolio(record: PortfolioRecord) {
     return this.sql`
        INSERT INTO portfolios (user_handle, notion_url, theme)
        VALUES (LOWER(${record.user_handle}), ${record.notion_url}, ${record.theme || 'modern'})
        RETURNING *
     `;
  }

  async getPortfolios(user_handle: string) {
     return this.sql<PortfolioRecord[]>`
        SELECT * FROM portfolios 
        WHERE LOWER(user_handle) = LOWER(${user_handle})
        ORDER BY created_at DESC
     `;
  }

  async clearPortfolios(user_handle: string) {
     return this.sql`
        DELETE FROM portfolios 
        WHERE LOWER(user_handle) = LOWER(${user_handle})
     `;
  }

   // User Management
   async upsertUser(handle: string, displayName?: string) {
      return this.sql`
        INSERT INTO users (handle, display_name)
        VALUES (LOWER(${handle}), ${displayName || null})
        ON CONFLICT (handle) DO UPDATE SET
          display_name = EXCLUDED.display_name
        RETURNING *
      `;
   }

   async getUser(handle: string) {
      const results = await this.sql`
        SELECT * FROM users WHERE LOWER(handle) = LOWER(${handle})
      `;
      return results[0] || null;
   }

   async decrementPoints(handle: string) {
      return this.sql`
        UPDATE users 
        SET points = GREATEST(0, points - 1)
        WHERE LOWER(handle) = LOWER(${handle})
        RETURNING *
      `;
   }

   // Message Management
   async saveMessage(handle: string, role: string, content: string) {
      return this.sql`
        INSERT INTO messages (user_handle, role, content)
        VALUES (LOWER(${handle}), ${role}, ${content})
        RETURNING *
      `;
   }

   async getMessages(handle: string) {
      return this.sql`
        SELECT * FROM messages 
        WHERE LOWER(user_handle) = LOWER(${handle})
        ORDER BY created_at ASC
      `;
   }
}
