import { ModernHero } from "../components/modern-hero";
import { TemplateGallery } from "../components/template-gallery";
import { PortfolioList } from "../components/portfolio-list";
import { Sparkles, Layout, Globe } from "lucide-react";

export function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-8 py-8">
      {/* Hero Section */}
      <ModernHero />

      {/* Portfolio Templates Section */}
      <div className="mb-20">
        <div className="flex items-end justify-between mb-12 border-b border-white/[0.05] pb-8">
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-4">
               Portfolio Blueprints
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 bg-purple-500 rounded-full" />
                 <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
               </div>
            </h2>
            <p className="text-lg text-white/40 mt-3 font-medium">
              Start with a battle-tested template or build from scratch.
            </p>
          </div>
          
          <button className="hidden md:flex items-center gap-2 text-sm font-bold text-white/40 hover:text-white transition-colors px-4 py-2 bg-white/[0.03] rounded-xl border border-white/[0.05]">
            <Layout className="w-4 h-4" />
            View Marketplace
          </button>
        </div>
        <TemplateGallery />
      </div>

      {/* Portfolio Vault (Recently Generated) */}
      <div className="mb-20">
        <div className="flex items-end justify-between mb-12 border-b border-white/[0.05] pb-8">
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-4">
               Portfolio Vault
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 bg-purple-500 rounded-full opacity-50" />
                 <Globe className="w-5 h-5 text-white/20" />
               </div>
            </h2>
            <p className="text-lg text-white/40 mt-3 font-medium">
              Historical manifests generated through the Synthesizer.
            </p>
          </div>
        </div>
        <PortfolioList />
      </div>
    </div>
  );
}
