import { Sparkles, ArrowRight, Play, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useGitHub } from "../context/GitHubContext";
import { toast } from "sonner";
import { useNavigate } from "react-router";

export function ModernHero() {
  const navigate = useNavigate();
  const { githubHandle, isGenerating, isConnected, displayName } = useGitHub();

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
          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full mb-4"
        >
          <div className="relative">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="absolute inset-0 animate-ping">
              <Sparkles className="w-4 h-4 text-purple-400 opacity-75" />
            </span>
          </div>
          <span className="text-sm font-medium text-purple-400 uppercase tracking-widest bg-purple-500/5 px-2 py-0.5 rounded-lg border border-purple-500/20">Powered by Gemini</span>
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight"
        >
          {isConnected ? "Welcome back, " : "Ready to build, "}
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            {displayName || githubHandle || "Creator"}
          </span>{" "}
          👋
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-lg text-white/60 max-w-2xl mb-8"
        >
          Let's build an amazing portfolio that showcases your skills and achievements.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="relative group overflow-hidden rounded-[2.5rem]"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/90 via-pink-600/90 to-blue-600/90" />
        {/* Animated accent line */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        
        <div className="relative p-8 md:p-12">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight leading-tight">
                Your Professional <span className="text-white/80">Notion Portfolio</span> is Just One Click Away
              </h2>
              
              <p className="text-white/80 mb-8 leading-relaxed">
                Connect your GitHub, describe your career goals, and let our AI engine build a high-quality portfolio directly in your Notion workspace.
              </p>

              <div className="flex flex-wrap gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="px-8 py-4 bg-white text-gray-950 rounded-2xl font-bold flex items-center gap-3 hover:bg-white/90 transition-all shadow-2xl shadow-white/10 disabled:opacity-50"
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
                  className="px-8 py-4 bg-black/20 backdrop-blur-md border border-white/20 text-white rounded-2xl font-bold flex items-center gap-3 hover:bg-black/30 transition-all"
                >
                  <Play className="w-5 h-5" />
                  Watch Demo
                </motion.button>
              </div>
            </div>

            {/* Decorative Icon */}
            <div className="hidden lg:block">
              <div className="w-48 h-48 bg-white/10 rounded-[3rem] backdrop-blur-md border border-white/20 flex items-center justify-center rotate-6 animate-pulse" style={{ willChange: "transform, opacity" }}>
                <Sparkles className="w-20 h-20 text-white/40" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
