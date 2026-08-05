"use client";
import React from "react";
import { useNarrativeStore } from "../../store/narrative";
import { useNarratives } from "../../hooks/queries";

export function ContextPanel() {
  const { activeArgumentBlockId } = useNarrativeStore();
  const { data: narrativesData } = useNarratives();

  if (!activeArgumentBlockId) {
    return (
      <div className="p-4 h-full bg-bg-surface border-l border-border-subtle text-text-tertiary text-sm flex items-center justify-center text-center">
        Select an Argument Block<br/>to view its evidence context.
      </div>
    );
  }

  const insight = narrativesData?.insightPricing; // In reality, we'd lookup the insights linked to the block

  if (!insight) return null;

  return (
    <div className="p-4 h-full bg-bg-surface border-l border-border-subtle flex flex-col">
      <div className="text-xs text-text-tertiary font-mono uppercase tracking-wider mb-6">Argument Context</div>

      <div className="space-y-8">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-semibold text-text-secondary">Referenced Insight</div>
            <div className="text-[10px] uppercase font-bold text-accent-success bg-accent-success/10 px-1.5 py-0.5 rounded">Validated</div>
          </div>
          <div className="p-3 border border-border-strong bg-bg-base rounded-md text-sm text-text-primary shadow-sm leading-snug">
            {insight.statement}
          </div>
        </div>

        <div>
          <div className="text-xs font-semibold text-text-secondary mb-3">Underlying Evidence</div>
          <div className="p-3 border-l-2 border-accent-primary bg-bg-base text-xs text-text-secondary italic">
            "Q3 enterprise revenue grew by 15% year-over-year, driven primarily by expansion in the APAC region."
            <div className="mt-2 text-[10px] text-text-tertiary not-italic font-mono uppercase">
              Source: Q3 Earnings Transcript.pdf
            </div>
          </div>
        </div>

        <div>
          <div className="text-xs font-semibold text-text-secondary mb-3">Unresolved Assumptions</div>
          <div className="p-2 border border-border-subtle bg-bg-base rounded text-xs text-text-secondary">
            Enterprise IT budgets will not be cut by more than 5% this year.
          </div>
        </div>
      </div>
    </div>
  );
}
