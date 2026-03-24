import { motion, AnimatePresence } from "motion/react";
import { Loader2, ExternalLink, CheckCircle2, Layout, Type, Image as ImageIcon, Briefcase, Award, Globe, RefreshCw, ChevronLeft, ChevronRight, Share2, MoreHorizontal } from "lucide-react";
import { NotionRendererPanel } from "./notion-renderer-panel";

interface PortfolioPreviewProps {
  isGenerating: boolean;
  url: string | null;
  id: string | null;
  onClose: () => void;
}

export function PortfolioPreview({ isGenerating, url, id, onClose }: PortfolioPreviewProps) {
  return (
    <div className="h-full w-full bg-background flex flex-col overflow-hidden relative">
      {/* Header */}
      <div className="px-6 py-6 border-b border-border flex items-center justify-between bg-secondary/30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center">
            <Layout className="w-4 h-4 text-purple-400" />
          </div>
          <h3 className="text-sm font-bold text-foreground tracking-tight">Portfolio Preview</h3>
        </div>
        
        <div className="flex items-center gap-3">
          {url && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => window.open(url, "_blank")}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-foreground text-background rounded-lg text-xs font-bold hover:opacity-90 transition-opacity"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              VIEW NOTION
            </motion.button>
          )}
          
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-secondary/40 transition-colors text-foreground/40 hover:text-foreground"
          >
            <ChevronRight className="w-5 h-5 translate-x-0.5" />
          </button>
        </div>
      </div>

      {/* Content: The "Virtual Browser" */}
      <div className="flex-1 overflow-hidden flex flex-col bg-[#F3F4F6]">
        {/* Browser Top Bar */}
        <div className="bg-[#FFFFFF] border-b border-gray-200 px-4 py-2 flex items-center gap-4">
            <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                <div className="w-3 h-3 rounded-full bg-[#28C840]" />
            </div>
            
            <div className="flex gap-2 text-gray-400">
                <ChevronLeft className="w-4 h-4 cursor-not-allowed" />
                <ChevronRight className="w-4 h-4 cursor-not-allowed" />
                <RefreshCw className={`w-4 h-4 cursor-pointer hover:text-gray-600 ${isGenerating ? 'animate-spin' : ''}`} />
            </div>

            <div className="flex-1 bg-[#F1F3F4] rounded-full px-4 py-1.5 flex items-center gap-2 border border-transparent hover:border-gray-200 transition-all group">
                <Globe className="w-3.5 h-3.5 text-gray-400" />
                <div className="text-[12px] text-gray-500 font-medium truncate flex-1">
                    {url ? url.replace('https://', '') : 'workspace.notion.so/building...'}
                </div>
                {isGenerating && (
                    <div className="flex gap-1">
                        <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-1 h-1 bg-purple-500 rounded-full" />
                        <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} className="w-1 h-1 bg-purple-500 rounded-full" />
                        <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }} className="w-1 h-1 bg-purple-500 rounded-full" />
                    </div>
                )}
            </div>

            <div className="flex gap-3 text-gray-400">
                <Share2 className="w-4 h-4 cursor-pointer hover:text-gray-600" />
                <MoreHorizontal className="w-4 h-4 cursor-pointer hover:text-gray-600" />
            </div>
        </div>

        {/* The Actual Notion Renderer */}
        <div className="flex-1 relative overflow-hidden shadow-inner">
            <NotionRendererPanel pageId={id} isGenerating={isGenerating} />
            
            {/* Show "Success" popup overlay when done */}
            {!isGenerating && url && (
                <motion.div 
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%]"
                >
                    <div className="bg-foreground text-background p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-4 border border-border/50 backdrop-blur-xl">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
                                <CheckCircle2 className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="text-xs font-black uppercase tracking-widest text-background/60">Success</p>
                                <p className="text-sm font-bold">Your Portfolio is Live!</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => window.open(url, "_blank")}
                            className="bg-background text-foreground px-5 py-2.5 rounded-xl text-xs font-black tracking-widest hover:opacity-90 transition-opacity"
                        >
                            VIEW FULL PAGE
                        </button>
                    </div>
                </motion.div>
            )}
        </div>
      </div>

      {/* Footer / Decorative */}
      <div className="p-6 border-t border-border bg-secondary/5 flex items-center justify-between">
          <div className="flex gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
          </div>
          <span className="text-[10px] font-black text-foreground/20 uppercase tracking-widest">Workspace Preview v1.0</span>
      </div>
    </div>
  );
}
