const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

export async function generatePortfolio(github_handle: string, user_prompt: string = "", sessionId?: number, templateId?: string) {
  const response = await fetch(`${API_BASE_URL}/portfolio/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ github_handle, user_prompt, sessionId, templateId }),
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

export async function getChatResponse(message: string, handle?: string, sessionId?: number, notionPageId?: string) {
  const response = await fetch(`${API_BASE_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message, handle, sessionId, notionPageId }),
  });

  if (!response.ok) {
    throw new Error("Failed to get chat response");
  }

  const result = await response.json();
  return result.data;
}

export async function getChatHistory(handle: string) {
  const response = await fetch(`${API_BASE_URL}/chat/history/${handle}`);
  if (!response.ok) throw new Error("Failed to fetch chat history");
  const result = await response.json();
  return result.history;
}

export async function createChatSession(handle: string, title: string) {
  const response = await fetch(`${API_BASE_URL}/chat/sessions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ handle, title }),
  });
  if (!response.ok) throw new Error("Failed to create session");
  const result = await response.json();
  return result.session;
}

export async function getChatSessions(handle: string) {
  const response = await fetch(`${API_BASE_URL}/chat/sessions/${handle}`);
  if (!response.ok) throw new Error("Failed to fetch sessions");
  const result = await response.json();
  return result.sessions;
}

export async function deleteChatSession(sessionId: number) {
  const response = await fetch(`${API_BASE_URL}/chat/sessions/${sessionId}`, {
    method: "DELETE"
  });
  if (!response.ok) throw new Error("Failed to delete session");
  return response.json();
}

export async function renameChatSession(sessionId: number, title: string) {
  const response = await fetch(`${API_BASE_URL}/chat/sessions/${sessionId}/rename`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
  if (!response.ok) throw new Error("Failed to rename session");
  return response.json();
}

export async function togglePinSession(sessionId: number, isPinned: boolean) {
  const response = await fetch(`${API_BASE_URL}/chat/sessions/${sessionId}/pin`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isPinned }),
  });
  if (!response.ok) throw new Error("Failed to toggle pin");
  return response.json();
}

export async function getSessionMessages(sessionId: number) {
  const response = await fetch(`${API_BASE_URL}/chat/sessions/messages/${sessionId}`);
  if (!response.ok) throw new Error("Failed to fetch session messages");
  const result = await response.json();
  return result.messages;
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

export async function getUserData(handle: string) {
  const response = await fetch(`${API_BASE_URL}/user/${handle}`);
  if (!response.ok) throw new Error("Failed to fetch user data");
  return response.json();
}

export async function deletePortfolio(handle: string, id: number) {
  const response = await fetch(`${API_BASE_URL}/portfolios/${handle}/${id}`, {
    method: "DELETE"
  });
  if (!response.ok) throw new Error("Failed to delete portfolio");
  return response.json();
}

export async function linkGitHubToHandle(handle: string, github_handle: string, display_name?: string) {
  const response = await fetch(`${API_BASE_URL}/user/${handle}/link-github`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ github_handle, display_name }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to link GitHub handle");
  }

  return response.json();
}

export async function updateUserData(handle: string, display_name?: string, bio?: string) {
  const response = await fetch(`${API_BASE_URL}/user/${handle}/update`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ display_name, bio }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update user data");
  }

  return response.json();
}

export async function getNotionBlocks(pageId: string) {
  const response = await fetch(`${API_BASE_URL}/notion/blocks/${pageId}`);
  if (!response.ok) throw new Error("Failed to fetch blocks");
  return response.json();
}

export async function uploadResume(handle: string, file: File, message?: string, sessionId?: number) {
  const formData = new FormData();
  formData.append("handle", handle);
  if (message) formData.append("message", message);
  if (sessionId) formData.append("sessionId", sessionId.toString());
  formData.append("resume", file);

  const response = await fetch(`${API_BASE_URL}/portfolio/upload-resume`, {
    method: "POST",
    body: formData,
  });

  return response.json();
}

export async function createBillingOrder(handle: string, planId: string) {
  const response = await fetch(`${API_BASE_URL}/billing/create-order`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ handle, planId }),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || "Failed to create payment order");
  }
  const result = await response.json();
  return result.order;
}

export async function verifyBillingPayment(handle: string, planId: string, orderId: string, paymentId: string, signature: string) {
  const response = await fetch(`${API_BASE_URL}/billing/verify-payment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ handle, planId, orderId, paymentId, signature }),
  });
  if (!response.ok) throw new Error("Payment verification failed");
  return response.json();
}
export async function getBillingHistory(handle: string) {
  const response = await fetch(`${API_BASE_URL}/billing/history/${handle}`);
  if (!response.ok) throw new Error("Failed to fetch billing history");
  const result = await response.json();
  return result.history;
}
