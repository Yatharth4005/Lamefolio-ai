import { ModernHero } from "../components/modern-hero";
import { PortfolioList } from "../components/portfolio-list";
import { ModernGitHubSync } from "../components/modern-github-sync";
import { ModernStats } from "../components/modern-stats";

export function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-8 py-8">
      {/* Hero Section */}
      <ModernHero />

      {/* Main Dashboard Interaction Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-16">
        {/* Right: Detailed Performance */}
        <div className="lg:col-span-12">
           <div className="mb-8 p-12 bg-gradient-to-br from-white/[0.03] to-transparent border border-white/[0.05] rounded-[3rem] shadow-2xl overflow-hidden relative group">
              <div 
                className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-500/10 blur-[80px] rounded-full -mr-40 -mt-40 transition-opacity opacity-50 group-hover:opacity-100" 
                style={{ willChange: "opacity" }}
              />
              <div className="relative z-10">
                <div className="mb-10 text-center lg:text-left">
                  <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-4 justify-center lg:justify-start">
                    Performance Snapshot
                    <div 
                      className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-[10px] uppercase font-black text-green-400 animate-pulse"
                      style={{ willChange: "opacity" }}
                    >
                      Live
                    </div>
                  </h2>
                  <p className="text-white/40 text-lg mt-3 max-w-xl">
                    Real-time synchronization metrics across your entire Notion ecosystem.
                  </p>
                </div>
                <ModernStats />
              </div>
           </div>
        </div>
      </div>

      {/* Project Status Overview */}
      <div className="mb-20">
        <div className="flex items-end justify-between mb-12 border-b border-white/[0.05] pb-8">
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-4">
               Portfolio Vault
               <div className="w-2 h-2 bg-purple-500 rounded-full" />
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
