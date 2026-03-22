import { Sparkles } from "lucide-react";
import { useGitHub } from "../context/GitHubContext";

export function DashboardHero() {
  const { displayName, githubHandle } = useGitHub();
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-semibold text-gray-900 mb-2">
        Welcome back, {displayName || githubHandle || "Creator"} 👋
      </h1>
      <p className="text-gray-600">
        Let's build an amazing portfolio that showcases your skills and achievements.
      </p>

      {/* CTA Card */}
      <div className="mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5" />
              <span className="text-sm font-medium opacity-90">AI-Powered</span>
            </div>
            <h2 className="text-xl font-semibold mb-2">
              Generate Your Portfolio in Minutes
            </h2>
            <p className="text-indigo-100 text-sm mb-6 max-w-lg">
              Our AI assistant analyzes your experience and automatically creates a stunning portfolio optimized for your career goals.
            </p>
            <button className="px-6 py-3 bg-white text-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition-colors shadow-lg">
              Generate Portfolio
            </button>
          </div>
          <div className="hidden lg:block w-32 h-32 bg-white/10 rounded-lg backdrop-blur-sm"></div>
        </div>
      </div>
    </div>
  );
}
