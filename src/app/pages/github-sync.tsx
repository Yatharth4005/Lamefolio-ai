import { Github, RefreshCw, CheckCircle2, XCircle, Star, GitFork, Calendar, ExternalLink, Activity } from "lucide-react";
import { motion } from "motion/react";

export function GitHubSyncPage() {
  const repos = [
    {
      id: 1,
      name: "portfolio-website",
      description: "My personal portfolio built with React and Tailwind CSS",
      language: "TypeScript",
      stars: 45,
      forks: 12,
      updated: "2 days ago",
      synced: true,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      id: 2,
      name: "ai-chat-bot",
      description: "AI-powered chatbot using OpenAI GPT-4",
      language: "Python",
      stars: 128,
      forks: 34,
      updated: "1 week ago",
      synced: true,
      gradient: "from-purple-500 to-pink-500",
    },
    {
      id: 3,
      name: "ecommerce-platform",
      description: "Full-stack e-commerce platform with Next.js",
      language: "JavaScript",
      stars: 89,
      forks: 23,
      updated: "3 days ago",
      synced: false,
      gradient: "from-orange-500 to-pink-500",
    },
    {
      id: 4,
      name: "data-visualization",
      description: "Interactive data visualization dashboard",
      language: "TypeScript",
      stars: 67,
      forks: 18,
      updated: "5 days ago",
      synced: true,
      gradient: "from-green-500 to-emerald-500",
    },
  ];

  const stats = [
    { label: "Total Repos", value: "24", icon: Github, gradient: "from-gray-700 to-gray-900" },
    { label: "Total Stars", value: "329", icon: Star, gradient: "from-yellow-500 to-orange-500" },
    { label: "Total Forks", value: "87", icon: GitFork, gradient: "from-blue-500 to-cyan-500" },
    { label: "Contributions", value: "1,247", icon: Activity, gradient: "from-green-500 to-emerald-500" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4"
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
            GitHub Integration
          </h1>
          <p className="text-white/60">
            Connect and sync your repositories and contributions
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-gradient-to-r from-gray-900 to-gray-800 border border-white/[0.1] rounded-xl text-white transition-all flex items-center gap-2 font-semibold relative group overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/[0.05] opacity-0 group-hover:opacity-100 transition-opacity" />
          <Github className="w-5 h-5 relative z-10" />
          <span className="relative z-10">Connect GitHub</span>
        </motion.button>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="relative group"
          >
            <div className={`absolute -inset-[1px] bg-gradient-to-r ${stat.gradient} rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`} />
            
            <div className="relative backdrop-blur-xl bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 hover:bg-white/[0.05] hover:border-white/[0.12] transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center relative`}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity`} />
                  <stat.icon className="w-6 h-6 text-white relative z-10" />
                </div>
                <div>
                  <p className="text-sm text-white/50">{stat.label}</p>
                  <p className="text-2xl font-bold text-white tracking-tight">{stat.value}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Sync Status Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="relative group mb-8"
      >
        <div className="absolute -inset-[1px] bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500" />
        
        <div className="relative backdrop-blur-xl bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 hover:bg-white/[0.05] hover:border-white/[0.12] transition-all duration-300">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <div>
              <h2 className="text-lg font-bold text-white mb-1 tracking-tight">Sync Status</h2>
              <p className="text-sm text-white/50">Last synced 2 minutes ago</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05, rotate: 180 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring" }}
              className="px-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white/80 hover:bg-white/[0.05] hover:border-white/[0.12] transition-all flex items-center gap-2 font-medium w-fit"
            >
              <RefreshCw className="w-4 h-4" />
              Sync Now
            </motion.button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
              <CheckCircle2 className="w-6 h-6 text-green-400" />
              <div>
                <p className="text-sm font-medium text-green-400">Repositories Synced</p>
                <p className="text-xs text-green-400/70">18 of 24 repositories</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
              <Activity className="w-6 h-6 text-blue-400" />
              <div>
                <p className="text-sm font-medium text-blue-400">Contributions Updated</p>
                <p className="text-xs text-blue-400/70">All time contributions</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
              <CheckCircle2 className="w-6 h-6 text-purple-400" />
              <div>
                <p className="text-sm font-medium text-purple-400">Profile Connected</p>
                <p className="text-xs text-purple-400/70 font-mono">@johndoe</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Repositories List */}
      <div>
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight mb-2">
              Your Repositories
            </h2>
            <p className="text-sm text-white/50">
              Manage which repos appear in your portfolio
            </p>
          </div>
          <div className="flex gap-2">
            <select className="px-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-sm text-white/80 hover:bg-white/[0.05] hover:border-white/[0.12] transition-all focus:outline-none focus:ring-2 focus:ring-purple-500/50">
              <option>All Languages</option>
              <option>TypeScript</option>
              <option>JavaScript</option>
              <option>Python</option>
            </select>
            <select className="px-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-sm text-white/80 hover:bg-white/[0.05] hover:border-white/[0.12] transition-all focus:outline-none focus:ring-2 focus:ring-purple-500/50">
              <option>Sort by Updated</option>
              <option>Sort by Stars</option>
              <option>Sort by Name</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {repos.map((repo, index) => (
            <motion.div
              key={repo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              whileHover={{ y: -4 }}
              className="relative group"
            >
              <div className={`absolute -inset-[1px] bg-gradient-to-r ${repo.gradient} rounded-2xl opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500`} />
              
              <div className="relative backdrop-blur-xl bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 hover:bg-white/[0.05] hover:border-white/[0.12] transition-all duration-300">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="font-semibold text-white tracking-tight font-mono">{repo.name}</h3>
                      <span className="text-xs px-2.5 py-1 bg-white/[0.05] rounded-lg text-white/60 border border-white/[0.08]">
                        {repo.language}
                      </span>
                      {repo.synced ? (
                        <span className="flex items-center gap-1.5 text-xs text-green-400 bg-green-500/10 px-2.5 py-1 rounded-lg border border-green-500/20">
                          <CheckCircle2 className="w-3 h-3" />
                          Synced
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-xs text-white/40 bg-white/[0.02] px-2.5 py-1 rounded-lg border border-white/[0.05]">
                          <XCircle className="w-3 h-3" />
                          Not synced
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-white/60 mb-4">{repo.description}</p>
                    <div className="flex items-center gap-4 text-sm text-white/50">
                      <span className="flex items-center gap-1.5">
                        <Star className="w-4 h-4" />
                        {repo.stars}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <GitFork className="w-4 h-4" />
                        {repo.forks}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        Updated {repo.updated}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white/80 hover:bg-white/[0.05] hover:border-white/[0.12] transition-all"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        repo.synced
                          ? "bg-white/[0.03] border border-white/[0.08] text-white/80 hover:bg-white/[0.05] hover:border-white/[0.12]"
                          : "bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:shadow-lg hover:shadow-purple-500/30"
                      }`}
                    >
                      {repo.synced ? "Remove" : "Add to Portfolio"}
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
