import { Search, Command, ChevronRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import { createPortal } from "react-dom";

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

  const paletteContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[15vh] px-4 cursor-default">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#0a0a0b]/60 backdrop-blur-[12px]"
            onClick={() => setIsOpen(false)}
          />
          
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.99, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.99, y: -10 }}
            transition={{ type: "spring", damping: 25, stiffness: 400 }}
            className="w-full max-w-2xl bg-black/20 backdrop-blur-2xl border border-white/10 rounded-[24px] shadow-[0_45px_100px_rgba(0,0,0,0.6)] overflow-hidden relative z-10"
          >
            <div className="p-5">
              <div className="flex items-center gap-4 px-5 py-3.5 bg-white/[0.02] rounded-2xl border border-white/5 focus-within:border-white/20 transition-all duration-300 group">
                <Search className="w-5 h-5 text-white/20 group-focus-within:text-white/50 transition-colors" />
                <input
                  type="text"
                  placeholder="Seach for anything..."
                  className="flex-1 bg-transparent border-none outline-none text-lg text-white placeholder:text-white/10 font-medium tracking-tight"
                  autoFocus
                />
                <kbd className="hidden sm:flex items-center gap-1.5 px-2 py-1 text-[9px] font-bold text-white/20 bg-white/5 border border-white/10 rounded-lg font-mono">
                  ESC
                </kbd>
              </div>
            </div>
            
            <div className="px-3 pb-3 max-h-[50vh] overflow-y-auto no-scrollbar">
              <div className="space-y-0.5">
                {items.map((item) => (
                  <button
                    key={item.name}
                    className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/[0.04] text-white/30 hover:text-white transition-all flex items-center justify-between group/item"
                    onClick={() => handleSelect(item.path)}
                  >
                    <div className="flex items-center gap-3">
                      <ChevronRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all text-white/40" />
                      <span className="font-medium tracking-tight text-[15px] -translate-x-4 group-hover/item:translate-x-0 transition-all">{item.name}</span>
                    </div>
                    <Command className="w-3.5 h-3.5 opacity-0 group-hover/item:opacity-30 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-3 px-4 py-2 sm:py-2.5 rounded-2xl bg-white/[0.03] border border-white/[0.05] hover:border-white/20 hover:bg-white/[0.08] transition-all duration-300 group w-full max-w-md mx-auto shadow-[0_0_20px_rgba(0,0,0,0.1)] backdrop-blur-md"
      >
        <Search className="w-4 h-4 text-white/30 group-hover:text-white/50 transition-colors shrink-0" />
        <span className="text-sm text-white/20 group-hover:text-white/40 transition-colors flex-1 text-left font-medium tracking-tight">
          Search...
        </span>
        <kbd className="hidden md:flex items-center gap-1.5 px-2 py-1 text-[10px] font-bold text-white/20 bg-white/5 border border-white/10 rounded-lg font-mono">
          CTRL K
        </kbd>
      </button>

      {createPortal(paletteContent, document.body)}
    </>
  );
}
