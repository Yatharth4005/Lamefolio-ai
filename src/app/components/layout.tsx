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
          <Outlet />
        </main>
      </div>
    </div>
  );
}
