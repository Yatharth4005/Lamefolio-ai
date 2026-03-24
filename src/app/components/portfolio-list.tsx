import { ExternalLink, Clock, Globe, ArrowUpRight, FolderOpen, Loader2, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useGitHub } from "../context/GitHubContext";
import { getUserPortfolios, deletePortfolio } from "../lib/api";

interface Portfolio {
  id: number;
  user_handle: string;
  notion_url: string;
  theme: string;
  created_at: string;
}

export function PortfolioList() {
  const { githubHandle, isConnected } = useGitHub();
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (githubHandle && isConnected) {
      loadPortfolios();
    }
  }, [githubHandle, isConnected]);

  const loadPortfolios = async () => {
    try {
      setLoading(true);
      const data = await getUserPortfolios(githubHandle);
      setPortfolios(data.portfolios);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!githubHandle) return;
    
    if (!confirm("Are you sure you want to delete this portfolio?")) return;

    try {
      await deletePortfolio(githubHandle, id);
      setPortfolios(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete portfolio");
    }
  };

  if (!isConnected) {
    return (
      <div className="p-12 border border-dashed border-border rounded-2xl text-center">
        <Globe className="w-8 h-8 text-foreground/20 mx-auto mb-3" />
        <h4 className="text-sm font-semibold text-foreground/60 mb-1">No Connection Found</h4>
        <p className="text-foreground/30 text-xs">Connect your account to see your portfolios.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        {/* Neutral spinner — inherits foreground color */}
        <Loader2 className="w-6 h-6 text-foreground/30 animate-spin" />
      </div>
    );
  }

  if (portfolios.length === 0) {
    return (
      <div className="p-12 border border-dashed border-border rounded-2xl text-center">
        <FolderOpen className="w-8 h-8 text-foreground/20 mx-auto mb-3" />
        <h4 className="text-sm font-semibold text-foreground/60 mb-1">No Portfolios Yet</h4>
        <p className="text-foreground/30 text-xs">Start a conversation to build your first portfolio.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {portfolios.map((item) => (
        <motion.a
          key={item.id}
          href={item.notion_url}
          target="_blank"
          rel="noreferrer"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="group p-5 bg-muted border border-border rounded-2xl hover:border-foreground/20 transition-colors block"
        >
          <div className="flex justify-between items-start mb-5">
            <div className="w-10 h-10 bg-background border border-border rounded-xl flex items-center justify-center">
              <Globe className="w-5 h-5 text-foreground/40" />
            </div>
            <div className="flex gap-1.5">
              <button
                onClick={(e) => handleDelete(e, item.id)}
                className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                title="Delete Portfolio"
              >
                <Trash2 className="w-4 h-4 text-foreground/20 hover:text-red-400 transition-colors" />
              </button>
              <div className="p-1.5 rounded-lg group-hover:bg-secondary transition-colors">
                <ExternalLink className="w-4 h-4 text-foreground/30 group-hover:text-foreground/60 transition-colors" />
              </div>
            </div>
          </div>

          <h3 className="text-sm font-semibold text-foreground mb-1">Notion Portfolio</h3>
          <p className="text-foreground/30 text-xs mb-4 truncate">{item.notion_url}</p>

          <div className="flex items-center gap-1.5 pt-3 border-t border-border">
            <Clock className="w-3 h-3 text-foreground/20" />
            <span className="text-[10px] text-foreground/30">
              {new Date(item.created_at).toLocaleDateString()}
            </span>
          </div>
        </motion.a>
      ))}
    </div>
  );
}

