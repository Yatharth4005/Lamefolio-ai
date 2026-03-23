# ✨ lamefolio.ai

**The Most Advanced AI-Powered Portfolio Engine**

lamefolio.ai transforms your career journey into a professional, high-converting portfolio directly in your Notion workspace. By connecting your GitHub and describing your professional goals, our Gemini-powered engine curates your best work and builds a complete portfolio automatically.


## 🚀 Key Features

*   **🪄 AI Portfolio Builder**: Leverage Google Gemini to turn repository metadata and career goals into professional portfolio content.
*   **🐙 GitHub Sync**: Effortlessly import your repositories, contributions, and project descriptions.
*   **📝 Notion Integration**: Export your curated portfolio directly as a structured, aesthetic Notion workspace.
*   **🎯 Command Palette**: Navigate the entire platform instantly using `Ctrl + K` or `Cmd + K`.
*   **⚡ Modern Experience**: Built with standard-setting UI/UX practices: glassmorphism, micro-animations, and a sleek dark mode.
*   **📊 Dynamic Dashboard**: Track your generation credits, manage your integrations, and view analytics at a glance.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Motion (framer-motion)](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: React Context via `GitHubProvider`
- **Routing**: React Router v7

### Backend
- **Core**: [Fastify](https://www.fastify.io/) + TypeScript
- **AI**: [Google Gemini Pro](https://deepmind.google/technologies/gemini/) (via MCP)
- **Database**: PostgreSQL (via Neon DB)
- **Integrations**: Notion Client SDK & GitHub Octokit
- **Architecture**: Model Context Protocol (MCP) for extensibility

---

## 🏃 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v20 or newer)
- [PostgreSQL](https://www.postgresql.org/) (or a Neon DB project)
- [Notion API Token](https://developers.notion.com/)
- [GitHub OAuth Credentials](https://docs.github.com/en/apps/oauth-apps)

### 1. Installation

Clone and install dependencies for both the frontend and backend:

```bash
# Main project (Frontend)
cd Lamefolioai
npm install

# Backend
cd backend
npm install
```

### 2. Environment Setup

Create a `.env` file in the `backend/` directory with the following:

```env
DATABASE_URL=your_postgres_url
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
NOTION_TOKEN=your_notion_api_token
GEMINI_API_KEY=your_gemini_api_key
```

### 3. Running Locally

Start both servers to begin development:

```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend
cd backend
npm run dev
```

The application will be accessible at `http://localhost:5173`.

---

## 🗺️ Project Structure

```text
Lamefolioai/
├── src/
│   ├── app/
│   │   ├── components/  # Modern UI components
│   │   ├── context/     # GitHub & Global state
│   │   ├── pages/       # Dashboard, Settings, etc.
│   │   └── routes.tsx   # React Router config
│   └── styles/          # Tailwind V4 CSS entries
├── backend/
│   ├── src/
│   │   ├── index.ts     # Fastify entry point
│   │   └── ...          # API routes & integrations
│   └── package.json
└── package.json
```

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Built with ❤️ by the **lamefolio.ai** team.
