import { GitHubService } from './github/github.service.js';
import { GeminiService } from './ai/gemini.service.js';
import { NotionService } from './notion/notion.service.js';
import { TransformerService } from './transformer/transformer.service.js';
import { DatabaseService } from './database.service.js';
import { env } from '../config/env.js';

export class OrchestratorService {
  private github = new GitHubService();
  private ai = new GeminiService();
  private notion = new NotionService();
  private transformer = new TransformerService();
  private db = new DatabaseService();

  async generatePortfolio(githubHandle: string, userPrompt: string, templateId?: string) {
    console.log(`🚀 Starting portfolio generation for: ${githubHandle} (Template: ${templateId || 'Default'})`);

    // 1. Fetch GitHub data
    const repos = githubHandle !== 'manual_entry' ? await this.github.getRepoMetadata(githubHandle) : [];
    const repoNames = repos.map(r => r.name);
    const deepRepoData = githubHandle !== 'manual_entry' ? await this.github.fetchProjectDeepData(githubHandle, repoNames) : [];

    // 2. Try to fetch stored Resume/Context
    const user = await this.db.getUser(githubHandle);
    
    const aggregatedData = {
      profile: { username: githubHandle, displayName: user?.display_name },
      repositories: repos,
      details: deepRepoData,
      resumeContext: user?.resume_json || null
    };

    // 3. Generate Semantic Map via AI
    console.log('🤖 Consult Gemini for architecture (including resume if available)...');
    const portfolioSchema = await this.ai.generatePortfolioSchema(aggregatedData, userPrompt);

    // 3. Transform to Notion Blocks
    console.log('💎 Converting to blocks using template:', templateId || 'default');
    const blocks = this.transformer.convertToPortfolioBlocks(portfolioSchema, templateId);

    // 4. Create Notion Page (Initial)
    console.log('📝 Creating Notion page structure...');
    const parentPageId = env.NOTION_PAGE_ID!;
    
    // Create page with title first to get ID immediately
    const pageresult = await this.notion.createPage(parentPageId, portfolioSchema.title, [], portfolioSchema.cover_image);
    const pageId = pageresult.id;
    const url = (pageresult as any).url;

    // 5. Append blocks incrementally (blocking the request so frontend stays in "isGenerating" mode)
    try {
      console.log(`💎 Syncing ${blocks.length} blocks to ${pageId}...`);
      const batchSize = 10; // Slightly larger batches for efficiency
      for (let i = 0; i < blocks.length; i += batchSize) {
        const batch = blocks.slice(i, i + batchSize);
        await this.notion.appendBlocks(pageId, batch);
        console.log(`✅ Appended batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(blocks.length / batchSize)}`);
        // Small artificial delay to slow down the flow so the frontend feels the AI building it.
        await new Promise(r => setTimeout(r, 500));
      }
      console.log(`🏁 Portfolio build complete for: ${githubHandle}`);
    } catch (error) {
      console.error("❌ Portfolio Build Failed:", error);
      throw error;
    }

    return {
      url: url,
      id: pageId,
      status: 'in_progress'
    };
  }

  async generateDocumentation(repoUrl: string) {
    const [owner, repo] = repoUrl.split('/').slice(-2);
    console.log(`📖 Generating docs for: ${repo}`);

    const readme = await this.github.getRepoReadme(owner, repo);
    const docSchema = await this.ai.generateDevDocs([{ name: repo, content: readme }], repo);

    const blocks = this.transformer.convertToDocsBlocks(docSchema);
    const parentPageId = env.NOTION_PAGE_ID!;
    const result = await this.notion.createPage(parentPageId, `Docs: ${repo}`, blocks);

    return {
      url: (result as any).url,
      id: result.id,
    };
  }

  async analyzeResume(handle: string, buffer: Buffer, mimeType: string, userPrompt?: string) {
    console.log(`🚀 Analyzing resume for: ${handle}`);
    
    // 1. Extract data via AI
    const resumeData = await this.ai.analyzeResume(buffer, mimeType, userPrompt);
    
    // 2. Persist to User Profile
    await this.db.updateResumeData(handle, resumeData);
    
    return resumeData;
  }

  async getChatResponse(message: string, history: any[] = [], context?: { notionPageId?: string, handle?: string }) {
    try {
      let enrichedMessage = message;
      let resumePrompt = "";

      if (context?.handle) {
        const user = await this.db.getUser(context.handle);
        if (user && user.resume_json) {
          console.log(`🧠 Injecting resume context for ${context.handle}`);
          resumePrompt = `\n\n[CONTEXT: USER RESUME DATA:\n${JSON.stringify(user.resume_json, null, 2)}\n]\n\nIf the user asks to add projects, skills, or experience from their resume, use the details provided above. You have full access to their resume content.`;
        }
      }

      if (context?.notionPageId) {
        enrichedMessage = `[CONTEXT: The current active Notion Page ID is ${context.notionPageId}. Use this ID if the user asks to update or read "this page" or "my portfolio" without providing an ID. Also context is always better than assumptions.]\n${resumePrompt}\n\n${message}`;
      } else {
        enrichedMessage = `${resumePrompt}\n\n${message}`;
      }

      console.log("💬 Fetching AI response for:", message);
      
      const response = await (this.ai as any).chat(enrichedMessage, history);
      
      return response.text();
    } catch (error: any) {
      console.error("❌ Orchestrator Chat Error:", error);
      return `I encountered an error while processing your request: ${error.message}. Please try again.`;
    }
  }
}
