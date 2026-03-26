import { Sparkles, Send, Zap, Loader2, User, Bot, ExternalLink, Globe, ChevronDown, CheckCircle2, Layout, Plus, History, MessageSquare, Search, X, MoreHorizontal, Pin, Edit2, Trash2, Code, FileText, Paperclip } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useRef, useEffect } from "react";
import { useGitHub } from "../context/GitHubContext";
import { generatePortfolio, getChatResponse, getChatHistory, createChatSession, getChatSessions, getSessionMessages, deleteChatSession, renameChatSession, togglePinSession, uploadResume } from "../lib/api";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { useNavigate, useLocation } from "react-router";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./ui/resizable";
import { PortfolioPreview } from "./portfolio-preview";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "./ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "./ui/tooltip";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  actionUrl?: string;
  buttonText?: string;
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
  const [renamingSessionId, setRenamingSessionId] = useState<number | null>(null);
  const [newName, setNewName] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  
  const { githubHandle, isGenerating, setIsGenerating, addNotification, displayName, incrementGenerationCount, plan, points, user, isNotionConnected } = useGitHub();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const templateId = new URLSearchParams(location.search).get("template");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGenerating]);

  // Load Sessions
  const loadHistory = async () => {
    const handle = githubHandle || displayName;
    if (!handle) return;
    try {
      const sessions = await getChatSessions(handle);
      if (Array.isArray(sessions)) {
        setHistoryItems(sessions.map((s: any) => ({
            id: s.id,
            title: s.title,
            is_pinned: s.is_pinned,
            date: new Date(s.created_at).toLocaleDateString()
        })));
      }
    } catch (error) {
      console.error("❌ Failed to load sessions:", error);
    }
  };

  const handleTogglePin = async (e: React.MouseEvent, sessionId: number, currentPinned: boolean) => {
      e.stopPropagation();
      try {
          await togglePinSession(sessionId, !currentPinned);
          loadHistory();
          toast.success(currentPinned ? "Unpinned chat" : "Pinned chat");
      } catch (error) {
          toast.error("Failed to update pin status");
      }
  };

  const handleRename = async (sessionId: number) => {
      if (!newName.trim()) return;
      try {
          await renameChatSession(sessionId, newName);
          setRenamingSessionId(null);
          loadHistory();
          toast.success("Chat renamed");
      } catch (error) {
          toast.error("Failed to rename chat");
      }
  };

  const handleDeleteSession = async (sessionId: number) => {
      try {
          await deleteChatSession(sessionId);
          if (currentSessionId === sessionId) {
              setMessages([]);
              setCurrentSessionId(null);
          }
          loadHistory();
          toast.success("Chat deleted");
          setDeleteConfirmId(null);
      } catch (error) {
          toast.error("Failed to delete chat");
      }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setPendingFile(file);
      if (fileInputRef.current) fileInputRef.current.value = "";
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
    toast.success("New conversation started");
  };

  const handleSend = async () => {
    if ((!input.trim() && !pendingFile) || isGenerating) return;

    const handle = githubHandle || displayName || "manual_entry";
    const userMessageContent = input.trim();
    const fileToSend = pendingFile;
    let sessionId = currentSessionId;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: fileToSend ? `[Uploaded File: ${fileToSend.name}] ${userMessageContent}` : userMessageContent,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setPendingFile(null);
    setIsGenerating(true);

    try {
      if (!sessionId) {
          const sessionTitle = fileToSend 
            ? `Resume: ${fileToSend.name}` 
            : (userMessageContent.length > 25 ? userMessageContent.substring(0, 25) + "..." : userMessageContent);
          
          const newSession = await createChatSession(handle, sessionTitle);
          sessionId = newSession.id;
          setCurrentSessionId(sessionId);
          loadHistory();
      }

      let responseText = "";
      if (fileToSend) {
        const res = await uploadResume(handle, fileToSend, userMessageContent, sessionId!);
        responseText = res.message;
      } else if (/portfolio|build|create|generate/i.test(userMessageContent) && !/search|query|find|look for|fetch/i.test(userMessageContent)) {
        setShowPreview(true);
        const result = await generatePortfolio(handle, userMessageContent, sessionId!, templateId || undefined);
        setPreviewUrl(result.url);
        setPreviewId(result.id);
        responseText = "Excellent! I've analyzed your data and am building your portfolio in Notion right now.";
      } else {
        responseText = await getChatResponse(userMessageContent, handle, sessionId || undefined, previewId || undefined);
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: responseText,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error: any) {
      if (error.message?.toLowerCase().includes("limit") || error.message?.toLowerCase().includes("0/3")) {
          const aiMsg: Message = {
              id: (Date.now() + 1).toString(),
              role: "ai",
              content: "You've reached your free portfolio generation limit (0/3). Ready to unlock unlimited AI builds and premium templates?",
              actionUrl: "/settings/billing",
              buttonText: "UPGRADE TO PRO",
              timestamp: new Date(),
          };
          setMessages((prev) => [...prev, aiMsg]);
          setShowPreview(false);
      } else {
          toast.error(error.message || "Something went wrong.");
      }
    } finally {
      setIsGenerating(false);
      scrollToBottom();
    }
  };

  const renderHistoryItem = (item: any) => {
    if (renamingSessionId === item.id) {
      return (
        <div className="flex items-center gap-2 p-3 bg-secondary rounded-xl border border-primary/30">
          <input 
              autoFocus
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                  if (e.key === "Enter") handleRename(item.id);
                  if (e.key === "Escape") setRenamingSessionId(null);
              }}
              className="bg-transparent text-xs font-semibold w-full outline-none"
          />
          <button onClick={() => handleRename(item.id)} className="text-primary"><CheckCircle2 className="w-4 h-4" /></button>
          <button onClick={() => setRenamingSessionId(null)} className="opacity-40"><X className="w-4 h-4" /></button>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-1 group/item relative">
          <button 
              onClick={() => loadSession(item)}
              className={`flex-1 text-left p-3 pr-8 rounded-xl text-xs font-semibold flex items-center gap-3 transition-all relative ${
                  currentSessionId === item.id 
                  ? "bg-secondary text-foreground border border-border shadow-md" 
                  : "text-foreground/60 hover:bg-secondary/50 hover:text-foreground border border-transparent"
              }`}
          >
              <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${currentSessionId === item.id ? "text-primary" : "opacity-40"}`} />
              <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center gap-2 overflow-hidden">
                      <span className="truncate">{item.title}</span>
                      {item.is_pinned && <Pin className="w-2.5 h-2.5 text-primary shrink-0" />}
                  </div>
                  <span className="text-[9px] opacity-50 mt-0.5">{item.date}</span>
              </div>
          </button>

          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                      <button className="p-1 rounded-lg hover:bg-secondary opacity-0 group-hover/item:opacity-100 transition-opacity">
                          <MoreHorizontal className="w-3.5 h-3.5 text-foreground/40" />
                      </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40 bg-background-secondary border border-border rounded-xl p-1 shadow-2xl">
                      <DropdownMenuItem onClick={(e) => handleTogglePin(e, item.id, item.is_pinned)} className="flex items-center gap-2 p-2 text-xs font-medium rounded-lg cursor-pointer hover:bg-secondary transition-all">
                          <Pin className="w-3.5 h-3.5" /> {item.is_pinned ? "Unpin chat" : "Pin chat"}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => { setRenamingSessionId(item.id); setNewName(item.title); }} className="flex items-center gap-2 p-2 text-xs font-medium rounded-lg cursor-pointer hover:bg-secondary transition-all">
                          <Edit2 className="w-3.5 h-3.5" /> Rename
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-border/50 my-1" />
                      <DropdownMenuItem onClick={() => setDeleteConfirmId(item.id)} className="flex items-center gap-2 p-2 text-xs font-medium rounded-lg cursor-pointer text-red-500 hover:bg-red-500/10 transition-all font-bold">
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                      </DropdownMenuItem>
                  </DropdownMenuContent>
              </DropdownMenu>
          </div>
      </div>
    );
  };

  return (
    <div className={`relative flex bg-background text-foreground w-full h-full overflow-hidden ${!immersive ? "border border-border rounded-3xl" : ""}`}>
      
      {/* Sidebar - Hidden on Mobile */}
      <div className="hidden sm:flex w-16 flex-col items-center py-6 gap-6 border-r border-border bg-background z-50">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button onClick={handleNewChat} className="w-10 h-10 flex items-center justify-center rounded-xl bg-secondary hover:bg-primary hover:text-primary-foreground transition-all group active:scale-95">
                  <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-foreground text-background font-bold text-[10px] px-3 py-1.5 rounded-lg ml-2">New Chat</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  onClick={() => { if (!showHistory) loadHistory(); setShowHistory(!showHistory); }}
                  className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all group active:scale-95 ${showHistory ? "bg-primary text-primary-foreground" : "bg-transparent text-foreground/40 hover:text-foreground hover:bg-secondary"}`}
                >
                  <History className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-foreground text-background font-bold text-[10px] px-3 py-1.5 rounded-lg ml-2">Chat History</TooltipContent>
            </Tooltip>
          </TooltipProvider>
      </div>

      <ResizablePanelGroup direction="horizontal" className="flex-1 overflow-hidden h-full">
         
         {/* History Panel */}
         {showHistory && (
          <div className="contents">
            <ResizablePanel defaultSize={20} minSize={15} className="hidden sm:flex bg-background-secondary border-r border-border p-4 flex-col gap-4 relative z-40 h-full">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Your Chats</span>
                    <button onClick={() => setShowHistory(false)}><X className="w-3 h-3 opacity-20 hover:opacity-100" /></button>
                </div>
                <div className="space-y-1 overflow-y-auto custom-scrollbar pr-1">
                    {historyItems.length > 0 ? historyItems.map((item) => <div key={item.id}>{renderHistoryItem(item)}</div>) : <p className="text-[11px] text-center opacity-20 py-10 font-medium">No recent chats</p>}
                </div>
            </ResizablePanel>

            <AnimatePresence>
                <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} className="fixed inset-0 z-[110] sm:hidden bg-background flex flex-col p-6 overflow-y-auto">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-black uppercase tracking-widest">Chat History</h2>
                        <button onClick={() => setShowHistory(false)} className="p-2 bg-secondary rounded-full"><X className="w-6 h-6" /></button>
                    </div>
                    <div className="space-y-2">{historyItems.map((item) => <div key={item.id} className="w-full">{renderHistoryItem(item)}</div>)}</div>
                </motion.div>
            </AnimatePresence>
          </div>
         )}

         <ResizablePanel defaultSize={(showPreview && typeof window !== 'undefined' && window.innerWidth > 768) ? 50 : 100} minSize={30} className="flex flex-col relative bg-background w-full">
            {/* Header */}
            <div className="flex items-center justify-between px-4 sm:px-8 py-3 sm:py-5 border-b border-border bg-background/80 backdrop-blur-2xl z-20">
                <div className="flex items-center gap-2 sm:gap-3">
                   <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                   <h1 className="text-[10px] sm:text-xs font-black uppercase tracking-[0.1em] sm:tracking-[0.2em] opacity-40">AI Workspace</h1>
                </div>

                <div className="flex items-center gap-2 sm:gap-4">
                    <div className="flex sm:hidden items-center gap-1 mr-2">
                        <button onClick={handleNewChat} className="p-2 text-foreground/60 hover:text-foreground active:scale-90 transition-all"><Plus className="w-4.5 h-4.5" /></button>
                        <button onClick={() => { if (!showHistory) loadHistory(); setShowHistory(!showHistory); }} className={`p-2 active:scale-90 transition-all ${showHistory ? "text-primary" : "text-foreground/60"}`}><History className="w-4.5 h-4.5" /></button>
                    </div>
                    {(previewUrl || previewId) && !showPreview && (
                        <motion.button initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} onClick={() => setShowPreview(true)} className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-primary text-primary-foreground rounded-xl text-[9px] sm:text-[10px] font-black tracking-widest uppercase hover:opacity-80 transition-all shadow-lg">
                            <Layout className="w-3 sm:w-3.5 h-3 sm:h-3.5" /> <span className="hidden xs:inline">Open Preview</span> <span className="xs:hidden">Preview</span>
                        </motion.button>
                    )}
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-10 space-y-8 custom-scrollbar scroll-smooth">
                {messages.length === 0 ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto">
                        <Bot className="w-10 h-10 opacity-10 mb-6" />
                        <h2 className="text-2xl font-bold mb-3">Hi, I'm your AI Builder.</h2>
                        <p className="text-[14px] leading-relaxed font-medium opacity-40">I can analyze your GitHub repositories and build a professional Notion portfolio in seconds.</p>
                        <div className="mt-8 flex flex-wrap justify-center gap-3">
                            {[
                                { label: "Build my Portfolio", icon: <Sparkles className="w-3.5 h-3.5" />, text: "Build my portfolio from my GitHub" },
                                { label: "Analyze my Code", icon: <Code className="w-3.5 h-3.5" />, text: "Analyze my top repositories" },
                                { label: "Generate Resume", icon: <FileText className="w-3.5 h-3.5" />, text: "Generate a resume based on my profile" },
                                { label: "Fast Sync", icon: <Zap className="w-3.5 h-3.5" />, text: "Sync my latest GitHub changes to Notion" }
                            ].map((action, i) => (
                                <button key={i} onClick={() => setInput(action.text)} className="px-4 py-2.5 bg-secondary/50 border border-border/50 hover:border-primary/50 hover:bg-secondary rounded-xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2">{action.icon}{action.label}</button>
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    messages.map((m) => (
                        <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                            <div className={`max-w-[80%] flex gap-4 ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${m.role === "user" ? "bg-secondary" : "bg-primary text-primary-foreground"}`}>{m.role === "user" ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}</div>
                                <div className={`p-4 rounded-2xl text-[14px] leading-relaxed font-medium ${m.role === "user" ? "bg-[#2A2A2A] text-white shadow-xl" : "bg-secondary border border-border"}`}>
                                    {m.role === 'user' && m.content.includes('[Uploaded File:') && (
                                        <button onClick={() => { const match = m.content.match(/\(LINK:(.*?)\)/); if (match) window.open(match[1], '_blank'); }} className="mb-4 bg-black/40 border border-white/10 rounded-xl p-3 flex items-center gap-4 group transition-all hover:bg-black/60 shadow-inner w-full text-left">
                                            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-500 text-white shadow-lg shrink-0 group-hover:scale-110 transition-transform"><FileText className="w-5 h-5 font-bold" /></div>
                                            <div className="flex flex-col min-w-0 pr-4"><span className="text-[12px] font-bold truncate text-white/90">{m.content.match(/\[Uploaded File: (.*?)\]/)?.[1] || "Document"}</span><span className="text-[9px] opacity-40 uppercase tracking-widest font-black leading-none">Click to View</span></div>
                                            <ExternalLink className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-40 transition-opacity" />
                                        </button>
                                    )}
                                    <ReactMarkdown components={{ p: ({ children }) => <span className="block mb-2 last:mb-0">{children}</span>, li: ({ children }) => <li className="ml-4 list-disc opacity-80">{children}</li> }}>{m.role === 'user' ? m.content.replace(/\[Uploaded File: .*?\](\(LINK:.*?\))? /, '') : m.content}</ReactMarkdown>
                                    {m.actionUrl && (
                                        <button 
                                            onClick={() => {
                                                if (m.actionUrl?.startsWith('/')) {
                                                    navigate(m.actionUrl);
                                                } else {
                                                    window.open(m.actionUrl, "_blank");
                                                }
                                            }} 
                                            className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary/20 hover:bg-primary/30 border border-primary/20 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all text-primary"
                                        >
                                            <Sparkles className="w-3.5 h-3.5" /> {m.buttonText || "Visit Notion Site"}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
                {isGenerating && (
                    <div className="flex justify-start">
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center"><Bot className="w-3.5 h-3.5" /></div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-secondary border border-border rounded-2xl"><Loader2 className="w-3 h-3 animate-spin opacity-40" /><span className="text-xs opacity-40 font-bold uppercase tracking-widest">Thinking...</span></div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Wrapper */}
            <div className="pb-6 sm:pb-10 flex justify-center px-4 sm:px-6">
                <div className={`relative flex items-center max-w-3xl w-full bg-[#1a1a1b] border transition-all duration-300 rounded-full shadow-2xl px-2 py-1.5 ${isFocused ? "border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.05)]" : "border-white/10"}`}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><button className="w-10 h-10 flex items-center justify-center rounded-full text-white/40 hover:text-white hover:bg-white/5 transition-all shrink-0"><Plus className="w-5 h-5" /></button></DropdownMenuTrigger>
                      <DropdownMenuContent side="top" align="start" className="w-56 bg-[#1a1a1b] border border-white/10 rounded-2xl p-1 mb-2 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-200">
                        <DropdownMenuItem onClick={() => fileInputRef.current?.click()} className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 rounded-xl cursor-pointer transition-all"><Paperclip className="w-4 h-4 text-white/40" /><span>Add photos & files</span></DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".pdf,.jpg,.jpeg,.png,.docx" />
                    <textarea 
                        rows={1} placeholder="Ask anything" value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSend())}
                        onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)}
                        className="flex-1 bg-transparent px-3 py-2.5 text-[15px] text-white placeholder:text-white/30 focus:outline-none resize-none custom-scrollbar font-normal leading-tight h-[42px] content-center"
                    />

                    <div className="flex items-center shrink-0">
                        <button onClick={isGenerating ? () => setIsGenerating(false) : handleSend} disabled={!isGenerating && !input.trim() && !pendingFile} className={`w-10 h-10 flex items-center justify-center rounded-full transition-all ${(!input.trim() && !pendingFile) && !isGenerating ? "text-white/10" : "bg-white text-black hover:scale-105 shadow-lg"}`}>
                            {isGenerating ? <div className="w-3.5 h-3.5 bg-black rounded-sm animate-pulse" /> : <Send className="w-4 h-4 translate-x-0.5" />}
                        </button>
                    </div>

                    {pendingFile && (
                        <div className="absolute -top-12 left-0 right-0 flex justify-center pointer-events-none">
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#1a1a1b] border border-white/10 rounded-full px-4 py-1.5 flex items-center gap-2 shadow-2xl pointer-events-auto">
                                <FileText className="w-3.5 h-3.5 text-red-400" /><span className="text-[10px] font-bold text-white/70 truncate max-w-[120px]">{pendingFile.name}</span>
                                <button onClick={() => setPendingFile(null)} className="p-1 hover:bg-white/10 rounded-full"><X className="w-3 h-3 text-white/40" /></button>
                            </motion.div>
                        </div>
                    )}
                </div>
            </div>
         </ResizablePanel>

         {showPreview && (
          <div className="contents sm:contents">
            <div className="hidden sm:contents"><ResizableHandle withHandle className="bg-transparent" /><ResizablePanel defaultSize={50} minSize={30}><PortfolioPreview isGenerating={isGenerating} url={previewUrl} id={previewId} onClose={() => setShowPreview(false)} /></ResizablePanel></div>
            <div className="fixed inset-0 z-[100] sm:hidden bg-background"><PortfolioPreview isGenerating={isGenerating} url={previewUrl} id={previewId} onClose={() => setShowPreview(false)} /></div>
          </div>
        )}
      </ResizablePanelGroup>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteConfirmId !== null} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
        <AlertDialogContent className="bg-background-secondary border border-border rounded-2xl p-6 shadow-2xl max-w-sm">
            <AlertDialogHeader><AlertDialogTitle className="text-xl font-bold">Delete Conversation?</AlertDialogTitle><AlertDialogDescription className="text-sm opacity-60">This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
            <AlertDialogFooter className="mt-6 flex gap-3">
                <AlertDialogCancel className="flex-1 bg-secondary text-foreground rounded-xl py-3 font-bold text-xs">Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => deleteConfirmId && handleDeleteSession(deleteConfirmId)} className="flex-1 bg-red-500 text-white rounded-xl py-3 font-bold text-xs">Delete</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
