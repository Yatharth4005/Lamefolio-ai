import { Layout, Sparkles, Wand2, Monitor, Palette, BookOpen, GraduationCap, ChevronRight, Check, Lock } from "lucide-react";
import { motion, useAnimation } from "motion/react";
import { useNavigate } from "react-router";
import { useGitHub } from "../context/GitHubContext";
import { toast } from "sonner";

const templates = [
  {
    id: "dev-pro",
    title: "Developer Pro",
    description: "Deep integration with GitHub, featuring project trackers and technical case studies.",
    icon: Wand2,
    color: "#5e6ad2",
    features: ["GitHub Repo Sync", "Tech Stack Badges", "Dynamic Skill Board"],
    premium: true
  },
  {
    id: "designer-minimal",
    title: "Designer Minimal",
    description: "Visual-first layout with high-impact image galleries and sleek typography.",
    icon: Palette,
    color: "#d34e9d",
    features: ["Masonry Gallery", "Custom Brand Color", "Dribbble Integration"],
    premium: false
  },
  {
    id: "marketing-master",
    title: "Marketing Master",
    description: "Data-driven structure with KPI dashboards and campaign case studies.",
    icon: Monitor,
    color: "#10b981",
    features: ["Metric Visualizers", "Client Logos", "Lead Generation Focus"],
    premium: true
  },
  {
    id: "academic-scholar",
    title: "Academic Scholar",
    description: "Highly organized structure for research papers, publications, and CV details.",
    icon: GraduationCap,
    color: "#3b82f6",
    features: ["Publication List", "Citation Manager", "Education History"],
    premium: false
  }
];

export function TemplateGallery() {
  const navigate = useNavigate();
  const { plan } = useGitHub();

  const handleUseTemplate = async (template: typeof templates[0]) => {
    const isLocked = template.premium && plan.toLowerCase() === "free";
    
    if (isLocked) {
      toast.error(`"${template.title}" is a Premium Template`, {
        description: "Upgrade to Pro to unlock this and more blueprints.",
        action: {
          label: "Upgrade Now",
          onClick: () => navigate("/settings/billing")
        }
      });
      if ('vibrate' in navigator) navigator.vibrate(50);
      return;
    }

    const prompt = `Using the ${template.title} template, build me a high-quality portfolio that highlights my best work and professional journey.`;
    navigate(`/portfolio-builder?template=${template.id}&prompt=${encodeURIComponent(prompt)}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {templates.map((template, index) => {
        const isLocked = template.premium && plan.toLowerCase() === "free";
        
        return (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            whileHover={!isLocked ? { y: -2 } : {}}
            className="group relative flex flex-col h-full"
          >
            <div className={`relative flex-1 bg-white dark:bg-white/[0.03] border ${isLocked ? "border-white/[0.04] opacity-80" : "border-black/[0.08] dark:border-white/[0.08]"} rounded-2xl p-7 hover:border-primary/30 shadow-[0_4px_24px_-12px_rgba(0,0,0,0.08)] hover:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.12)] transition-all duration-300 flex flex-col overflow-hidden group/card`}>
              {/* Top Accent Line */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity" />
              
              {/* Header */}
              <div className="flex justify-between items-start mb-10 text-foreground/90">
                <div 
                  className="w-11 h-11 rounded-xl flex items-center justify-center border border-black/[0.05] dark:border-white/[0.12] transition-all group-hover/card:scale-105 shadow-sm"
                  style={{ backgroundColor: `${template.color}15`, borderColor: `${template.color}30` }}
                >
                  <template.icon className="w-5 h-5 transition-colors" style={{ color: template.color }} />
                </div>
                
                <div className={`px-2.5 py-1 border rounded-md text-[9px] font-black uppercase tracking-[0.15em] ${template.premium ? "bg-primary text-white border-primary shadow-lg shadow-primary/10" : "bg-black/[0.03] dark:bg-white/[0.05] border-black/[0.05] dark:border-white/[0.1] text-foreground/40"}`}>
                  {template.premium ? "Premium" : "Free"}
                </div>
              </div>

              <h3 className="text-xl font-bold text-foreground mb-2.5 tracking-tight group-hover/card:text-primary transition-colors">
                {template.title}
              </h3>
              
              <p className="text-foreground/50 text-[13px] mb-10 leading-relaxed font-semibold">
                {template.description}
              </p>

              <div className="space-y-3 mb-10 flex-1">
                {template.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3 text-foreground/60 transition-colors group-hover/card:text-foreground/80">
                    <div className="w-1 h-1 rounded-full bg-primary/40 group-hover/card:bg-primary transition-colors" />
                    <span className="text-[11px] font-bold tracking-tight">{feature}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleUseTemplate(template)}
                className={`w-full py-4 px-6 rounded-xl font-bold text-[12px] transition-all flex items-center justify-center gap-2.5 ${
                  isLocked 
                    ? "bg-black/[0.02] dark:bg-white/[0.02] text-foreground/20 border border-black/[0.05] dark:border-white/[0.05] cursor-not-allowed" 
                    : "bg-black/[0.04] dark:bg-white/[0.05] hover:bg-foreground hover:text-background text-foreground border border-black/[0.08] dark:border-white/[0.08] group/btn shadow-[0_4px_12px_rgba(0,0,0,0.05)]"
                }`}
              >
                {isLocked ? (
                  <>
                    <Lock className="w-4 h-4 opacity-40" />
                    <span>Locked Prototype</span>
                  </>
                ) : (
                  <>
                    <span className="tracking-tight uppercase py-0.5">Use Blueprint</span>
                    <ChevronRight className="w-4 h-4 opacity-40 group-hover/btn:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
