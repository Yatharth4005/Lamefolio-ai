import { ExternalLink, Clock, Globe, ArrowUpRight, FolderOpen, Loader2, Trash2, X } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useGitHub } from "../context/GitHubContext";
import { getUserPortfolios, deletePortfolio } from "../lib/api";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import { toast } from "sonner";

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
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

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

  const confirmDelete = async (id: number) => {
    if (!githubHandle) return;
    try {
      await deletePortfolio(githubHandle, id);
      setPortfolios(prev => prev.filter(p => p.id !== id));
      toast.success("Portfolio removed from vault");
      setDeleteConfirmId(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete portfolio");
    }
  };

  const handleDeleteClick = (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleteConfirmId(id);
  };

  if (!isConnected) {
    return (
      <div className="p-12 border border-dashed border-border rounded-3xl text-center bg-secondary">
         <Globe className="w-10 h-10 text-foreground/20 mx-auto mb-4" />
         <h4 className="text-foreground font-bold">No Connection Found</h4>
         <p className="text-foreground/40 text-sm mt-1">Connect your account to see your portfolios.</p>

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
      <div className="p-12 border border-dashed border-border rounded-3xl text-center bg-secondary">
         <FolderOpen className="w-10 h-10 text-foreground/20 mx-auto mb-4" />
         <h4 className="text-foreground font-bold">No Portfolios Yet</h4>
         <p className="text-foreground/40 text-sm mt-1">Start a conversation to build your first portfolio.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolios.map((item) => (
          <motion.a
            key={item.id}
            href={item.notion_url}
            target="_blank"
            rel="noreferrer"
            whileHover={{ y: -5 }}
            className="group relative p-6 bg-secondary border border-border rounded-3xl hover:bg-muted hover:border-sidebar-border transition-all cursor-pointer block"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-muted rounded-2xl flex items-center justify-center">
                 <Globe className="w-6 h-6 text-foreground/40 group-hover:text-purple-400 transition-colors" />
              </div>
              <div className="flex gap-2">
                <div 
                  onClick={(e) => handleDeleteClick(e, item.id)}
                  className="p-2 bg-muted rounded-lg hover:bg-red-500/10 group/del transition-colors"
                  title="Delete Portfolio"
                >
                  <Trash2 className="w-4 h-4 text-foreground/20 group-hover/del:text-red-400 transition-colors" />
                </div>
                <div className="p-2 bg-muted rounded-lg group-hover:bg-sidebar-accent transition-colors">
                  <ExternalLink className="w-4 h-4 text-foreground/40 group-hover:text-foreground transition-colors" />
                </div>
              </div>
            </div>

            <h3 className="text-foreground font-bold mb-2 truncate pr-6">Notion Portfolio</h3>
            <p className="text-foreground/40 text-xs mb-6 line-clamp-1">{item.notion_url}</p>

            <div className="flex items-center gap-1.5 pt-4 border-t border-border">
               <Clock className="w-3 h-3 text-foreground/20" />
               <span className="text-[10px] uppercase font-black tracking-widest text-foreground/20">
                  {new Date(item.created_at).toLocaleDateString()}
               </span>
            </div>
          </motion.a>
        ))}
      </div>

      <AlertDialog open={deleteConfirmId !== null} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
        <AlertDialogContent className="bg-background-secondary border border-border rounded-2xl p-6 shadow-2xl max-w-sm">
            <AlertDialogHeader>
                <AlertDialogTitle className="text-xl font-bold">Delete Portfolio?</AlertDialogTitle>
                <AlertDialogDescription className="text-sm opacity-60">
                    Are you sure you want to remove this portfolio from your vault? This will not delete the actual Notion page.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="mt-6 flex gap-3">
                <AlertDialogCancel className="flex-1 bg-secondary text-foreground hover:bg-secondary/80 border-none rounded-xl py-3 font-bold text-xs uppercase tracking-widest">
                    Cancel
                </AlertDialogCancel>
                <AlertDialogAction 
                    onClick={() => deleteConfirmId && confirmDelete(deleteConfirmId)}
                    className="flex-1 bg-red-500 text-white hover:bg-red-600 border-none rounded-xl py-3 font-bold text-xs uppercase tracking-widest"
                >
                    Delete
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

