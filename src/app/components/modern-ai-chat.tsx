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
            is_pinned: s.is_pinned,
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
    toast.success("New conversation started");
  };

  const handleSend = async () => {
    if ((!input.trim() && !pendingFile) || isGenerating) return;

    const handle = githubHandle || displayName || "manual_entry";
    const userMessageContent = input.trim();
    const fileToSend = pendingFile;
    let sessionId = currentSessionId;

    // Build virtual user message optimistically
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
      // 1. Create session IF NEW
      if (!sessionId) {
          const sessionTitle = fileToSend 
            ? `Resume: ${fileToSend.name}` 
            : (userMessageContent.length > 25 ? userMessageContent.substring(0, 25) + "..." : userMessageContent);
          
          const newSession = await createChatSession(handle, sessionTitle);
          sessionId = newSession.id;
          setCurrentSessionId(sessionId);
          loadHistory(); // Refresh sidebar list
      }

      const isBuildIntent = /portfolio|build|create|generate/i.test(userMessageContent);
      let responseText = "";

      if (fileToSend) {
        // Multi-part upload (Resume/Files)
        const res = await uploadResume(handle, fileToSend, userMessageContent, sessionId!);
        responseText = res.message;
        
        // Update user message with link
        if (res.fileUrl) {
          setMessages(prev => prev.map(m => m.id === userMsg.id ? { 
            ...m, 
            content: userMessageContent 
              ? `[Uploaded File: ${fileToSend.name}](LINK:${res.fileUrl}) ${userMessageContent}`
              : `[Uploaded Resume: ${fileToSend.name}](LINK:${res.fileUrl})`
          } : m));
        }
      } else if (isBuildIntent && !fileToSend) {
        // Portfolio generation intent
        setShowPreview(true);
        const result = await generatePortfolio(handle, userMessageContent, sessionId!, templateId || undefined);
        incrementGenerationCount();
        setPreviewUrl(result.url);
        setPreviewId(result.id);
        
        responseText = githubHandle === 'manual_entry' 
          ? "I've structured your custom details into a Notion portfolio! You can see it manifest live in the preview window." 
          : "Excellent! I've analyzed your GitHub data and am building your portfolio in Notion right now. Watch the live preview on the right.";
      } else {
        // Standard chat response
        responseText = await getChatResponse(userMessageContent, handle, sessionId || undefined);
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: responseText,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);

    } catch (error: any) {
      console.error("Chat Error:", error);
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsGenerating(false);
      scrollToBottom();
    }
  };

  return (
    <div className={`relative flex bg-background text-foreground w-full h-full overflow-hidden ${!immersive ? "border border-border rounded-3xl" : ""}`}>
      
      {/* Sidebar - Theme Adaptive */}
      <div className="w-16 flex flex-col items-center py-6 gap-6 border-r border-border bg-background z-50">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  onClick={handleNewChat}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-secondary hover:bg-primary hover:text-primary-foreground transition-all group active:scale-95"
                >
                  <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-foreground text-background font-bold text-[10px] px-3 py-1.5 rounded-lg ml-2">
                New Chat
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  onClick={() => {
                    if (!showHistory) loadHistory();
                    setShowHistory(!showHistory);
                  }}
                  className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all group active:scale-95 ${showHistory ? "bg-primary text-primary-foreground" : "bg-transparent text-foreground/40 hover:text-foreground hover:bg-secondary"}`}
                >
                  <History className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-foreground text-background font-bold text-[10px] px-3 py-1.5 rounded-lg ml-2">
                Chat History
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
      </div>

      <ResizablePanelGroup direction="horizontal" className="flex-1 overflow-hidden h-full">
         
         {/* History Panel - Theme Adaptive */}
         {showHistory && (
             <ResizablePanel defaultSize={20} minSize={15} className="bg-background-secondary border-r border-border p-4 flex flex-col gap-4 relative z-40">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Your Chats</span>
                    <button onClick={() => setShowHistory(false)}><X className="w-3 h-3 opacity-20 hover:opacity-100" /></button>
                </div>
                <div className="space-y-1 overflow-y-auto custom-scrollbar pr-1">
                    {historyItems.length > 0 ? (
                        historyItems.map((item) => (
                            <div key={item.id} className="relative group/item">
                                {renamingSessionId === item.id ? (
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
                                ) : (
                                    <div className="flex items-center gap-1 group">
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

                                        {/* Dropdown Menu Toggle */}
                                        <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <button className="p-1 rounded-lg hover:bg-secondary opacity-0 group-hover/item:opacity-100 transition-opacity">
                                                        <MoreHorizontal className="w-3.5 h-3.5 text-foreground/40" />
                                                    </button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-40 bg-background-secondary border border-border rounded-xl p-1 shadow-2xl">
                                                    <DropdownMenuItem 
                                                        onClick={(e) => handleTogglePin(e, item.id, item.is_pinned)}
                                                        className="flex items-center gap-2 p-2 text-xs font-medium rounded-lg cursor-pointer hover:bg-secondary transition-all"
                                                    >
                                                        <Pin className="w-3.5 h-3.5" />
                                                        {item.is_pinned ? "Unpin chat" : "Pin chat"}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem 
                                                        onClick={() => {
                                                            setRenamingSessionId(item.id);
                                                            setNewName(item.title);
                                                        }}
                                                        className="flex items-center gap-2 p-2 text-xs font-medium rounded-lg cursor-pointer hover:bg-secondary transition-all"
                                                    >
                                                        <Edit2 className="w-3.5 h-3.5" />
                                                        Rename
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator className="bg-border/50 my-1" />
                                                    <DropdownMenuItem 
                                                        onClick={() => setDeleteConfirmId(item.id)}
                                                        className="flex items-center gap-2 p-2 text-xs font-medium rounded-lg cursor-pointer text-red-500 hover:bg-red-500/10 transition-all font-bold"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                )}
                            </div>
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
                   <h1 className="text-xs font-black uppercase tracking-[0.2em] opacity-40">AI Workspace</h1>
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

                        <div className="mt-8 flex flex-wrap justify-center gap-3">
                            {[
                                { label: "Build my Portfolio", icon: <Sparkles className="w-3.5 h-3.5" />, text: "Build my portfolio from my GitHub" },
                                { label: "Analyze my Code", icon: <Code className="w-3.5 h-3.5" />, text: "Analyze my top repositories" },
                                { label: "Generate Resume", icon: <FileText className="w-3.5 h-3.5" />, text: "Generate a resume based on my profile" },
                                { label: "Fast Sync", icon: <Zap className="w-3.5 h-3.5" />, text: "Sync my latest GitHub changes to Notion" }
                            ].map((action, i) => (
                                <motion.button 
                                    key={i}
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setInput(action.text)}
                                    className="px-4 py-2.5 bg-secondary/50 border border-border/50 hover:border-primary/50 hover:bg-secondary rounded-xl text-[11px] font-black uppercase tracking-widest transition-all shadow-sm hover:shadow-xl flex items-center gap-2"
                                >
                                    {action.icon}
                                    {action.label}
                                </motion.button>
                            ))}
                        </div>
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
                                <div className={`p-4 rounded-2xl text-[14px] leading-relaxed font-medium ${m.role === "user" ? "bg-[#2A2A2A] text-white shadow-xl border border-white/5" : "bg-secondary border border-border"}`}>
                                    {m.role === 'user' && m.content.includes('[Uploaded File:') && (
                                        <button 
                                            onClick={() => {
                                                const match = m.content.match(/\(LINK:(.*?)\)/);
                                                if (match) window.open(match[1], '_blank');
                                            }}
                                            className="mb-4 bg-black/40 border border-white/10 rounded-xl p-3 flex items-center gap-4 group transition-all hover:bg-black/60 shadow-inner w-full text-left cursor-pointer hover:border-primary/30"
                                        >
                                            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-500 text-white shadow-lg shrink-0 group-hover:scale-110 transition-transform">
                                                <FileText className="w-5 h-5 font-bold" />
                                            </div>
                                            <div className="flex flex-col min-w-0 pr-4">
                                                <span className="text-[12px] font-bold truncate text-white/90 group-hover:text-primary transition-colors">
                                                    {m.content.match(/\[Uploaded File: (.*?)\]/)?.[1] || "Document"}
                                                </span>
                                                <span className="text-[9px] opacity-40 uppercase tracking-widest font-black leading-none">Click to View Original</span>
                                            </div>
                                            <ExternalLink className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-40 transition-opacity" />
                                        </button>
                                    )}

                                    <ReactMarkdown 
                                        components={{
                                            p: ({ children }) => <span className="block mb-2 last:mb-0">{children}</span>,
                                            li: ({ children }) => <li className="ml-4 list-disc opacity-80">{children}</li>
                                        }}
                                    >
                                        {/* Strip file prefix and link pattern for display */}
                                        {m.role === 'user' ? m.content.replace(/\[Uploaded File: .*?\](\(LINK:.*?\))? /, '') : m.content}
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
                <div className={`relative flex flex-col max-w-2xl w-full bg-secondary/90 backdrop-blur-xl border transition-all duration-300 rounded-[1.8rem] shadow-xl hover:shadow-2xl hover:border-border/80 ${isFocused ? "border-primary shadow-[0_0_40px_rgba(139,92,246,0.2)] ring-1 ring-primary/20 scale-[1.01]" : "border-border/50"}`}>
                    
                    {/* Attachment Overlay if file is selected */}
                    {pendingFile && (
                        <div className="px-8 pt-4">
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex items-center gap-3 bg-foreground/5 border border-border rounded-[1.2rem] p-2 pr-4 w-fit max-w-full group relative shadow-xl backdrop-blur-sm"
                            >
                                <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-500 text-white shadow-lg overflow-hidden">
                                     <FileText className="w-5 h-5 shadow-sm" />
                                </div>
                                <div className="flex flex-col min-w-0 pr-4">
                                    <span className="text-[12px] font-bold truncate max-w-[200px] text-foreground">{pendingFile.name}</span>
                                    <span className="text-[9px] opacity-40 uppercase tracking-widest font-black leading-none">PDF Document</span>
                                </div>
                                <button 
                                    onClick={() => setPendingFile(null)}
                                    className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-background-secondary border border-border rounded-full flex items-center justify-center hover:bg-secondary hover:scale-110 active:scale-95 transition-all shadow-xl z-20"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </motion.div>
                        </div>
                    )}

                    {/* Attachment Option */}
                    <div className="px-8 pt-4 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                onChange={handleFileUpload} 
                                className="hidden" 
                                accept=".pdf,.jpg,.jpeg,.png,.docx" 
                            />
                            <button 
                                onClick={() => fileInputRef.current?.click()}
                                className="flex items-center gap-2 text-foreground/40 hover:text-foreground transition-colors group"
                            >
                                <Paperclip className="w-4 h-4" />
                                <span className="text-[11px] font-bold">Add photos & files</span>
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center">
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
                        <div className="pr-4">
                            <button 
                                onClick={handleSend}
                                disabled={(!input.trim() && !pendingFile) || isGenerating}
                                className={`w-11 h-11 flex items-center justify-center rounded-[1.2rem] transition-all dropdown-shadow ${(!input.trim() && !pendingFile) || isGenerating ? "bg-white/10 text-white/20" : "bg-white text-primary hover:scale-110 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.3)]"}`}
                            >
                                <Send className="w-5 h-5 translate-x-0.5" />
                            </button>
                        </div>
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
          {/* Delete Confirmation Dialog */}
          <AlertDialog open={deleteConfirmId !== null} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
            <AlertDialogContent className="bg-background-secondary border border-border rounded-2xl p-6 shadow-2xl max-w-sm">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-xl font-bold">Delete Conversation?</AlertDialogTitle>
                    <AlertDialogDescription className="text-sm opacity-60">
                        This action cannot be undone. This will permanently remove the conversation from your history.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-6 flex gap-3">
                    <AlertDialogCancel className="flex-1 bg-secondary text-foreground hover:bg-secondary/80 border-none rounded-xl py-3 font-bold text-xs uppercase tracking-widest">
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction 
                        onClick={() => deleteConfirmId && handleDeleteSession(deleteConfirmId)}
                        className="flex-1 bg-red-500 text-white hover:bg-red-600 border-none rounded-xl py-3 font-bold text-xs uppercase tracking-widest"
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </ResizablePanelGroup>
    </div>
  );
}
