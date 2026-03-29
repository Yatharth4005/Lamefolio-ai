import axios from 'axios';
import { env } from '../../config/env.js';
import { ASSISTANT_SYSTEM_INSTRUCTION, PORTFOLIO_SCHEMA_PROMPT } from '../../config/prompts.js';

export class GeminiService {
  constructor() {
    console.log('🚀 AIService: Groq AI initialized as primary provider.');
  }

  async generatePortfolioSchema(rawData: any, userPrompt: string) {
    const prompt = PORTFOLIO_SCHEMA_PROMPT(rawData, userPrompt);

    try {
      const text = await this.callGroq(prompt);
      return this.parseJsonResponse(text);
    } catch (e: any) {
      console.error('Groq Portfolio Schema Error:', e.message);
      throw new Error(`AI Generation Failed: ${e.message}`);
    }
  }

  async chat(message: string, history: any[]) {
    try {
      // Convert history format to OpenAI format
      const groqHistory = (history || []).map(h => ({
        role: h.role === 'model' ? 'assistant' : 'user',
        content: h.parts?.[0]?.text || h.content || ''
      }));

      const text = await this.callGroq(message, {
        messages: [
          { role: 'system', content: ASSISTANT_SYSTEM_INSTRUCTION },
          ...groqHistory,
          { role: 'user', content: message }
        ]
      });

      // Return a compatible response object
      return { 
        text: () => text,
        candidates: [{ content: { parts: [{ text }] } }] 
      };
    } catch (e: any) {
      console.error('Groq Chat Error:', e.message);
      throw new Error(`AI Chat Failed: ${e.message}`);
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
      
      Input: ${JSON.stringify(repoFiles.slice(0, 10))}
      
      Return ONLY valid JSON.
    `;

    try {
      const text = await this.callGroq(prompt);
      return this.parseJsonResponse(text);
    } catch (e: any) {
      console.error('Groq DevDocs Error:', e.message);
      throw new Error(`AI Docs Generation Failed: ${e.message}`);
    }
  }

  async analyzeResume(buffer: Buffer, mimeType: string, userPrompt?: string) {
    const prompt = `
      Task: Analyze the provided file content.
      User Instruction: "${userPrompt || 'Analyze and describe this file.'}"
      
      Output Specification:
      Respond ONLY with a valid JSON object.
      
      {
        "is_resume": true,
        "full_name": "...",
        "tagline": "...",
        "professional_summary": "...",
        "contact": { "email": "...", "links": [] },
        "skills": { "technical": [], "tools": [], "soft": [] },
        "experience": [],
        "projects": [],
        "extracurriculars/awards": [],
        "analysis": "..."
      }
    `;

    try {
      // Groq doesn't support direct file uploads like Gemini yet, 
      // so we pass the text prompt with context.
      const text = await this.callGroq(`${prompt}\n\n[Context: User uploaded a file of type ${mimeType}]`);
      return this.parseJsonResponse(text);
    } catch (e: any) {
      console.error('Groq Resume Analysis Error:', e.message);
      throw new Error(`AI Analysis Failed: ${e.message}`);
    }
  }

  private async callGroq(prompt: string, options: any = {}) {
    if (!env.GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY is not configured.');
    }

    const messages = options.messages || [
      { role: 'system', content: ASSISTANT_SYSTEM_INSTRUCTION },
      { role: 'user', content: prompt }
    ];

    try {
      const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
        model: 'llama-3.3-70b-versatile', // High-speed versatile model
        messages,
        temperature: 0.7,
        max_tokens: 4000,
        response_format: prompt.includes('JSON') ? { type: 'json_object' } : undefined
      }, {
        headers: {
          'Authorization': `Bearer ${env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 20000 
      });

      if (!response.data.choices || response.data.choices.length === 0) {
        throw new Error('No response from Groq');
      }

      return response.data.choices[0].message.content;
    } catch (error: any) {
      const errorMsg = error.response?.data?.error?.message || error.message;
      throw new Error(`Groq Error: ${errorMsg}`);
    }
  }

  private parseJsonResponse(text: string) {
    try {
      const jsonStr = text.match(/\{[\s\S]*\}/)?.[0] || text.replace(/```json|```/g, '').trim();
      return JSON.parse(jsonStr);
    } catch (e) {
      console.error('Failed to parse AI output:', text);
      throw new Error('Invalid AI response format - could not parse JSON');
    }
  }
}
