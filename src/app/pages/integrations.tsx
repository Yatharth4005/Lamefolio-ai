import { Github, RefreshCw, CheckCircle2, XCircle, Star, GitFork, ExternalLink, Activity, Loader2, Database, LayoutPanelLeft, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useGitHub } from "../context/GitHubContext";
import { getGitHubAuthUrl, handleGitHubCallback, getNotionAuthUrl, handleNotionCallback, linkGitHubToHandle } from "../lib/api";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";

export function IntegrationsPage() {
  const navigate = useNavigate();
  const { 
    user, setUser, token, setToken, setGithubHandle, githubHandle, isConnected,
    notionToken, setNotionToken, notionWorkspace, setNotionWorkspace, isNotionConnected,
    disconnectGitHub, disconnectNotion, displayName, setDisplayName
  } = useGitHub();
  
  const [isConnecting, setIsConnecting] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state"); // Optional: for security or identifying service

    if (code) {
      // Logic to determine which service redirected back
      // Since Notion and GitHub might both use ?code=, we check what we were trying to connect
      // or check the search path. Alternatively, look at the origin.
      // Easiest is to try GitHub first, or check for specific notion-only params if they exist.
      // Notion typically sends 'code' just like GitHub.
      
      // Let's assume the user was connecting ONE of them. 
      // We can use a 'pending_integration' state in localStorage.
      const pending = localStorage.getItem("pending_integration");
      
      if (pending === "github") {
        handleAuthCallback(code, "github");
      } else if (pending === "notion") {
        handleAuthCallback(code, "notion");
      }
    }
  }, [searchParams]);

  // AUTO-REDIRECT: If both are connected, take them to the builder!
  useEffect(() => {
    if (isConnected && isNotionConnected) {
      const timer = setTimeout(() => {
        toast.success("All systems go! Redirecting to Portfolio Builder...", {
          description: "Both GitHub and Notion are connected.",
          duration: 3000,
        });
        navigate("/portfolio-builder");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isConnected, isNotionConnected]);

  const handleAuthCallback = async (code: string, service: "github" | "notion") => {
    try {
      setIsConnecting(service);
      if (service === "github") {
        const data = await handleGitHubCallback(code);
        setToken(data.token);
        setUser(data.profile);
        setGithubHandle(data.profile.username);
        
        // Prefer GitHub's real name if it exists, otherwise use handle
        const nameToSet = data.profile.name || data.profile.username;
        setDisplayName(nameToSet);
        
        // Link the local handle to this GitHub account
        const currentHandle = githubHandle || displayName;
        if (currentHandle) {
          try {
            await linkGitHubToHandle(currentHandle, data.profile.username, nameToSet);
          } catch (e) {
            console.error("Failed to link GitHub to handle:", e);
          }
        }
        
        toast.success("GitHub Connected Successfully!");
      } else {
        const data = await handleNotionCallback(code);
        setNotionToken(data.accessToken);
        setNotionWorkspace({
          id: data.workspaceId,
          name: data.workspaceName,
          avatar: data.workspaceIcon
        });
        toast.success("Notion Workspace Connected!");
      }
      setSearchParams({}); 
      localStorage.removeItem("pending_integration");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsConnecting(null);
    }
  };

  const initiateGitHubAuth = async () => {
    try {
      setIsConnecting("github");
      localStorage.setItem("pending_integration", "github");
      const { clientId, redirectUri, scope } = await getGitHubAuthUrl();
      const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
      window.location.href = authUrl;
    } catch (error: any) {
      toast.error(error.message);
      setIsConnecting(null);
    }
  };

  const initiateNotionAuth = async () => {
    try {
      setIsConnecting("notion");
      localStorage.setItem("pending_integration", "notion");
      const { clientId, redirectUri } = await getNotionAuthUrl();
      const authUrl = `https://api.notion.com/v1/oauth/authorize?client_id=${clientId}&response_type=code&owner=user&redirect_uri=${redirectUri}`;
      window.location.href = authUrl;
    } catch (error: any) {
      toast.error(error.message);
      setIsConnecting(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <header className="mb-14">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-[-0.03em]">Integrations</h1>
        <p className="text-foreground/40 text-lg font-medium">Connect your toolstack to empower your AI assistant.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        {/* GitHub Card */}
        <motion.div 
          whileHover={{ y: -2 }}
          className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] transition-all duration-300 relative overflow-hidden group"
        >
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex-1">
              <div className="flex justify-between items-start mb-10">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
                    <Github className="w-6 h-6 text-primary" />
                </div>
                {isConnected && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                      <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-400">Connected</span>
                  </div>
                )}
              </div>
              
              <h2 className="text-xl font-bold text-foreground mb-2 tracking-tight">GitHub</h2>
              <p className="text-foreground/40 text-sm mb-10 leading-relaxed font-medium">
                Sync repositories, contributions, and project readmes to build your data-driven portfolio.
              </p>

              {isConnected && user ? (
                <div className="flex items-center gap-4 p-4 bg-white/[0.03] rounded-xl border border-white/[0.06] mb-10">
                  <img src={user.avatar} className="w-10 h-10 rounded-lg border border-white/[0.1]" alt="avatar" />
                  <div>
                      <p className="text-foreground font-bold text-sm tracking-tight">{user.username}</p>
                      <p className="text-foreground/20 text-[10px] uppercase font-bold tracking-widest">{user.repos.length} Repositories</p>
                  </div>
                </div>
              ) : null}
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={isConnected ? disconnectGitHub : initiateGitHubAuth}
              disabled={isConnecting === "github"}
              className={`w-full py-3.5 rounded-xl font-bold text-[13px] flex items-center justify-center gap-2 transition-all ${
                isConnected 
                  ? "bg-white/[0.03] text-foreground/40 hover:bg-white/[0.06] hover:text-foreground border border-white/[0.06]" 
                  : "bg-primary text-white shadow-[0_10px_30px_rgba(94,106,210,0.3)] hover:shadow-[0_15px_40px_rgba(94,106,210,0.4)]"
              }`}
            >
              {isConnecting === "github" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Github className="w-4 h-4" />}
              <span className="tracking-tight">{isConnected ? "Disconnect Account" : "Connect GitHub"}</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Notion Card */}
        <motion.div 
          whileHover={{ y: -2 }}
          className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] transition-all duration-300 relative overflow-hidden group"
        >
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex-1">
              <div className="flex justify-between items-start mb-10">
                <div className="w-12 h-12 bg-white/[0.05] rounded-xl flex items-center justify-center border border-white/[0.1]">
                    <Database className="w-6 h-6 text-foreground/60" />
                </div>
                {isNotionConnected ? (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                      <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-400">Integrated</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 px-2.5 py-1 bg-primary/10 border border-primary/20 rounded-full">
                      <Sparkles className="w-3 h-3 text-primary" />
                      <span className="text-[9px] font-bold uppercase tracking-widest text-primary">Required</span>
                  </div>
                )}
              </div>
              
              <h2 className="text-xl font-bold text-foreground mb-2 tracking-tight">Notion</h2>
              <p className="text-foreground/40 text-sm leading-relaxed mb-10 font-medium">
                Directly build your portfolio into your Notion workspace as beautiful, structured pages.
              </p>

              {isNotionConnected && notionWorkspace ? (
                <div className="flex items-center gap-4 p-4 bg-white/[0.03] rounded-xl border border-white/[0.06] mb-10">
                  {notionWorkspace.avatar ? (
                      <img src={notionWorkspace.avatar} className="w-10 h-10 rounded-lg border border-white/[0.1]" alt="notion" />
                  ) : (
                      <div className="w-10 h-10 bg-white/[0.05] border border-white/[0.1] rounded-lg flex items-center justify-center font-bold text-foreground/60">{notionWorkspace.name?.[0]}</div>
                  )}
                  <div>
                      <p className="text-foreground font-bold text-sm tracking-tight">{notionWorkspace.name}</p>
                      <p className="text-foreground/20 text-[10px] uppercase font-bold tracking-widest">Workspace Linked</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 mb-10">
                   {["Auth", "Pick", "Sync"].map((step, i) => (
                    <div key={step} className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-[10px] font-bold text-foreground/30">{i + 1}</div>
                      <span className="text-[11px] text-foreground/30 font-bold uppercase tracking-tight">{step}</span>
                      {i < 2 && <div className="w-4 h-px bg-white/[0.04]" />}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={isNotionConnected ? disconnectNotion : initiateNotionAuth}
              disabled={isConnecting === "notion"}
              className={`w-full py-3.5 rounded-xl font-bold text-[13px] flex items-center justify-center gap-2 transition-all ${
                isNotionConnected 
                  ? "bg-white/[0.03] text-foreground/40 hover:bg-white/[0.06] hover:text-foreground border border-white/[0.06]" 
                  : "bg-foreground text-background shadow-[0_10px_30px_rgba(255,255,255,0.05)]"
              }`}
            >
              {isConnecting === "notion" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
              <span className="tracking-tight">{isNotionConnected ? "Disconnect Account" : "Connect — One Click"}</span>
            </motion.button>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {isConnected && user && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12"
          >
             <h2 className="text-[10px] font-black text-foreground/20 uppercase tracking-[0.2em] mb-8">
                Synchronized Repositories
             </h2>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {user.repos.map((repo, idx) => (
                   <div key={idx} className="p-5 bg-white/[0.015] border border-white/[0.04] rounded-xl flex justify-between items-center group hover:bg-white/[0.03] hover:border-white/[0.08] transition-all">
                      <div className="min-w-0">
                         <h4 className="text-foreground/80 font-bold text-sm truncate tracking-tight group-hover:text-primary transition-colors">{repo.name}</h4>
                         <p className="text-foreground/20 text-[10px] font-bold mt-1 uppercase tracking-tight">{repo.language || "Unknown"}</p>
                      </div>
                      <div className="flex items-center gap-1 text-foreground/20 text-xs font-bold bg-white/[0.03] px-2 py-1 rounded-md">
                        <Star className="w-3 h-3 text-amber-500/40" />
                        {repo.stars}
                      </div>
                   </div>
                ))}
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
