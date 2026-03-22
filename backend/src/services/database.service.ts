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
      console.log('✅ Database initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize database:', error);
    }
  }

  async savePortfolio(record: PortfolioRecord) {
     return this.sql`
        INSERT INTO portfolios (user_handle, notion_url, theme)
        VALUES (${record.user_handle}, ${record.notion_url}, ${record.theme || 'modern'})
        RETURNING *
     `;
  }

  async getPortfolios(user_handle: string) {
     return this.sql<PortfolioRecord[]>`
        SELECT * FROM portfolios 
        WHERE user_handle = ${user_handle}
        ORDER BY created_at DESC
     `;
  }
}
