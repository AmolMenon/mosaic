"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Folder, FileText, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        className="fixed inset-0 bg-bg-overlay backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="relative w-full max-w-2xl bg-bg-surface border border-border-strong rounded-xl shadow-modal overflow-hidden font-ui"
      >
        <div className="flex items-center px-4 py-3 border-b border-border-subtle gap-3">
          <Search className="text-accent-primary" size={20} />
          <input 
            autoFocus
            className="flex-1 bg-transparent border-none outline-none text-lg text-text-primary placeholder:text-text-tertiary"
            placeholder="Ask AI, search documents, or jump to..."
          />
          <div className="text-[10px] font-mono text-text-tertiary border border-border-subtle rounded px-1.5 py-0.5">ESC</div>
        </div>
        
        <div className="p-2 space-y-1 max-h-[60vh] overflow-y-auto">
          <div className="px-3 py-2 text-xs font-mono uppercase text-text-tertiary tracking-wider">AI Actions</div>
          <button className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-bg-surface-hover text-left transition-colors group">
            <Zap size={16} className="text-accent-warning" />
            <div>
              <div className="text-sm font-medium text-text-primary">Synthesize recent uploads</div>
              <div className="text-xs text-text-tertiary">Run AI pipeline on 4 new data room files</div>
            </div>
          </button>
          
          <div className="px-3 py-4 text-xs font-mono uppercase text-text-tertiary tracking-wider">Recent</div>
          <button className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-bg-surface-hover text-left transition-colors group">
            <Folder size={16} className="text-text-secondary" />
            <div>
              <div className="text-sm font-medium text-text-primary">Project Apollo</div>
              <div className="text-xs text-text-tertiary">Active Workspace</div>
            </div>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-bg-surface-hover text-left transition-colors group">
            <FileText size={16} className="text-text-secondary" />
            <div>
              <div className="text-sm font-medium text-text-primary">Q3 Earnings Transcript</div>
              <div className="text-xs text-text-tertiary">Data Room Document</div>
            </div>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
