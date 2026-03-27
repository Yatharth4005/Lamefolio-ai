import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Github, ArrowRight, Sparkles, Wand2, CheckCircle2, User } from "lucide-react";
import { useGitHub } from "../context/GitHubContext";

export function Onboarding() {
  const { displayName, setDisplayName } = useGitHub();
  const [inputValue, setInputValue] = useState("");
  const [step, setStep] = useState(1);
  const [isVisible, setIsVisible] = useState(!displayName);

  React.useEffect(() => {
    if (displayName) setIsVisible(false);
  }, [displayName]);

  if (!isVisible) return null;

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      if (inputValue.trim()) {
        setDisplayName(inputValue.trim());
        setStep(3);
        // Delay closing to show success state
        setTimeout(() => {
          setIsVisible(false);
        }, 2000);
      }
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           exit={{ opacity: 0 }}
           className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-[20px] px-6"
        >
          {/* Architectural Background Glows */}
          <div className="absolute top-[15%] left-[10%] w-[500px] h-[500px] bg-primary/20 blur-[140px] rounded-full opacity-50" />
          <div className="absolute bottom-[15%] right-[10%] w-[500px] h-[500px] bg-purple-600/10 blur-[140px] rounded-full opacity-30" />

          <motion.div
            initial={{ scale: 0.98, y: 15, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            className="relative w-full max-w-xl bg-[#0a0a0b] border border-white/[0.08] rounded-[2.5rem] p-12 shadow-[0_48px_100px_rgba(0,0,0,0.8)] overflow-hidden"
          >
            {/* High-Precision Progress Bar */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-white/[0.04]">
               <motion.div 
                 className="h-full bg-primary shadow-[0_0_15px_rgba(94,106,210,0.8)]"
                 animate={{ width: `${(step / 3) * 100}%` }}
                 transition={{ type: "spring", damping: 20, stiffness: 100 }}
               />
            </div>

            <div className="relative z-10">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-center"
                  >
                    <div className="w-16 h-16 bg-white/[0.03] border border-white/[0.08] rounded-2xl flex items-center justify-center mx-auto mb-10 relative group">
                       <div className="absolute inset-x-0 bottom-0 h-1/2 bg-primary/20 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                       <Wand2 className="w-7 h-7 text-primary relative z-10" />
                    </div>
                    <h2 className="text-4xl font-black text-white mb-4 tracking-[-0.03em] leading-tight">
                       Welcome to <span className="text-primary">lamefolio.ai</span>
                    </h2>
                    <p className="text-white/40 text-[17px] font-medium mb-12 max-w-md mx-auto leading-relaxed">
                       Synthesize your professional history into high-converting portfolios with the power of modern AI.
                    </p>
                    <button
                      onClick={handleNext}
                      className="w-full py-4.5 bg-white text-black rounded-xl font-black text-[12px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:translate-y-[-2px] hover:shadow-2xl hover:shadow-white/10 transition-all group"
                    >
                      Getting Started
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <p className="mt-8 text-[10px] font-bold text-white/20 uppercase tracking-widest">Setup takes less than 30 seconds</p>
                  </motion.div>
                )}

                 {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <div className="flex items-center gap-5 mb-10">
                      <div className="w-12 h-12 bg-white/[0.03] border border-white/[0.08] rounded-xl flex items-center justify-center shrink-0">
                         <User className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-black text-white tracking-tight">
                           What should we call you?
                        </h2>
                        <p className="text-[14px] text-white/30 font-medium">
                           Setup your workspace identity.
                        </p>
                      </div>
                    </div>
                    
                    <div className="relative mb-10 group">
                      <input
                        type="text"
                        placeholder="e.g. Yatharth"
                        autoFocus
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="w-full bg-white/[0.02] border border-white/[0.1] rounded-2xl py-5 px-6 text-white placeholder:text-white/10 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all text-xl font-bold tracking-tight outline-none"
                        onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                      />
                      <Sparkles className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 text-primary/20 group-focus-within:text-primary/40 transition-colors" />
                    </div>

                    <button
                      onClick={handleNext}
                      disabled={!inputValue.trim()}
                      className="w-full py-4.5 bg-white text-black rounded-xl font-black text-[12px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:translate-y-[-2px] hover:shadow-2xl hover:shadow-white/10 transition-all disabled:opacity-20 disabled:translate-y-0"
                    >
                      Continue to Workspace
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <div className="w-20 h-20 bg-green-500/5 border border-green-500/20 rounded-full flex items-center justify-center mx-auto mb-10 relative">
                       <div className="absolute inset-0 bg-green-500/10 blur-xl rounded-full" />
                       <CheckCircle2 className="w-10 h-10 text-green-400 relative z-10" />
                    </div>
                    <h2 className="text-4xl font-black text-white mb-4 tracking-tight leading-tight">
                       Welcome, <span className="text-primary">{displayName}</span>.
                    </h2>
                    <p className="text-white/40 text-[17px] font-medium leading-relaxed max-w-sm mx-auto">
                       Your workspace is ready. Synthesizing experience clouds...
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
