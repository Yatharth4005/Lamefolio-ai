import { Client } from '@notionhq/client';
import axios from 'axios';
import { env } from '../../config/env.js';

export class NotionService {
  private notion;

  constructor(token?: string) {
    this.notion = new Client({
      auth: token || env.NOTION_TOKEN,
    });
  }

  async getAccessToken(code: string) {
    const auth = Buffer.from(`${env.NOTION_CLIENT_ID}:${env.NOTION_CLIENT_SECRET}`).toString('base64');
    
    const response = await axios.post(
      'https://api.notion.com/v1/oauth/token',
      {
        grant_type: 'authorization_code',
        code,
        redirect_uri: 'http://localhost:5173/integrations',
      },
      {
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  }

  async createPage(parentPageId: string, title: string, blocks: any[], coverUrl?: string) {
    try {
      const response = await this.notion.pages.create({
        parent: { page_id: parentPageId },
        cover: coverUrl ? { type: 'external', external: { url: coverUrl } } : undefined,
        properties: {
          title: [
            {
              text: { content: title },
            },
          ],
        },
        children: blocks,
      });
      return response;

    } catch (e: any) {
      console.error('Notion integration error:', e.body || e.message);
      throw new Error(`Notion API failure: ${e.message}`);
    }
  }

  async getPage(pageId: string) {
     return this.notion.pages.retrieve({ page_id: pageId });
  }

  async appendBlocks(pageId: string, blocks: any[]) {
      return this.notion.blocks.children.append({
         block_id: pageId,
         children: blocks
      });
  }

  async getBlocks(pageId: string) {
      const response = await this.notion.blocks.children.list({
          block_id: pageId,
      });
      return response.results;
  }
}
