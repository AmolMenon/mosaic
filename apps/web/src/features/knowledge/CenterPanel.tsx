"use client";
import React, { useState } from "react";
import { useKnowledgeStore } from "../../store/knowledge";
import { useKnowledge } from "../../hooks/queries";
import { clsx } from "clsx";

export function CenterPanel() {
  const { activeAssetId } = useKnowledgeStore();
  const { data, isLoading } = useKnowledge();
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex-1 h-full p-8 flex flex-col gap-8 animate-pulse bg-bg-base">
        <div className="w-1/3 h-10 bg-border-subtle rounded mb-4"></div>
        <div className="w-2/3 h-4 bg-border-subtle rounded"></div>
        <div className="grid grid-cols-2 gap-6 mt-8">
          <div className="col-span-2 h-32 bg-border-subtle rounded-lg"></div>
          <div className="h-48 bg-border-subtle rounded-lg"></div>
          <div className="h-48 bg-border-subtle rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!data || !activeAssetId) {
    return (
      <div className="flex-1 h-full flex flex-col items-center justify-center bg-bg-base text-text-tertiary">
        <div className="w-24 h-24 mb-6 rounded-full bg-bg-surface border-2 border-border-dashed flex items-center justify-center">
          <span className="text-4xl">🕸️</span>
        </div>
        <h3 className="text-xl font-medium text-text-primary mb-2">Knowledge Graph Explorer</h3>
        <p className="text-sm max-w-md text-center">Select an institutional principle or asset from the left panel to explore its origins, reuse, and evolution.</p>
      </div>
    );
  }

  const asset = data.knowledgeAssetPricing; // We'd lookup by activeAssetId
  const principle = data.principlePricingPower;
  const challenge = data.challengeHelios;

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-bg-base px-10 py-12 scroll-smooth">
      
      {/* Header */}
      <div className="mb-12 max-w-4xl relative">
        <div className="absolute -left-10 top-0 bottom-0 w-1 bg-gradient-to-b from-accent-primary to-transparent rounded-full opacity-50" />
        <div className="flex items-center gap-3 mb-6">
          <div className="text-[10px] font-bold text-accent-primary uppercase tracking-widest bg-accent-primary/10 px-3 py-1.5 rounded-full border border-accent-primary/20 backdrop-blur-sm">
            Institutional Principle
          </div>
          {asset.isPinned && <span className="text-xs flex items-center gap-1.5 bg-bg-surface px-2 py-1 rounded-full border border-border-strong">📌 Pinned</span>}
        </div>
        <h1 className="text-4xl font-bold text-text-primary mb-6 leading-tight tracking-tight">{asset.title}</h1>
        <div className="text-lg text-text-secondary leading-relaxed max-w-3xl font-serif">
          {asset.summary}
        </div>
      </div>

      <div className="max-w-4xl grid grid-cols-2 gap-6 mb-12">
        
        {/* The Principle Statement */}
        <div className="col-span-2 p-8 bg-gradient-to-br from-selection-bg to-bg-base border border-accent-primary/30 rounded-xl shadow-sm relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-64 h-64 bg-accent-primary/5 rounded-full blur-3xl -mr-20 -mt-20 transition-transform group-hover:scale-110 duration-700" />
          <div className="text-xs font-mono uppercase tracking-widest text-accent-primary mb-4 relative z-10 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-accent-primary animate-pulse" />
            Core Principle
          </div>
          <div className="text-2xl font-serif italic text-text-primary leading-relaxed relative z-10">
            &quot;{principle.statement}&quot;
          </div>
        </div>

        {/* Confidence Metrics */}
        <div className="p-6 bg-bg-surface border border-border-subtle rounded-xl hover:border-border-strong transition-colors shadow-sm">
          <div className="text-xs font-mono uppercase tracking-wider text-text-tertiary mb-6 flex items-center gap-2">
            <span>📊</span> Institutional Confidence
          </div>
          <div className="grid grid-cols-2 gap-y-8 gap-x-4">
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-text-primary tracking-tight mb-1">{asset.confidence.numberOfUses}</span>
              <span className="text-xs text-text-secondary font-medium">Total Uses</span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-accent-success tracking-tight mb-1">{asset.confidence.successfulValidations}</span>
              <span className="text-xs text-text-secondary font-medium">Successful Validations</span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-bold text-accent-danger tracking-tight mb-1">{asset.confidence.contradictions}</span>
              <span className="text-xs text-text-secondary font-medium">Contradictions</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-text-primary tracking-tight mt-3 mb-1">{new Date(asset.confidence.lastReviewed).toLocaleDateString()}</span>
              <span className="text-xs text-text-secondary font-medium">Last Reviewed</span>
            </div>
          </div>
        </div>

        {/* Interactive Relationship Explorer (Visualizer) */}
        <div className="p-6 bg-bg-surface border border-border-subtle rounded-xl hover:border-border-strong transition-colors shadow-sm relative overflow-hidden">
          <div className="text-xs font-mono uppercase tracking-wider text-text-tertiary mb-6 flex items-center gap-2">
            <span>🕸️</span> Knowledge Graph Explorer
          </div>
          
          <div className="space-y-6 relative before:absolute before:left-3 before:top-3 before:bottom-3 before:w-px before:bg-gradient-to-b before:from-border-strong before:via-border-subtle before:to-border-subtle">
            
            {[
              { id: 'origin', label: 'Origin', name: 'Project Titan', type: 'origin', color: 'border-text-primary' },
              { id: 'current', label: 'Current Context', name: 'Project Apollo', type: 'current', color: 'border-accent-primary bg-selection-bg' },
              { id: 'prior', label: 'Prior Usage', name: 'Project Helios', type: 'prior', color: 'border-text-tertiary' },
            ].map((node) => (
              <div 
                key={node.id}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                className={clsx(
                  "relative pl-10 py-1 transition-all duration-300 cursor-pointer rounded-lg",
                  hoveredNode === node.id ? "bg-bg-surface-hover -ml-2 pl-12" : ""
                )}
              >
                <div className={clsx(
                  "absolute left-[10px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 transition-transform duration-300 z-10",
                  node.color,
                  node.type === 'current' ? "bg-bg-base" : "bg-bg-surface",
                  hoveredNode === node.id ? "scale-150" : ""
                )} />
                <div className="text-[10px] font-mono text-text-tertiary mb-0.5 uppercase tracking-wide">{node.label}</div>
                <div className={clsx(
                  "font-semibold transition-colors duration-300",
                  node.type === 'current' ? "text-accent-primary" : "text-text-primary"
                )}>
                  {node.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Challenges & Revisions */}
      <div className="max-w-4xl border-t border-border-subtle pt-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-sm font-bold font-mono uppercase tracking-widest text-text-secondary flex items-center gap-3">
            <span className="w-8 h-px bg-border-strong inline-block"></span>
            Institutional Learning
          </h2>
          <button className="text-xs font-medium bg-bg-base hover:bg-bg-surface border border-border-strong hover:border-text-primary px-4 py-2 rounded-full transition-all text-text-primary shadow-sm hover:shadow">
            Challenge Principle
          </button>
        </div>

        <div className="p-6 border border-accent-warning/20 bg-accent-warning/5 rounded-xl transition-all hover:bg-accent-warning/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-accent-warning/20 flex items-center justify-center text-accent-warning">⚠️</div>
            <span className="text-xs font-bold uppercase tracking-widest text-accent-warning">Historical Challenge Resolved</span>
          </div>
          
          <div className="mb-6 pl-11">
            <div className="text-xs font-mono text-text-tertiary mb-2 uppercase tracking-wide">During Project Helios</div>
            <div className="text-base italic text-text-primary border-l-2 border-accent-warning/40 pl-4 py-1 leading-relaxed">
              &quot;Helios data showed Mid-Market churn actually accelerates at 6% during high interest rate environments.&quot;
            </div>
          </div>

          <div className="pt-5 border-t border-accent-warning/10 pl-11">
            <div className="text-xs font-bold text-text-secondary uppercase mb-2 tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-success"></span>
              Resolution: {challenge.resolution}
            </div>
            <div className="text-sm text-text-secondary leading-relaxed">
              {challenge.resolutionNotes}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
