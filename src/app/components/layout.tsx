import { useState } from "react";
import { Outlet } from "react-router";
import { ModernSidebar } from "./modern-sidebar";
import { ModernHeader } from "./modern-header";
import { AnimatedBackground } from "./animated-background";
import { Onboarding } from "./onboarding";

export function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <Onboarding />
      <AnimatedBackground />
      
      {/* Sidebar - Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 lg:relative lg:translate-x-0 transition-transform duration-300
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        <ModernSidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        {/* Header */}
        <ModernHeader onMenuClick={() => setIsSidebarOpen(true)} />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto" style={{ willChange: "transform" }}>
          <div className="min-h-full flex flex-col">
            <div className="flex-1">
              <Outlet />
            </div>
            
            {/* Global Footer */}
            <footer className="mt-auto px-6 md:px-12 py-10 border-t border-black/[0.05] dark:border-white/[0.05]">
              <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] text-foreground/20">
                    &copy; {new Date().getFullYear()} Lamefolio AI
                  </span>
                  <div className="hidden md:block w-px h-3 bg-black/[0.05] dark:bg-white/[0.05]" />
                  <span className="hidden md:inline text-[10px] font-bold text-foreground/40 uppercase tracking-widest">
                    All Rights Reserved
                  </span>
                </div>
                
                <div className="flex items-center gap-8">
                  <a href="#" className="text-[10px] font-bold text-foreground/30 hover:text-primary transition-colors uppercase tracking-widest">Privacy Policy</a>
                  <a href="#" className="text-[10px] font-bold text-foreground/30 hover:text-primary transition-colors uppercase tracking-widest">Terms of Service</a>
                  <a href="#" className="text-[10px] font-bold text-foreground/30 hover:text-primary transition-colors uppercase tracking-widest">Support</a>
                </div>
              </div>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}
