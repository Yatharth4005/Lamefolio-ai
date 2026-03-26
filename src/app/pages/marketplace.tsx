import { Search, SlidersHorizontal, ArrowLeft, Wand2, Palette, Monitor, GraduationCap, Code, Rocket, Sparkles, Star, Zap, Layout, Lock } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import { useGitHub } from "../context/GitHubContext";
import { toast } from "sonner";

const categories = [
  { id: "all", label: "All Blueprints", icon: Layout },
  { id: "developer", label: "Developer", icon: Code },
  { id: "designer", label: "Designer", icon: Palette },
  { id: "marketing", label: "Marketing", icon: Monitor },
  { id: "academic", label: "Academic", icon: GraduationCap },
];

const allTemplates = [
  {
    id: "dev-pro",
    title: "Developer Pro",
    category: "developer",
    description: "Deep integration with GitHub, featuring project trackers and technical case studies.",
    icon: Wand2,
    color: "from-purple-500 to-blue-500",
    stats: { users: "2.4k", rating: "4.9" },
    premium: true,
    new: false
  },
  {
    id: "designer-minimal",
    title: "Designer Minimal",
    category: "designer",
    description: "Visual-first layout with high-impact image galleries and sleek typography.",
    icon: Palette,
    color: "from-pink-500 to-orange-500",
    stats: { users: "1.8k", rating: "4.8" },
    premium: false,
    new: false
  },
  {
    id: "marketing-master",
    title: "Marketing Master",
    category: "marketing",
    description: "Data-driven structure with KPI dashboards and campaign case studies.",
    icon: Monitor,
    color: "from-green-500 to-emerald-500",
    stats: { users: "950", rating: "4.7" },
    premium: true,
    new: false
  },
  {
    id: "academic-scholar",
    title: "Academic Scholar",
    category: "academic",
    description: "Highly organized structure for research papers, publications, and CV details.",
    icon: GraduationCap,
    color: "from-blue-500 to-cyan-500",
    stats: { users: "1.2k", rating: "4.9" },
    premium: false,
    new: false
  },
  {
    id: "hacker-dark",
    title: "Hacker Terminal",
    category: "developer",
    description: "A retro terminal-inspired layout for those who live in the command line.",
    icon: Code,
    color: "from-emerald-400 to-green-600",
    stats: { users: "600", rating: "4.6" },
    premium: true,
    new: true
  },
  {
    id: "startup-launch",
    title: "Startup Launchpad",
    category: "marketing",
    description: "Convert visitors into leads with this optimized SaaS-style portfolio builder.",
    icon: Rocket,
    color: "from-orange-400 to-red-600",
    stats: { users: "450", rating: "4.8" },
    premium: true,
    new: true
  },
];

