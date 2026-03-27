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
          github_handle TEXT,
          points INTEGER DEFAULT 3,
          plan TEXT DEFAULT 'Free',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `;

      // Migration: Add github_handle if it doesn't exist
      await this.sql`
        DO $$ 
        BEGIN 
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='github_handle') THEN
            ALTER TABLE users ADD COLUMN github_handle TEXT;
          END IF;
        END $$;
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

      await this.sql`
        CREATE TABLE IF NOT EXISTS chat_sessions (
          id SERIAL PRIMARY KEY,
          user_handle TEXT NOT NULL,
          title TEXT NOT NULL,
          is_pinned BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `;

      // Migration: Drop is_archived if it exists
      await this.sql`
        DO $$ 
        BEGIN 
          IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='chat_sessions' AND column_name='is_archived') THEN
            ALTER TABLE chat_sessions DROP COLUMN is_archived;
          END IF;
        END $$;
      `;

      // Migration: Add session_id and action_url to messages if they don't exist
      await this.sql`
        DO $$ 
        BEGIN 
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='messages' AND column_name='session_id') THEN
            ALTER TABLE messages ADD COLUMN session_id INTEGER;
          END IF;
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='messages' AND column_name='action_url') THEN
            ALTER TABLE messages ADD COLUMN action_url TEXT;
          END IF;
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='resume_json') THEN
            ALTER TABLE users ADD COLUMN resume_json JSONB;
          END IF;
        END $$;
      `;

      await this.sql`
        CREATE TABLE IF NOT EXISTS billing_history (
          id SERIAL PRIMARY KEY,
          user_handle TEXT NOT NULL,
          plan_id TEXT NOT NULL,
          amount INTEGER NOT NULL,
          status TEXT DEFAULT 'Processed',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `;

      // Backfill Billing History - Ensure every user starts with Free Plan Enrollment
      const allUsers = await this.sql`SELECT * FROM users`;
      for (const u of allUsers) {
         // 1. Check if they have the 'free' enrollment record
         const [freeHistory] = await this.sql`SELECT 1 FROM billing_history WHERE LOWER(user_handle) = LOWER(${u.handle}) AND plan_id = 'free'`;
         if (!freeHistory) {
            console.log(`📦 Backfilling Free enrollment for user: ${u.handle}`);
            await this.saveBillingRecord(u.handle, 'free', 0);
         }

         // 2. Check if they are currently Pro/Premium and missing that specific record
         if (u.plan.toLowerCase() !== 'free') {
            const [paidHistory] = await this.sql`SELECT 1 FROM billing_history WHERE LOWER(user_handle) = LOWER(${u.handle}) AND plan_id = LOWER(${u.plan})`;
            if (!paidHistory) {
               console.log(`📦 Backfilling ${u.plan} upgrade for user: ${u.handle}`);
               await this.saveBillingRecord(u.handle, u.plan.toLowerCase(), u.plan.toLowerCase() === 'pro' ? 1 : 2);
            }
         }
      }

      console.log('✅ Database initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize database:', error);
    }
  }

  async saveBillingRecord(handle: string, planId: string, amount: number) {
    return this.sql`
      INSERT INTO billing_history (user_handle, plan_id, amount)
      VALUES (LOWER(${handle}), ${planId}, ${amount})
      RETURNING *
    `;
  }

  async getBillingHistory(handle: string) {
    return this.sql`
      SELECT * FROM billing_history 
      WHERE LOWER(user_handle) = LOWER(${handle}) 
      ORDER BY created_at DESC
    `;
  }

  async updateResumeData(handle: string, resumeJson: any) {
    return this.sql`
      UPDATE users 
      SET resume_json = ${resumeJson}
      WHERE LOWER(handle) = LOWER(${handle})
      RETURNING *
    `;
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

  async deletePortfolio(id: number, user_handle: string) {
     return this.sql`
        DELETE FROM portfolios 
        WHERE id = ${id} AND LOWER(user_handle) = LOWER(${user_handle})
        RETURNING *
     `;
  }


   // User Management
   async upsertUser(handle: string, displayName?: string, githubHandle?: string) {
      const lowerHandle = handle.toLowerCase();
      
      // If display name is not provided, we only want to set it if it doesn't exist yet
      // This avoids overwriting an existing display name with the handle string
      return this.sql`
        INSERT INTO users (handle, display_name, github_handle)
        VALUES (${lowerHandle}, ${displayName || handle}, ${githubHandle || null})
        ON CONFLICT (handle) DO UPDATE SET
          display_name = COALESCE(NULLIF(${displayName || ''}, ''), users.display_name),
          github_handle = COALESCE(${githubHandle || null}, users.github_handle)
        RETURNING *
      `;
   }

   async getUser(handle: string) {
      const results = await this.sql`
        SELECT * FROM users WHERE LOWER(handle) = LOWER(${handle})
      `;
      return results[0] || null;
   }

   async updateUserPlan(handle: string, plan: string, points: number) {
      const lowerHandle = handle.toLowerCase();
      console.log(`🆙 Database: Updating ${lowerHandle} to ${plan} with ${points} points`);
      return this.sql`
        UPDATE users 
        SET plan = ${plan}, points = ${points} 
        WHERE LOWER(handle) = ${lowerHandle}
        RETURNING *
      `;
   }

   async linkGithubToHandle(handle: string, githubHandle: string, displayName?: string) {
      const lowerHandle = handle.toLowerCase();
      const lowerGithubHandle = githubHandle.toLowerCase();

      // Fetch the target user (the one with the GitHub handle as their primary ID)
      const [targetUser] = await this.sql`SELECT * FROM users WHERE LOWER(handle) = ${lowerGithubHandle}`;
      const [currentUser] = await this.sql`SELECT * FROM users WHERE LOWER(handle) = ${lowerHandle}`;

      if (!currentUser) {
         console.warn(`User ${handle} not found for linking`);
         return null;
      }

      if (targetUser && lowerHandle !== lowerGithubHandle) {
         console.log(`Merging ${lowerHandle} into existing GitHub account ${lowerGithubHandle}`);
         
         // 1. Move related data to the target account
         await this.sql`UPDATE portfolios SET user_handle = ${lowerGithubHandle} WHERE LOWER(user_handle) = ${lowerHandle}`;
         await this.sql`UPDATE messages SET user_handle = ${lowerGithubHandle} WHERE LOWER(user_handle) = ${lowerHandle}`;
         
         // 2. Consolidate stats (take max points, upgrade plan if either is pro)
         const mergedPoints = Math.max(currentUser.points || 0, targetUser.points || 0);
         const mergedPlan = (currentUser.plan === 'Pro' || targetUser.plan === 'Pro') ? 'Pro' : 'Free';
         const finalDisplayName = displayName || currentUser.display_name || targetUser.display_name;

         await this.sql`
            UPDATE users 
            SET points = ${mergedPoints}, 
                plan = ${mergedPlan}, 
                display_name = ${finalDisplayName},
                github_handle = ${githubHandle}
            WHERE handle = ${lowerGithubHandle}
         `;

         // 3. Delete the redundant local account
         await this.sql`DELETE FROM users WHERE handle = ${lowerHandle}`;
         
         return this.getUser(lowerGithubHandle);
      } else {
         // rename current handle to github handle if they aren't already the same
         if (lowerHandle !== lowerGithubHandle) {
            console.log(`Renaming handle ${lowerHandle} to GitHub handle ${lowerGithubHandle}`);
            
            // Rename handle and update metadata
            // Note: handle is UNIQUE, so we know this won't conflict because targetUser check failed
            await this.sql`
               UPDATE users 
               SET handle = ${lowerGithubHandle}, 
                   github_handle = ${githubHandle}, 
                   display_name = COALESCE(NULLIF(${displayName || ''}, ''), display_name) 
               WHERE handle = ${lowerHandle}
            `;
            
            // Move related data
            await this.sql`UPDATE portfolios SET user_handle = ${lowerGithubHandle} WHERE LOWER(user_handle) = ${lowerHandle}`;
            await this.sql`UPDATE messages SET user_handle = ${lowerGithubHandle} WHERE LOWER(user_handle) = ${lowerHandle}`;
            
            return this.getUser(lowerGithubHandle);
         } else {
            // Already identified by GitHub handle, just update metadata
            return this.upsertUser(lowerHandle, displayName, githubHandle);
         }
      }
   }

   async decrementPoints(handle: string) {
      const user = await this.getUser(handle);
      if (!user) return null;

      const results = await this.sql`
        UPDATE users 
        SET points = GREATEST(0, points - 1)
        WHERE LOWER(handle) = LOWER(${handle})
        RETURNING *
      `;

      const updatedUser = results[0];

      // Sync points to all handles sharing this github account
      if (updatedUser.github_handle) {
        await this.sql`
          UPDATE users 
          SET points = ${updatedUser.points}
          WHERE github_handle = ${updatedUser.github_handle}
        `;
      }

      return updatedUser;
   }

   // Message & Session Management
   async createChatSession(handle: string, title: string) {
      return this.sql`
        INSERT INTO chat_sessions (user_handle, title)
        VALUES (LOWER(${handle}), ${title})
        RETURNING *
      `;
   }

   async getChatSessions(handle: string) {
      return this.sql`
        SELECT * FROM chat_sessions 
        WHERE LOWER(user_handle) = LOWER(${handle})
        ORDER BY is_pinned DESC, created_at DESC
      `;
   }

   async deleteChatSession(sessionId: number) {
      // Delete messages first? (Cascade delete is better but if not set...)
      // Let's just delete the session.
      await this.sql`DELETE FROM messages WHERE session_id = ${sessionId}`;
      return this.sql`DELETE FROM chat_sessions WHERE id = ${sessionId} RETURNING *`;
   }

   async renameChatSession(sessionId: number, title: string) {
      return this.sql`
        UPDATE chat_sessions 
        SET title = ${title} 
        WHERE id = ${sessionId} 
        RETURNING *
      `;
   }

   async togglePinSession(sessionId: number, isPinned: boolean) {
      return this.sql`
        UPDATE chat_sessions 
        SET is_pinned = ${isPinned} 
        WHERE id = ${sessionId} 
        RETURNING *
      `;
   }

   async saveMessage(handle: string, role: string, content: string, sessionId?: number, actionUrl?: string) {
      return this.sql`
        INSERT INTO messages (user_handle, role, content, session_id, action_url)
        VALUES (LOWER(${handle}), ${role}, ${content}, ${sessionId || null}, ${actionUrl || null})
        RETURNING *
      `;
   }

   async getMessages(handle: string) {
      return this.sql`
        SELECT * FROM messages 
        WHERE LOWER(user_handle) = LOWER(${handle}) AND session_id IS NULL
        ORDER BY created_at ASC
      `;
   }

   async getMessagesBySession(sessionId: number) {
      return this.sql`
        SELECT * FROM messages 
        WHERE session_id = ${sessionId}
        ORDER BY created_at ASC
      `;
   }
}
