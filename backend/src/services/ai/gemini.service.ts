import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, SchemaType } from '@google/generative-ai';
import { env } from '../../config/env.js';
import { ASSISTANT_SYSTEM_INSTRUCTION, PORTFOLIO_SCHEMA_PROMPT } from '../../config/prompts.js';

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

export class GeminiService {
  private model;

  constructor() {
    this.model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: ASSISTANT_SYSTEM_INSTRUCTION,
      tools: [
        {
          functionDeclarations: [
            {
              name: "notion_search",
              description: "Search for pages, databases or content in the connected Notion workspace.",
              parameters: {
                type: SchemaType.OBJECT,
                properties: {
                  query: { type: SchemaType.STRING, description: "The search query." }
                },
                required: ["query"]
              }
            },
            {
              name: "notion_update_page",
              description: "Update a Notion page's icon, cover or properties.",
              parameters: {
                type: SchemaType.OBJECT,
                properties: {
                  page_id: { type: SchemaType.STRING, description: "The ID of the page to update." },
                  icon: { type: SchemaType.STRING, description: "Emoji icon to set." },
                  cover: { type: SchemaType.STRING, description: "URL of the cover image." }
                },
                required: ["page_id"]
              }
            },
            {
              name: "notion_fetch_content",
              description: "Fetch the full text content and blocks from a specific Notion page ID. Use this to read the details of a page before summarizing or analyzing it.",
              parameters: {
                type: SchemaType.OBJECT,
                properties: {
                  page_id: { type: SchemaType.STRING, description: "The ID of the page to read." }
                },
                required: ["page_id"]
              }
            },
            {
              name: "notion_append_content",
              description: "Append new text or content blocks to the bottom of a Notion page.",
              parameters: {
                type: SchemaType.OBJECT,
                properties: {
                  page_id: { type: SchemaType.STRING, description: "The ID of the page." },
                  text: { type: SchemaType.STRING, description: "The text content to append." }
                },
                required: ["page_id", "text"]
              }
            },
            {
              name: "notion_create_comment",
              description: "Add a comment to a Notch page.",
              parameters: {
                type: SchemaType.OBJECT,
                properties: {
                  page_id: { type: SchemaType.STRING, description: "The ID of the page." },
                  text: { type: SchemaType.STRING, description: "The comment content." }
                },
                required: ["page_id", "text"]
              }
            }
          ]
        }
      ]
    }, { apiVersion: 'v1beta' });
  }

  async generatePortfolioSchema(rawData: any, userPrompt: string) {
    const prompt = PORTFOLIO_SCHEMA_PROMPT(rawData, userPrompt);

    const result = await this.model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      const jsonStr = text.match(/\{[\s\S]*\}/)?.[0] || text.replace(/```json|```/g, '').trim();
      return JSON.parse(jsonStr);
    } catch (e) {
      console.error('Failed to parse AI output:', text);
      throw new Error('Invalid AI response format');
    }
  }

  async chat(message: string, history: any[]) {
    const chatSession = this.model.startChat({
      history,
    });

    const result = await chatSession.sendMessage(message);
    return result.response;
  }

  async generateDevDocs(repoFiles: any[], repoName: string) {
    const prompt = `
      System: You are a technical writer generating Notion documentation.
      Task: Analyze the provided code structure and README for repo "${repoName}". Generate a comprehensive documentation structure.
      
      Output Schema:
      Return JSON with:
      - intro: High-level overview
      - setup_instructions: Step-by-step
      - architecture: Explanation of project structure
      - api_reference: If applicable, list endpoints/functions
      
      Input: ${JSON.stringify(repoFiles.slice(0, 10))}
      
      Return ONLY valid JSON.
    `;

    const result = await this.model.generateContent(prompt);
    const text = (await result.response).text();
    return JSON.parse(text.replace(/```json|```/g, '').trim());
  }

  async analyzeResume(buffer: Buffer, mimeType: string, userPrompt?: string) {
    // Use v1beta for advanced multimodal features like PDF/Document processing
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }, { apiVersion: "v1beta" });

    const prompt = `
      Task: Analyze the attached file.
      User Instruction: "${userPrompt || 'Analyze and describe this file.'}"
      
      Output Specification:
      Respond ONLY with a valid JSON object.
      
      If the file is a RESUME:
      {
        "is_resume": true,
        "full_name": "...",
        "tagline": "...",
        "contact": { "email": "...", "links": [] },
        "skills": ["..."],
        "experience": [{ "company": "...", "role": "...", "achievements": [] }],
        "analysis": "A brief summary of why you identified this as a resume and the key highlights."
      }
      
      If the file is NOT a resume (e.g., general image, different document):
      {
        "is_resume": false,
        "analysis": "Your detailed answer to the user's instruction or a description of what is in the file/image."
      }
    `;

    try {
      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            data: buffer.toString("base64"),
            mimeType: mimeType
          }
        }
      ]);

      const response = await result.response;
      const text = response.text();
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("Could not find valid JSON in AI response");
      return JSON.parse(jsonMatch[0]);
    } catch (e: any) {
      console.error('❌ Gemini Resume Analysis Failed:', e);
      throw new Error(`AI Analysis Error: ${e.message || 'Check document format'}`);
    }
  }
}
