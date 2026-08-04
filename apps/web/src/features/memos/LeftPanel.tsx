"use client";
import React from "react";
import { useMemoStore } from "../../store/memo";
import { mockMemoApolloIC } from "@mosaic/testing";
import { clsx } from "clsx";

export function LeftPanel() {
  const { activeProfile, setActiveProfile } = useMemoStore();
  
  const memo = mockMemoApolloIC;

  return (
    <div className="p-4 h-full flex flex-col bg-bg-base overflow-y-auto">
      
      {/* Rendering Profiles */}
      <div className="mb-8">
        <div className="text-xs font-mono uppercase tracking-wider text-text-tertiary mb-3">Rendering Profile</div>
        <select 
          className="w-full bg-bg-surface border border-border-strong rounded px-3 py-2 text-sm outline-none focus:border-accent-primary transition-colors"
          value={activeProfile}
          onChange={(e) => setActiveProfile(e.target.value as any)}
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
        <div className={clsx(
          "p-3 rounded border text-sm font-medium flex items-center gap-2",
          memo.readiness === 'ready' ? "bg-accent-success/10 border-accent-success/30 text-accent-success" :
          memo.readiness === 'outstanding_risks' ? "bg-accent-warning/10 border-accent-warning/30 text-accent-warning" : "bg-bg-surface"
        )}>
          {memo.readiness === 'outstanding_risks' && <span>⚠️</span>}
          <span className="capitalize">{memo.readiness.replace('_', ' ')}</span>
        </div>
      </div>

      {/* Memo Outline */}
      <div>
        <div className="text-xs font-mono uppercase tracking-wider text-text-tertiary mb-3">Document Outline</div>
        <div className="space-y-1 pl-2 border-l border-border-subtle ml-1 text-sm text-text-secondary">
          {memo.sections.map(section => (
            <div key={section.id} className="cursor-pointer hover:text-text-primary transition-colors py-1">
              {section.title}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
