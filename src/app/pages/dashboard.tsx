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
