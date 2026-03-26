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

  async getAccessToken(code: string, redirectUri?: string) {
    const auth = Buffer.from(`${env.NOTION_CLIENT_ID}:${env.NOTION_CLIENT_SECRET}`).toString('base64');
    
    const response = await axios.post(
      'https://api.notion.com/v1/oauth/token',
      {
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
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

  // --- MCP COMPATIBLE EXTENSIONS ---

  async search(query: string) {
    return this.notion.search({
      query,
      sort: {
        direction: 'descending',
        timestamp: 'last_edited_time',
      },
      page_size: 10,
    });
  }

  async updatePage(pageId: string, properties: any, icon?: string, cover?: string) {
    return this.notion.pages.update({
      page_id: pageId,
      properties,
      icon: icon ? { type: 'emoji', emoji: icon as any } : undefined,
      cover: cover ? { type: 'external', external: { url: cover } } : undefined,
    });
  }

  async duplicatePage(pageId: string) {
    // Note: Notion API doesn't have a direct 'duplicate' yet, 
    // but MCP tools often implement it by reading and recreating.
    // For now, we use a placeholder or handle it via a specific integration if available.
    // However, the 'notion-duplicate-page' MCP tool exists, so it might use a private/new endpoint.
    // We'll implement a basic version: fetch and create.
    const page = await this.getPage(pageId) as any;
    const blocks = await this.getBlocks(pageId);
    return this.createPage(page.parent.page_id || page.parent.id, `Copy of ${page.properties.title.title[0].plain_text}`, blocks as any[]);
  }

  async archivePage(pageId: string) {
    return this.notion.pages.update({
      page_id: pageId,
      archived: true,
    });
  }

  async createComment(pageId: string, text: string) {
    return this.notion.comments.create({
      parent: { page_id: pageId },
      rich_text: [
        {
          text: { content: text },
        },
      ],
    });
  }
}
