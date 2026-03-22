import fastify from 'fastify';
import cors from '@fastify/cors';
import { env } from './config/env.js';
import { portfolioRoutes } from './api/routes.js';

const app = fastify({ logger: true });

// Registering Fastify CORS
await app.register(cors, {
  origin: true, // Allow all origins for dev
});

// Registering Routes
await app.register(portfolioRoutes, { prefix: '/api' });

const start = async () => {
  try {
    const address = await app.listen({ port: env.PORT, host: '0.0.0.0' });
    console.log(`
🚀 Backend Server Running!
-----------------------------------
📍 Server address: ${address}
🌱 Environment: ${env.NODE_ENV}
🛠️ Gemini API: Registered
🛠️ GitHub Token: ${env.GITHUB_TOKEN ? 'Present' : 'Missing'}
🛠️ Notion Token: ${env.NOTION_TOKEN ? 'Present' : 'Missing'}
-----------------------------------
    `);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
