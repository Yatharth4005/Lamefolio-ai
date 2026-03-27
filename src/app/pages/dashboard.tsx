import { ModernHero } from "../components/modern-hero";
import { TemplateGallery } from "../components/template-gallery";
import { PortfolioList } from "../components/portfolio-list";
import { Sparkles, Layout, Globe, Play } from "lucide-react";
import { useNavigate } from "react-router";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

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

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-8" ref={containerRef}>
      {/* Hero Section */}
      <ModernHero />

      {/* Cinematic Expanding Video Section */}
      <div className="relative mb-32 h-[80vh] flex items-center justify-center">
        <motion.div 
          style={{ 
            scale, 
            borderRadius,
            opacity,
            y
          }}
          className="relative w-full h-full overflow-hidden border border-white/[0.08] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] bg-black"
        >
          {/* Subtle Video Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 z-10" />
          
          <video 
            autoPlay 
            muted 
            loop 
            playsInline
            className="w-full h-full object-cover opacity-80"
          >
            <source src="https://assets.mixkit.co/videos/preview/mixkit-abstract-fast-and-bright-colored-shapes-28498-large.mp4" type="video/mp4" />
          </video>

          {/* Video Content Label */}
          <div className="absolute bottom-12 left-12 z-20">
            <div className="flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
               <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/90">Preview Mode</span>
            </div>
            <h3 className="text-3xl font-bold text-white mt-4 tracking-tight">The Future of Portfolios</h3>
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center z-20 cursor-pointer pointer-events-none"
          >
             <div className="w-20 h-20 rounded-full bg-white/10 border border-white/20 backdrop-blur-xl flex items-center justify-center">
                <Play className="w-8 h-8 text-white fill-current" />
             </div>
          </motion.div>
        </motion.div>
      </div>

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
