import { Search, SlidersHorizontal, ArrowLeft, Wand2, Palette, Monitor, GraduationCap, Code, Rocket, Sparkles, Star, Zap, Layout, Lock, ChevronRight } from "lucide-react";
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
    color: "#5e6ad2",
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
    color: "#d34e9d",
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
    color: "#10b981",
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
    color: "#3b82f6",
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
    color: "#10b981",
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
    color: "#f59e0b",
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
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-16">
        <div>
          <button 
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-foreground/30 hover:text-foreground transition-colors mb-6 group cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] py-0.5">Back to Dashboard</span>
          </button>
          
          <div className="flex items-center gap-4 mb-3">
             <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
               Marketplace
             </h1>
             <div className="flex items-center gap-2 px-2.5 py-1 bg-primary/10 border border-primary/20 rounded-full">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Blueprints</span>
             </div>
          </div>
          
          <p className="text-base text-foreground/40 font-medium max-w-xl leading-relaxed">
            Discover battle-tested Notion templates engineered for technical portfolios, creative showcases, and academic resumes.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5 h-11">
           <div className="relative group min-w-[280px] h-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-foreground/20 group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-full bg-white/[0.03] dark:bg-white/[0.01] border border-black/[0.1] dark:border-white/[0.06] rounded-xl pl-10 pr-4 text-sm text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all font-semibold"
              />
           </div>
           <button className="flex items-center justify-center gap-2 px-5 h-full bg-white dark:bg-white/[0.02] border border-black/[0.08] dark:border-white/[0.08] rounded-xl text-foreground/50 hover:text-foreground hover:border-black/[0.15] dark:hover:border-white/[0.15] transition-all text-[12px] font-bold shadow-sm">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
           </button>
        </div>
      </div>

      {/* Categories */}
      <div className="flex items-center gap-1.5 mb-12 overflow-x-auto pb-4 no-scrollbar border-b border-black/[0.04] dark:border-white/[0.04]">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-bold text-[12px] whitespace-nowrap transition-all border ${
              activeCategory === cat.id
                ? "bg-foreground text-background border-foreground shadow-[0_8px_16px_-6px_rgba(0,0,0,0.15)]"
                : "bg-transparent border-transparent text-foreground/40 hover:text-foreground hover:bg-black/[0.03] dark:hover:bg-white/[0.03]"
            }`}
          >
            <cat.icon className={`w-3.5 h-3.5`} />
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredTemplates.map((template, index) => {
            const isLocked = template.premium && plan.toLowerCase() === "free";
            
            return (
              <motion.div
                key={template.id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={!isLocked ? { y: -4 } : {}}
                className="group relative h-full flex flex-col"
              >
                <div className={`relative flex-1 bg-white dark:bg-white/[0.03] border ${isLocked ? "border-black/[0.04] dark:border-white/[0.04] opacity-80" : "border-black/[0.1] dark:border-white/[0.08]"} rounded-3xl p-8 hover:border-primary/30 shadow-[0_4px_24px_-12px_rgba(0,0,0,0.08)] hover:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.12)] transition-all duration-300 flex flex-col overflow-hidden group/card`}>
                  {/* Top Accent Line */}
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity" />

                  {/* Badges */}
                  <div className="absolute top-8 right-8 flex gap-2">
                    {template.new && (
                      <div className="px-2 py-0.5 bg-green-500 text-white rounded-md text-[9px] uppercase font-black tracking-[0.15em] shadow-lg shadow-green-500/10">
                        New
                      </div>
                    )}
                    {template.premium && (
                      <div className="px-2 py-0.5 bg-primary text-white border border-primary rounded-md text-[9px] uppercase font-black tracking-[0.15em] shadow-lg shadow-primary/10">
                        Premium
                      </div>
                    )}
                  </div>

                  {/* Header / Icon */}
                  <div className="mb-10">
                    <div 
                      className="w-14 h-14 rounded-2xl flex items-center justify-center border border-black/[0.05] dark:border-white/[0.12] transition-all group-hover/card:scale-105 shadow-sm"
                      style={{ backgroundColor: `${template.color}15`, borderColor: `${template.color}30` }}
                    >
                      {isLocked ? (
                        <Lock className="w-6 h-6 text-foreground/40" />
                      ) : (
                        <template.icon className="w-6 h-6 transition-colors" style={{ color: template.color }} />
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-foreground mb-3 tracking-tight group-hover/card:text-primary transition-colors">
                      {template.title}
                    </h3>
                    <p className="text-foreground/50 text-[14px] font-semibold leading-relaxed">
                      {template.description}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-5 mb-10 text-foreground/30">
                     <div className="flex items-center gap-2">
                        <Zap className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-bold uppercase tracking-wider">{template.stats.users} installs</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <Star className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-bold uppercase tracking-wider">{template.stats.rating} rating</span>
                     </div>
                  </div>

                  {/* Action */}
                  <div className="mt-auto">
                    <motion.button
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
                      className={`w-full py-4 px-6 rounded-2xl font-bold text-[12px] uppercase tracking-widest transition-all flex items-center justify-center gap-2.5 ${
                        isLocked 
                          ? "bg-black/[0.02] dark:bg-white/[0.02] text-foreground/20 border border-black/[0.05] dark:border-white/[0.05] cursor-not-allowed" 
                          : "bg-black/[0.04] dark:bg-white/[0.05] hover:bg-foreground hover:text-background text-foreground border border-black/[0.08] dark:border-white/[0.08] group/btn shadow-[0_4px_12px_rgba(0,0,0,0.05)]"
                      }`}
                    >
                      {isLocked ? (
                        <>
                          <Lock className="w-4 h-4 opacity-40" />
                          <span>Unlock Pro Template</span>
                        </>
                      ) : (
                        <>
                          <span>Implement Blueprint</span>
                          <ChevronRight className="w-4 h-4 opacity-40 group-hover/btn:translate-x-1 transition-transform" />
                        </>
                      )}
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
