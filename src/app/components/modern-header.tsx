import { Bell, Sparkles, Check, ExternalLink, X, Settings, LogOut, User as UserIcon, Shield, Moon, Sun } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { CommandPalette } from "./command-palette";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import { useGitHub } from "../context/GitHubContext";

export function ModernHeader() {
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
    <header className="h-16 backdrop-blur-md border-b border-sidebar-border flex items-center justify-between px-6 sticky top-0 z-40 bg-sidebar"
    >
      {/* Search / Command Palette - Centered */}
      <div className="absolute left-1/2 -translate-x-1/2 w-full max-w-md hidden md:block">
        <CommandPalette />
      </div>

      {/* Spacer for mobile or to keep flex balance */}
      <div className="flex-1 md:hidden" />
      <div className="hidden md:block flex-1" />

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* AI Credits Badge - Hidden if GitHub is not connected */}
        {isConnected && (
          <motion.button 
            onClick={() => navigate("/settings/billing")}
            whileHover={{ scale: 1.05 }}
            className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-xl"
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-sidebar-foreground/90">
              {plan === "Free" ? `${points} / 3 Credits` : "Unlimited Credits"}
            </span>
          </motion.button>
        )}

        {/* Theme Toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2.5 text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent rounded-xl transition-all group"
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </motion.button>

        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent rounded-xl transition-all group"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-purple-500 rounded-full ring-2 ring-background">
                <span className="absolute inset-0 bg-purple-500 rounded-full animate-ping opacity-75" />
              </span>
            )}
          </motion.button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-80 bg-background-secondary border border-sidebar-border rounded-2xl shadow-2xl overflow-hidden z-[100]"
              >
                <div className="p-4 border-b border-sidebar-border/50 flex items-center justify-between">
                  <h3 className="text-sidebar-foreground font-semibold">Notifications</h3>
                  <button onClick={clearNotifications} className="text-[11px] text-purple-400 hover:text-purple-300 font-bold uppercase tracking-wider">Clear all</button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map(n => (
                      <div 
                        key={n.id} 
                        className={`p-4 border-b border-sidebar-border/20 hover:bg-sidebar-accent transition-colors group ${!n.read ? "bg-purple-500/5" : ""}`}
                        onClick={() => markNotificationRead(n.id)}
                      >
                        <div className="flex gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${n.type === 'success' ? "bg-green-500/10 text-green-400" : "bg-blue-500/10 text-blue-400"}`}>
                            {n.type === 'success' ? <Check className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-sidebar-foreground/90 leading-relaxed mb-1">{n.message}</p>
                            <div className="flex items-center gap-3">
                              <span className="text-[10px] text-sidebar-foreground/30">{new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              {n.actionUrl && (
                                <a 
                                  href={n.actionUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-[10px] text-purple-400 font-bold flex items-center gap-1 hover:underline"
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
