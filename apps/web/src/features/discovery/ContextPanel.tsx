import React from "react";
import { useDiscoveryStore } from "../../store/discovery";
import { mockDiscoveryResultPrinciple, mockPricingEvolution } from "@mosaic/testing";

export function ContextPanel() {
  const { activeResultId } = useDiscoveryStore();

  if (!activeResultId) {
    return (
      <div className="p-4 h-full bg-bg-surface border-l border-border-subtle text-text-tertiary text-sm flex items-center justify-center text-center">
        Select a discovery result<br/>to explore its evolution.
      </div>
    );
  }

  const evo = mockPricingEvolution;

  return (
    <div className="p-4 h-full bg-bg-surface border-l border-border-subtle flex flex-col">
      <div className="text-xs text-text-tertiary font-mono uppercase tracking-wider mb-6">Knowledge Evolution</div>

      <div className="mb-6 pb-6 border-b border-border-subtle">
        <h3 className="text-sm font-bold text-text-primary mb-1">{evo.conceptName}</h3>
        <p className="text-xs text-text-secondary">Track how this concept evolved across {evo.projectTimeline.length} past deals.</p>
      </div>

      <div className="space-y-6 relative before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-border-subtle">
        {evo.projectTimeline.map((pt, idx) => (
          <div key={idx} className="relative pl-8">
            <div className="absolute left-1 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-border-strong bg-bg-base z-10" />
            
            <div className="text-[10px] font-mono text-text-tertiary uppercase mb-1">
              {new Date(pt.timestamp).toLocaleDateString(undefined, { month: 'short', year: 'numeric'})}
            </div>
            
            <div className="text-sm font-semibold text-text-primary mb-1">
              {pt.projectName}
            </div>
            
            <div className="text-xs text-text-secondary italic bg-bg-base p-2 rounded border border-border-subtle mt-2">
              "{pt.context}"
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
