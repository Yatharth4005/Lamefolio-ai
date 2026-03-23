import { motion } from "motion/react";
import { ModernAIChat } from "../components/modern-ai-chat";

export function PortfolioBuilderPage() {
  return (
    <div className="h-[calc(100vh-64px)] w-full flex flex-col bg-background">
      {/* Immersive Chat workspace that fills the whole page area */}
      <div className="flex-1 min-h-0 flex flex-col">
        {/* Background Gradients for depth */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[180px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[180px] pointer-events-none" />

        <div className="relative z-10 flex-1 flex flex-col">
          {/* We pass a prop indicating this is now a full-screen page experience */}
          <ModernAIChat immersive={true} />
        </div>
      </div>
    </div>
  );
}
