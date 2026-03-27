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
      <div className="p-16 border border-dashed border-black/[0.1] dark:border-white/[0.1] rounded-[2.5rem] text-center bg-black/[0.02] dark:bg-white/[0.02]">
         <Globe className="w-12 h-12 text-foreground/10 mx-auto mb-6" />
         <h4 className="text-xl font-bold text-foreground">No Connection Found</h4>
         <p className="text-base text-foreground/40 mt-2 font-medium">Connect your account to see your portfolios.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center p-20">
         <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (portfolios.length === 0) {
    return (
      <div className="p-16 border border-dashed border-black/[0.1] dark:border-white/[0.1] rounded-[2.5rem] text-center bg-black/[0.02] dark:bg-white/[0.02]">
         <FolderOpen className="w-12 h-12 text-foreground/10 mx-auto mb-6" />
         <h4 className="text-xl font-bold text-foreground">No Portfolios Yet</h4>
         <p className="text-base text-foreground/40 mt-2 font-medium">Start a conversation to build your first portfolio.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {portfolios.map((item) => (
          <motion.a
            key={item.id}
            href={item.notion_url}
            target="_blank"
            rel="noreferrer"
            whileHover={{ y: -6 }}
            className="group relative p-8 bg-white dark:bg-white/[0.03] border border-black/[0.1] dark:border-white/[0.08] rounded-[2rem] hover:border-primary/30 shadow-sm hover:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.12)] transition-all cursor-pointer block"
          >
            <div className="flex justify-between items-start mb-8">
              <div className="w-14 h-14 bg-black/[0.03] dark:bg-white/[0.05] border border-black/[0.05] dark:border-white/[0.1] rounded-2xl flex items-center justify-center transition-colors group-hover:border-primary/20">
                 <Globe className="w-7 h-7 text-foreground/40 group-hover:text-primary transition-colors" />
              </div>
              <div className="flex gap-2.5">
                <div 
                  onClick={(e) => handleDeleteClick(e, item.id)}
                  className="p-2.5 bg-black/[0.03] dark:bg-white/[0.05] border border-black/[0.05] dark:border-white/[0.1] rounded-xl hover:bg-red-500/10 hover:border-red-500/20 group/del transition-all"
                  title="Delete Portfolio"
                >
                  <Trash2 className="w-4 h-4 text-foreground/20 group-hover/del:text-red-400 transition-colors" />
                </div>
                <div className="p-2.5 bg-black/[0.03] dark:bg-white/[0.05] border border-black/[0.05] dark:border-white/[0.1] rounded-xl group-hover:bg-primary/5 transition-all">
                  <ExternalLink className="w-4 h-4 text-foreground/40 group-hover:text-primary transition-colors" />
                </div>
              </div>
            </div>

            <h3 className="text-xl font-bold text-foreground mb-3 truncate pr-6 group-hover:text-primary transition-colors">Notion Portfolio</h3>
            <p className="text-foreground/40 text-sm font-semibold mb-8 line-clamp-1">{item.notion_url}</p>

            <div className="flex items-center gap-2 pt-6 border-t border-black/[0.05] dark:border-white/[0.05]">
               <Clock className="w-3.5 h-3.5 text-foreground/20" />
               <span className="text-[10px] uppercase font-black tracking-[0.15em] text-foreground/25">
                  Synthesized on {new Date(item.created_at).toLocaleDateString()}
               </span>
            </div>
          </motion.a>
        ))}
      </div>

      <AlertDialog open={deleteConfirmId !== null} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
        <AlertDialogContent className="bg-white dark:bg-background-secondary border border-black/[0.1] dark:border-white/[0.1] rounded-3xl p-8 shadow-2xl max-w-md">
            <AlertDialogHeader>
                <AlertDialogTitle className="text-2xl font-bold tracking-tight">Remove from Vault?</AlertDialogTitle>
                <AlertDialogDescription className="text-base text-foreground/50 font-medium leading-relaxed pt-2">
                    This will permanently remove the record from your dashboard. <br /><span className="text-red-400 font-bold">Important:</span> Your Notion page will NOT be deleted.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="mt-10 flex gap-3">
                <AlertDialogCancel className="flex-1 bg-black/[0.03] dark:bg-white/[0.05] text-foreground border-none rounded-2xl py-4 font-bold text-[12px] uppercase tracking-widest hover:bg-black/[0.06] dark:hover:bg-white/[0.1] transition-colors">
                    Cancel
                </AlertDialogCancel>
                <AlertDialogAction 
                    onClick={() => deleteConfirmId && confirmDelete(deleteConfirmId)}
                    className="flex-1 bg-red-500 text-white border-none rounded-2xl py-4 font-bold text-[12px] uppercase tracking-widest hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
                >
                    Confirm Delete
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

