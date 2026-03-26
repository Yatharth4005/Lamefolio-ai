import { Sparkles, ArrowRight, Play, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useGitHub } from "../context/GitHubContext";
import { toast } from "sonner";
import { useNavigate } from "react-router";

export function ModernHero() {
  const navigate = useNavigate();
  const { githubHandle, isGenerating, isConnected, displayName, plan } = useGitHub();

  const handleGenerate = () => {
    // If handle is set, we navigate to the builder to start the process
    navigate("/portfolio-builder");
    
    if (!githubHandle) {
      toast.info("Welcome! Please start by connecting your GitHub in the Integrations page.", {
        action: {
          label: "Connect Now",
          onClick: () => navigate("/integrations")
        },
      });
    } else {
      toast.success(`Redirecting to Builder for ${githubHandle}...`);
    }
  };

  const isPro = plan?.toLowerCase() === 'pro';
  const isPremium = plan?.toLowerCase() === 'premium';

  const bannerStyles = {
    gradient: isPremium 
      ? "bg-gradient-to-r from-amber-600 via-yellow-200 to-amber-500" 
      : isPro 
        ? "bg-gradient-to-r from-slate-400 via-gray-100 to-slate-500" 
        : "bg-gradient-to-r from-purple-600/90 via-pink-600/90 to-blue-600/90",
    text: (isPro || isPremium) ? "text-gray-900" : "text-white",
    subtext: (isPro || isPremium) ? "text-gray-900/70" : "text-white/80",
    border: (isPro || isPremium) ? "border-black/10" : "border-white/20",
    accent: (isPro || isPremium) ? "bg-black/5" : "bg-black/20"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-8"
    >
      <div className="mb-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className={`inline-flex items-center gap-2 px-4 py-2 ${isPremium ? 'bg-amber-500/10 border-amber-500/20' : isPro ? 'bg-slate-500/10 border-slate-500/20' : 'bg-purple-500/10 border-purple-500/20'} border rounded-full mb-4`}
        >
          <div className="relative">
            <Sparkles className={`w-4 h-4 ${isPremium ? 'text-amber-500' : isPro ? 'text-slate-400' : 'text-purple-400'}`} />
            <span className="absolute inset-0 animate-ping">
              <Sparkles className={`w-4 h-4 ${isPremium ? 'text-amber-500' : isPro ? 'text-slate-400' : 'text-purple-400'} opacity-75`} />
            </span>
          </div>
          <span className={`text-sm font-medium ${isPremium ? 'text-amber-600' : isPro ? 'text-slate-500' : 'text-purple-400'} uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded-lg`}>Powered by Gemini</span>
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl md:text-5xl font-bold text-foreground mb-3 tracking-tight"
        >
          {isConnected ? "Welcome back, " : "Ready to build, "}
          <span className={`bg-gradient-to-r ${isPremium ? 'from-amber-600 to-yellow-500' : isPro ? 'from-slate-500 to-gray-400' : 'from-purple-400 via-pink-400 to-blue-400'} bg-clip-text text-transparent`}>
            {displayName || githubHandle || "Creator"}
          </span>{" "}
          👋
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-lg text-foreground/60 max-w-2xl mb-8"
        >
          Let's build an amazing portfolio that showcases your skills and achievements.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="relative group overflow-hidden rounded-[2.5rem] shadow-2xl"
      >
        <div className={`absolute inset-0 ${bannerStyles.gradient}`} />
        {/* Animated accent line */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        
        <div className="relative p-8 md:p-12">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12">
            <div className="max-w-2xl">
              <h2 className={`text-3xl md:text-4xl font-bold ${bannerStyles.text} mb-6 tracking-tight leading-tight`}>
                Your Professional <span className={`${bannerStyles.subtext}`}>Notion Portfolio</span> is Just One Click Away
              </h2>
              
              <p className={`${bannerStyles.subtext} mb-8 leading-relaxed`}>
                Connect your GitHub, describe your career goals, and let our AI engine build a high-quality portfolio directly in your Notion workspace.
              </p>

              <div className="flex flex-wrap gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className={`px-8 py-4 ${isPro || isPremium ? 'bg-gray-900 text-white hover:bg-black' : 'bg-white text-gray-950 hover:bg-white/90'} rounded-2xl font-bold flex items-center gap-3 transition-all shadow-2xl disabled:opacity-50`}
                >
                  {isGenerating ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Sparkles className="w-5 h-5" />
                  )}
                  {isGenerating ? "Generating..." : (isConnected ? "Generate Portfolio" : "Connect & Generate")}
                  <ArrowRight className="w-4 h-4 ml-1" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-8 py-4 ${bannerStyles.accent} backdrop-blur-md border ${bannerStyles.border} ${bannerStyles.text} rounded-2xl font-bold flex items-center gap-3 hover:opacity-80 transition-all`}
                >
                  <Play className="w-5 h-5" />
                  Watch Demo
                </motion.button>
              </div>
            </div>

            {/* Decorative Icon */}
            <div className="hidden lg:block">
              <div className={`w-48 h-48 ${bannerStyles.accent} rounded-[3rem] backdrop-blur-md border ${bannerStyles.border} flex items-center justify-center rotate-6 animate-pulse`} style={{ willChange: "transform, opacity" }}>
                <Sparkles className={`w-20 h-20 ${isPro || isPremium ? 'text-black/20' : 'text-white/40'}`} />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
