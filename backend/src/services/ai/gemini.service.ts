import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { env } from '../../config/env.js';
import { ASSISTANT_SYSTEM_INSTRUCTION, PORTFOLIO_SCHEMA_PROMPT } from '../../config/prompts.js';

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

export class GeminiService {
  private model;

  constructor() {
    this.model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: ASSISTANT_SYSTEM_INSTRUCTION
    }, { apiVersion: 'v1beta' });
  }

  async generatePortfolioSchema(rawData: any, userPrompt: string) {
    const prompt = `Use this raw data: ${JSON.stringify(rawData)} and user prompt: "${userPrompt}" to generate a portfolio schema. Return ONLY JSON.`;

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

  async chat(message: string, history: any[]) {
    const chatSession = this.model.startChat({
      history,
    });

    const result = await chatSession.sendMessage(message);
    const response = await result.response;
    return response.text();
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
