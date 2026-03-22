import { ModernHero } from "../components/modern-hero";
import { ModernPortfolioSections } from "../components/modern-portfolio-sections";
import { ModernGitHubSync } from "../components/modern-github-sync";
import { ModernStats } from "../components/modern-stats";

export function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-8 py-8">
      {/* Hero Section */}
      <ModernHero />

      {/* Main Dashboard Interaction Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
        {/* Left: Quick Actions & Navigation */}
        <div className="lg:col-span-4 flex flex-col gap-6">
           {/* We can put a placeholder or nothing here for now */}
        </div>

        {/* Right: Detailed Performance */}
        <div className="lg:col-span-8">
           <div className="mb-6">
            <h2 className="text-xl font-bold text-white tracking-tight">
              Performance Snapshot
            </h2>
            <p className="text-sm text-white/50 mt-1">
              Real-time analytics for your Notion portfolios
            </p>
          </div>
          <ModernStats />
        </div>
      </div>

      {/* Project Status Overview */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Portfolio Assets
            </h2>
            <p className="text-sm text-white/50 mt-1">
              Active projects and content sections
            </p>
          </div>
          <button className="text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors">
            Manage All →
          </button>
        </div>
        <ModernPortfolioSections />
      </div>
    </div>
  );
}
