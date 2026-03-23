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

    // 4. Create Notion Page
    console.log('📝 Creating Notion page...');
    const parentPageId = env.NOTION_PAGE_ID!;
    const result = await this.notion.createPage(parentPageId, portfolioSchema.title, blocks, portfolioSchema.cover_image);

    return {
      url: (result as any).url,
      id: result.id,
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
