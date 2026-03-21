import { Sparkles, Send, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

export function ModernAIChat() {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative group"
    >
      {/* Glow effect on focus */}
      {isFocused && (
        <div className="absolute -inset-[1px] bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl blur-xl opacity-30 animate-pulse" />
      )}
      
      <div className="relative backdrop-blur-xl bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 overflow-hidden">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative z-10">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center relative flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl blur-lg opacity-50" />
              <Sparkles className="w-6 h-6 text-white relative z-10" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-1 tracking-tight">
                AI Portfolio Assistant
              </h3>
              <p className="text-sm text-white/50">
                Describe your experience and I'll craft your perfect portfolio
              </p>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-lg">
              <Zap className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-xs font-medium text-purple-400">Powered by GPT-4</span>
            </div>
          </div>

          <div className="relative">
            <textarea
              placeholder="E.g., I'm a full-stack developer specializing in React and Node.js with 5 years of experience building scalable web applications..."
              className="w-full px-5 py-4 bg-white/[0.02] border border-white/[0.08] rounded-xl text-sm text-white placeholder:text-white/30 resize-none focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.03] transition-all duration-200"
              rows={4}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="absolute bottom-4 right-4 p-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/50 transition-all group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity" />
              <Send className="w-4 h-4 relative z-10" />
            </motion.button>
          </div>

          {/* Quick suggestions */}
          <div className="flex flex-wrap gap-2 mt-4">
            {["Add Skills", "Import from LinkedIn", "Analyze GitHub"].map((suggestion) => (
              <motion.button
                key={suggestion}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-1.5 text-xs font-medium text-white/60 bg-white/[0.02] border border-white/[0.08] rounded-lg hover:text-white hover:bg-white/[0.05] hover:border-purple-500/30 transition-all"
              >
                {suggestion}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
