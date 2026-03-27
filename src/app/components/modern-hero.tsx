import { Sparkles, ArrowRight, Play, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useGitHub } from "../context/GitHubContext";
import { toast } from "sonner";
import { useNavigate } from "react-router";

export function ModernHero() {
  const navigate = useNavigate();
  const { githubHandle, isGenerating, isConnected, displayName, plan } = useGitHub();

  const handleGenerate = () => {
    navigate("/portfolio-builder");
    if (!githubHandle) {
      toast.info("Start by connecting your GitHub in Integrations.");
    }
  };

  const isPro = plan?.toLowerCase() === 'pro';
  const isPremium = plan?.toLowerCase() === 'premium';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative mb-12"
    >
      {/* Background Decor */}
      <div className="absolute inset-x-0 -top-24 -bottom-24 bg-[radial-gradient(45%_40%_at_50%_50%,rgba(94,106,210,0.08)_0%,transparent_100%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="relative pt-12 pb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 px-3 py-1 bg-black/[0.03] dark:bg-white/[0.03] border border-black/[0.08] dark:border-white/[0.08] rounded-full mb-8 shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-[0.2em]">Next Gen AI Portfolio Builder</span>
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-5xl md:text-7xl font-bold text-foreground mb-6 tracking-[-0.03em] leading-[1.1]"
        >
          Build for the <br />
          <span className="text-foreground/40">Future of Work</span>
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-lg md:text-xl text-foreground/50 max-w-xl mb-10 leading-relaxed font-medium"
        >
          Transform your GitHub presence into a premium Notion portfolio. Engineered for developers, designers, and creators.
        </motion.p>

        <div className="flex flex-wrap gap-4">
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-8 py-4 bg-primary text-white rounded-xl font-bold flex items-center gap-3 transition-all shadow-[0_20px_40px_rgba(94,106,210,0.25)] disabled:opacity-50"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span className="text-sm tracking-tight">{isGenerating ? "Generating..." : "Get Started Now"}</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
          
          <motion.button
            whileHover={{ y: -2, backgroundColor: "rgba(0,0,0,0.05)" }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-4 bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/[0.08] text-foreground/80 rounded-xl font-bold flex items-center gap-3 transition-all shadow-sm"
          >
            <Play className="w-4 h-4" />
            <span className="text-sm tracking-tight">How it works</span>
          </motion.button>
        </div>
      </div>

      {/* Plan Badge / Status Card */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute top-12 right-0 hidden xl:flex flex-col gap-4 w-64"
      >
        <div className="p-6 bg-white dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/[0.08] rounded-2xl backdrop-blur-xl shadow-sm">
          <p className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em] mb-4">Subscription Status</p>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-foreground capitalize">{plan} Plan</span>
            <div className={`w-2 h-2 rounded-full ${isPremium ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.4)]' : isPro ? 'bg-indigo-400 shadow-[0_0_10px_rgba(129,140,248,0.4)]' : 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]'} animate-pulse`} />
          </div>
          <p className="text-xs text-foreground/40 font-medium">
            {isPremium ? "Full portfolio suite unlocked" : isPro ? "Advanced features active" : "3 Builds remaining"}
          </p>
        </div>
        
        {!isPremium && (
          <div 
            onClick={() => navigate("/settings/billing")}
            className="p-4 bg-primary/[0.03] border border-primary/20 rounded-2xl flex items-center justify-between group cursor-pointer hover:bg-primary/5 transition-colors shadow-sm"
          >
            <span className="text-[11px] font-bold text-primary uppercase tracking-widest py-0.5">
              {isPro ? "Go Premium" : "Upgrade to Pro"}
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-primary group-hover:translate-x-1 transition-transform" />
          </div>
        )}
        
        {isPremium && (
          <div 
            onClick={() => navigate("/settings/billing")}
            className="p-4 bg-white dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/[0.08] rounded-2xl flex items-center justify-between group cursor-pointer hover:bg-black/[0.03] dark:hover:bg-white/[0.05] transition-colors shadow-sm"
          >
            <span className="text-[11px] font-bold text-foreground/40 uppercase tracking-widest py-0.5">Manage Billing</span>
            <ArrowRight className="w-3.5 h-3.5 text-foreground/20 group-hover:translate-x-1 transition-transform" />
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
