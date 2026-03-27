import { LayoutDashboard, Wand2, GitBranch, Settings, ChevronLeft, ChevronRight, Layout, User as UserIcon, LogOut, X } from "lucide-react";
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

interface ModernSidebarProps {
  onClose?: () => void;
}

export function ModernSidebar({ onClose }: ModernSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isConnected, displayName, plan, signOut } = useGitHub();

  // Reset collapse on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setCollapsed(false);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const handleNavItemClick = () => {
    if (window.innerWidth < 1024 && onClose) {
      onClose();
    }
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 240 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="h-screen relative backdrop-blur-md border-r border-sidebar-border flex flex-col z-50 shadow-[20px_0_50px_rgba(0,0,0,0.1)] bg-sidebar"
    >
      {/* Search / Close Header for Mobile */}
      <div className="lg:hidden absolute top-4 right-4 z-[60]">
        <button 
          onClick={onClose}
          className="p-2 bg-sidebar-accent rounded-xl text-sidebar-foreground/60 hover:text-sidebar-foreground transition-all"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Logo */}
      <div className={`h-16 flex items-center ${collapsed ? "justify-center" : "px-6"}`}>
        <Link to="/" className="flex items-center gap-3" onClick={handleNavItemClick}>
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center relative shadow-[0_0_20px_rgba(94,106,210,0.3)]">
            <Wand2 className="w-4 h-4 text-white" />
          </div>
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="font-bold text-sm tracking-tight text-foreground"
              >
                lamefolio.ai
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.label}>
                <Link
                  to={item.path}
                  onClick={handleNavItemClick}
                  className={`relative flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? "text-foreground bg-white/[0.03] shadow-inner"
                      : "text-sidebar-foreground/50 hover:text-foreground hover:bg-white/[0.02]"
                  }`}
                >
                  <div className={`relative z-10 w-5 h-5 flex items-center justify-center ${isActive ? "text-primary" : ""}`}>
                    <item.icon className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <AnimatePresence mode="wait">
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                        className="text-[13px] font-medium tracking-tight relative z-10"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active-indicator"
                      className="absolute left-0 w-0.5 h-4 bg-primary rounded-full shadow-[0_0_10px_rgba(94,106,210,1)]"
                    />
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
                      onClick={() => { setShowProfile(false); navigate("/settings/profile"); handleNavItemClick(); }}
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
              className={`flex items-center gap-3.5 px-4 py-3.5 rounded-[1.25rem] bg-black/[0.03] dark:bg-white/[0.03] border border-black/[0.05] dark:border-white/[0.08] hover:border-primary/40 hover:bg-black/[0.05] dark:hover:bg-white/[0.05] cursor-pointer transition-all shadow-sm ${collapsed ? "justify-center" : ""}`}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center relative group flex-shrink-0">
                {isConnected && user?.avatar ? (
                  <img src={user.avatar} className="w-full h-full rounded-full object-cover relative z-20" alt="avatar" />
                ) : (
                  <span className="text-white text-sm font-bold relative z-20">
                    {(displayName || user?.username || "C").substring(0, 1).toUpperCase()}
                  </span>
                )}
                {/* Enhanced Bloom Effect */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-primary/40 to-transparent blur-md z-10" />
                <div className="absolute -inset-[3px] bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-full opacity-60 blur-md group-hover:opacity-100 transition-opacity" />
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
                    <p className="text-[13.5px] font-bold text-foreground leading-none mb-1.5 truncate pr-2">{displayName || user?.username}</p>
                    <div className="flex items-center gap-1.5">
                       <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(94,106,210,0.6)]" />
                       <p className="text-[10px] text-foreground/40 font-black uppercase tracking-widest">{plan} Plan</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </>
        ) : (
          <button 
            onClick={() => { navigate("/integrations"); handleNavItemClick(); }}
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

      {/* Collapse Button - Desktop Only */}
      {typeof window !== 'undefined' && window.innerWidth >= 1024 && (
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-4.5 top-[18px] w-7 h-7 bg-background-secondary border border-sidebar-border rounded-full hidden lg:flex items-center justify-center hover:bg-purple-500/10 hover:border-purple-500/30 transition-all z-50 group/collapse shadow-xl"
        >
          {collapsed ? (
            <ChevronRight className="w-3.5 h-3.5 text-sidebar-foreground/40 group-hover/collapse:text-purple-400 transition-colors" />
          ) : (
            <ChevronLeft className="w-3.5 h-3.5 text-sidebar-foreground/40 group-hover/collapse:text-purple-400 transition-colors" />
          )}
        </button>
      )}
    </motion.aside>
  );
}
