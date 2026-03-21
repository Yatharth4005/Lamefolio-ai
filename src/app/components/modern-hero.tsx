import { Sparkles, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

export function ModernHero() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-8"
    >
      <div className="mb-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full mb-4"
        >
          <div className="relative">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="absolute inset-0 animate-ping">
              <Sparkles className="w-4 h-4 text-purple-400 opacity-75" />
            </span>
          </div>
          <span className="text-sm font-medium text-purple-400">AI-Powered Portfolio Builder</span>
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight"
        >
          Welcome back,{" "}
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            John
          </span>{" "}
          👋
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-lg text-white/60 max-w-2xl"
        >
          Let's build an amazing portfolio that showcases your skills and achievements
        </motion.p>
      </div>

      {/* CTA Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.01 }}
        className="relative group overflow-hidden rounded-2xl"
      >
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
        
        {/* Noise texture */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
        
        <div className="relative p-8 flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-white" />
              <span className="text-sm font-semibold text-white/90 uppercase tracking-wider">
                AI-Powered
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 tracking-tight">
              Generate Your Portfolio in Minutes
            </h2>
            <p className="text-white/80 text-sm md:text-base mb-6 max-w-2xl">
              Our AI assistant analyzes your experience and automatically creates a stunning portfolio optimized for your career goals
            </p>
            <motion.button
              whileHover={{ scale: 1.05, x: 4 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white text-purple-600 rounded-xl font-semibold hover:bg-white/95 transition-all shadow-2xl shadow-white/20 flex items-center gap-2 group"
            >
              Generate Portfolio
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>
          
          {/* Decorative element */}
          <div className="hidden lg:block relative">
            <div className="w-40 h-40 rounded-2xl border-2 border-white/20 backdrop-blur-sm transform rotate-12 group-hover:rotate-6 transition-transform duration-500" />
            <div className="absolute top-8 left-8 w-40 h-40 rounded-2xl border-2 border-white/10 backdrop-blur-sm transform -rotate-6 group-hover:rotate-0 transition-transform duration-500" />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
