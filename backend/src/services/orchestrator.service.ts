import { GitHubService } from './github/github.service.js';
import { GeminiService } from './ai/gemini.service.js';
import { NotionService } from './notion/notion.service.js';
import { TransformerService } from './transformer/transformer.service.js';
import { env } from '../config/env.js';

export class OrchestratorService {
  private github = new GitHubService();
  private ai = new GeminiService();
  private notion = new NotionService();
  private transformer = new TransformerService();

  async generatePortfolio(githubHandle: string, userPrompt: string) {
    console.log(`🚀 Starting portfolio generation for: ${githubHandle}`);

    // 1. Fetch GitHub data
    const repos = await this.github.getRepoMetadata(githubHandle);
    const repoNames = repos.map(r => r.name);
    const deepRepoData = await this.github.fetchProjectDeepData(githubHandle, repoNames);

    const aggregatedData = {
      profile: { username: githubHandle },
      repositories: repos,
      details: deepRepoData,
    };

    // 2. Generate Semantic Map via AI
    console.log('🤖 Consult Gemini for architecture...');
    const portfolioSchema = await this.ai.generatePortfolioSchema(aggregatedData, userPrompt);

    // 3. Transform to Notion Blocks
    console.log('💎 Converting to blocks...');
    const blocks = this.transformer.convertToPortfolioBlocks(portfolioSchema);

    // 4. Create Notion Page (Initial)
    console.log('📝 Creating Notion page structure...');
    const parentPageId = env.NOTION_PAGE_ID!;
    
    // Create page with title first to get ID immediately
    const pageresult = await this.notion.createPage(parentPageId, portfolioSchema.title, [], portfolioSchema.cover_image);
    const pageId = pageresult.id;
    const url = (pageresult as any).url;

    // 5. Append blocks incrementally (in background or sequentially)
    // For now, we do it sequentially but we could return the URL early if we wanted to true async
    // In this MVP, we'll append blocks in batches of 10
    console.log(`💎 Appending ${blocks.length} blocks to ${pageId}...`);
    const batchSize = 10;
    for (let i = 0; i < blocks.length; i += batchSize) {
      const batch = blocks.slice(i, i + batchSize);
      await this.notion.appendBlocks(pageId, batch);
      console.log(`✅ Appended batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(blocks.length/batchSize)}`);
    }

    return {
      url: url,
      id: pageId,
      status: 'completed'
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

  async getChatResponse(message: string) {
    const history = [
      { role: 'user', parts: [{ text: "Hello" }] },
      { role: 'model', parts: [{ text: "Hi! I am Lamefolio AI. I help you build stunning portfolios and documentation." }] }
    ] as any;

    return this.ai.chat(message, history);
  }
}
