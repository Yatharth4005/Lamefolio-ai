import { ExternalLink, Clock, Globe, ArrowUpRight, FolderOpen, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useGitHub } from "../context/GitHubContext";
import { getUserPortfolios } from "../lib/api";

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

  if (!isConnected) {
    return (
      <div className="p-12 border border-dashed border-white/10 rounded-3xl text-center bg-white/[0.02]">
         <Globe className="w-10 h-10 text-white/20 mx-auto mb-4" />
         <h4 className="text-white font-bold">No Connection Found</h4>
         <p className="text-white/40 text-sm mt-1">Connect your account to see your manifests.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center p-12">
         <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  if (portfolios.length === 0) {
    return (
      <div className="p-12 border border-dashed border-white/10 rounded-3xl text-center bg-white/[0.02]">
         <FolderOpen className="w-10 h-10 text-white/20 mx-auto mb-4" />
         <h4 className="text-white font-bold">No Portfolios Yet</h4>
         <p className="text-white/40 text-sm mt-1">Start a conversation to build your first portfolio.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {portfolios.map((item) => (
        <motion.div
          key={item.id}
          whileHover={{ y: -5 }}
          className="group relative p-6 bg-white/[0.03] border border-white/[0.08] rounded-3xl hover:bg-white/[0.05] transition-all"
        >
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center">
               <Globe className="w-6 h-6 text-white/40 group-hover:text-purple-400 transition-colors" />
            </div>
            <a 
              href={item.notion_url} 
              target="_blank" 
              rel="noreferrer"
              className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <ExternalLink className="w-4 h-4 text-white/40" />
            </a>
          </div>

          <h3 className="text-white font-bold mb-2 truncate pr-6">Notion Portfolio</h3>
          <p className="text-white/40 text-xs mb-6 line-clamp-1">{item.notion_url}</p>

          <div className="flex items-center gap-1.5 pt-4 border-t border-white/5">
             <Clock className="w-3 h-3 text-white/20" />
             <span className="text-[10px] uppercase font-black tracking-widest text-white/20">
                {new Date(item.created_at).toLocaleDateString()}
             </span>
          </div>

          <motion.a
            href={item.notion_url}
            target="_blank"
            className="absolute bottom-6 right-6 p-2 bg-purple-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-lg shadow-purple-500/20"
          >
            <ArrowUpRight className="w-4 h-4" />
          </motion.a>
        </motion.div>
      ))}
    </div>
  );
}
