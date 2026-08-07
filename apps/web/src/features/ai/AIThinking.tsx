"use client";
import React from "react";
import { motion } from "framer-motion";
import { Sparkles, BrainCircuit, Search, FileSearch } from "lucide-react";
import clsx from "clsx";

export function AIThinking({ step = 0 }: { step?: number }) {
  const steps = [
    { icon: Search, label: "Scanning data room..." },
    { icon: FileSearch, label: "Extracting key insights..." },
    { icon: BrainCircuit, label: "Synthesizing evidence..." },
    { icon: Sparkles, label: "Drafting proposals..." },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-8 font-ui">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-24 h-24 mb-8"
      >
        <div className="absolute inset-0 bg-accent-primary/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute inset-2 bg-bg-surface border border-border-strong rounded-full shadow-lg flex items-center justify-center z-10">
          <Sparkles className="text-accent-primary animate-pulse" size={32} />
        </div>
        
        {/* Orbiting particles */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border border-dashed border-border-subtle"
        >
          <div className="absolute top-0 left-1/2 w-2 h-2 bg-accent-primary rounded-full shadow-[0_0_8px_var(--color-accent-primary)] -translate-x-1/2 -translate-y-1/2" />
        </motion.div>
      </motion.div>

      <h3 className="text-lg font-semibold text-text-primary mb-6">AI Teammate is working</h3>

      <div className="w-full max-w-sm space-y-4">
        {steps.map((s, idx) => {
          const isActive = idx === step;
          const isPast = idx < step;
          const Icon = s.icon;
          
          return (
            <div 
              key={idx} 
              className={clsx(
                "flex items-center gap-4 transition-all duration-300",
                isActive ? "opacity-100" : isPast ? "opacity-50" : "opacity-20"
              )}
            >
              <div className={clsx(
                "w-8 h-8 rounded-full flex items-center justify-center border transition-colors duration-300",
                isActive ? "border-accent-primary bg-selection-bg text-accent-primary shadow-[0_0_12px_rgba(255,255,255,0.1)]" : 
                isPast ? "border-accent-success bg-accent-success/10 text-accent-success" : 
                "border-border-subtle bg-bg-base text-text-tertiary"
              )}>
                <Icon size={14} />
              </div>
              <div className="flex-1">
                <div className={clsx("text-sm font-medium transition-colors", isActive ? "text-text-primary" : "text-text-secondary")}>
                  {s.label}
                </div>
                {isActive && (
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="h-0.5 bg-accent-primary mt-2 rounded-full"
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
