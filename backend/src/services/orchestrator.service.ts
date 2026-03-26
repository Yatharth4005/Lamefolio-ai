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

  async analyzeResume(handle: string, buffer: Buffer, mimeType: string, userPrompt?: string) {
    console.log(`🚀 Analyzing resume for: ${handle}`);
    
    // 1. Extract data via AI
    const resumeData = await this.ai.analyzeResume(buffer, mimeType, userPrompt);
    
    // 2. Persist to User Profile
    await this.db.updateResumeData(handle, resumeData);
    
    return resumeData;
  }

  async getChatResponse(message: string, history: any[] = [], context?: { notionPageId?: string }) {
    try {
      let enrichedMessage = message;
      if (context?.notionPageId) {
        enrichedMessage = `[CONTEXT: The current active Notion Page ID is ${context.notionPageId}. Use this ID if the user asks to update or read "this page" or "my portfolio" without providing an ID.]\n\n${message}`;
      }

      console.log("💬 Fetching AI response for:", message);
      let response = await this.ai.chat(enrichedMessage, history);
      
      // Check for function calls
      const functionCalls = response.candidates?.[0]?.content?.parts?.filter(p => p.functionCall);

      if (functionCalls && functionCalls.length > 0) {
        const toolResults = [];

        for (const fc of functionCalls) {
          const { name, args } = fc.functionCall!;
          console.log(`🛠️ AI is calling tool: ${name}`, args);

          try {
            let result;
            switch (name) {
              case 'notion_search':
                result = await this.notion.search((args as any).query);
                // Simplify search result to avoid token overflow
                result = (result as any).results.map((r: any) => ({
                  id: r.id,
                  type: r.object,
                  title: r.properties?.title?.title?.[0]?.plain_text || r.properties?.Name?.title?.[0]?.plain_text || "Untitled",
                  url: r.url
                })).slice(0, 5);
                break;
              case 'notion_fetch_content':
                result = await this.notion.getBlocks((args as any).page_id);
                // Simplify block data for the AI
                result = (result as any).map((b: any) => ({
                  type: b.type,
                  content: b[b.type]?.rich_text?.[0]?.plain_text || "..."
                })).slice(0, 20);
                break;
              case 'notion_append_content':
                // AI-powered block generation - converting text to Notion blocks
                const newBlocks = [{
                  object: 'block',
                  type: 'callout',
                  callout: {
                      rich_text: [{ type: 'text', text: { content: (args as any).text }, annotations: { bold: true } }],
                      icon: { emoji: "🛠️" },
                      color: "default"
                  }
                }];

                // Smart Positioning: Search for Projects heading to append after it
                const allBlocks = await this.notion.getBlocks((args as any).page_id);
                const projectsHeader = (allBlocks as any).find((b: any) => 
                  b.type === 'heading_2' && 
                  (b.heading_2?.rich_text?.[0]?.plain_text?.toLowerCase().includes('project') ||
                   b.heading_1?.rich_text?.[0]?.plain_text?.toLowerCase().includes('project'))
                );

                if (projectsHeader) {
                  console.log(`📍 Found Projects section at ${projectsHeader.id}, appending after.`);
                  result = await (this.notion as any).notion.blocks.children.append({
                    block_id: (args as any).page_id,
                    after: projectsHeader.id,
                    children: newBlocks
                  });
                } else {
                  console.log(`📍 Projects section not found, appending to bottom.`);
                  result = await this.notion.appendBlocks((args as any).page_id, newBlocks);
                }
                break;
              case 'notion_delete_content':
                // Smart Deletion: Find the block matching the query and delete it
                const pageBlocks = await this.notion.getBlocks((args as any).page_id);
                const blockToDelete = (pageBlocks as any).find((b: any) => {
                  const content = JSON.stringify(b).toLowerCase();
                  return content.includes((args as any).query.toLowerCase());
                });

                if (blockToDelete) {
                  console.log(`🗑️ Deleting block ${blockToDelete.id} matching query: ${(args as any).query}`);
                  result = await (this.notion as any).notion.blocks.delete({
                    block_id: blockToDelete.id
                  });
                } else {
                  result = { error: "Content not found on the page." };
                }
                break;
              case 'notion_update_page':
                result = await this.notion.updatePage((args as any).page_id, {}, (args as any).icon, (args as any).cover);
                break;
              case 'notion_create_comment':
                result = await this.notion.createComment((args as any).page_id, (args as any).text);
                break;
              default:
                result = { error: "Tool not found" };
            }
            
            toolResults.push({
              functionResponse: {
                name,
                response: { content: result }
              }
            });
          } catch (e: any) {
            console.error(`❌ Tool execution failed (${name}):`, e.message);
            toolResults.push({
              functionResponse: {
                name,
                response: { error: e.message }
              }
            });
          }
        }

        // Send results back
        console.log("🔄 Sending tool results back to Gemini...");
        const finalChat = (this.ai as any).model.startChat({ 
          history: [
            ...history, 
            { role: 'user', parts: [{ text: message }] }, 
            response.candidates![0].content
          ] 
        });
        
        const finalResult = await finalChat.sendMessage(toolResults);
        const finalText = finalResult.response.text();
        console.log("✅ AI Final Response Received.");
        return finalText;
      }

      return response.text();
    } catch (error: any) {
      console.error("❌ Orchestrator Chat Error:", error);
      return `I encountered an error while processing your request: ${error.message}. Please try again.`;
    }
  }
}