export function MarketplacePage() {
  const navigate = useNavigate();
  const { plan } = useGitHub();
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTemplates = allTemplates.filter(t => {
    const matchesCategory = activeCategory === "all" || t.category === activeCategory;
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         t.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <button 
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-foreground/40 hover:text-foreground transition-colors mb-4 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-bold uppercase tracking-widest">Back to Dashboard</span>
          </button>
          <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight flex items-center gap-4">
            Blueprint Marketplace
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-purple-500 rounded-full" />
              <Sparkles className="w-6 h-6 text-purple-400 animate-pulse" />
            </div>
          </h1>
          <p className="text-lg text-foreground/40 mt-4 font-medium max-w-2xl">
            Discover battle-tested Notion blueprints engineered for every professional vertical.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
           <div className="relative group min-w-[300px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/20 group-focus-within:text-purple-400 transition-colors" />
              <input 
                type="text" 
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-secondary border border-border rounded-2xl py-3.5 pl-12 pr-4 text-foreground placeholder:text-foreground/20 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all font-medium"
              />
           </div>
           <button className="flex items-center justify-center gap-2 px-6 py-3.5 bg-secondary border border-border rounded-2xl text-foreground/60 hover:text-foreground hover:bg-muted transition-all font-bold">
              <SlidersHorizontal className="w-4 h-4" />
              Filters
           </button>
        </div>
      </div>

      {/* Categories */}
      <div className="flex items-center gap-2 mb-12 overflow-x-auto pb-4 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-bold whitespace-nowrap border transition-all ${
              activeCategory === cat.id
                ? "bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-purple-500/40 text-foreground shadow-lg shadow-purple-500/10"
                : "bg-secondary border-border text-foreground/40 hover:text-foreground hover:bg-muted"
            }`}
          >
            <cat.icon className={`w-4 h-4 ${activeCategory === cat.id ? "text-purple-400" : ""}`} />
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredTemplates.map((template, index) => {
            const isLocked = template.premium && plan.toLowerCase() === "free";
            
            return (
              <motion.div
                key={template.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={!isLocked ? { y: -10 } : {}}
                whileTap={isLocked ? { x: [-3, 3, -3, 3, 0] } : {}}
                className="group relative h-full flex flex-col"
              >
                {/* Background Glow */}
                <div className={`absolute -inset-[1px] bg-gradient-to-r ${template.color} rounded-[2.5rem] opacity-0 group-hover:opacity-30 blur-2xl transition-opacity duration-500`} />
                
                <div className={`relative flex-1 backdrop-blur-xl ${isLocked ? "bg-muted/30 grayscale" : "bg-background-secondary"} border border-border rounded-[2.5rem] p-10 hover:bg-muted/80 hover:border-sidebar-border transition-all duration-500 flex flex-col overflow-hidden`}>
                  {/* Badges */}
                  <div className="absolute top-8 right-8 flex gap-2">
                    {isLocked && <Lock className="w-3.5 h-3.5 text-purple-400 mt-0.5" />}
                    {template.new && (
                      <div className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-[10px] uppercase font-black text-green-400 tracking-widest animate-pulse">
                        New
                      </div>
                    )}
                    {template.premium && (
                      <div className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-[10px] uppercase font-black text-purple-400 tracking-widest shadow-lg shadow-purple-500/10">
                        Premium
                      </div>
                    )}
                    {!template.premium && !template.new && (
                      <div className="px-3 py-1 bg-white/[0.05] border border-white/[0.1] rounded-full text-[10px] uppercase font-black text-white/40 tracking-widest">
                        Free
                      </div>
                    )}
                  </div>

                  {/* Visual Header / Icon */}
                  <div className="mb-10 relative">
                    <div className={`w-20 h-20 bg-gradient-to-br ${template.color} rounded-3xl flex items-center justify-center relative ${!isLocked && "group-hover:scale-110 group-hover:rotate-6 transition-all duration-700"}`}>
                      <div className={`absolute inset-0 bg-gradient-to-br ${template.color} rounded-3xl blur-2xl opacity-40 group-hover:opacity-100 transition-opacity`} />
                      {isLocked ? (
                        <Lock className="w-10 h-10 text-white relative z-10" />
                      ) : (
                        <template.icon className="w-10 h-10 text-white relative z-10" />
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="mb-8">
                    <h3 className="text-3xl font-black text-foreground mb-4 tracking-tight group-hover:translate-x-1 transition-transform">
                      {template.title}
                    </h3>
                    <p className="text-foreground/40 text-lg font-medium leading-relaxed">
                      {template.description}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-6 mb-10 pb-8 border-b border-border/50 text-foreground/20">
                     <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        <span className="text-sm font-bold">{template.stats.users} installs</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm font-bold">{template.stats.rating} rating</span>
                     </div>
                  </div>

                  {/* Action */}
                  <div className="mt-auto pt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        if (isLocked) {
                          toast.error("Premium Blueprint Locked", {
                            description: "Upgrade to Pro or Premium to unlock this battle-tested template.",
                            action: {
                                label: "Upgrade",
                                onClick: () => navigate("/settings/billing")
                            }
                          });
                          if ('vibrate' in navigator) navigator.vibrate(50);
                          return;
                        }
                        navigate(`/portfolio-builder?template=${template.id}`);
                      }}
                      className={`w-full py-5 ${isLocked ? "bg-secondary/50 text-foreground/20 cursor-not-allowed" : "bg-white text-gray-950 hover:bg-white/90 shadow-2xl shadow-white/5"} rounded-2xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3`}
                    >
                      {isLocked ? (
                        <>
                          <Lock className="w-4 h-4" />
                          <span>Unlock Pro Template</span>
                        </>
                      ) : "Implement Blueprint"}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20 bg-secondary rounded-[3rem] border border-dashed border-border mt-12"
        >
          <div className="w-20 h-20 bg-muted rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Layout className="w-10 h-10 text-foreground/10" />
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-2">No blueprints found</h3>
          <p className="text-foreground/40">Try adjusting your search or category filters.</p>
          <button 
            onClick={() => { setSearchQuery(""); setActiveCategory("all"); }}
            className="mt-6 text-purple-400 font-bold hover:underline"
          >
            Clear all filters
          </button>
        </motion.div>
      )}

    </div>
  );
}
