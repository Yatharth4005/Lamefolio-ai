import { GeminiService } from './ai/gemini.service.js';
import { NotionService } from './notion/notion.service.js';

export class KnowledgeService {
  private ai = new GeminiService();
  private notion = new NotionService();

  async syncUnstructuredData(content: string, category: string) {
    console.log(`🧠 Syncing knowledge for category: ${category}`);

    const prompt = `
      System: You are an expert knowledge organizer for Notion.
      Task: Convert the provide text into a highly structured Notion-ready format.
      - Extract key entities
      - Create summary
      - Action items (if any)
      - Key takeaways
      
      Input: ${content}
      
      Return ONLY valid JSON.
    `;

    // Reusing Gemini for structuring
    const structured = await this.ai.generatePortfolioSchema({ rawText: content }, prompt);

    // Transforming to basic blocks
    const blocks: any[] = [
      {
        object: 'block',
        type: 'heading_2',
        heading_2: { rich_text: [{ type: 'text', text: { content: `Knowledge Note: ${category}` } }] }
      },
      {
        object: 'block',
        type: 'quote',
        quote: { rich_text: [{ type: 'text', text: { content: structured.summary || content.slice(0, 500) } }] }
      }
    ];

    // ... more complex block generation for knowledge

    return blocks;
  }
}
