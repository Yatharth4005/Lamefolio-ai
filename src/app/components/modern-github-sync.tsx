import { Github, RefreshCw, CheckCircle2, Activity } from "lucide-react";
import { motion } from "motion/react";

export function ModernGitHubSync() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="relative group"
    >
      {/* Glow effect */}
      <div className="absolute -inset-[1px] bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" />
      
      <div className="relative backdrop-blur-xl bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 hover:bg-white/[0.05] hover:border-white/[0.12] transition-all duration-300">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-gray-900 to-gray-700 rounded-xl flex items-center justify-center relative">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl blur-lg opacity-50" />
              <Github className="w-6 h-6 text-white relative z-10" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white mb-1 tracking-tight">
                GitHub Integration
              </h3>
              <p className="text-sm text-white/40">
                Sync repositories & contributions
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ rotate: 180, scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="p-2 hover:bg-white/[0.05] rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4 text-white/60" />
          </motion.button>
        </div>

        {/* Sync Status */}
        <div className="space-y-3 mb-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-between py-3 border-b border-white/[0.05]"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                <span className="absolute inset-0 animate-ping">
                  <CheckCircle2 className="w-5 h-5 text-green-400 opacity-75" />
                </span>
              </div>
              <span className="text-sm text-white/70">Repositories synced</span>
            </div>
            <span className="text-sm font-semibold text-white bg-white/[0.05] px-3 py-1 rounded-lg">
              24
            </span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-between py-3 border-b border-white/[0.05]"
          >
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 text-blue-400" />
              <span className="text-sm text-white/70">Contributions</span>
            </div>
            <span className="text-sm font-semibold text-white bg-white/[0.05] px-3 py-1 rounded-lg">
              1,247
            </span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-between py-3"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="absolute inset-0 animate-ping">
                  <div className="w-2 h-2 bg-green-500 rounded-full opacity-75" />
                </span>
              </div>
              <span className="text-sm text-white/70">Last synced</span>
            </div>
            <span className="text-sm font-medium text-green-400">2 min ago</span>
          </motion.div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 px-4 bg-gradient-to-r from-gray-900 to-gray-800 border border-white/[0.1] text-white rounded-xl hover:border-white/[0.2] transition-all font-medium relative group overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="relative z-10">Configure GitHub</span>
        </motion.button>
      </div>
    </motion.div>
  );
}
