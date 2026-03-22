import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Github, ArrowRight, Sparkles, Wand2, CheckCircle2 } from "lucide-react";
import { useGitHub } from "../context/GitHubContext";

export function Onboarding() {
  const { githubHandle, setGithubHandle } = useGitHub();
  const [inputValue, setInputValue] = useState("");
  const [step, setStep] = useState(1);
  const [isVisible, setIsVisible] = useState(!githubHandle);

  if (!isVisible) return null;

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      if (inputValue.trim()) {
        setGithubHandle(inputValue.trim());
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
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0a0f]/90 backdrop-blur-2xl px-6"
        >
          {/* Background Decorative Blobs */}
          <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-purple-600/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full" />

          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="relative w-full max-w-xl bg-white/[0.03] border border-white/[0.08] rounded-[3rem] p-12 shadow-2xl overflow-hidden"
          >
            {/* Animated Progress Bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-white/[0.05]">
               <motion.div 
                 className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                 animate={{ width: `${(step / 3) * 100}%` }}
                 transition={{ duration: 0.5 }}
               />
            </div>

            <div className="relative z-10">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="text-center"
                  >
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-purple-500/20">
                       <Wand2 className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-4xl font-black text-white mb-4 tracking-tight">
                       Welcome to <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">PortfolioAI</span>
                    </h2>
                    <p className="text-white/40 text-lg mb-10">
                       The most advanced AI-powered portfolio engine. Let's get you set up in seconds.
                    </p>
                    <button
                      onClick={handleNext}
                      className="w-full py-5 bg-white text-gray-950 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-white/90 transition-all group"
                    >
                      Getting Started
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <div className="w-16 h-16 bg-white/[0.05] border border-white/[0.1] rounded-2xl flex items-center justify-center mb-8">
                       <Github className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-black text-white mb-3 tracking-tight">
                       Connect your GitHub
                    </h2>
                    <p className="text-white/40 mb-8">
                       We'll use your username to personalize your dashboard and sync your best work.
                    </p>
                    
                    <div className="relative mb-8">
                      <input
                        type="text"
                        placeholder="Enter your GitHub username"
                        autoFocus
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl py-5 px-6 text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 transition-all text-xl font-medium"
                        onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                      />
                      <Sparkles className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 text-purple-400/30" />
                    </div>

                    <button
                      onClick={handleNext}
                      disabled={!inputValue.trim()}
                      className="w-full py-5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:opacity-90 transition-all disabled:opacity-50"
                    >
                      Continue
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-10"
                  >
                    <div className="w-24 h-24 bg-green-500/10 border-2 border-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8 relative">
                       <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full animate-pulse" />
                       <CheckCircle2 className="w-12 h-12 text-green-400 relative z-10" />
                    </div>
                    <h2 className="text-4xl font-black text-white mb-4 tracking-tight">
                       You're all set, <span className="text-purple-400">{inputValue}</span>!
                    </h2>
                    <p className="text-white/40 text-lg">
                       Welcome back. Preparing your personalized experience...
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
