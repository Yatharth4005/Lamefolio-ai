import { Github, RefreshCw, CheckCircle2 } from "lucide-react";

export function GitHubSync() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
            <Github className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">GitHub Integration</h3>
            <p className="text-sm text-gray-500 mt-1">
              Sync your repositories and contributions
            </p>
          </div>
        </div>
        <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
          <RefreshCw className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {/* Sync Status */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between py-3 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <span className="text-sm text-gray-700">Repositories synced</span>
          </div>
          <span className="text-sm font-medium text-gray-900">24</span>
        </div>
        <div className="flex items-center justify-between py-3 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <span className="text-sm text-gray-700">Contributions</span>
          </div>
          <span className="text-sm font-medium text-gray-900">1,247</span>
        </div>
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <span className="text-sm text-gray-700">Last synced</span>
          </div>
          <span className="text-sm font-medium text-gray-900">2 min ago</span>
        </div>
      </div>

      <button className="w-full py-2.5 px-4 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium">
        Configure GitHub
      </button>
    </div>
  );
}
