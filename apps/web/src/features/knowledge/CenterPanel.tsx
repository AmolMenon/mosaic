"use client";
import React from "react";
import { useKnowledgeStore } from "../../store/knowledge";
import { useKnowledge } from "../../hooks/queries";

export function CenterPanel() {
  const { activeAssetId } = useKnowledgeStore();
  const { data, isLoading } = useKnowledge();

  if (isLoading) return <div className="flex-1 h-full flex items-center justify-center text-text-tertiary">Loading knowledge...</div>;
  if (!data) return null;

  const asset = data.knowledgeAssetPricing; // We'd lookup by activeAssetId
  const principle = data.principlePricingPower;
  const challenge = data.challengeHelios;

  if (!activeAssetId) {
    return (
      <div className="flex-1 h-full flex items-center justify-center text-text-tertiary">
        Select a knowledge asset to explore.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-bg-base p-8">
      
      {/* Header */}
      <div className="mb-10 max-w-4xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="text-[10px] font-bold text-accent-primary uppercase tracking-wider bg-selection-bg px-2 py-1 rounded border border-accent-primary/20">
            Institutional Principle
          </div>
          {asset.isPinned && <span className="text-xs">📌 Pinned</span>}
        </div>
        <h1 className="text-3xl font-bold text-text-primary mb-4 leading-tight">{asset.title}</h1>
        <div className="text-sm text-text-secondary leading-relaxed max-w-3xl">
          {asset.summary}
        </div>
      </div>

      <div className="max-w-4xl grid grid-cols-2 gap-6 mb-8">
        
        {/* The Principle Statement */}
        <div className="col-span-2 p-6 bg-selection-bg border-l-4 border-accent-primary rounded-r-lg">
          <div className="text-xs font-mono uppercase tracking-wider text-text-tertiary mb-3">Core Principle</div>
          <div className="text-lg font-serif italic text-text-primary leading-relaxed">
            &quot;{principle.statement}&quot;
          </div>
        </div>

        {/* Confidence Metrics */}
        <div className="p-5 bg-bg-surface border border-border-subtle rounded-lg">
          <div className="text-[10px] font-mono uppercase tracking-wider text-text-tertiary mb-4">Institutional Confidence</div>
          <div className="grid grid-cols-2 gap-y-4">
            <div>
              <div className="text-2xl font-bold text-text-primary">{asset.confidence.numberOfUses}</div>
              <div className="text-xs text-text-secondary">Total Uses</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent-success">{asset.confidence.successfulValidations}</div>
              <div className="text-xs text-text-secondary">Successful Validations</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent-danger">{asset.confidence.contradictions}</div>
              <div className="text-xs text-text-secondary">Contradictions</div>
            </div>
            <div>
              <div className="text-sm font-bold text-text-primary mt-2">{new Date(asset.confidence.lastReviewed).toLocaleDateString()}</div>
              <div className="text-xs text-text-secondary">Last Reviewed</div>
            </div>
          </div>
        </div>

        {/* Reuse Graph */}
        <div className="p-5 bg-bg-surface border border-border-subtle rounded-lg">
          <div className="text-[10px] font-mono uppercase tracking-wider text-text-tertiary mb-4">Reuse Graph</div>
          
          <div className="space-y-4 text-sm relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-border-subtle">
            <div className="relative pl-6">
              <div className="absolute left-1 top-1.5 w-2.5 h-2.5 rounded-full border-2 border-border-strong bg-bg-base" />
              <div className="text-xs text-text-tertiary mb-0.5">Origin</div>
              <div className="font-medium text-text-primary">Project Titan</div>
            </div>
            
            <div className="relative pl-6">
              <div className="absolute left-1 top-1.5 w-2.5 h-2.5 rounded-full border-2 border-accent-primary bg-selection-bg" />
              <div className="text-xs text-text-tertiary mb-0.5">Current Usage</div>
              <div className="font-medium text-text-primary text-accent-primary">Project Apollo</div>
            </div>

            <div className="relative pl-6">
              <div className="absolute left-1 top-1.5 w-2.5 h-2.5 rounded-full border-2 border-border-strong bg-bg-base" />
              <div className="text-xs text-text-tertiary mb-0.5">Prior Usage</div>
              <div className="font-medium text-text-primary">Project Helios</div>
            </div>
          </div>
        </div>
      </div>

      {/* Challenges & Revisions */}
      <div className="max-w-4xl border-t border-border-subtle pt-8">
        <h2 className="text-lg font-bold mb-6 font-mono uppercase tracking-wider text-text-secondary flex items-center justify-between">
          <span>Institutional Learning</span>
          <button className="text-xs bg-bg-surface hover:bg-bg-surface-hover border border-border-strong px-3 py-1.5 rounded transition-colors text-text-primary">
            Challenge Principle
          </button>
        </h2>

        <div className="p-5 border border-accent-warning/30 bg-accent-warning/5 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-accent-warning text-sm">⚠️</span>
            <span className="text-xs font-bold uppercase tracking-wider text-accent-warning">Historical Challenge Resolved</span>
          </div>
          
          <div className="mb-4">
            <div className="text-xs text-text-secondary mb-1">During Project Helios:</div>
            <div className="text-sm italic text-text-primary border-l-2 border-accent-warning/50 pl-3 py-1">
              &quot;Helios data showed Mid-Market churn actually accelerates at 6% during high interest rate environments.&quot;
            </div>
          </div>

          <div className="pt-4 border-t border-accent-warning/20">
            <div className="text-[10px] font-mono text-text-tertiary uppercase mb-2">Resolution: {challenge.resolution}</div>
            <div className="text-sm text-text-secondary">
              {challenge.resolutionNotes}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
