import { FastifyInstance } from 'fastify';
import { OrchestratorService } from '../services/orchestrator.service.js';
import { KnowledgeService } from '../services/knowledge.service.js';
import { GitHubService } from '../services/github/github.service.js';
import { NotionService } from '../services/notion/notion.service.js';
import { DatabaseService } from '../services/database.service.js';
import { env } from '../config/env.js';

const orchestrator = new OrchestratorService();
const knowledge = new KnowledgeService();
const github = new GitHubService();
const notion = new NotionService();
const db = new DatabaseService();

// Initialize DB schema
db.init();

export async function portfolioRoutes(fastify: FastifyInstance) {
  fastify.post('/portfolio/generate', async (request, reply) => {
    try {
      const { github_handle: inputHandle, user_prompt } = request.body as { github_handle: string, user_prompt: string };
      
      if (!inputHandle) {
        return reply.status(400).send({ error: 'GitHub handle or local handle is required' });
      }

      // Check if this is a local handle linked to a GitHub account
      const user = await db.getUser(inputHandle);
      const github_handle = user?.github_handle || inputHandle;

      console.log(`--- Triggering Portfolio Generation for ${github_handle} (input: ${inputHandle}) ---`);

      // Save User prompt to messages IMMEDIATELY (before long sync)
      console.log(`📝 Persistence User Build Prompt for ${inputHandle}`);
      await db.saveMessage(inputHandle, 'user', user_prompt);

      const result = await orchestrator.generatePortfolio(github_handle, user_prompt);
      
      // Track usage and save history
      const handle = inputHandle;

        await db.savePortfolio({
          user_handle: handle,
          notion_url: result.url
        });

        // Track usage (points)
        const [userRecord] = await db.upsertUser(handle);
        if (userRecord && userRecord.plan !== 'Pro') {
          await db.decrementPoints(handle);
        }


        // Save AI response to messages
        await db.saveMessage(handle, 'ai', github_handle === 'manual_entry' 
          ? `I've processed the details you provided and generated your Notion portfolio!` 
          : `Excellent news! I've analyzed your GitHub and built your portfolio in Notion.`);

      return reply.send({
        success: true,
        data: result,
      });
    } catch (error: any) {
      console.error('❌ Generation Failed:', error);
      return reply.status(500).send({
        success: false,
        error: error.message,
      });
    }
  });

  fastify.post('/docs/generate', async (request, reply) => {
    try {
      const { repo_url } = request.body as { repo_url: string };
      
      if (!repo_url) {
        return reply.status(400).send({ error: 'Repo URL is required' });
      }

      console.log('--- Triggering Doc Generation ---');
      const result = await orchestrator.generateDocumentation(repo_url);
      
      return reply.send({
        success: true,
        data: result,
      });
    } catch (error: any) {
      console.error('❌ Doc Generation Failed:', error);
      return reply.status(500).send({
        success: false,
        error: error.message,
      });
    }
  });

  fastify.post('/knowledge/sync', async (request, reply) => {
    try {
      const { content, category } = request.body as { content: string, category: string };
      
      if (!content) {
        return reply.status(400).send({ error: 'Content is required' });
      }

      console.log('--- Triggering Knowledge Sync ---');
      const blocks = await knowledge.syncUnstructuredData(content, category || 'General');
      
      // Syncing to the knowledge base page in Notion
      // (Using dummy logic for now as it's a template)
      
      return reply.send({
        success: true,
        message: 'Knowledge synced to Notion',
      });
    } catch (error: any) {
      console.error('❌ Knowledge Sync Failed:', error);
      return reply.status(500).send({
        success: false,
        error: error.message,
      });
    }
  });

  fastify.post('/chat', async (request, reply) => {
    try {
      const { message, handle } = request.body as { message: string, handle?: string };
      
      if (!message) {
        return reply.status(400).send({ error: 'Message is required' });
      }

      if (handle) {
        console.log(`📝 Saving user message for ${handle}`);
        await db.saveMessage(handle, 'user', message);
      }

      const response = await orchestrator.getChatResponse(message);
      
      if (handle) {
        console.log(`🤖 Saving AI response for ${handle}`);
        await db.saveMessage(handle, 'ai', response);
      }

      return reply.send({
        success: true,
        data: response,
      });
    } catch (error: any) {
      return reply.status(500).send({
        success: false,
        error: error.message,
      });
    }
  });

  fastify.get('/chat/history/:handle', async (request, reply) => {
    try {
      const { handle } = request.params as { handle: string };
      const history = await db.getMessages(handle);
      return reply.send({ success: true, history });
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  // Health check
  fastify.get('/health', async () => ({ status: 'ok' }));

  // --- GITHUB OAUTH ---
  fastify.get('/auth/github/url', async (request, reply) => {
    return reply.send({
      clientId: env.GITHUB_CLIENT_ID,
      redirectUri: 'http://localhost:5173/integrations', // Point at Frontend
      scope: 'repo,user'
    });
  });

  fastify.post('/auth/github/callback', async (request, reply) => {
    try {
      const { code } = request.body as { code: string };
      if (!code) return reply.status(400).send({ error: 'Code is required' });

      // Exchange for token
      const token = await github.getAccessToken(code);
      
      // Fetch user profile using the token
      const userProfile = await github.getUserProfile(token);
      
      // Ensure user exists in our DB and is linked to their GitHub handle
      await db.upsertUser(userProfile.username, userProfile.name || userProfile.username, userProfile.username);

      return reply.send({
        success: true,
        token,
        profile: userProfile
      });
    } catch (error: any) {
      console.error('❌ GitHub Auth Failed:', error);
      return reply.status(500).send({ error: error.message });
    }
  });

  // --- NOTION OAUTH ---
  fastify.get('/auth/notion/url', async (request, reply) => {
    return reply.send({
      clientId: env.NOTION_CLIENT_ID,
      redirectUri: 'http://localhost:5173/integrations' // Point at Frontend
    });
  });

  fastify.post('/auth/notion/callback', async (request, reply) => {
    try {
      const { code } = request.body as { code: string };
      if (!code) return reply.status(400).send({ error: 'Code is required' });

      const data = await notion.getAccessToken(code);
      
      return reply.send({
        success: true,
        accessToken: data.access_token,
        workspaceId: data.workspace_id,
        workspaceName: data.workspace_name,
        workspaceIcon: data.workspace_icon,
        owner: data.owner
      });
    } catch (error: any) {
      console.error('❌ Notion Auth Failed:', error);
      return reply.status(500).send({ error: error.message });
    }
  });

  // --- PORTFOLIO LIST ---
  fastify.get('/portfolios/:handle', async (request, reply) => {
    try {
      const { handle } = request.params as { handle: string };
      const portfolios = await db.getPortfolios(handle);
      return reply.send({ success: true, portfolios });
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  fastify.delete('/portfolios/:handle', async (request, reply) => {
    try {
      const { handle } = request.params as { handle: string };
      await db.clearPortfolios(handle);
      return reply.send({ success: true, message: `Portfolios cleared for ${handle}` });
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  fastify.delete('/portfolios/:handle/:id', async (request, reply) => {
    try {
      const { handle, id } = request.params as { handle: string, id: string };
      const result = await db.deletePortfolio(parseInt(id), handle);
      
      if (result.length === 0) {
        return reply.status(404).send({ success: false, error: 'Portfolio not found or unauthorized' });
      }

      return reply.send({ success: true, message: `Portfolio ${id} deleted` });
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });


  // --- USER DATA ---
  fastify.get('/user/:handle', async (request, reply) => {
    try {
      const { handle } = request.params as { handle: string };
      // Ensure user exists - will not overwrite existing fields because of COALESCE logic
      await db.upsertUser(handle);
      const user = await db.getUser(handle);
      return reply.send({ success: true, user });
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  fastify.post('/user/:handle/link-github', async (request, reply) => {
    try {
      const { handle } = request.params as { handle: string };
      const { github_handle, display_name } = request.body as { github_handle: string, display_name?: string };
      
      if (!github_handle) {
         return reply.status(400).send({ error: 'github_handle is required' });
      }
 
      const user = await db.linkGithubToHandle(handle, github_handle, display_name);
      return reply.send({ success: true, user });
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  fastify.post('/user/:handle/update', async (request, reply) => {
    try {
      const { handle } = request.params as { handle: string };
      const { display_name, bio } = request.body as { display_name?: string, bio?: string };
      
      const user = await db.upsertUser(handle, display_name);
      // bio update logic if needed, but upsertUser only handles displayName/githubHandle for now
      // Let's stick to display_name as that's what's missing
      
      return reply.send({ success: true, user });
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  fastify.get('/notion/blocks/:pageId', async (request, reply) => {
    try {
      const { pageId } = request.params as { pageId: string };
      const blocks = await notion.getBlocks(pageId);
      return reply.send({ success: true, blocks });
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });
}
