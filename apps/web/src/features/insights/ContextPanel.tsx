import React from "react";
import { useInsightsStore } from "../../store/insights";
import { mockInsightPricing } from "@mosaic/testing";

export function ContextPanel() {
  const { activeInsightId } = useInsightsStore();

  if (!activeInsightId) {
    return (
      <div className="p-4 h-full bg-bg-surface border-l border-border-subtle text-text-tertiary text-sm flex items-center justify-center">
        Context unavailable.
      </div>
    );
  }

  const insight = mockInsightPricing;

  return (
    <div className="p-4 h-full bg-bg-surface border-l border-border-subtle flex flex-col">
      <div className="text-xs text-text-tertiary font-mono uppercase tracking-wider mb-6">Traceability Context</div>

      <div className="space-y-8">
        <div>
          <div className="text-xs font-semibold text-text-secondary mb-3">Source Question</div>
          <div className="p-3 border border-accent-primary bg-selection-bg rounded-md text-sm text-text-primary">
            Is the 15% price premium sustainable in the current macro environment?
          </div>
        </div>

        <div>
          <div className="text-xs font-semibold text-text-secondary mb-3">Referenced Documents</div>
          <div className="p-2 border border-border-subtle rounded bg-bg-base text-xs text-text-primary hover:bg-bg-surface-hover cursor-pointer transition-colors truncate">
            📄 Project Titan CIM v2.pdf
          </div>
          <div className="p-2 border border-border-subtle rounded bg-bg-base text-xs text-text-primary hover:bg-bg-surface-hover cursor-pointer transition-colors truncate mt-2">
            📄 Q3 Earnings Transcript.pdf
          </div>
        </div>

        <div>
          <div className="text-xs font-semibold text-text-secondary mb-3">Review Notes</div>
          <div className="p-3 border border-border-subtle rounded bg-bg-base text-xs text-text-secondary italic">
            "{insight.ownership.reviewNotes}"
            <div className="mt-2 font-mono text-[10px] text-text-tertiary not-italic uppercase">
              - {insight.ownership.reviewerId}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
