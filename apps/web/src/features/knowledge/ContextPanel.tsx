"use client";
import React from "react";
import { useKnowledgeStore } from "../../store/knowledge";
import { useKnowledge } from "../../hooks/queries";

export function ContextPanel() {
  const { activeAssetId } = useKnowledgeStore();
  const { data } = useKnowledge();
  
  if (!activeAssetId) {
    return (
      <div className="p-4 h-full bg-bg-surface border-l border-border-subtle text-text-tertiary text-sm flex items-center justify-center text-center">
        Select a Knowledge Asset<br/>to view traceability.
      </div>
    );
  }

  if (!data) return null;
  const usage = data.knowledgeUsageApollo;

  return (
    <div className="p-4 h-full bg-bg-surface border-l border-border-subtle flex flex-col">
      <div className="text-xs text-text-tertiary font-mono uppercase tracking-wider mb-6">Traceability Context</div>

      <div className="space-y-8">
        <div>
          <div className="text-xs font-semibold text-text-secondary mb-3">Current Deal Context</div>
          <div className="p-3 border border-accent-primary bg-selection-bg rounded-md text-sm text-text-primary shadow-sm leading-snug">
            {usage.context}
          </div>
          <div className="mt-2 flex items-center justify-between text-[10px] text-text-tertiary font-mono uppercase">
            <span>By: {usage.userId}</span>
            <span>{new Date(usage.timestamp).toLocaleDateString()}</span>
          </div>
        </div>

        <div>
          <div className="text-xs font-semibold text-text-secondary mb-3">Origin Source</div>
          <div className="p-3 border border-border-subtle bg-bg-base rounded-md hover:bg-bg-surface-hover cursor-pointer transition-colors">
            <div className="text-[10px] text-accent-success uppercase font-bold mb-1">Validated Insight</div>
            <div className="text-xs text-text-primary line-clamp-3">
              "The 15% price premium is sustainable within the Enterprise segment due to SOC2 compliance, but creates high vulnerability to Apex in the Mid-Market."
            </div>
          </div>
        </div>

        <div>
          <div className="text-xs font-semibold text-text-secondary mb-3">Origin Documents</div>
          <div className="p-2 border border-border-subtle rounded bg-bg-base text-xs text-text-primary hover:bg-bg-surface-hover cursor-pointer transition-colors truncate">
            📄 Project Titan CIM v2.pdf
          </div>
          <div className="p-2 border border-border-subtle rounded bg-bg-base text-xs text-text-primary hover:bg-bg-surface-hover cursor-pointer transition-colors truncate mt-2">
            📄 Q3 Earnings Transcript.pdf
          </div>
        </div>
      </div>
    </div>
  );
}
