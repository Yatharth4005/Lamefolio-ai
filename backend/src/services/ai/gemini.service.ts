import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../../config/env.js';
import { ASSISTANT_SYSTEM_INSTRUCTION, PORTFOLIO_SCHEMA_PROMPT } from '../../config/prompts.js';

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

export class GeminiService {
  private model;

  constructor() {
    this.model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      systemInstruction: ASSISTANT_SYSTEM_INSTRUCTION
    });
  }

  async generatePortfolioSchema(rawData: any, userPrompt: string) {
    const prompt = PORTFOLIO_SCHEMA_PROMPT(rawData, userPrompt);

    const result = await this.model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      return JSON.parse(text.replace(/```json|```/g, '').trim());
    } catch (e) {
      console.error('Failed to parse AI output:', text);
      throw new Error('Invalid AI response format');
    }
  }

  async chat(message: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]) {
     const chatSession = this.model.startChat({
        history,
     });
     
     const result = await chatSession.sendMessage(message);
     return result.response.text();
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
}
