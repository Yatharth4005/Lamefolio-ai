import { Outlet } from "react-router";
import { ModernSidebar } from "./modern-sidebar";
import { ModernHeader } from "./modern-header";
import { AnimatedBackground } from "./animated-background";
import { Onboarding } from "./onboarding";

export function Layout() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Onboarding />
      <AnimatedBackground />
      
      {/* Sidebar */}
      <ModernSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <ModernHeader />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto" style={{ willChange: "transform" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
