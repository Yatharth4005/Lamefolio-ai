import { Sparkles, Send, Zap, Loader2, User, Bot, ExternalLink, Globe, ChevronDown, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useRef, useEffect } from "react";
import { useGitHub } from "../context/GitHubContext";
import { generatePortfolio, getChatResponse, getChatHistory } from "../lib/api";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { useNavigate } from "react-router";

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

function ThinkingTrace() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const steps = [
    "Analyzing project requirements...",
    "Crawling GitHub repositories...",
    "Extracting core tech stack...",
    "Synthesizing achievement patterns...",
    "Generating Notion block architecture...",
    "Pushing final assets to workspace..."
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-3">
      {/* Header / Trigger */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 group transition-colors bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 px-4 py-2.5 rounded-2xl"
      >
        <div className="flex gap-1 relative">
           <motion.div 
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.5, 1, 0.5]
              }} 
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-2.5 h-2.5 bg-purple-500 rounded-full blur-[2px]" 
           />
           <div className="absolute inset-0 bg-purple-500/20 blur-md animate-pulse rounded-full" />
        </div>
        <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.4em] group-hover:text-white/60 transition-colors">
          Thinking...
        </p>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          className="text-white/20 group-hover:text-white/40 border-l border-white/10 pl-3 ml-1"
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </motion.div>
      </button>

      {/* Collapsible Steps */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white/[0.015] border border-white/5 rounded-[2rem] p-6 backdrop-blur-3xl space-y-1">
               {steps.slice(0, currentStep + 1).map((step, idx) => (
                  <motion.div 
                     key={idx}
                     initial={{ opacity: 0, x: -10 }}
                     animate={{ opacity: 1, x: 0 }}
                     className="flex items-center gap-4 py-1.5"
                  >
                     <div className="flex-shrink-0">
                        {idx === currentStep ? (
                           <div className="relative">
                             <Loader2 className="w-3.5 h-3.5 text-purple-400/60 animate-spin" />
                           </div>
                        ) : (
                           <CheckCircle2 className="w-3.5 h-3.5 text-purple-500/30" />
                        )}
                     </div>
                     <span className={`text-[12px] tracking-tight ${idx === currentStep ? "text-white/60 font-medium italic" : "text-white/20"}`}>
                        {step}
                     </span>
                  </motion.div>
               ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


export function ModernAIChat({ immersive = false }: ModernAIChatProps) {
  const navigate = useNavigate();
  const [isFocused, setIsFocused] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  
  const { githubHandle, isGenerating, setIsGenerating, addNotification, displayName, generationCount, incrementGenerationCount, plan, points, user, isNotionConnected } = useGitHub();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGenerating]);

  // Load History
  useEffect(() => {
    const handle = githubHandle || displayName;
    if (!handle) return;

    const loadHistory = async () => {
      try {
        const history = await getChatHistory(handle);
        if (history && history.length > 0) {
          setMessages(history.map((m: any) => ({
            id: m.id.toString(),
            role: m.role,
            content: m.content,
            timestamp: new Date(m.created_at)
          })));
        } else {
          setMessages([
            {
              id: "initial",
              role: "ai",
              content: "Hi there! I'm your AI Portfolio assistant. Just describe your work, or type 'build my portfolio' and I'll create a stunning Notion page for you!",
              timestamp: new Date(),
            }
          ]);
        }
      } catch (error) {
        console.error("Failed to load history:", error);
      }
    };
    loadHistory();
  }, [githubHandle, displayName]);

  const handleSend = async () => {
    if (!input.trim() || isGenerating) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput("");

    // Identify intent (simple logic)
    const lowerInput = currentInput.toLowerCase();
    const isBuildIntent = lowerInput.includes("build") || lowerInput.includes("portfolio") || lowerInput.includes("create") || lowerInput.includes("make");
    const isGithubIntent = lowerInput.includes("github") || lowerInput.includes("analyze") || lowerInput.includes("sync");

    // Case 1: Github intent but no handle
    if (isGithubIntent && !githubHandle) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "ai",
          content: "I'd love to analyze your GitHub, but you haven't connected your account yet! Please head over to the **Integrations** page to set your handle, and then we can build something amazing together.",
          timestamp: new Date(),
        },
      ]);
      return;
    }

    // Case 2: Build intent
    if (isBuildIntent) {
      if (plan === "Free" && points <= 0) {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "ai",
            content: "You've reached your limit of 3 portfolio generations on the **Free Plan**! Upgrading to **Pro** gives you unlimited generations, custom domains, and more. Would you like to check out our plans?",
            actionUrl: "/settings/billing",
            timestamp: new Date(),
          },
        ]);
        return;
      }
      
      // Case 2b: Build intent but Notion not connected — nudge to connect
      if (!isNotionConnected) {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "ai",
            content: "Before I can build your portfolio into Notion, you'll need to connect your Notion workspace! It only takes a few seconds — just click the button below to authorize access, and I'll take care of the rest. ✨",
            actionUrl: "/integrations",
            timestamp: new Date(),
          },
        ]);
        return;
      }

      // If we have a handle OR if the prompt is very long (assumed to contain details)
      if (githubHandle || currentInput.length > 50) {
        try {
          setIsGenerating(true);
          const result = await generatePortfolio(githubHandle || displayName || "manual_entry", currentInput);
          incrementGenerationCount();
          
          setMessages((prev) => [
            ...prev,
            {
              id: (Date.now() + 1).toString(),
              role: "ai",
              content: githubHandle 
                ? "Excellent news! I've analyzed your GitHub and built your portfolio in Notion. You can view it using the link below:"
                : "I've processed the details you provided and generated your Notion portfolio! Check it out here:",
              actionUrl: result.url,
              timestamp: new Date(),
            },
          ]);
          addNotification({
            message: `Hey ${displayName || "Creator"}, your Notion site is ready!`,
            type: "success",
            actionUrl: result.url
          });
          toast.success("Portfolio Built!");
        } catch (error: any) {
          setMessages((prev) => [
            ...prev,
            {
              id: (Date.now() + 1).toString(),
              role: "ai",
              content: `I ran into an issue: ${error.message}. Please check your connection and try again.`,
              timestamp: new Date(),
            },
          ]);
        } finally {
          setIsGenerating(false);
        }
      } else {
        // Build intent but no data
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "ai",
            content: "I can build your portfolio in two ways:\n\n1. **GitHub Integration**: Connect your account on the Dashboard to auto-fetch your projects.\n2. **Direct Details**: Paste your resume or bio here, and I'll structure it for you immediately!\n\nWhich one would you prefer?",
            timestamp: new Date(),
          },
        ]);
      }
      return;
    }

    // Case 3: General Chat
    try {
      setIsGenerating(true);
      const responseText = await getChatResponse(currentInput, githubHandle || displayName || "manual_entry");
      
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "ai",
          content: responseText,
          timestamp: new Date(),
        },
      ]);
    } catch (error: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "ai",
          content: "I'm having trouble connecting to my brain right now. Can we try again in a moment?",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`relative flex flex-col bg-[#0D0D0D] border-x border-white/[0.05] overflow-hidden w-full ${
        immersive ? "h-full" : "h-[500px] rounded-[2rem] border border-white/[0.08]"
      }`}
    >
      {/* Immersive Header - Integrated Dashboard info */}
      <div className="flex items-center justify-between px-6 py-6 border-b border-white/[0.08] bg-white/[0.01]">
        <div className="flex items-center gap-5">
           <div className={`flex flex-col ${immersive ? "" : "hidden"}`}>
              <h1 className="text-xl font-bold text-white tracking-tight">AI Workspace</h1>
           </div>
           
           {!immersive && (
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="text-sm font-bold text-white">Assistant</h3>
             </div>
           )}
        </div>

        <div className="flex items-center gap-6">
           {immersive && githubHandle && (
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/[0.03] border border-white/[0.08] rounded-xl">
                 <Globe className="w-3.5 h-3.5 text-white/40" />
                 <span className="text-xs text-white/60 font-medium">@{githubHandle}</span>
              </div>
           )}
           <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-xl relative group overflow-hidden">
            <div className="absolute inset-0 bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors" />
            <Zap className="w-4 h-4 text-purple-400 font-bold relative z-10" />
            <span className="text-xs font-black text-purple-400 uppercase tracking-widest leading-none pt-0.5 relative z-10">Powered by Gemini</span>
          </div>
        </div>
      </div>

      {/* Messages Area - Larger padding for Full Page */}
      <div className="flex-1 overflow-y-auto px-6 py-10 space-y-8 custom-scrollbar scroll-smooth">
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4, type: "spring", bounce: 0.3 }}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`flex gap-5 max-w-[85%] ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl overflow-hidden ${
                  message.role === "user" ? "bg-white/10 border border-white/10" : "bg-white text-black"
                }`}>
                  {message.role === "user" ? (
                    user?.avatar ? <img src={user.avatar} className="w-full h-full object-cover" alt="user" /> : <User className="w-5 h-5" />
                  ) : (
                    <Bot className="w-5 h-5" />
                  )}
                </div>
                <div className={`p-6 rounded-[1.8rem] text-[15px] leading-[1.6] shadow-md ${
                  message.role === "user" 
                    ? "bg-[#1A1A1A] border border-white/10 text-white/90 rounded-tr-none" 
                    : "bg-[#111111] border border-white/5 text-white/80 rounded-tl-none font-medium prose prose-invert max-w-none"
                }`}>
                  {message.role === "user" ? (
                    message.content
                  ) : (
                    <ReactMarkdown 
                      components={{
                        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                        li: ({ children }) => <li className="ml-4 list-disc">{children}</li>,
                        ul: ({ children }) => <ul className="space-y-1 mb-2">{children}</ul>,
                        strong: ({ children }) => <strong className="text-white font-bold">{children}</strong>
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  )}
                  
                  {message.actionUrl && (
                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => message.actionUrl?.startsWith("/") ? navigate(message.actionUrl) : window.open(message.actionUrl, "_blank")}
                      className="mt-8 w-full py-5 bg-white text-black rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-2xl hover:bg-gray-100 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      {message.actionUrl === "/settings/billing" ? "UPGRADE TO PRO" : message.actionUrl === "/integrations" ? "CONNECT NOTION →" : "View in Notion"}
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isGenerating && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex justify-start"
          >
            <div className="flex gap-5 w-full max-w-[85%]">
              <div className="w-11 h-11 rounded-2xl bg-white text-black flex items-center justify-center shadow-xl">
                <Bot className="w-5 h-5" />
              </div>
              <div className="flex-1">
                 <ThinkingTrace />
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Immersive Input bar */}
      <div className="p-6 bg-white/[0.01] border-t border-white/[0.05]">
        <div className="relative group w-full">
          <div className="absolute -inset-1.5 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-[2.5rem] blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-700" />
          <div className="relative flex items-center gap-4">
            <input
              type="text"
              placeholder="Tell me about your career or 'build me a portfolio'..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              disabled={isGenerating}
              className="flex-1 bg-[#1A1A1A] border border-white/[0.08] rounded-[1.8rem] px-8 py-6 text-[15px] text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-all font-medium shadow-inner"
            />
            <motion.button
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSend}
              disabled={isGenerating || !input.trim()}
              className="p-6 bg-white text-black rounded-2xl shadow-2xl disabled:opacity-20 disabled:grayscale transition-all flex items-center justify-center group/btn"
            >
              <Send className="w-6 h-6 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
            </motion.button>
          </div>
        </div>
        <div className="flex justify-center gap-10 mt-8">
          {[ 
            { label: "Build Portfolio", prompt: "Build my portfolio using my GitHub data" },
            { label: "Analyze GitHub", prompt: "Analyze my GitHub repositories" },
            { label: "Direct Build", prompt: "Build my portfolio based on these details: [Paste Details Here]" }
          ].map((tag) => (
             <button
               key={tag.label}
               onClick={() => setInput(tag.prompt)}
               className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-white transition-all duration-300 relative group"
             >
               {tag.label}
               <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white transition-all group-hover:w-full" />
             </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
