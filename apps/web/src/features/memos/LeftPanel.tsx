"use client";
import React from "react";
import { useMemoStore } from "../../store/memo";
import { useMemos } from "../../hooks/queries";
import { clsx } from "clsx";

export function LeftPanel() {
  const { activeProfile, setActiveProfile } = useMemoStore();
  const { data } = useMemos();
  
  return (
    <div className="p-4 h-full flex flex-col bg-bg-base overflow-y-auto">
      
      {/* Rendering Profiles */}
      <div className="mb-8">
        <div className="text-xs font-mono uppercase tracking-wider text-text-tertiary mb-3">Rendering Profile</div>
        <select 
          className="w-full bg-bg-surface border border-border-strong rounded px-3 py-2 text-sm outline-none focus:border-accent-primary transition-colors opacity-50 cursor-not-allowed"
          value={activeProfile}
          onChange={(e) => setActiveProfile(e.target.value as any)}
          disabled
        >
          <option value="executive">Executive Summary</option>
          <option value="investment_committee">Investment Committee (IC)</option>
          <option value="partner">Partner Brief</option>
          <option value="board">Board Update</option>
        </select>
        <div className="mt-2 text-xs text-text-tertiary">
          Profiles adapt prose length and tone, but never alter underlying Narrative logic.
        </div>
      </div>

      {/* Publication Readiness */}
      <div className="mb-8">
        <div className="text-xs font-mono uppercase tracking-wider text-text-tertiary mb-3">Publication Readiness</div>
        <div className="p-3 rounded border text-sm font-medium flex items-center gap-2 bg-bg-surface text-text-tertiary">
          Not Ready
        </div>
      </div>

      {/* Memo Outline */}
      <div>
        <div className="text-xs font-mono uppercase tracking-wider text-text-tertiary mb-3">Document Outline</div>
        <div className="space-y-1 pl-2 border-l border-border-subtle ml-1 text-sm text-text-tertiary italic">
          No document outline available.
        </div>
      </div>

    </div>
  );
}
