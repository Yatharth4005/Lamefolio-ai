import { Bell, Sparkles, Check, ExternalLink, X, Settings, LogOut, User as UserIcon, Shield, Moon, Sun, Menu, Search } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { CommandPalette } from "./command-palette";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import { useGitHub } from "../context/GitHubContext";

interface ModernHeaderProps {
  onMenuClick?: () => void;
}

export function ModernHeader({ onMenuClick }: ModernHeaderProps) {
  const { user, isConnected, isNotionConnected, displayName, notifications, markNotificationRead, clearNotifications, setDisplayName, generationCount, points, plan, signOut, theme, setTheme } = useGitHub();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  return (
    <header className="h-16 backdrop-blur-md border-b border-sidebar-border flex items-center gap-4 px-4 md:px-6 sticky top-0 z-40 bg-sidebar">
      {/* Mobile Menu Toggle */}
      <div className="flex-shrink-0 min-w-[40px]">
        <button 
          onClick={onMenuClick}
          className="p-2 lg:hidden text-sidebar-foreground/60 hover:text-sidebar-foreground transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Search / Command Palette - Centered */}
      <div className="flex-1 flex justify-center pointer-events-auto min-w-0">
        <div className="w-full max-w-[200px] sm:max-w-md">
          <CommandPalette />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-1 md:gap-3">
        {/* AI Credits Badge */}
        {isConnected && (
          <div className="flex items-center gap-2">
            {plan && plan !== "Free" && (
              <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.15em] border ${
                plan.toLowerCase() === 'premium' 
                  ? "bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-[0_0_15px_-5px_rgba(245,158,11,0.3)]" 
                  : "bg-primary/10 text-primary border-primary/20 shadow-[0_0_15px_-5px_rgba(94,106,210,0.3)]"
              }`}>
                {plan}
              </div>
            )}
            <motion.button 
              onClick={() => navigate("/settings/billing")}
              whileHover={{ scale: 1.02 }}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-black/[0.03] dark:bg-white/[0.03] border border-black/[0.08] dark:border-white/[0.08] rounded-lg hover:bg-black/[0.05] dark:hover:bg-white/[0.06] transition-colors shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-[11px] font-bold text-foreground/70 uppercase tracking-widest">
                {plan === "Free" ? `${points} / 3` : "Unlimited"}
              </span>
            </motion.button>
          </div>
        )}

        {/* Theme Toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 text-foreground/40 hover:text-foreground transition-all"
        >
          {theme === "dark" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </motion.button>

        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-foreground/40 hover:text-foreground transition-all relative"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-primary rounded-full ring-2 ring-background" />
            )}
          </motion.button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-80 bg-white dark:bg-background-secondary border border-black/[0.1] dark:border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden z-[100]"
              >
                <div className="p-4 border-b border-black/[0.05] dark:border-white/[0.05] flex items-center justify-between">
                  <h3 className="text-foreground font-semibold">Notifications</h3>
                  <button onClick={clearNotifications} className="text-[11px] text-primary hover:text-primary/80 font-bold uppercase tracking-wider">Clear all</button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map(n => (
                      <div 
                        key={n.id} 
                        className={`p-4 border-b border-black/[0.04] dark:border-white/[0.04] hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors group ${!n.read ? "bg-primary/5" : ""}`}
                        onClick={() => markNotificationRead(n.id)}
                      >
                        <div className="flex gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${n.type === 'success' ? "bg-green-500/10 text-green-400" : "bg-blue-500/10 text-blue-400"}`}>
                            {n.type === 'success' ? <Check className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-foreground/90 leading-relaxed mb-1">{n.message}</p>
                            <div className="flex items-center gap-3">
                              <span className="text-[10px] text-foreground/30">{new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              {n.actionUrl && (
                                <a 
                                  href={n.actionUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-[10px] text-primary font-bold flex items-center gap-1 hover:underline"
                                  onClick={(e) => { e.stopPropagation(); markNotificationRead(n.id); }}
                                >
                                  Open Portfolio <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center">
                      <div className="w-12 h-12 bg-sidebar-accent rounded-full flex items-center justify-center mx-auto mb-3">
                        <Bell className="w-5 h-5 text-sidebar-foreground/20" />
                      </div>
                      <p className="text-sm text-sidebar-foreground/40">No new notifications</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </header>

  );
}
