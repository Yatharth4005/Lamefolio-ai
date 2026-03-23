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
        className="flex items-center gap-3 px-4 py-2 rounded-xl bg-background dark:bg-sidebar-accent border border-border hover:bg-muted transition-all duration-200 group w-full max-w-md mx-auto shadow-sm"
      >
        <Search className="w-4 h-4 text-foreground/40 group-hover:text-foreground/60 transition-colors" />
        <span className="text-sm text-foreground/40 group-hover:text-foreground/60 transition-colors flex-1 text-left">
          Search anything...
        </span>
        <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 text-xs text-foreground/40 bg-muted border border-border rounded-md font-mono">
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
              className="fixed inset-0 bg-transparent z-[100]"
            />
            <div className="fixed inset-0 z-[101] flex items-start justify-center pt-[20vh] px-4">
              <motion.div
                ref={modalRef}
                initial={{ opacity: 0, scale: 0.95, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{ type: "spring", duration: 0.3 }}
                className="w-full max-w-2xl bg-background-secondary border border-border rounded-2xl shadow-2xl overflow-hidden"
              >
                <div className="p-4 border-b border-border/50">
                  <div className="flex items-center gap-3 px-4 py-3 bg-secondary/50 rounded-xl border border-border">
                    <Search className="w-5 h-5 text-foreground/40" />
                    <input
                      type="text"
                      placeholder="Search for pages, features, or settings..."
                      className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-foreground/40"
                      autoFocus
                    />
                  </div>
                </div>
                <div className="p-4 max-h-96 overflow-y-auto no-scrollbar">
                  <div className="space-y-1">
                    {items.map((item) => (
                      <button
                        key={item.name}
                        className="w-full text-left px-4 py-3 rounded-xl hover:bg-muted text-foreground/80 hover:text-foreground transition-all font-medium"
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
