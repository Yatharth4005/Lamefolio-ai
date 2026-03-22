import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../../config/env.js';

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

export class GeminiService {
  private model;

  constructor() {
    this.model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  }

  async generatePortfolioSchema(rawData: any, userPrompt: string) {
    const prompt = `
      System: You are an AI that structures professional portfolios for Notion.
      Task: Based on the provided GitHub repository metadata and user bio/prompt, generate a structured "Semantic Asset Map" for a professional Notion portfolio.
      
      Output Schema Requirements:
      Return a JSON object with:
      - title: Portfolio Page Title
      - hero: { bio: string, tagline: string, social_links: string[] }
      - skills: string[]
      - projects: Array of {
          title: string,
          description: string,
          stars: number,
          tech_stack: string[],
          url: string,
          notion_layout: 'column' | 'card'
        }
      - timeline: Array of { date: string, event: string }
      
      Input Data:
      ---
      GitHub Data: ${JSON.stringify(rawData)}
      User Input: ${userPrompt}
      ---
      Return ONLY valid JSON.
    `;

    const result = await this.model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      // Basic JSON cleanup if LLM adds backticks
      return JSON.parse(text.replace(/```json|```/g, '').trim());
    } catch (e) {
      console.error('Failed to parse AI output:', text);
      throw new Error('Invalid AI response format');
    }
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
      
      Input: ${JSON.stringify(repoFiles.slice(0, 10))} // Limiting for now
      
      Return ONLY valid JSON.
    `;

    const result = await this.model.generateContent(prompt);
    const text = (await result.response).text();
    return JSON.parse(text.replace(/```json|```/g, '').trim());
  }
}
