import { Search, Command } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.05] transition-all duration-200 group w-full max-w-md"
      >
        <Search className="w-4 h-4 text-white/40 group-hover:text-white/60 transition-colors" />
        <span className="text-sm text-white/40 group-hover:text-white/60 transition-colors flex-1 text-left">
          Search anything...
        </span>
        <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 text-xs text-white/40 bg-white/[0.03] border border-white/[0.08] rounded-md font-mono">
          <Command className="w-3 h-3" />K
        </kbd>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] px-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{ type: "spring", duration: 0.3 }}
                className="w-full max-w-2xl bg-[#13131a]/95 backdrop-blur-xl border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden"
              >
                <div className="p-4 border-b border-white/[0.08]">
                  <div className="flex items-center gap-3 px-4 py-3 bg-white/[0.03] rounded-xl">
                    <Search className="w-5 h-5 text-white/40" />
                    <input
                      type="text"
                      placeholder="Search for pages, features, or settings..."
                      className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-white/40"
                      autoFocus
                    />
                  </div>
                </div>
                <div className="p-4 max-h-96 overflow-y-auto">
                  <div className="space-y-1">
                    {[
                      "Dashboard",
                      "Portfolio Builder",
                      "GitHub Sync",
                      "Settings",
                      "Profile Settings",
                      "Appearance",
                      "Billing",
                    ].map((item) => (
                      <button
                        key={item}
                        className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/[0.05] text-white/80 hover:text-white transition-all"
                        onClick={() => setIsOpen(false)}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
