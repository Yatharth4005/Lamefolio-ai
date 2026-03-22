import React, { createContext, useContext, useState, ReactNode } from "react";

interface GitHubContextType {
  githubHandle: string;
  setGithubHandle: (handle: string) => void;
  isGenerating: boolean;
  setIsGenerating: (generating: boolean) => void;
}

const GitHubContext = createContext<GitHubContextType | undefined>(undefined);

export function GitHubProvider({ children }: { children: ReactNode }) {
  const [githubHandle, setGithubHandle] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  return (
    <GitHubContext.Provider
      value={{
        githubHandle,
        setGithubHandle,
        isGenerating,
        setIsGenerating,
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
