import { LayoutDashboard, Wand2, GitBranch, Settings, ChevronLeft, ChevronRight } from "lucide-react";
import { Link, useLocation } from "react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: Wand2, label: "Portfolio Builder", path: "/portfolio-builder" },
  { icon: GitBranch, label: "Integrations", path: "/integrations" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export function ModernSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 240 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="h-screen relative backdrop-blur-md border-r border-white/[0.08] flex flex-col"
      style={{
        background: "rgba(19, 19, 26, 0.6)",
      }}
    >
      {/* Logo */}
      <div className="p-6 border-b border-white/[0.08]">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
            <Wand2 className="w-5 h-5 text-white relative z-10" />
          </div>
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="font-semibold text-lg bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent tracking-tight"
              >
                PortfolioAI
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.label}>
                <Link
                  to={item.path}
                  className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    isActive
                      ? "text-white"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl border border-purple-500/30"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <div className={`relative z-10 ${isActive ? "text-purple-400" : ""}`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <AnimatePresence mode="wait">
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                        className="text-sm font-medium relative z-10"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  
                  {/* Glow effect on hover */}
                  {!isActive && (
                    <div className="absolute inset-0 bg-white/[0.03] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-white/[0.08]">
        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/[0.03] cursor-pointer transition-colors ${collapsed ? "justify-center" : ""}`}>
          <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center relative group flex-shrink-0">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
            <span className="text-white text-sm font-medium relative z-10">JD</span>
          </div>
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="flex-1 min-w-0"
              >
                <p className="text-sm font-medium text-white truncate">John Doe</p>
                <p className="text-xs text-white/40 truncate">Pro Plan</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Collapse Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-6 w-6 h-6 bg-[#13131a] border border-white/[0.08] rounded-full flex items-center justify-center hover:bg-white/[0.05] transition-colors z-20"
      >
        {collapsed ? (
          <ChevronRight className="w-3 h-3 text-white/60" />
        ) : (
          <ChevronLeft className="w-3 h-3 text-white/60" />
        )}
      </button>
    </motion.aside>
  );
}
