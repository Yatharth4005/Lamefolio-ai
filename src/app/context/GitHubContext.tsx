import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getUserPortfolios, getUserData } from "../lib/api";

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

export interface AppNotification {
  id: string;
  message: string;
  type: "success" | "info" | "error";
  actionUrl?: string;
  timestamp: string;
  read: boolean;
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

  // Plan & Usage
  plan: "Free" | "Pro";
  generationCount: number; // For Free plan, this shows 'points left' if we change logic
  points: number;
  incrementGenerationCount: () => void;

  // Appearance
  theme: "dark" | "light" | "auto";
  setTheme: (theme: "dark" | "light" | "auto") => void;
  accentColor: string;
  setAccentColor: (color: string) => void;

  // Actions
  disconnectGitHub: () => void;
  disconnectNotion: () => void;

  // Notifications
  notifications: AppNotification[];
  addNotification: (n: Omit<AppNotification, "id" | "timestamp" | "read">) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
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

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem("app_notifications");
    return saved ? JSON.parse(saved) : [];
  });

  const [generationCount, setGenerationCount] = useState(0);
  const [points, setPoints] = useState(3);
  const [plan, setPlan] = useState<"Free" | "Pro">("Free");

  const [theme, setTheme] = useState<"dark" | "light" | "auto">(() => {
    return (localStorage.getItem("app_theme") as "dark" | "light" | "auto") || "dark";
  });
  const [accentColor, setAccentColor] = useState(() => {
    return localStorage.getItem("app_accent") || "#A855F7"; // Purple default
  });

  useEffect(() => {
    localStorage.setItem("app_theme", theme);
    document.documentElement.classList.remove("light", "dark");
    if (theme === "auto") {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.classList.add(isDark ? "dark" : "light");
    } else {
      document.documentElement.classList.add(theme);
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("app_accent", accentColor);
    const root = document.documentElement;
    root.style.setProperty("--primary", accentColor);
    root.style.setProperty("--ring", accentColor);
    root.style.setProperty("--sidebar-primary", accentColor);
    root.style.setProperty("--accent-color", accentColor);
  }, [accentColor]);

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

  useEffect(() => {
    localStorage.setItem("app_notifications", JSON.stringify(notifications));
  }, [notifications]);

  // Sync generationCount / Points with Database
  useEffect(() => {
    const fetchUsage = async () => {
      const handle = githubHandle || displayName;
      if (!handle) return;
      
      try {
        const userData = await getUserData(handle);
        if (userData.success && userData.user) {
          setPoints(userData.user.points);
          setPlan(userData.user.plan);
        }

        const portfolioData = await getUserPortfolios(handle);
        if (portfolioData.success && Array.isArray(portfolioData.portfolios)) {
          setGenerationCount(portfolioData.portfolios.length);
        }
      } catch (error) {
        console.error("Failed to fetch usage:", error);
      }
    };
    fetchUsage();
  }, [githubHandle, displayName, notifications]);

  const disconnectGitHub = () => {
    setToken(null);
    setUser(null);
    setGithubHandle("");
    localStorage.removeItem("github_token");
    localStorage.removeItem("github_user");
    localStorage.removeItem("github_handle");
    localStorage.removeItem("generation_count");
    setGenerationCount(0);
  };

  const disconnectNotion = () => {
    setNotionToken(null);
    setNotionWorkspace(null);
    localStorage.removeItem("notion_token");
    localStorage.removeItem("notion_workspace");
  };

  const addNotification = (n: Omit<AppNotification, "id" | "timestamp" | "read">) => {
    const newNotif: AppNotification = {
      ...n,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearNotifications = () => {
    setNotifications([]);
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
        disconnectNotion,

        notifications,
        addNotification,
        markNotificationRead,
        clearNotifications,

        plan,
        points,
        generationCount,
        incrementGenerationCount: () => setGenerationCount(prev => prev + 1),

        theme,
        setTheme,
        accentColor,
        setAccentColor
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
