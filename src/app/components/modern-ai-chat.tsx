import { Sparkles, Send, Zap, Loader2, User, Bot, ExternalLink, Globe, ChevronDown, CheckCircle2, Layout, Plus, History, MessageSquare, Search, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useRef, useEffect } from "react";
import { useGitHub } from "../context/GitHubContext";
import { generatePortfolio, getChatResponse, getChatHistory, createChatSession, getChatSessions, getSessionMessages } from "../lib/api";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./ui/resizable";
import { PortfolioPreview } from "./portfolio-preview";

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  actionUrl?: string;
  timestamp: Date;
}

interface ModernAIChatProps {
  immersive?: boolean;
}

export function ModernAIChat({ immersive = false }: ModernAIChatProps) {
  const [input, setInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<number | null>(null);
  
  const [historyItems, setHistoryItems] = useState<any[]>([]);
  
  const { githubHandle, isGenerating, setIsGenerating, addNotification, displayName, incrementGenerationCount, plan, points, user, isNotionConnected } = useGitHub();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGenerating]);

  // Load Sessions
  const loadHistory = async () => {
    const handle = githubHandle || displayName;
    console.log("🔍 Loading history for handle:", handle);
    if (!handle) {
      console.warn("⚠️ No handle available for loading history");
      return;
    }
    try {
      const sessions = await getChatSessions(handle);
      console.log("✅ Sessions received:", sessions);
      if (Array.isArray(sessions)) {
        setHistoryItems(sessions.map((s: any) => ({
            id: s.id,
            title: s.title,
            date: new Date(s.created_at).toLocaleDateString()
        })));
      } else {
        console.error("❌ Sessions is not an array:", sessions);
        setHistoryItems([]);
      }
    } catch (error) {
      console.error("❌ Failed to load sessions:", error);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [githubHandle, displayName]);

  const loadSession = async (session: any) => {
    try {
        const sessionMessages = await getSessionMessages(session.id);
        setCurrentSessionId(session.id);
        setMessages(sessionMessages.map((m: any) => ({
            id: m.id.toString(),
            role: m.role,
            content: m.content,
            actionUrl: m.action_url,
            timestamp: new Date(m.created_at)
        })));
        setShowHistory(false);
        toast.info(`Loaded: ${session.title}`);
    } catch (error) {
        toast.error("Failed to load session content");
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setCurrentSessionId(null);
    setPreviewUrl(null);
    setPreviewId(null);
    setShowPreview(false);
    toast.success("New chat started");
  };

  const handleSend = async () => {
    const handle = githubHandle || displayName || "manual_entry";
    if (!input.trim() || isGenerating) return;

    let sessionId = currentSessionId;

    // Create session if it's a new chat
    if (!sessionId) {
        try {
            const title = input.length > 25 ? input.substring(0, 25) + "..." : input;
            const newSession = await createChatSession(handle, title);
            sessionId = newSession.id;
            setCurrentSessionId(sessionId);
            loadHistory(); // Refresh sidebar list
        } catch (error) {
            console.error("Failed to create session", error);
        }
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setIsGenerating(true);

    try {
      const isBuildIntent = /portfolio|build|create|generate/i.test(currentInput);
      
      if (isBuildIntent) {
          setShowPreview(true);
          const result = await generatePortfolio(handle, currentInput, sessionId!);
          incrementGenerationCount();
          setPreviewUrl(result.url);
          setPreviewId(result.id);
          
          setMessages((prev) => [
            ...prev,
            {
              id: (Date.now() + 1).toString(),
              role: "ai",
              content: githubHandle === 'manual_entry' 
                ? "I've structured your custom details into a Notion portfolio! You can see it manifest live in the preview window." 
                : "Excellent! I've analyzed your GitHub data and am building your portfolio in Notion right now. Watch the live preview on the right.",
              actionUrl: result.url,
              timestamp: new Date(),
            },
          ]);
      } else {
          const response = await getChatResponse(currentInput, handle, sessionId || undefined);
          setMessages((prev) => [
            ...prev,
            {
              id: (Date.now() + 1).toString(),
              role: "ai",
              content: response,
              timestamp: new Date(),
            },
          ]);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className={`relative flex bg-background text-foreground w-full h-full overflow-hidden ${!immersive ? "border border-border rounded-3xl" : ""}`}>
      
      {/* Sidebar - Theme Adaptive */}
      <div className="w-16 flex flex-col items-center py-6 gap-6 border-r border-border bg-background z-50">
          <button 
            onClick={handleNewChat}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-secondary hover:bg-primary hover:text-primary-foreground transition-all group"
            title="New Chat"
          >
            <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>
          <button 
            onClick={() => {
              if (!showHistory) loadHistory();
              setShowHistory(!showHistory);
            }}
            className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all group ${showHistory ? "bg-primary text-primary-foreground" : "bg-transparent text-foreground/40 hover:text-foreground hover:bg-secondary"}`}
            title="History"
          >
            <History className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>
      </div>

      <ResizablePanelGroup direction="horizontal" className="flex-1 overflow-hidden h-full">
         
         {/* History Panel - Theme Adaptive */}
         {showHistory && (
             <ResizablePanel defaultSize={20} minSize={15} className="bg-background-secondary border-r border-border p-4 flex flex-col gap-4 relative z-40">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-30">Your Chats</span>
                    <button onClick={() => setShowHistory(false)}><X className="w-3 h-3 opacity-20 hover:opacity-100" /></button>
                </div>
                <div className="space-y-1 overflow-y-auto custom-scrollbar pr-1">
                    {historyItems.length > 0 ? (
                        historyItems.map((item) => (
                            <button 
                                key={item.id}
                                onClick={() => loadSession(item)}
                                className={`w-full text-left p-3 rounded-xl text-xs font-semibold flex items-center gap-3 transition-all ${
                                    currentSessionId === item.id 
                                    ? "bg-secondary text-foreground border border-border shadow-md" 
                                    : "text-foreground/40 hover:bg-secondary/50 hover:text-foreground border border-transparent"
                                }`}
                            >
                                <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${currentSessionId === item.id ? "text-primary" : "opacity-40"}`} />
                                <div className="flex flex-col min-w-0">
                                    <span className="truncate">{item.title}</span>
                                    <span className="text-[9px] opacity-30 mt-0.5">{item.date}</span>
                                </div>
                            </button>
                        ))
                    ) : (
                        <p className="text-[11px] text-center opacity-20 py-10 font-medium">No recent chats</p>
                    )}
                </div>
             </ResizablePanel>
         )}

         <ResizablePanel defaultSize={showPreview ? 50 : 100} minSize={30} className="flex flex-col relative bg-background">
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-border bg-background/80 backdrop-blur-2xl z-20">
                <div className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                   <h1 className="text-xs font-black uppercase tracking-[0.2em] opacity-40">AI Workspace v2</h1>
                </div>

                <div className="flex items-center gap-4">
                    {(previewUrl || previewId) && !showPreview && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            onClick={() => setShowPreview(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-[10px] font-black tracking-widest uppercase hover:opacity-80 transition-all shadow-lg"
                        >
                            <Layout className="w-3.5 h-3.5" />
                            <span>Open Preview</span>
                        </motion.button>
                    )}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto px-6 py-10 space-y-8 custom-scrollbar scroll-smooth">
                {messages.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto"
                    >
                        <Bot className="w-10 h-10 opacity-10 mb-6" />
                        <h2 className="text-2xl font-bold mb-3">Hi, I'm your AI Builder.</h2>
                        <p className="text-[14px] leading-relaxed font-medium opacity-40">
                            I can analyze your GitHub repositories and build a professional Notion portfolio in seconds. Describe what you need.
                        </p>
                    </motion.div>
                ) : (
                    messages.map((m) => (
                        <motion.div 
                            key={m.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                            <div className={`max-w-[80%] flex gap-4 ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${m.role === "user" ? "bg-secondary" : "bg-primary text-primary-foreground"}`}>
                                    {m.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                </div>
                                <div className={`p-4 rounded-2xl text-[14px] leading-relaxed font-medium ${m.role === "user" ? "bg-primary text-primary-foreground shadow-xl" : "bg-secondary border border-border"}`}>
                                    <ReactMarkdown 
                                        components={{
                                            p: ({ children }) => <span className="block mb-2 last:mb-0">{children}</span>,
                                            li: ({ children }) => <li className="ml-4 list-disc opacity-80">{children}</li>
                                        }}
                                    >
                                        {m.content}
                                    </ReactMarkdown>

                                    {m.actionUrl && (
                                        <button 
                                            onClick={() => window.open(m.actionUrl, "_blank")}
                                            className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-background/20 hover:bg-background/40 border border-foreground/5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all"
                                        >
                                            <ExternalLink className="w-3.5 h-3.5" />
                                            Visit Notion Site
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
                {isGenerating && (
                    <div className="flex justify-start">
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
                                <Bot className="w-4 h-4" />
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-secondary border border-border rounded-2xl">
                                <Loader2 className="w-3 h-3 animate-spin opacity-40" />
                                <span className="text-xs opacity-40 font-bold uppercase tracking-widest">Thinking...</span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Slim Pill Input - Theme Adaptive */}
            <div className="pb-10 flex justify-center px-6">
                <div className={`relative flex items-center max-w-2xl w-full bg-secondary border transition-all duration-300 rounded-[1.8rem] shadow-xl ${isFocused ? "border-primary/50 ring-1 ring-primary/10" : "border-border"}`}>
                    <textarea 
                        rows={1}
                        placeholder="Ask me to 'build my portfolio'..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSend())}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        className="w-full bg-transparent px-8 py-5 text-[14px] text-foreground placeholder:text-foreground/20 focus:outline-none resize-none custom-scrollbar font-medium"
                    />
                    <div className="pr-5">
                         <button 
                            onClick={handleSend}
                            disabled={!input.trim() || isGenerating}
                            className="w-9 h-9 flex items-center justify-center rounded-2xl bg-primary text-primary-foreground disabled:opacity-20 hover:scale-105 transition-all active:scale-95 shadow-lg"
                         >
                            <Send className="w-4 h-4 translate-x-0.5" />
                         </button>
                    </div>
                </div>
            </div>
         </ResizablePanel>

         {showPreview && (
          <>
            <ResizableHandle withHandle className="bg-transparent" />
            <ResizablePanel defaultSize={50} minSize={30}>
              <PortfolioPreview 
                isGenerating={isGenerating} 
                url={previewUrl} 
                id={previewId}
                onClose={() => setShowPreview(false)} 
              />
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </div>
  );
}
