import { FastifyInstance } from 'fastify';
import { OrchestratorService } from '../services/orchestrator.service.js';
import { KnowledgeService } from '../services/knowledge.service.js';

const orchestrator = new OrchestratorService();
const knowledge = new KnowledgeService();

export async function portfolioRoutes(fastify: FastifyInstance) {
  fastify.post('/portfolio/generate', async (request, reply) => {
    try {
      const { github_handle, user_prompt } = request.body as { github_handle: string, user_prompt: string };
      
      if (!github_handle) {
        return reply.status(400).send({ error: 'GitHub handle is required' });
      }

      console.log('--- Triggering Portfolio Generation ---');
      const result = await orchestrator.generatePortfolio(github_handle, user_prompt || '');
      
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
      const { message } = request.body as { message: string };
      
      if (!message) {
        return reply.status(400).send({ error: 'Message is required' });
      }

      const response = await orchestrator.getChatResponse(message);
      
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

  // Health check
  fastify.get('/health', async () => ({ status: 'ok' }));
}
