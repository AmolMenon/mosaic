"use client";
import React from "react";
import { useMemoStore } from "../../store/memo";
import { useMemos } from "../../hooks/queries";

export function ContextPanel() {
  const { activeBlockId } = useMemoStore();
  const { data } = useMemos();

  if (!data) return null;
  const memo = data.memoApolloIC;

  // Mock lookup
  const block = activeBlockId === data.memoBlockPrinciple.id ? data.memoBlockPrinciple 
              : activeBlockId === data.memoBlockArgument.id ? data.memoBlockArgument 
              : null;

  if (!block) {
    return (
      <div className="p-4 h-full bg-bg-surface border-l border-border-subtle text-text-tertiary text-sm flex items-center justify-center text-center flex-col">
        <div className="text-2xl mb-2">📄</div>
        <div>Select a paragraph in the memo<br/>to inspect its underlying knowledge.</div>
      </div>
    );
  }

  return (
    <div className="p-4 h-full bg-bg-surface border-l border-border-subtle flex flex-col overflow-y-auto">
      
      {/* Traceability Header */}
      <div className="mb-6">
        <div className="text-xs text-text-tertiary font-mono uppercase tracking-wider mb-2">Traceability Inspector</div>
        <div className="text-sm font-semibold text-text-primary">Underlying Source</div>
      </div>

      <div className="space-y-6">
        {/* Source Definition */}
        <div className="p-4 bg-selection-bg border border-accent-primary rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold text-accent-primary uppercase tracking-wider px-2 py-0.5 rounded border border-accent-primary/20 bg-bg-base">
              {block.sourceType.replace('_', ' ')}
            </span>
            <span className="text-[10px] text-text-tertiary font-mono">ID: {block.sourceId}</span>
          </div>
          
          <div className="text-sm text-text-primary mb-3">
            This prose is a presentation projection of a validated knowledge asset.
          </div>
          
          <div className="text-xs text-text-secondary bg-bg-base p-2 border border-border-subtle rounded italic">
            "The renderer applied the 'Investment Committee' profile to generate the current paragraph."
          </div>
        </div>

        {/* Evidence Strength */}
        <div>
          <div className="text-xs font-semibold text-text-secondary mb-2">Evidence Strength</div>
          <div className="p-2 border border-border-subtle bg-bg-base rounded-md flex items-center gap-2">
            <span className={
              block.evidenceStrength === 'high' ? "text-accent-success" : 
              block.evidenceStrength === 'medium' ? "text-accent-warning" : "text-accent-danger"
            }>
              {block.evidenceStrength === 'high' ? '●' : block.evidenceStrength === 'medium' ? '◐' : '○'}
            </span>
            <span className="text-sm capitalize">{block.evidenceStrength}</span>
          </div>
        </div>

        {/* Version Diffing based on Knowledge */}
        <div className="pt-6 border-t border-border-subtle">
          <div className="text-xs font-semibold text-text-secondary mb-3">Version History (Knowledge Diff)</div>
          
          <div className="text-xs text-text-tertiary mb-3">
            Memos are diffed based on changes to the underlying knowledge graph, not just string comparisons.
          </div>

          <div className="space-y-2">
            {memo.currentVersion.knowledgeDiffFromPrevious?.addedInsights.map(id => (
              <div key={id} className="text-xs bg-accent-success/10 text-accent-success p-1.5 rounded border border-accent-success/20">
                + Insight Added: {id}
              </div>
            ))}
            {memo.currentVersion.knowledgeDiffFromPrevious?.changedRisks.map(id => (
              <div key={id} className="text-xs bg-accent-warning/10 text-accent-warning p-1.5 rounded border border-accent-warning/20">
                ~ Risk Changed: {id}
              </div>
            ))}
            <div className="text-xs bg-bg-base text-text-secondary p-1.5 rounded border border-border-subtle flex justify-between">
              <span>Validation Delta</span>
              <span className="font-bold text-accent-danger">-1</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
