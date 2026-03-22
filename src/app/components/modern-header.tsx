import { Bell, Sparkles, Check, ExternalLink, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { CommandPalette } from "./command-palette";
import { motion, AnimatePresence } from "motion/react";
import { useGitHub } from "../context/GitHubContext";

export function ModernHeader() {
  const { user, isConnected, displayName, notifications, markNotificationRead, clearNotifications } = useGitHub();
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
    <header className="h-16 backdrop-blur-md border-b border-white/[0.08] flex items-center justify-between px-6 sticky top-0 z-40"
      style={{ background: "rgba(19, 19, 26, 0.6)" }}
    >
      {/* Search / Command Palette */}
      <div className="flex-1 max-w-xl">
        <CommandPalette />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* AI Credits Badge */}
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-xl">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span className="text-sm font-medium text-white/90">10 Credits</span>
        </div>

        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 text-white/60 hover:text-white hover:bg-white/[0.05] rounded-xl transition-all group"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-purple-500 rounded-full ring-2 ring-[#13131a]">
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
                className="absolute right-0 mt-2 w-80 bg-[#1a1a24] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden z-[100]"
              >
                <div className="p-4 border-b border-white/[0.04] flex items-center justify-between">
                  <h3 className="text-white font-semibold">Notifications</h3>
                  <button onClick={clearNotifications} className="text-[11px] text-purple-400 hover:text-purple-300 font-bold uppercase tracking-wider">Clear all</button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map(n => (
                      <div 
                        key={n.id} 
                        className={`p-4 border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors group ${!n.read ? "bg-purple-500/5" : ""}`}
                        onClick={() => markNotificationRead(n.id)}
                      >
                        <div className="flex gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${n.type === 'success' ? "bg-green-500/10 text-green-400" : "bg-blue-500/10 text-blue-400"}`}>
                            {n.type === 'success' ? <Check className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-white/90 leading-relaxed mb-1">{n.message}</p>
                            <div className="flex items-center gap-3">
                              <span className="text-[10px] text-white/30">{new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
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
                      <div className="w-12 h-12 bg-white/[0.02] rounded-full flex items-center justify-center mx-auto mb-3">
                        <Bell className="w-5 h-5 text-white/20" />
                      </div>
                      <p className="text-sm text-white/40">No new notifications</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-9 h-9 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center cursor-pointer relative group"
        >
          {isConnected && user?.avatar ? (
            <img src={user.avatar} className="w-full h-full rounded-full object-cover relative z-10" alt="avatar" />
          ) : (
            <span className="text-white text-sm font-medium relative z-10">
              {displayName ? displayName.substring(0, 1).toUpperCase() : (isConnected && user ? user.username.substring(0, 1).toUpperCase() : "U")}
            </span>
          )}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
        </motion.div>
      </div>
    </header>
  );
}
