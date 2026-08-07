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

  return (
    <AnimatePresence>
      {isOpen && (
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
                className="flex-1 bg-transparent border-none outline-none text-lg text-text-primary placeholder:text-text-tertiary focus:ring-0"
                placeholder="Ask AI, search documents, or jump to..."
              />
              <div className="flex gap-1">
                <div className="text-[10px] font-mono text-text-tertiary border border-border-subtle bg-bg-base rounded px-1.5 py-0.5 shadow-sm">ESC</div>
              </div>
            </div>
            
            <div className="p-2 space-y-1 max-h-[60vh] overflow-y-auto">
              <div className="px-3 py-2 text-[10px] font-bold font-mono uppercase text-text-tertiary tracking-wider">Suggested AI Actions</div>
              <button 
                onClick={() => { router.push('/projects/prj_01HVKM4T/data-room'); setIsOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-selection-bg text-left transition-colors group border border-transparent hover:border-accent-primary/20"
              >
                <div className="w-8 h-8 rounded-full bg-accent-warning/10 flex items-center justify-center border border-accent-warning/20">
                  <Zap size={14} className="text-accent-warning" />
                </div>
                <div>
                  <div className="text-sm font-medium text-text-primary">Synthesize recent uploads</div>
                  <div className="text-xs text-text-tertiary">Run AI pipeline on 4 new data room files</div>
                </div>
              </button>
              
              <div className="px-3 py-4 text-[10px] font-bold font-mono uppercase text-text-tertiary tracking-wider">Recent Workspaces</div>
              <button 
                onClick={() => { router.push('/projects/prj_01HVKM4T'); setIsOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-bg-surface-hover text-left transition-colors group"
              >
                <div className="w-8 h-8 rounded bg-bg-base border border-border-subtle flex items-center justify-center">
                  <Folder size={14} className="text-text-secondary" />
                </div>
                <div>
                  <div className="text-sm font-medium text-text-primary">Project Apollo</div>
                  <div className="text-xs text-text-tertiary">Active Workspace • Updated 2m ago</div>
                </div>
              </button>

              <div className="px-3 py-4 text-[10px] font-bold font-mono uppercase text-text-tertiary tracking-wider">Documents</div>
              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-bg-surface-hover text-left transition-colors group">
                <div className="w-8 h-8 rounded bg-bg-base border border-border-subtle flex items-center justify-center">
                  <FileText size={14} className="text-text-secondary" />
                </div>
                <div>
                  <div className="text-sm font-medium text-text-primary">Q3 Earnings Transcript</div>
                  <div className="text-xs text-text-tertiary">Data Room Document • Project Titan</div>
                </div>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
