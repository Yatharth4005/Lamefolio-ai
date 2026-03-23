import { LayoutDashboard, Wand2, GitBranch, Settings, ChevronLeft, ChevronRight, Layout, User as UserIcon, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useGitHub } from "../context/GitHubContext";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: Wand2, label: "Portfolio Builder", path: "/portfolio-builder" },
  { icon: Layout, label: "Marketplace", path: "/marketplace" },
  { icon: GitBranch, label: "Integrations", path: "/integrations" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export function ModernSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isConnected, displayName, plan, signOut } = useGitHub();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = () => {
    signOut();
    setShowProfile(false);
    navigate("/");
    window.location.reload();
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 240 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="h-screen relative backdrop-blur-md border-r border-sidebar-border flex flex-col z-50 shadow-[20px_0_50px_rgba(0,0,0,0.1)] bg-sidebar"
    >
      {/* Logo */}
      <div className={`h-16 flex items-center border-b border-sidebar-border ${collapsed ? "justify-center" : "px-6"}`}>
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
                lamefolio.ai
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
                      ? "text-sidebar-foreground"
                      : "text-sidebar-foreground/60 hover:text-sidebar-foreground"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl border border-purple-500/30"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <div className={`relative z-10 w-9 h-9 flex items-center justify-center ${isActive ? "text-purple-400" : ""}`}>
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
                    <div className="absolute inset-0 bg-sidebar-accent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile / Connect CTA */}
      <div className="p-4 border-t border-sidebar-border relative" ref={profileRef}>
        {(displayName || (isConnected && user)) ? (
          <>
            <AnimatePresence>
              {showProfile && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className={`absolute left-4 ${collapsed ? "w-48" : "w-[calc(100%-2rem)]"} bottom-20 bg-background-secondary border border-sidebar-border rounded-2xl shadow-2xl overflow-hidden z-[100]`}
                >
                  <div className="p-4 border-b border-sidebar-border/50">
                    <p className="text-xs text-sidebar-foreground/40 uppercase font-black tracking-widest mb-1">Account</p>
                    <p className="text-sm font-bold text-sidebar-foreground truncate">{displayName || (user?.username ?? "Creator")}</p>
                  </div>
                  
                  <div className="p-2">
                    <button 
                      onClick={() => { setShowProfile(false); navigate("/settings/profile"); }}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent rounded-xl transition-all group"
                    >
                      <UserIcon className="w-4 h-4 text-sidebar-foreground/40 group-hover:text-purple-400" />
                      Profile Settings
                    </button>
                  </div>

                  <div className="p-2 border-t border-sidebar-border/50">
                    <button 
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div 
              onClick={() => setShowProfile(!showProfile)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-sidebar-accent cursor-pointer transition-colors ${collapsed ? "justify-center" : ""}`}
            >
              <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center relative group flex-shrink-0">
                {isConnected && user?.avatar ? (
                  <img src={user.avatar} className="w-full h-full rounded-full object-cover relative z-10" alt="avatar" />
                ) : (
                  <span className="text-white text-sm font-medium relative z-10">
                    {(displayName || user?.username || "C").substring(0, 1).toUpperCase()}
                  </span>
                )}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
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
                    <p className="text-sm font-medium text-sidebar-foreground truncate">{displayName || user?.username}</p>
                    <p className="text-xs text-sidebar-foreground/40 truncate">{plan} Plan</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </>
        ) : (
          <button 
            onClick={() => navigate("/integrations")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 hover:border-purple-500/40 transition-all group w-full ${collapsed ? "justify-center" : ""}`}
          >
            <div className="w-9 h-9 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <GitBranch className="w-4 h-4 text-purple-400" />
            </div>
            {!collapsed && (
              <div className="text-left overflow-hidden">
                <p className="text-[11px] font-black uppercase tracking-widest text-sidebar-foreground/90">Connect GitHub</p>
                <p className="text-[10px] text-sidebar-foreground/40 truncate">Sync projects now</p>
              </div>
            )}
          </button>
        )}
      </div>

      {/* Collapse Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-4.5 top-[18px] w-7 h-7 bg-background-secondary border border-sidebar-border rounded-full flex items-center justify-center hover:bg-purple-500/10 hover:border-purple-500/30 transition-all z-50 group/collapse shadow-xl"
      >
        {collapsed ? (
          <ChevronRight className="w-3.5 h-3.5 text-sidebar-foreground/40 group-hover/collapse:text-purple-400 transition-colors" />
        ) : (
          <ChevronLeft className="w-3.5 h-3.5 text-sidebar-foreground/40 group-hover/collapse:text-purple-400 transition-colors" />
        )}
      </button>
    </motion.aside>
  );
}
