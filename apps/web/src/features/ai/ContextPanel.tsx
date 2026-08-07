"use client";
import React from "react";
import { useAiStore } from "../../store/ai";
import { useAI } from "../../hooks/queries";

export function ContextPanel() {
  const { activeProposalId } = useAiStore();
  const { data } = useAI();

  if (!activeProposalId) {
    return (
      <div className="p-4 h-full bg-bg-surface border-l border-border-subtle text-text-tertiary text-sm flex items-center justify-center text-center">
        Select an insight to review<br/>its underlying AI reasoning.
      </div>
    );
  }

  if (!data) return null;
  const proposal = data.hypothesisProposal; // Mapped by ID in real app

  return (
    <div className="p-4 h-full bg-bg-surface border-l border-border-subtle flex flex-col overflow-y-auto">
      <div className="text-xs text-text-tertiary font-mono uppercase tracking-wider mb-6">AI Reasoning Trace</div>

      <div className="space-y-6">
        
        {/* Why Suggested */}
        <div>
          <div className="text-xs font-semibold text-text-secondary mb-2">Why was this suggested?</div>
          <div className="text-sm text-text-primary p-3 bg-bg-base border border-border-subtle rounded leading-snug">
            {proposal.reasoning.whySuggested}
          </div>
        </div>

        {/* Supporting Evidence */}
        <div>
          <div className="text-xs font-semibold text-text-secondary mb-2 flex justify-between">
            <span>Supporting Evidence</span>
            <span className="text-text-tertiary">{proposal.reasoning.supportingEvidenceIds.length}</span>
          </div>
          <div className="space-y-1">
            {proposal.reasoning.supportingEvidenceIds.map((id: string) => (
              <div key={id} className="text-xs p-2 border border-border-subtle rounded bg-bg-base hover:bg-bg-surface-hover cursor-pointer truncate text-accent-primary">
                📄 Q3 Earnings Transcript (Paragraph 42)
              </div>
            ))}
          </div>
        </div>

        {/* Referenced Principles */}
        <div>
          <div className="text-xs font-semibold text-text-secondary mb-2 flex justify-between">
            <span>Referenced Principles</span>
            <span className="text-text-tertiary">{proposal.reasoning.institutionalPrinciples.length}</span>
          </div>
          <div className="space-y-1">
            {proposal.reasoning.institutionalPrinciples.map((id: string) => (
              <div key={id} className="text-xs p-2 border border-border-subtle rounded bg-bg-base hover:bg-bg-surface-hover cursor-pointer truncate text-accent-success">
                💡 Enterprise Price Premium Tolerance
              </div>
            ))}
          </div>
        </div>

        {/* Assumptions & Uncertainty */}
        <div className="pt-4 border-t border-border-subtle">
          <div className="text-xs font-semibold text-text-secondary mb-2">Assumptions Made</div>
          <ul className="list-disc pl-4 text-xs text-text-primary space-y-1 mb-4">
            {proposal.reasoning.assumptionsMade.map((a: string, i: number) => <li key={i}>{a}</li>)}
          </ul>

          <div className="text-xs font-semibold text-accent-warning mb-2">Uncertainty Remaining</div>
          <div className="text-xs text-text-secondary p-2 bg-accent-warning/10 border border-accent-warning/30 rounded">
            {proposal.reasoning.uncertaintyRemaining}
          </div>
        </div>

      </div>
    </div>
  );
}
