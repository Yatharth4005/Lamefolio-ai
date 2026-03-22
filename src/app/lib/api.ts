const API_BASE_URL = "http://localhost:5000/api";

export async function generatePortfolio(github_handle: string, user_prompt: string = "") {
  const response = await fetch(`${API_BASE_URL}/portfolio/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ github_handle, user_prompt }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to generate portfolio");
  }

  const result = await response.json();
  return result.data;
}

export async function generateDevDocs(repo_url: string) {
  const response = await fetch(`${API_BASE_URL}/docs/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ repo_url }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to generate docs");
  }

  const result = await response.json();
  return result.data;
}

export async function syncKnowledge(content: string, category?: string) {
  const response = await fetch(`${API_BASE_URL}/knowledge/sync`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content, category }),
  });

  if (!response.ok) {
    throw new Error("Failed to sync knowledge");
  }

  return response.json();
}

export async function getChatResponse(message: string) {
  const response = await fetch(`${API_BASE_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    throw new Error("Failed to get chat response");
  }

  const result = await response.json();
  return result.data;
}

export async function getGitHubAuthUrl() {
  const response = await fetch(`${API_BASE_URL}/auth/github/url`);
  if (!response.ok) throw new Error("Failed to get GitHub Auth URL");
  return response.json();
}

export async function handleGitHubCallback(code: string) {
  const response = await fetch(`${API_BASE_URL}/auth/github/callback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "GitHub authentication failed");
  }

  return response.json();
}

export async function getNotionAuthUrl() {
  const response = await fetch(`${API_BASE_URL}/auth/notion/url`);
  if (!response.ok) throw new Error("Failed to get Notion Auth URL");
  return response.json();
}

export async function handleNotionCallback(code: string) {
  const response = await fetch(`${API_BASE_URL}/auth/notion/callback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Notion authentication failed");
  }

  return response.json();
}

export async function getUserPortfolios(handle: string) {
  const response = await fetch(`${API_BASE_URL}/portfolios/${handle}`);
  if (!response.ok) throw new Error("Failed to fetch portfolios");
  return response.json();
}
