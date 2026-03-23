import { Search, Command } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const modalRef = useRef<HTMLDivElement>(null);

  const items = [
    { name: "Dashboard", path: "/" },
    { name: "Portfolio Builder", path: "/portfolio-builder" },
    { name: "Blueprint Marketplace", path: "/marketplace" },
    { name: "GitHub Sync", path: "/integrations" },
    { name: "Settings", path: "/settings/profile" },
    { name: "Profile Settings", path: "/settings/profile" },
    { name: "Billing", path: "/settings/billing" },
    { name: "Notifications", path: "/settings/notifications" },
  ];

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    document.addEventListener("keydown", down);
    return () => {
      document.body.style.overflow = "unset";
      document.removeEventListener("keydown", down);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.05] transition-all duration-200 group w-full max-w-md mx-auto"
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
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />
            <div className="fixed inset-0 z-[101] flex items-start justify-center pt-[20vh] px-4">
              <motion.div
                ref={modalRef}
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
                <div className="p-4 max-h-96 overflow-y-auto no-scrollbar">
                  <div className="space-y-1">
                    {items.map((item) => (
                      <button
                        key={item.name}
                        className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/[0.05] text-white/80 hover:text-white transition-all font-medium"
                        onClick={() => handleSelect(item.path)}
                      >
                        {item.name}
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
