# 🛠️ lamefolio.ai Backend

**AI-Powered Notion Portfolio Builder API**

This is the server-side architecture for `lamefolio.ai`, handling AI curation (Gemini), GitHub data extraction, and Notion page generation.

## 🚀 Key Responsibilities

- **Gemini AI Integration**: Uses the Google Generative AI SDK to analyze repository data and generate professional content.
- **GitHub Sync**: Connects to the GitHub API via Octokit to fetch user projects, languages, and repo metadata.
- **Notion Engine**: Orchestrates the creation of blocks, databases, and pages in a user's Notion workspace.
- **Data Persistence**: Uses PostgreSQL (via Neon DB) to store user settings, portfolio history, and status updates.

## 🛠️ Tech Stack

- **Server**: [Fastify](https://www.fastify.io/)
- **Language**: TypeScript
- **AI**: Google Gemini (via Model Context Protocol)
- **Database**: PostgreSQL (via `postgres` driver)
- **Validation**: [Zod](https://zod.dev/)

## 🏃 Running the Backend

### 1. Install Dependencies
```bash
npm install
```

### 2. Configuration
Create a `.env` file from the example:
```env
DATABASE_URL=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
NOTION_TOKEN=
GEMINI_API_KEY=
```

### 3. Start Development
```bash
npm run dev
```

The server will start on `localhost:3000` (by default).
