import React from "react";
import { useNarrativeStore } from "../../store/narrative";
import { mockNarrative } from "@mosaic/testing";
import { clsx } from "clsx";

export function LeftPanel() {
  const { activeNarrativeId, setActiveNarrative, activeSectionId, setActiveSection } = useNarrativeStore();

  const n = mockNarrative;

  // Auto-select first narrative and section if none selected for mock simplicity
  React.useEffect(() => {
    if (!activeNarrativeId) setActiveNarrative(n.id);
    if (!activeSectionId && n.flow.sections.length > 0) setActiveSection(n.flow.sections[0].id);
  }, [activeNarrativeId, activeSectionId, n.id, n.flow.sections, setActiveNarrative, setActiveSection]);

  return (
    <div className="p-4 h-full flex flex-col bg-bg-base overflow-y-auto">
      <div className="mb-6">
        <div className="text-xs font-mono uppercase tracking-wider text-text-tertiary mb-2">Active Narrative</div>
        <div className="font-semibold text-sm text-text-primary mb-1">{n.title}</div>
        <div className="flex gap-2 text-[10px] uppercase font-bold">
          <span className="bg-bg-surface border border-border-subtle px-1.5 py-0.5 rounded text-text-secondary">{n.audience}</span>
          <span className="bg-accent-primary/20 text-accent-primary px-1.5 py-0.5 rounded">{n.intent}</span>
        </div>
      </div>

      <div className="text-xs font-mono uppercase tracking-wider text-text-tertiary mb-4">Narrative Outline</div>
      
      <div className="space-y-2">
        {n.flow.sections.map((sec, idx) => {
          const isActive = activeSectionId === sec.id;
          return (
            <div 
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              className={clsx(
                "p-3 rounded-md cursor-pointer transition-colors border",
                isActive 
                  ? "bg-selection-bg border-accent-primary" 
                  : "bg-bg-surface border-border-subtle hover:border-border-strong"
              )}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-text-tertiary">{idx + 1}.</span>
                <span className={clsx("text-sm font-medium", isActive ? "text-accent-primary" : "text-text-primary")}>
                  {sec.title}
                </span>
              </div>
              
              <div className="flex justify-between items-center mt-2">
                <div className="flex gap-1.5">
                  <div className="flex items-center justify-center w-5 h-5 rounded-full bg-bg-base border border-border-subtle text-[10px] text-text-secondary font-bold" title="Supporting Insights">
                    {sec.health.supportingInsightCount}
                  </div>
                  {sec.health.openRisksCount > 0 && (
                    <div className="flex items-center justify-center w-5 h-5 rounded-full bg-accent-danger/20 text-accent-danger text-[10px] font-bold" title="Open Risks">
                      {sec.health.openRisksCount}
                    </div>
                  )}
                  {sec.health.missingEvidenceCount > 0 && (
                    <div className="flex items-center justify-center w-5 h-5 rounded-full bg-accent-warning/20 text-accent-warning text-[10px] font-bold" title="Missing Evidence">
                      {sec.health.missingEvidenceCount}
                    </div>
                  )}
                </div>
                
                <div className={clsx(
                  "text-[10px] uppercase font-bold",
                  sec.health.validationStrength === 'high' ? 'text-accent-success' :
                  sec.health.validationStrength === 'medium' ? 'text-accent-warning' : 'text-accent-danger'
                )}>
                  {sec.health.validationStrength}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
