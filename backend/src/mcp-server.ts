import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { OrchestratorService } from "./services/orchestrator.service.js";

const orchestrator = new OrchestratorService();

const server = new Server(
  {
    name: "notion-portfolio-builder",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "generate_portfolio",
        description: "Generates a beautiful Notion portfolio from a GitHub handle",
        inputSchema: {
          type: "object",
          properties: {
            github_handle: { type: "string" },
            user_prompt: { type: "string" },
          },
          required: ["github_handle"],
        },
      },
      {
        name: "generate_docs",
        description: "Generates technical documentation in Notion for a GitHub repo",
        inputSchema: {
          type: "object",
          properties: {
            repo_url: { type: "string" },
          },
          required: ["repo_url"],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === "generate_portfolio") {
      const { github_handle, user_prompt } = args as any;
      const result = await orchestrator.generatePortfolio(github_handle, user_prompt);
      return {
        content: [{ type: "text", text: `Success! Portfolio created: ${result.url}` }],
      };
    }

    if (name === "generate_docs") {
      const { repo_url } = args as any;
      const result = await orchestrator.generateDocumentation(repo_url);
      return {
        content: [{ type: "text", text: `Success! Documentation created: ${result.url}` }],
      };
    }

    throw new Error(`Tool not found: ${name}`);
  } catch (error: any) {
    return {
      content: [{ type: "text", text: `Error: ${error.message}` }],
      isError: true,
    };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
console.error("Notion MCP Server running on stdio");
