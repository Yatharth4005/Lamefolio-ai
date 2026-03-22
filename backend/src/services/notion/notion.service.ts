import { Client } from '@notionhq/client';
import { env } from '../../config/env.js';

export class NotionService {
  private notion;

  constructor() {
    this.notion = new Client({
      auth: env.NOTION_TOKEN,
    });
  }

  async createPage(parentPageId: string, title: string, blocks: any[]) {
    try {
      const response = await this.notion.pages.create({
        parent: { page_id: parentPageId },
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
}
