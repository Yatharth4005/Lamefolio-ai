import { Bell, Sparkles } from "lucide-react";
import { CommandPalette } from "./command-palette";
import { motion } from "motion/react";

export function ModernHeader() {
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
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative p-2.5 text-white/60 hover:text-white hover:bg-white/[0.05] rounded-xl transition-all group"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-purple-500 rounded-full ring-2 ring-[#13131a]">
            <span className="absolute inset-0 bg-purple-500 rounded-full animate-ping opacity-75" />
          </span>
        </motion.button>

        {/* User Avatar */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-9 h-9 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center cursor-pointer relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
          <span className="text-white text-sm font-medium relative z-10">JD</span>
        </motion.div>
      </div>
    </header>
  );
}
