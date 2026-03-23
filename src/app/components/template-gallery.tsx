import { Layout, Sparkles, Wand2, Monitor, Palette, BookOpen, GraduationCap, ChevronRight, Check } from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";

const templates = [
  {
    id: "dev-pro",
    title: "Developer Pro",
    description: "Deep integration with GitHub, featuring project trackers and technical case studies.",
    icon: Wand2,
    color: "from-purple-500 to-blue-500",
    features: ["GitHub Repo Sync", "Tech Stack Badges", "Dynamic Skill Board"],
    premium: true
  },
  {
    id: "designer-minimal",
    title: "Designer Minimal",
    description: "Visual-first layout with high-impact image galleries and sleek typography.",
    icon: Palette,
    color: "from-pink-500 to-orange-500",
    features: ["Masonry Gallery", "Custom Brand Color", "Dribbble Integration"],
    premium: false
  },
  {
    id: "marketing-master",
    title: "Marketing Master",
    description: "Data-driven structure with KPI dashboards and campaign case studies.",
    icon: Monitor,
    color: "from-green-500 to-emerald-500",
    features: ["Metric Visualizers", "Client Logos", "Lead Generation Focus"],
    premium: true
  },
  {
    id: "academic-scholar",
    title: "Academic Scholar",
    description: "Highly organized structure for research papers, publications, and CV details.",
    icon: GraduationCap,
    color: "from-blue-500 to-cyan-500",
    features: ["Publication List", "Citation Manager", "Education History"],
    premium: false
  }
];

export function TemplateGallery() {
  const navigate = useNavigate();

  const handleUseTemplate = (id: string) => {
    navigate(`/portfolio-builder?template=${id}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {templates.map((template, index) => (
        <motion.div
          key={template.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ y: -8 }}
          className="group relative flex flex-col h-full"
        >
          {/* Background Glow */}
          <div className={`absolute -inset-[1px] bg-gradient-to-r ${template.color} rounded-[2rem] opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`} />
          
          <div className="relative flex-1 backdrop-blur-md bg-muted border border-border rounded-[2rem] p-8 hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-300 flex flex-col overflow-hidden">
            {/* Template Type Indicator */}
            {template.premium && (
              <div className="absolute top-6 right-6 px-2.5 py-1 bg-purple-500/10 border border-purple-500/20 rounded-lg text-[10px] uppercase font-black text-purple-400 tracking-widest">
                Premium
              </div>
            )}

            {/* Icon Container */}
            <div className={`w-14 h-14 bg-gradient-to-br ${template.color} rounded-[1.25rem] flex items-center justify-center mb-8 relative group-hover:scale-110 transition-transform duration-500`}>
              <div className={`absolute inset-0 bg-gradient-to-br ${template.color} rounded-[1.25rem] blur-lg opacity-40 group-hover:opacity-75 transition-opacity`} />
              <template.icon className="w-7 h-7 text-white relative z-10" />
            </div>

            <h3 className="text-2xl font-bold text-foreground mb-3 tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-foreground group-hover:to-foreground/50 transition-all">
              {template.title}
            </h3>
            
            <p className="text-foreground/40 text-sm mb-8 leading-relaxed line-clamp-2 min-h-[2.5rem]">
              {template.description}
            </p>

            <div className="space-y-3 mb-8 flex-1">
              {template.features.map((feature) => (
                <div key={feature} className="flex items-center gap-3 text-foreground/60 group-hover:text-foreground/80 transition-colors">
                  <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${template.color} flex items-center justify-center scale-75 opacity-70`}>
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-xs font-medium text-foreground/60">{feature}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => handleUseTemplate(template.id)}
              className="w-full py-4 px-6 bg-secondary hover:bg-foreground text-foreground hover:text-background border border-border rounded-2xl font-bold transition-all flex items-center justify-center gap-3 group/btn"
            >
              <span className="text-sm">Customize Template</span>
              <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
