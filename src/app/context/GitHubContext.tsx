import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface GitHubRepo {
  name: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  url: string;
  updated_at: string;
}

interface GitHubUser {
  username: string;
  avatar: string;
  bio: string;
  repos: GitHubRepo[];
}

interface NotionWorkspace {
  id: string;
  name: string;
  avatar: string;
}

interface GitHubContextType {
  // GitHub
  githubHandle: string;
  setGithubHandle: (handle: string) => void;
  isGenerating: boolean;
  setIsGenerating: (generating: boolean) => void;
  user: GitHubUser | null;
  setUser: (user: GitHubUser | null) => void;
  token: string | null;
  setToken: (token: string | null) => void;
  isConnected: boolean;
  displayName: string;
  setDisplayName: (name: string) => void;

  // Notion
  notionToken: string | null;
  setNotionToken: (token: string | null) => void;
  notionWorkspace: NotionWorkspace | null;
  setNotionWorkspace: (nw: NotionWorkspace | null) => void;
  isNotionConnected: boolean;

  // Actions
  disconnectGitHub: () => void;
  disconnectNotion: () => void;
}

const GitHubContext = createContext<GitHubContextType | undefined>(undefined);

export function GitHubProvider({ children }: { children: ReactNode }) {
  // GitHub States
  const [githubHandle, setGithubHandle] = useState(() => localStorage.getItem("github_handle") || "");
  const [isGenerating, setIsGenerating] = useState(false);
  const [user, setUser] = useState<GitHubUser | null>(() => {
    const saved = localStorage.getItem("github_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("github_token"));
  const [displayName, setDisplayName] = useState(() => localStorage.getItem("display_name") || "");

  // Notion States
  const [notionToken, setNotionToken] = useState(() => localStorage.getItem("notion_token"));
  const [notionWorkspace, setNotionWorkspace] = useState<NotionWorkspace | null>(() => {
    const saved = localStorage.getItem("notion_workspace");
    return saved ? JSON.parse(saved) : null;
  });

  // Persistent Effects GitHub
  useEffect(() => {
    localStorage.setItem("github_handle", githubHandle);
  }, [githubHandle]);

  useEffect(() => {
    if (user) localStorage.setItem("github_user", JSON.stringify(user));
    else localStorage.removeItem("github_user");
  }, [user]);

  useEffect(() => {
    if (token) localStorage.setItem("github_token", token);
    else localStorage.removeItem("github_token");
  }, [token]);

  useEffect(() => {
    localStorage.setItem("display_name", displayName);
  }, [displayName]);

  // Persistent Effects Notion
  useEffect(() => {
    if (notionToken) localStorage.setItem("notion_token", notionToken);
    else localStorage.removeItem("notion_token");
  }, [notionToken]);

  useEffect(() => {
    if (notionWorkspace) localStorage.setItem("notion_workspace", JSON.stringify(notionWorkspace));
    else localStorage.removeItem("notion_workspace");
  }, [notionWorkspace]);

  const disconnectGitHub = () => {
    setToken(null);
    setUser(null);
    setGithubHandle("");
    setDisplayName("");
    localStorage.removeItem("github_token");
    localStorage.removeItem("github_user");
    localStorage.removeItem("github_handle");
    localStorage.removeItem("display_name");
  };

  const disconnectNotion = () => {
    setNotionToken(null);
    setNotionWorkspace(null);
    localStorage.removeItem("notion_token");
    localStorage.removeItem("notion_workspace");
  };

  return (
    <GitHubContext.Provider
      value={{
        githubHandle,
        setGithubHandle,
        isGenerating,
        setIsGenerating,
        user,
        setUser,
        token,
        setToken,
        isConnected: !!token,
        displayName,
        setDisplayName,

        notionToken,
        setNotionToken,
        notionWorkspace,
        setNotionWorkspace,
        isNotionConnected: !!notionToken,

        disconnectGitHub,
        disconnectNotion
      }}
    >
      {children}
    </GitHubContext.Provider>
  );
}

export function useGitHub() {
  const context = useContext(GitHubContext);
  if (context === undefined) {
    throw new Error("useGitHub must be used within a GitHubProvider");
  }
  return context;
}
