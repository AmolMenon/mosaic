"use client";
import React from "react";
import { useKnowledgeStore } from "../../store/knowledge";
import { useKnowledge } from "../../hooks/queries";
import { clsx } from "clsx";

export function ContextPanel() {
  const { activeAssetId } = useKnowledgeStore();
  const { data, isLoading } = useKnowledge();
  
  if (isLoading) {
    return (
      <div className="p-6 h-full bg-bg-surface border-l border-border-subtle flex flex-col gap-6 animate-pulse">
        <div className="h-4 w-32 bg-border-subtle rounded mb-4"></div>
        <div className="h-24 bg-border-subtle rounded-lg"></div>
        <div className="h-24 bg-border-subtle rounded-lg"></div>
        <div className="h-24 bg-border-subtle rounded-lg"></div>
      </div>
    );
  }

  if (!activeAssetId || !data) {
    return (
      <div className="p-6 h-full bg-bg-surface border-l border-border-subtle text-text-tertiary flex flex-col items-center justify-center text-center">
        <div className="text-3xl mb-4 opacity-50">🔗</div>
        <h3 className="text-sm font-medium text-text-primary mb-1">Traceability Context</h3>
        <p className="text-xs max-w-[200px]">Select a Knowledge Asset to view its lineage and evidence.</p>
      </div>
    );
  }

  const usage = data.knowledgeUsageApollo;

  return (
    <div className="h-full bg-bg-surface border-l border-border-subtle flex flex-col overflow-y-auto">
      <div className="sticky top-0 bg-bg-surface/90 backdrop-blur border-b border-border-subtle p-6 z-10">
        <div className="text-[10px] text-text-tertiary font-mono uppercase tracking-widest flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-accent-primary" />
          Traceability Context
        </div>
      </div>

      <div className="p-6 space-y-10">
        
        {/* Current Deal Context */}
        <section className="relative">
          <div className="absolute -left-6 top-2 bottom-0 w-px bg-accent-primary/20" />
          <div className="flex items-center gap-2 mb-4">
            <div className="absolute -left-[27px] w-3 h-3 rounded-full bg-accent-primary/20 border border-accent-primary flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-accent-primary" />
            </div>
            <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider">Current Deal Context</h4>
          </div>
          <div className="p-4 bg-selection-bg border border-accent-primary/20 rounded-lg text-sm text-text-primary shadow-sm leading-relaxed relative group transition-colors hover:border-accent-primary/40">
            {usage.context}
            <div className="mt-4 pt-3 border-t border-accent-primary/10 flex items-center justify-between text-[10px] text-text-tertiary font-mono uppercase tracking-wide">
              <span className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-bg-base border border-border-strong inline-block" />
                {usage.userId}
              </span>
              <span>{new Date(usage.timestamp).toLocaleDateString()}</span>
            </div>
          </div>
        </section>

        {/* Origin Source */}
        <section className="relative">
          <div className="absolute -left-6 top-2 bottom-0 w-px bg-border-subtle" />
          <div className="flex items-center gap-2 mb-4">
            <div className="absolute -left-[27px] w-3 h-3 rounded-full bg-bg-base border border-border-strong flex items-center justify-center" />
            <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider">Origin Source</h4>
          </div>
          <div className="p-4 border border-border-subtle bg-bg-base rounded-lg hover:border-border-strong hover:shadow-md cursor-pointer transition-all group">
            <div className="flex justify-between items-start mb-3">
              <div className="text-[10px] text-accent-success uppercase font-bold tracking-widest bg-accent-success/10 px-2 py-0.5 rounded-sm">Validated Insight</div>
              <span className="text-text-tertiary group-hover:text-text-primary transition-colors">↗</span>
            </div>
            <div className="text-sm font-serif italic text-text-primary line-clamp-4 leading-relaxed">
              &quot;The 15% price premium is sustainable within the Enterprise segment due to SOC2 compliance, but creates high vulnerability to Apex in the Mid-Market.&quot;
            </div>
          </div>
        </section>

        {/* Origin Documents */}
        <section className="relative">
          <div className="flex items-center gap-2 mb-4">
            <div className="absolute -left-[27px] w-3 h-3 rounded-full bg-bg-base border border-border-strong flex items-center justify-center" />
            <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider">Source Documents</h4>
          </div>
          <div className="space-y-2">
            {[
              { id: 1, name: "Project Titan CIM v2.pdf", date: "Oct 12, 2025" },
              { id: 2, name: "Q3 Earnings Transcript.pdf", date: "Nov 04, 2025" }
            ].map(doc => (
              <div key={doc.id} className="p-3 border border-border-subtle rounded-lg bg-bg-base hover:border-border-strong hover:bg-bg-surface-hover cursor-pointer transition-all group flex items-center justify-between">
                <div className="flex items-center gap-3 overflow-hidden">
                  <span className="text-lg opacity-80 group-hover:opacity-100 transition-opacity">📄</span>
                  <div className="truncate">
                    <div className="text-sm font-medium text-text-primary truncate">{doc.name}</div>
                    <div className="text-[10px] font-mono text-text-tertiary mt-0.5">{doc.date}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
