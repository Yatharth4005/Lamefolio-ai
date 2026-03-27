import { ModernHero } from "../components/modern-hero";
import { TemplateGallery } from "../components/template-gallery";
import { PortfolioList } from "../components/portfolio-list";
import { Sparkles, Layout, Globe, Play, MonitorPlay, MousePointer2, Loader2 } from "lucide-react";
import { useNavigate } from "react-router";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { useRef, useEffect, useState } from "react";

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

  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  // Fetch entire video as blob so it plays from memory without stalling
  useEffect(() => {
    let cancelled = false;

    const fetchVideo = async () => {
      try {
        const response = await fetch("/Lamefolio-demo.mp4");
        const reader = response.body?.getReader();
        const contentLength = +(response.headers.get("Content-Length") || 0);

        if (!reader) return;

        const chunks: Uint8Array[] = [];
        let received = 0;

        while (true) {
          const { done, value } = await reader.read();
          if (done || cancelled) break;
          chunks.push(value);
          received += value.length;
          if (contentLength > 0) {
            setLoadProgress(Math.round((received / contentLength) * 100));
          }
        }

        if (cancelled) return;

        const blob = new Blob(chunks as any[], { type: "video/mp4" });
        const url = URL.createObjectURL(blob);
        setBlobUrl(url);
      } catch (err) {
        console.error("Video preload failed:", err);
        // Fallback: use direct URL
        setBlobUrl("/Lamefolio-demo.mp4");
      }
    };

    fetchVideo();

    return () => {
      cancelled = true;
    };
  }, []);

  // Once blob URL is set and video element mounts, play it
  useEffect(() => {
    if (blobUrl && videoRef.current) {
      videoRef.current.load();
    }
  }, [blobUrl]);

  const handleCanPlayThrough = () => {
    setVideoReady(true);
    videoRef.current?.play().catch(() => {});
  };

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
              <div className="w-2.5 h-2.5 rounded-full bg-red-400/20" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400/20" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/20" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-16 bg-white/[0.05] rounded-full" />
              <div className="h-1.5 w-24 bg-white/[0.03] rounded-full" />
            </div>
            <div className="w-10" />
          </div>

          <div className="aspect-video w-full relative">
            {/* Loading Skeleton — shown while video is buffering */}
            <AnimatePresence>
              {!videoReady && (
                <motion.div
                  key="skeleton"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  className="absolute inset-0 z-20 bg-[#0A0A0B] flex flex-col items-center justify-center gap-6"
                >
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent animate-shimmer" />
                  </div>

                  <div className="relative flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <Loader2 className="w-7 h-7 text-primary animate-spin" />
                    </div>
                    <div className="text-center">
                      <p className="text-[11px] font-black uppercase tracking-[0.2em] text-foreground/40 mb-2">
                        Loading Demo
                      </p>
                      {/* Progress bar */}
                      <div className="w-48 h-1 bg-white/[0.05] rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full"
                          initial={{ width: "0%" }}
                          animate={{ width: `${loadProgress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                      <p className="text-[9px] font-bold text-foreground/20 mt-2 uppercase tracking-widest">
                        {loadProgress}% buffered
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* The actual video — plays from memory blob */}
            {blobUrl && (
              <video
                ref={videoRef}
                autoPlay={true}
                loop={true}
                muted={true}
                playsInline={true}
                preload="auto"
                onCanPlayThrough={handleCanPlayThrough}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.01]"
                src={blobUrl}
              />
            )}

            {/* Interactive Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8 z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center animate-pulse">
                  <Play className="w-4 h-4 text-white fill-white" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Live Demonstration — Portfolio Synthesis Engine</span>
              </div>
            </div>
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
