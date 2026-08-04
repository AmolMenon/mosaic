"use client";
import React from "react";
import { useQuestionsStore } from "../../store/questions";
import { mockHypothesisPremium } from "@mosaic/testing";

export function ContextPanel() {
  const { activeQuestionId } = useQuestionsStore();

  if (!activeQuestionId) {
    return (
      <div className="p-4 h-full bg-bg-surface border-l border-border-subtle text-text-tertiary text-sm flex items-center justify-center">
        Context unavailable.
      </div>
    );
  }

  return (
    <div className="p-4 h-full bg-bg-surface border-l border-border-subtle flex flex-col">
      <div className="text-xs text-text-tertiary font-mono uppercase tracking-wider mb-6">Hypothesis Context</div>

      <div className="space-y-6">
        <div>
          <div className="text-xs font-semibold text-text-secondary mb-2">Referenced Documents</div>
          <div className="p-2 border border-border-subtle rounded bg-bg-base text-xs text-text-primary hover:bg-bg-surface-hover cursor-pointer transition-colors truncate">
            📄 Project Titan CIM v2.pdf
          </div>
          <div className="p-2 border border-border-subtle rounded bg-bg-base text-xs text-text-primary hover:bg-bg-surface-hover cursor-pointer transition-colors truncate mt-2">
            📄 Q3 Earnings Transcript.pdf
          </div>
        </div>

        <div>
          <div className="text-xs font-semibold text-text-secondary mb-2">Linked Risks</div>
          {mockHypothesisPremium.risks.map(r => (
            <div key={r.id} className="p-2 border border-accent-danger/20 bg-accent-danger/5 rounded text-xs text-text-primary">
              ⚠️ {r.statement}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
