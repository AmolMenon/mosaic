"use client";
import React from "react";
import { Project } from "@mosaic/contracts";

export function LeftPanel({ project }: { project: Project }) {
  return (
    <div className="p-4 h-full flex flex-col">
      <div className="mb-6">
        <div className="text-xs text-text-tertiary font-mono uppercase tracking-wider mb-1">Active Project</div>
        <div className="font-semibold text-sm truncate">{project.name}</div>
        <div className="text-xs text-accent-primary mt-1">{project.stage.replace('_', ' ').toUpperCase()}</div>
      </div>
      
      <nav className="flex-1 space-y-1">
        <a href="#" className="block px-2 py-1.5 text-sm rounded bg-selection-bg text-accent-primary font-medium">Workspace</a>
        <a href="#" className="block px-2 py-1.5 text-sm rounded text-text-secondary hover:bg-bg-surface-hover transition-colors">Smart Data Room</a>
        <a href="#" className="block px-2 py-1.5 text-sm rounded text-text-secondary hover:bg-bg-surface-hover transition-colors">Questions</a>
        <a href="#" className="block px-2 py-1.5 text-sm rounded text-text-secondary hover:bg-bg-surface-hover transition-colors">Memo Canvas</a>
      </nav>
      
      <div className="mt-auto pt-4 border-t border-border-subtle">
        <div className="text-xs text-text-tertiary">Owner: {project.owner}</div>
        <div className="text-[10px] text-text-tertiary mt-2 font-mono">CMD+K to search</div>
      </div>
    </div>
  );
}
