import { Code2, Briefcase, FolderGit2, Plus, Check, TrendingUp } from "lucide-react";
import { motion } from "motion/react";

const sections = [
  {
    icon: Code2,
    title: "Skills",
    description: "Tech stack & expertise",
    items: 12,
    completed: true,
    progress: 100,
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Briefcase,
    title: "Experience",
    description: "Career journey",
    items: 5,
    completed: true,
    progress: 100,
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: FolderGit2,
    title: "Projects",
    description: "Featured work",
    items: 8,
    completed: false,
    progress: 65,
    color: "from-orange-500 to-pink-500",
  },
];

export function ModernPortfolioSections() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {sections.map((section, index) => (
        <motion.div
          key={section.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ y: -8, scale: 1.02 }}
          className="relative group"
        >
          {/* Glow effect */}
          <div className={`absolute -inset-[1px] bg-gradient-to-r ${section.color} rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`} />
          
          <div className="relative backdrop-blur-xl bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 hover:bg-white/[0.05] hover:border-white/[0.12] transition-all duration-300 overflow-hidden">
            {/* Gradient overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br ${section.color} opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500`} />
            
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${section.color} rounded-xl flex items-center justify-center relative`}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${section.color} rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity`} />
                  <section.icon className="w-6 h-6 text-white relative z-10" />
                </div>
                {section.completed ? (
                  <div className="w-8 h-8 bg-green-500/20 border border-green-500/30 rounded-lg flex items-center justify-center">
                    <Check className="w-4 h-4 text-green-400" />
                  </div>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-8 h-8 bg-white/[0.05] border border-white/[0.1] rounded-lg flex items-center justify-center hover:bg-purple-500/20 hover:border-purple-500/30 transition-all"
                  >
                    <Plus className="w-4 h-4 text-white/60 group-hover:text-purple-400" />
                  </motion.button>
                )}
              </div>

              <h3 className="text-base font-semibold text-white mb-1 tracking-tight">
                {section.title}
              </h3>
              <p className="text-sm text-white/40 mb-4">
                {section.description}
              </p>

              {/* Progress bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-white/50">Progress</span>
                  <span className="text-xs text-white/70 font-medium">{section.progress}%</span>
                </div>
                <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${section.progress}%` }}
                    transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                    className={`h-full bg-gradient-to-r ${section.color}`}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-white/50">
                  <TrendingUp className="w-4 h-4" />
                  <span>{section.items} items</span>
                </div>
                <motion.button
                  whileHover={{ x: 4 }}
                  className="text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Edit →
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
