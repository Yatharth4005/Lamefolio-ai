import { Wand2, Monitor, Palette, GraduationCap, ChevronRight, Check } from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";

const templates = [
  {
    id: "dev-pro",
    title: "Developer Pro",
    description: "Deep integration with GitHub, featuring project trackers and technical case studies.",
    icon: Wand2,
    features: ["GitHub Repo Sync", "Tech Stack Badges", "Dynamic Skill Board"],
    premium: true
  },
  {
    id: "designer-minimal",
    title: "Designer Minimal",
    description: "Visual-first layout with high-impact image galleries and sleek typography.",
    icon: Palette,
    features: ["Masonry Gallery", "Custom Brand Color", "Dribbble Integration"],
    premium: false
  },
  {
    id: "marketing-master",
    title: "Marketing Master",
    description: "Data-driven structure with KPI dashboards and campaign case studies.",
    icon: Monitor,
    features: ["Metric Visualizers", "Client Logos", "Lead Generation Focus"],
    premium: true
  },
  {
    id: "academic-scholar",
    title: "Academic Scholar",
    description: "Highly organized structure for research papers, publications, and CV details.",
    icon: GraduationCap,
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      {templates.map((template, index) => (
        <motion.div
          key={template.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.08 }}
          className="group relative flex flex-col h-full"
        >
          <div className="relative flex-1 bg-muted border border-border rounded-2xl p-6 hover:border-foreground/20 transition-colors duration-200 flex flex-col">
            {/* Pro plan badge */}
            {template.premium && (
              <div className="absolute top-5 right-5 px-2 py-0.5 bg-secondary border border-border rounded-md text-[10px] uppercase font-semibold text-foreground/40 tracking-widest">
                Pro
              </div>
            )}

            {/* Neutral icon container — no gradient fill */}
            <div className="w-10 h-10 bg-background border border-border rounded-xl flex items-center justify-center mb-6">
              <template.icon className="w-5 h-5 text-foreground/60" />
            </div>

            <h3 className="text-base font-semibold text-foreground mb-2">
              {template.title}
            </h3>

            <p className="text-foreground/40 text-sm mb-6 leading-relaxed line-clamp-2 flex-1">
              {template.description}
            </p>

            <div className="space-y-2 mb-6">
              {template.features.map((feature) => (
                <div key={feature} className="flex items-center gap-2 text-foreground/50">
                  <Check className="w-3.5 h-3.5 text-foreground/30 flex-shrink-0" />
                  <span className="text-xs">{feature}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => handleUseTemplate(template.id)}
              className="w-full py-2.5 px-4 bg-secondary hover:bg-foreground text-foreground hover:text-background border border-border rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 group/btn"
            >
              Use Template
              <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
