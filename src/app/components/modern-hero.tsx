import { ArrowRight, Loader2, CheckCircle2, Circle } from "lucide-react";
import { motion } from "motion/react";
import { useGitHub } from "../context/GitHubContext";
import { toast } from "sonner";
import { useNavigate } from "react-router";

export function ModernHero() {
  const navigate = useNavigate();
  const { githubHandle, isGenerating, isConnected, isNotionConnected, displayName } = useGitHub();

  const handleGenerate = () => {
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
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-12 pt-2"
    >
      {/* Greeting and subtitle */}
      <div className="mb-6">
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl font-semibold text-foreground mb-2 tracking-tight"
        >
          {isConnected
            ? `Welcome back, ${displayName || githubHandle}`
            : "Welcome to lamefolio.ai"}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-base text-foreground/50 max-w-xl"
        >
          Build and publish a professional Notion portfolio powered by your GitHub activity.
        </motion.p>
      </div>

      {/* Integration status indicators and primary action */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
      >
        {/* Shows whether GitHub and Notion are connected */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5">
            {isConnected ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            ) : (
              <Circle className="w-4 h-4 text-foreground/20" />
            )}
            <span className={isConnected ? "text-foreground/70" : "text-foreground/30"}>
              GitHub
            </span>
          </div>

          <div className="w-px h-4 bg-border" />

          <div className="flex items-center gap-1.5">
            {isNotionConnected ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            ) : (
              <Circle className="w-4 h-4 text-foreground/20" />
            )}
            <span className={isNotionConnected ? "text-foreground/70" : "text-foreground/30"}>
              Notion
            </span>
          </div>
        </div>

        {/* Single primary action: navigates to the portfolio builder */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleGenerate}
          disabled={isGenerating}
          className="flex items-center gap-2 px-5 py-2.5 bg-foreground text-background rounded-xl text-sm font-medium hover:bg-foreground/90 transition-colors disabled:opacity-50"
        >
          {isGenerating && <Loader2 className="w-4 h-4 animate-spin" />}
          {isGenerating ? "Generating..." : isConnected ? "Generate Portfolio" : "Get Started"}
          {!isGenerating && <ArrowRight className="w-4 h-4" />}
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
