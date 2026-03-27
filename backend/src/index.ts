import fastify from 'fastify';
import fs from 'fs';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import path from 'path';
import { fileURLToPath } from 'url';
import { env } from './config/env.js';
import { portfolioRoutes } from './api/routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = fastify({ logger: true });

// Registering Fastify CORS
await app.register(cors, {
  origin: true, // Allow all origins for dev
});

// Registering Fastify Multipart
await app.register(multipart);

// Registering Fastify Static for uploads
const uploadsDir = process.env.VERCEL 
  ? path.join('/tmp', 'uploads') 
  : path.join(__dirname, '../uploads');

// Ensure directory exists at startup
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

await app.register(fastifyStatic, {
  root: uploadsDir,
  prefix: '/uploads/',
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
💳 Razorpay: ${env.RAZORPAY_KEY_ID ? 'Live Gateway Active' : 'Mock Mode Enabled'}
-----------------------------------
    `);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

if (!process.env.VERCEL) {
  start();
}

export default app;
