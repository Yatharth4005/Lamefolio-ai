import { ModernHero } from "../components/modern-hero";
import { TemplateGallery } from "../components/template-gallery";
import { PortfolioList } from "../components/portfolio-list";
import { Layout } from "lucide-react";
import { useNavigate } from "react-router";

export function DashboardPage() {
  const navigate = useNavigate();
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-8 py-8">
      {/* Greeting, integration status, and primary generate action */}
      <ModernHero />

      {/* Portfolio Blueprints: template picker for starting a new portfolio */}
      <div className="mb-20">
        <div className="flex items-end justify-between mb-8 border-b border-border pb-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground tracking-tight">
              Portfolio Blueprints
            </h2>
            <p className="text-sm text-foreground/40 mt-1">
              Start with a battle-tested template or build from scratch.
            </p>
          </div>

          <button
            onClick={() => navigate("/marketplace")}
            className="hidden md:flex items-center gap-2 text-sm font-medium text-foreground/40 hover:text-foreground transition-colors px-3 py-1.5 bg-secondary rounded-lg border border-border"
          >
            <Layout className="w-4 h-4" />
            View Marketplace
          </button>
        </div>
        <TemplateGallery />
      </div>

      {/* Portfolio Vault: previously generated portfolios for this user */}
      <div className="mb-20">
        <div className="flex items-end justify-between mb-8 border-b border-border pb-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground tracking-tight">
              Portfolio Vault
            </h2>
            <p className="text-sm text-foreground/40 mt-1">
              Historical portfolios generated through the Synthesizer.
            </p>
          </div>
        </div>
        <PortfolioList />
      </div>
    </div>
  );
}
