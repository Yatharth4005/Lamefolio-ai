import { Sparkles, Eye, Download, Share2, Plus, Edit3, Palette, Loader2 } from "lucide-react";
import { useState } from "react";
import { motion } from "motion/react";
import { useGitHub } from "../context/GitHubContext";
import { generatePortfolio } from "../lib/api";
import { toast } from "sonner";

export function PortfolioBuilderPage() {
  const [activeTab, setActiveTab] = useState("all");
  const { githubHandle, isGenerating, setIsGenerating } = useGitHub();

  const handleGenerate = async () => {
    if (!githubHandle) {
      toast.error("Please configure your GitHub handle in the dashboard first!");
      return;
    }

    try {
      setIsGenerating(true);
      toast.info("AI is analyzing your profile to fill in missing sections...");
      
      const result = await generatePortfolio(githubHandle, "Fill in missing sections for my portfolio based on my GitHub data.");
      
      toast.success("Portfolio updated!", {
        action: { 
          label: "View in Notion", 
          onClick: () => window.open(result.url, "_blank") 
        }
      });
    } catch (error: any) {
      toast.error("Generation failed", { description: error.message });
    } finally {
      setIsGenerating(false);
    }
  };

  const templates = [
    { id: 1, name: "Modern Developer", style: "Minimal", color: "Purple", gradient: "from-purple-500 to-pink-500" },
    { id: 2, name: "Creative Designer", style: "Bold", color: "Blue", gradient: "from-blue-500 to-cyan-500" },
    { id: 3, name: "Professional Resume", style: "Classic", color: "Orange", gradient: "from-orange-500 to-pink-500" },
  ];

  const sections = [
    { id: 1, title: "Hero Section", status: "complete", items: 4, progress: 100 },
    { id: 2, title: "About Me", status: "complete", items: 3, progress: 100 },
    { id: 3, title: "Skills & Technologies", status: "complete", items: 12, progress: 100 },
    { id: 4, title: "Work Experience", status: "complete", items: 5, progress: 100 },
    { id: 5, title: "Projects Showcase", status: "in-progress", items: 8, progress: 65 },
    { id: 6, title: "Education", status: "complete", items: 2, progress: 100 },
    { id: 7, title: "Testimonials", status: "empty", items: 0, progress: 0 },
    { id: 8, title: "Contact Form", status: "complete", items: 1, progress: 100 },
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
            Portfolio Builder
          </h1>
          <p className="text-white/60">
            Customize your portfolio sections and design
          </p>
        </div>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white/80 hover:bg-white/[0.05] hover:border-white/[0.12] transition-all flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            <span className="font-medium">Preview</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white/80 hover:bg-white/[0.05] hover:border-white/[0.12] transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span className="font-medium">Export</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl text-white transition-all flex items-center gap-2 font-semibold relative group overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
            <Share2 className="w-4 h-4 relative z-10" />
            <span className="relative z-10">Publish</span>
          </motion.button>
        </div>
      </motion.div>

      {/* AI Generation Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative group mb-8 overflow-hidden rounded-2xl"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
        
        <div className="relative p-6 md:p-8">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-white" />
            <span className="font-semibold text-white uppercase tracking-wider text-sm">
              AI-Powered Generation
            </span>
          </div>
          <p className="text-white/90 mb-6 max-w-2xl text-sm md:text-base">
            Let our AI analyze your profile and automatically fill in missing sections with compelling content based on your experience and skills.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-8 py-3 bg-white text-purple-600 rounded-xl font-semibold hover:bg-white/95 transition-all shadow-lg flex items-center gap-2 disabled:opacity-50"
          >
            {isGenerating && <Loader2 className="w-4 h-4 animate-spin" />}
            {isGenerating ? "Generating..." : "Generate Missing Sections"}
          </motion.button>
        </div>
      </motion.div>

      {/* Templates */}
      <div className="mb-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white tracking-tight mb-2">
            Choose a Template
          </h2>
          <p className="text-sm text-white/50">
            Select a design that matches your style
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {templates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="relative group"
            >
              <div className={`absolute -inset-[1px] bg-gradient-to-r ${template.gradient} rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`} />
              
              <div className="relative backdrop-blur-xl bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 hover:bg-white/[0.05] hover:border-white/[0.12] transition-all duration-300 cursor-pointer">
                <div className={`w-full h-36 bg-gradient-to-br ${template.gradient} rounded-xl mb-4 flex items-center justify-center relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/20" />
                  <Palette className="w-8 h-8 text-white/80 relative z-10" />
                </div>
                <h3 className="font-semibold text-white mb-2 tracking-tight">{template.name}</h3>
                <div className="flex gap-2 mb-4">
                  <span className="text-xs px-2.5 py-1 bg-white/[0.05] rounded-lg text-white/60 border border-white/[0.08]">
                    {template.style}
                  </span>
                  <span className={`text-xs px-2.5 py-1 bg-gradient-to-r ${template.gradient} bg-opacity-10 rounded-lg text-white/80 border border-white/[0.1]`}>
                    {template.color}
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-sm font-medium text-white/80 hover:bg-white/[0.05] hover:border-white/[0.12] transition-all"
                >
                  Use Template
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Portfolio Sections */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight mb-2">
              Portfolio Sections
            </h2>
            <p className="text-sm text-white/50">
              Manage and organize your content
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white/80 hover:bg-white/[0.05] hover:border-white/[0.12] transition-all flex items-center gap-2 font-medium"
          >
            <Plus className="w-4 h-4" />
            Add Section
          </motion.button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-white/[0.08] overflow-x-auto">
          {["all", "complete", "in-progress", "empty"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-medium capitalize transition-all whitespace-nowrap ${
                activeTab === tab
                  ? "text-purple-400 border-b-2 border-purple-400"
                  : "text-white/60 hover:text-white"
              }`}
            >
              {tab.replace("-", " ")}
            </button>
          ))}
        </div>

        {/* Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sections.map((section, index) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.05 }}
              whileHover={{ y: -4 }}
              className="relative group"
            >
              <div className="relative backdrop-blur-xl bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 hover:bg-white/[0.05] hover:border-white/[0.12] transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-1 tracking-tight">{section.title}</h3>
                    <p className="text-sm text-white/50">{section.items} items</p>
                  </div>
                  <span
                    className={`text-xs px-2.5 py-1 rounded-lg border ${
                      section.status === "complete"
                        ? "bg-green-500/10 text-green-400 border-green-500/20"
                        : section.status === "in-progress"
                        ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                        : "bg-white/[0.05] text-white/60 border-white/[0.08]"
                    }`}
                  >
                    {section.status}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="mb-4">
                  <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${section.progress}%` }}
                      transition={{ duration: 1, delay: 0.3 + index * 0.05 }}
                      className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-sm font-medium text-white/80 hover:bg-white/[0.05] hover:border-white/[0.12] transition-all flex items-center justify-center gap-2"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white/80 hover:bg-white/[0.05] hover:border-white/[0.12] transition-all"
                  >
                    <Eye className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
