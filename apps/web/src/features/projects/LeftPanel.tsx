"use client";
import React, { useState } from "react";
import { Project } from "@mosaic/contracts";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { motion } from "framer-motion";
import { 
  Folder, HardDrive, MessageSquare, FileText, ChevronRight, 
  Settings, Users, Activity, Star, Clock, Search
} from "lucide-react";

export function LeftPanel({ project }: { project: Project }) {
  const pathname = usePathname();
  const [isFavorite, setIsFavorite] = useState(false);

  const navItems = [
    { name: "Workspace", path: `/projects/${project.id}`, icon: Folder },
    { name: "Smart Data Room", path: `/projects/${project.id}/data-room`, icon: HardDrive },
    { name: "Q&A Matrix", path: `/projects/${project.id}/questions`, icon: MessageSquare },
    { name: "Memo Canvas", path: `/projects/${project.id}/memo`, icon: FileText },
  ];

  return (
    <div className="h-full flex flex-col font-ui bg-bg-surface border-r border-border-subtle w-64 flex-shrink-0 relative overflow-hidden">
      
      {/* Workspace Header */}
      <div className="p-4 border-b border-border-subtle hover:bg-bg-surface-hover transition-colors cursor-pointer group">
        <div className="flex items-center gap-2 text-xs text-text-tertiary mb-1">
          <Link href="/" className="hover:text-text-primary transition-colors">Home</Link>
          <ChevronRight size={12} />
          <span>Projects</span>
        </div>
        <div className="flex justify-between items-center">
          <div className="font-bold text-base text-text-primary truncate">{project.name}</div>
          <button 
            onClick={(e) => { e.preventDefault(); setIsFavorite(!isFavorite); }}
            className={clsx("transition-colors", isFavorite ? "text-accent-warning" : "text-text-tertiary opacity-0 group-hover:opacity-100 hover:text-text-secondary")}
          >
            <Star size={16} className={isFavorite ? "fill-current" : ""} />
          </button>
        </div>
        <div className="flex gap-2 mt-2">
          <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 bg-accent-primary/10 text-accent-primary rounded border border-accent-primary/20">
            {project.stage.replace('_', ' ')}
          </span>
          <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 bg-bg-base text-text-tertiary rounded border border-border-subtle">
            Updated 2h ago
          </span>
        </div>
      </div>
      
      {/* Quick Search Trigger */}
      <div className="p-3">
        <button 
          onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
          className="w-full flex items-center justify-between px-3 py-1.5 bg-bg-base border border-border-strong rounded-md text-sm text-text-tertiary hover:border-accent-primary hover:text-text-secondary transition-all group"
        >
          <div className="flex items-center gap-2">
            <Search size={14} className="group-hover:text-accent-primary transition-colors" />
            <span>Search project...</span>
          </div>
          <div className="flex gap-1">
            <kbd className="font-mono text-[10px] px-1 rounded bg-bg-surface border border-border-subtle">⌘</kbd>
            <kbd className="font-mono text-[10px] px-1 rounded bg-bg-surface border border-border-subtle">K</kbd>
          </div>
        </button>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-6">
        <div>
          <div className="px-2 text-[10px] font-bold text-text-tertiary uppercase tracking-wider mb-2">Core Tools</div>
          <nav className="space-y-0.5">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              const Icon = item.icon;
              return (
                <Link 
                  key={item.name} 
                  href={item.path} 
                  className={clsx(
                    "flex items-center justify-between px-3 py-2 text-sm rounded-lg font-medium transition-all duration-200 group",
                    isActive 
                      ? "bg-selection-bg text-accent-primary" 
                      : "text-text-secondary hover:text-text-primary hover:bg-bg-base"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={16} className={clsx(isActive ? "text-accent-primary" : "text-text-tertiary group-hover:text-text-secondary")} />
                    {item.name}
                  </div>
                  {isActive && (
                    <motion.div layoutId="activeNavIndicator" className="w-1.5 h-1.5 rounded-full bg-accent-primary shadow-[0_0_8px_var(--color-accent-primary)]" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div>
          <div className="px-2 text-[10px] font-bold text-text-tertiary uppercase tracking-wider mb-2">Recent History</div>
          <div className="space-y-0.5">
            <Link href={`/projects/${project.id}/data-room`} className="flex items-center gap-3 px-3 py-1.5 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-bg-base transition-colors group">
              <Clock size={14} className="text-text-tertiary group-hover:text-text-secondary" />
              <span className="truncate">CIM v2.pdf</span>
            </Link>
            <Link href={`/projects/${project.id}/questions`} className="flex items-center gap-3 px-3 py-1.5 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-bg-base transition-colors group">
              <Clock size={14} className="text-text-tertiary group-hover:text-text-secondary" />
              <span className="truncate">Pricing power validation</span>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Footer Tools */}
      <div className="mt-auto p-2 border-t border-border-subtle bg-bg-surface space-y-0.5">
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-base transition-colors group">
          <Activity size={16} className="text-text-tertiary group-hover:text-text-secondary" />
          Project Activity
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-base transition-colors group">
          <Users size={16} className="text-text-tertiary group-hover:text-text-secondary" />
          Team & Access
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-base transition-colors group">
          <Settings size={16} className="text-text-tertiary group-hover:text-text-secondary" />
          Settings
        </button>
      </div>
    </div>
  );
}
