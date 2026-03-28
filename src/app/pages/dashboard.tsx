import { ModernHero } from "../components/modern-hero";
import { TemplateGallery } from "../components/template-gallery";
import { PortfolioList } from "../components/portfolio-list";
import { Sparkles, Layout, Globe, Play, MonitorPlay, MousePointer2 } from "lucide-react";
import { useNavigate } from "react-router";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";

export function DashboardPage() {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const scale = useTransform(scrollYProgress, [0, 0.4], [0.85, 1]);
  const borderRadius = useTransform(scrollYProgress, [0, 0.4], ["32px", "0px"]);
  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.4], [0, 1, 1]);
  const y = useTransform(scrollYProgress, [0, 0.4], [50, 0]);

  const [isPlaying, setIsPlaying] = useState(false);
  const youtubeId = "JdBnPsTmZpY";

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-8" ref={containerRef}>
      {/* Hero Section */}
      <ModernHero />

      {/* Featured Demo Video Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
        className="mb-32 mt-12 relative"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-purple-600/30 rounded-[2.5rem] blur-2xl opacity-20" />
        <div className="relative bg-black dark:bg-[#0A0A0B] border border-white/[0.08] rounded-[2rem] overflow-hidden shadow-2xl group">
          {/* Browser-like Toolbar */}
          <div className="h-10 border-b border-white/[0.05] flex items-center px-6 justify-between bg-white/[0.02]">
            <div className="flex gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/60" />
            </div>
            <div className="flex items-center gap-2 px-4 py-1 bg-white/[0.03] rounded-lg border border-white/[0.05]">
              <div className="w-3 h-3 rounded-full bg-emerald-500/30 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              </div>
              <span className="text-[10px] font-medium text-white/30 tracking-wide">lamefolio.ai/demo</span>
            </div>
            <div className="w-10" />
          </div>

          {/* YouTube Video Area */}
          <div className="aspect-video w-full relative">
            {!isPlaying ? (
              /* Thumbnail with Play Button overlay */
              <div
                className="absolute inset-0 cursor-pointer group/play"
                onClick={() => setIsPlaying(true)}
              >
                {/* YouTube thumbnail */}
                <img
                  src={`https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`}
                  alt="Lamefolio AI Demo"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                />

                {/* Dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30" />

                {/* Centered Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-20 h-20 bg-primary/90 backdrop-blur-xl rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(94,106,210,0.4)] border border-white/10 transition-all group-hover/play:shadow-[0_0_80px_rgba(94,106,210,0.6)]"
                  >
                    <Play className="w-8 h-8 text-white fill-white ml-1" />
                  </motion.button>
                </div>

                {/* Bottom info bar */}
                <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-1">Product Demo</p>
                    <h3 className="text-lg font-bold text-white tracking-tight">See Lamefolio AI in Action</h3>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-xl rounded-lg border border-white/10">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-[9px] font-bold text-white/70 uppercase tracking-widest">Watch Demo</span>
                  </div>
                </div>
              </div>
            ) : (
              /* Actual YouTube Embed */
              <iframe
                src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1&showinfo=0&controls=0&iv_load_policy=3&loop=1&playlist=${youtubeId}`}
                title="Lamefolio AI Demo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-0"
              />
            )}
          </div>
        </div>

        {/* Floating decoration icons */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute -right-8 -top-8 w-20 h-20 bg-secondary border border-border rounded-2xl hidden lg:flex items-center justify-center shadow-xl rotate-12"
        >
          <MonitorPlay className="w-8 h-8 text-primary opacity-40" />
        </motion.div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute -left-6 bottom-12 w-16 h-16 bg-secondary border border-border rounded-2xl hidden lg:flex items-center justify-center shadow-xl -rotate-12"
        >
          <MousePointer2 className="w-6 h-6 text-primary opacity-40" />
        </motion.div>
      </motion.div>



      {/* Portfolio Templates Section */}
      <div className="mb-32">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight flex items-center gap-4">
              Blueprints
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-primary rounded-full shadow-[0_0_10px_var(--primary)]" />
                <Sparkles className="w-6 h-6 text-primary animate-pulse" />
              </div>
            </h2>
            <p className="text-base text-foreground/40 mt-4 font-semibold leading-relaxed">
              Explore our curation of elite blueprints—engineered for modern tech leaders, designers, and innovators.
            </p>
          </div>

          <button
            onClick={() => navigate("/marketplace")}
            className="flex items-center gap-2.5 text-[12px] font-bold text-foreground/50 hover:text-foreground transition-all px-6 py-3 bg-white dark:bg-white/[0.03] rounded-xl border border-black/[0.08] dark:border-white/[0.08] shadow-sm"
          >
            <Layout className="w-4 h-4" />
            <span className="uppercase tracking-widest py-0.5">Explore Marketplace</span>
          </button>
        </div>
        <TemplateGallery />
      </div>

      {/* Portfolio Vault (Recently Generated) */}
      <div className="mb-32">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight flex items-center gap-4">
              The Vault
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-foreground/10 rounded-full" />
                <Globe className="w-6 h-6 text-foreground/20" />
              </div>
            </h2>
            <p className="text-base text-foreground/40 mt-4 font-semibold leading-relaxed">
              Your personal library of historical portfolios—synthesized, stored, and ready for deployment.
            </p>
          </div>
        </div>
        <PortfolioList />
      </div>
    </div>
  );
}
