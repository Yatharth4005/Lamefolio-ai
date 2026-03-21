import { ModernHero } from "../components/modern-hero";
import { ModernAIChat } from "../components/modern-ai-chat";
import { ModernPortfolioSections } from "../components/modern-portfolio-sections";
import { ModernGitHubSync } from "../components/modern-github-sync";
import { ModernStats } from "../components/modern-stats";

export function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-8 py-8">
      {/* Hero Section */}
      <ModernHero />

      {/* Two Column Layout - Asymmetric */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Left Column - AI Chat (wider) */}
        <div className="lg:col-span-2">
          <ModernAIChat />
        </div>

        {/* Right Column - GitHub Sync */}
        <div className="lg:col-span-1">
          <ModernGitHubSync />
        </div>
      </div>

      {/* Portfolio Sections */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Portfolio Sections
            </h2>
            <p className="text-sm text-white/50 mt-1">
              Manage your content sections
            </p>
          </div>
          <button className="text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors">
            View All →
          </button>
        </div>
        <ModernPortfolioSections />
      </div>

      {/* Stats Grid */}
      <div className="mb-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white tracking-tight">
            Analytics Overview
          </h2>
          <p className="text-sm text-white/50 mt-1">
            Track your portfolio performance
          </p>
        </div>
        <ModernStats />
      </div>
    </div>
  );
}
