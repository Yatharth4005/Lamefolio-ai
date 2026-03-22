import { LayoutDashboard, Wand2, GitBranch, Settings } from "lucide-react";
import { Link, useLocation } from "react-router";
import { useGitHub } from "../context/GitHubContext";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: Wand2, label: "Portfolio Builder", path: "/portfolio-builder" },
  { icon: GitBranch, label: "GitHub Sync", path: "/github-sync" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export function SidebarNav() {
  const location = useLocation();
  const { user, isConnected, displayName, plan } = useGitHub();

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Wand2 className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold text-lg">PortfolioAI</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.label}>
                <Link
                  to={item.path}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 cursor-pointer">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
            {isConnected && user?.avatar ? (
              <img src={user.avatar} className="w-full h-full rounded-full object-cover" alt="avatar" />
            ) : (
              <span className="text-white text-sm font-medium">
                {(displayName || user?.username || "C").substring(0, 1).toUpperCase()}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{displayName || user?.username || "Creator"}</p>
            <p className="text-xs text-gray-500 truncate">{plan} Plan</p>
          </div>
        </div>
      </div>
    </aside>
  );
}