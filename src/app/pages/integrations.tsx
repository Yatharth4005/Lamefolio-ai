import { Github, RefreshCw, CheckCircle2, XCircle, Star, GitFork, ExternalLink, Activity, Loader2, Database, LayoutPanelLeft, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useGitHub } from "../context/GitHubContext";
import { getGitHubAuthUrl, handleGitHubCallback, getNotionAuthUrl, handleNotionCallback } from "../lib/api";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { toast } from "sonner";

export function IntegrationsPage() {
  const { 
    user, setUser, token, setToken, setGithubHandle, isConnected,
    notionToken, setNotionToken, notionWorkspace, setNotionWorkspace, isNotionConnected,
    disconnectGitHub, disconnectNotion
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

  const handleAuthCallback = async (code: string, service: "github" | "notion") => {
    try {
      setIsConnecting(service);
      if (service === "github") {
        const data = await handleGitHubCallback(code);
        setToken(data.token);
        setUser(data.profile);
        setGithubHandle(data.profile.username);
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
    <div className="max-w-6xl mx-auto px-6 py-12">
      <header className="mb-12">
        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Integrations</h1>
        <p className="text-white/40">Connect your toolstack to empower your AI assistant.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {/* GitHub Card */}
        <motion.div 
          whileHover={{ y: -5 }}
          className={`p-8 rounded-3xl border transition-all duration-500 relative overflow-hidden group ${
            isConnected 
              ? "bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/20" 
              : "bg-white/[0.02] border-white/10 hover:border-white/20"
          }`}
        >
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex-1">
              <div className="flex justify-between items-start mb-8">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center">
                    <Github className="w-8 h-8 text-white" />
                </div>
                {isConnected && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                      <span className="text-[10px] font-black uppercase text-green-400">Linked</span>
                  </div>
                )}
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-2">GitHub</h2>
              <p className="text-white/40 text-sm mb-8 leading-relaxed">
                Sync your repositories, contributions, and project readmes to build a data-driven portfolio.
              </p>

              {isConnected && user ? (
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 mb-6">
                  <img src={user.avatar} className="w-12 h-12 rounded-xl" alt="avatar" />
                  <div>
                      <p className="text-white font-bold text-sm">@{user.username}</p>
                      <p className="text-white/30 text-[10px] uppercase font-black tracking-widest">{user.repos.length} Repositories</p>
                  </div>
                </div>
              ) : null}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={isConnected ? disconnectGitHub : initiateGitHubAuth}
              disabled={isConnecting === "github"}
              className={`w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                isConnected 
                  ? "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white border border-white/5" 
                  : "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.1)]"
              }`}
            >
              {isConnecting === "github" ? <Loader2 className="w-5 h-5 animate-spin" /> : <Github className="w-5 h-5" />}
              {isConnected ? "Disconnect GitHub" : "Connect GitHub"}
            </motion.button>
          </div>
        </motion.div>

        {/* Notion Card */}
        <motion.div 
          whileHover={{ y: -5 }}
          className={`p-8 rounded-3xl border transition-all duration-500 relative overflow-hidden group ${
            isNotionConnected 
              ? "bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/20" 
              : "bg-white/[0.02] border-white/10 hover:border-white/20"
          }`}
        >
          {/* Shimmer effect for unconnected state */}
          {!isNotionConnected && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.015] to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
          )}

          <div className="relative z-10 flex flex-col h-full">
            <div className="flex-1">
              <div className="flex justify-between items-start mb-8">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center">
                    <Database className="w-8 h-8 text-white" />
                </div>
                {isNotionConnected ? (
                  <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                      <span className="text-[10px] font-black uppercase text-blue-400">Linked</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-[10px] font-black uppercase text-amber-400">Required</span>
                  </div>
                )}
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-2">Notion</h2>
              <p className="text-white/40 text-sm leading-relaxed mb-6">
                Directly manifest your portfolio into your Notion workspace as beautiful, structured pages.
              </p>

              {!isNotionConnected && (
                <div className="flex items-center gap-2 mb-8">
                  {["Authorize", "Pick Workspace", "Done!"].map((step, i) => (
                    <div key={step} className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[9px] font-black text-white/40">{i + 1}</div>
                      <span className="text-[11px] text-white/40 font-medium">{step}</span>
                      {i < 2 && <div className="w-4 h-px bg-white/10" />}
                    </div>
                  ))}
                </div>
              )}

              {isNotionConnected && notionWorkspace ? (
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 mb-6">
                  {notionWorkspace.avatar ? (
                      <img src={notionWorkspace.avatar} className="w-12 h-12 rounded-xl" alt="notion" />
                  ) : (
                      <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center font-bold text-white">{notionWorkspace.name?.[0]}</div>
                  )}
                  <div>
                      <p className="text-white font-bold text-sm">{notionWorkspace.name}</p>
                      <p className="text-white/30 text-[10px] uppercase font-black tracking-widest">Workspace Integrated</p>
                  </div>
                </div>
              ) : null}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={isNotionConnected ? disconnectNotion : initiateNotionAuth}
              disabled={isConnecting === "notion"}
              className={`w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                isNotionConnected 
                  ? "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white border border-white/5" 
                  : "bg-white text-black shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:shadow-[0_0_40px_rgba(255,255,255,0.25)]"
              }`}
            >
              {isConnecting === "notion" ? <Loader2 className="w-5 h-5 animate-spin" /> : <Database className="w-5 h-5" />}
              {isNotionConnected ? "Disconnect Notion" : "Connect Notion — One Click"}
            </motion.button>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {isConnected && user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12"
          >
             <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3 uppercase tracking-widest text-[12px] opacity-40">
                Synchronized Repositories
             </h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.repos.map((repo, idx) => (
                   <div key={idx} className="p-6 bg-white/[0.03] border border-white/5 rounded-2xl flex justify-between items-center group hover:bg-white/[0.05] transition-all">
                      <div>
                         <h4 className="text-white font-bold text-sm group-hover:text-purple-400 transition-colors">{repo.name}</h4>
                         <p className="text-white/20 text-xs mt-1">{repo.language || "Unknown"}</p>
                      </div>
                      <div className="flex gap-4">
                         <div className="flex items-center gap-1.5 text-white/20 text-xs font-bold">
                            <Star className="w-3.5 h-3.5 text-yellow-500/40" />
                            {repo.stars}
                         </div>
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
