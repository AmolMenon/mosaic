import React from "react";
import { useNarrativeStore } from "../../store/narrative";
import { mockNarrative, mockPricingSection, mockInsightPricing } from "@mosaic/testing";
import { clsx } from "clsx";

export function CenterPanel() {
  const { activeSectionId, activeArgumentBlockId, setActiveArgumentBlock } = useNarrativeStore();

  const section = mockNarrative.flow.sections.find(s => s.id === activeSectionId) || mockPricingSection;

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-bg-base p-8">
      
      {/* Section Header */}
      <div className="mb-8 max-w-4xl">
        <div className="text-xs font-mono uppercase tracking-wider text-text-tertiary mb-2">Narrative Section</div>
        <h1 className="text-3xl font-bold text-text-primary mb-4 leading-tight">{section.title}</h1>
        
        <div className="p-4 bg-selection-bg border border-accent-primary/50 rounded-md">
          <div className="text-[10px] font-bold text-accent-primary uppercase mb-1">Section Purpose</div>
          <div className="text-sm font-medium text-text-primary">
            {section.purpose}
          </div>
        </div>
      </div>

      {/* Narrative Health & Gaps */}
      <div className="mb-10 max-w-4xl grid grid-cols-2 gap-4">
        <div className="p-4 bg-bg-surface border border-border-subtle rounded-md">
          <div className="text-[10px] font-mono uppercase tracking-wider text-text-tertiary mb-3">Narrative Health</div>
          <div className="grid grid-cols-2 gap-y-3 text-sm">
            <div className="text-text-secondary">Validation</div>
            <div className="font-bold text-accent-warning uppercase text-right">{section.health.validationStrength}</div>
            
            <div className="text-text-secondary">Insights</div>
            <div className="font-bold text-text-primary text-right">{section.health.supportingInsightCount}</div>
            
            <div className="text-text-secondary">Open Risks</div>
            <div className="font-bold text-accent-danger text-right">{section.health.openRisksCount}</div>
            
            <div className="text-text-secondary">Missing Evidence</div>
            <div className="font-bold text-accent-warning text-right">{section.health.missingEvidenceCount}</div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-border-subtle">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-text-secondary">Completeness</span>
              <span className="font-bold text-text-primary">{section.health.completenessScore}%</span>
            </div>
            <div className="w-full bg-border-subtle h-1.5 rounded-full overflow-hidden">
              <div className="bg-accent-primary h-full" style={{ width: `${section.health.completenessScore}%` }} />
            </div>
          </div>
        </div>

        <div className="p-4 bg-bg-surface border border-border-subtle rounded-md">
          <div className="text-[10px] font-mono uppercase tracking-wider text-accent-danger mb-3">Narrative Gaps</div>
          {section.gaps.length === 0 ? (
            <div className="text-sm text-text-tertiary italic">No gaps identified.</div>
          ) : (
            <div className="space-y-2">
              {section.gaps.map(g => (
                <div key={g.id} className="p-2 border border-accent-danger/20 bg-accent-danger/5 rounded flex gap-2">
                  <span className="text-accent-danger text-xs mt-0.5">⚠️</span>
                  <span className="text-xs text-text-primary">{g.description}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-4xl border-t border-border-subtle pt-8">
        <h2 className="text-lg font-bold mb-6 font-mono uppercase tracking-wider text-text-secondary flex items-center gap-2">
          <span>Argument Builder</span>
          <span className="text-xs font-normal lowercase bg-bg-surface border border-border-subtle px-2 py-0.5 rounded-full">
            {section.argumentBlocks.length} blocks
          </span>
        </h2>
        
        <div className="space-y-8 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-[2px] before:bg-border-subtle">
          {section.argumentBlocks.map((block, idx) => {
            const isActive = activeArgumentBlockId === block.id;
            return (
              <div 
                key={block.id} 
                onClick={() => setActiveArgumentBlock(block.id)}
                className={clsx(
                  "relative pl-12 transition-opacity cursor-pointer group",
                  activeArgumentBlockId && !isActive ? "opacity-50 hover:opacity-100" : "opacity-100"
                )}
              >
                {/* Node indicator */}
                <div className={clsx(
                  "absolute left-2.5 top-4 w-3.5 h-3.5 rounded-full border-2 bg-bg-base z-10 transition-colors",
                  isActive ? "border-accent-primary" : "border-border-strong group-hover:border-text-secondary"
                )} />
                
                <div className={clsx(
                  "p-5 rounded-lg border transition-all shadow-sm",
                  isActive 
                    ? "bg-bg-surface border-accent-primary ring-1 ring-accent-primary/20" 
                    : "bg-bg-surface border-border-subtle group-hover:border-border-strong"
                )}>
                  <div className="flex justify-between items-center mb-3">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary">Argument Block {idx + 1}</div>
                    <div className={clsx(
                      "text-[10px] uppercase font-bold",
                      block.argumentStrength === 'high' ? 'text-accent-success' :
                      block.argumentStrength === 'medium' ? 'text-accent-warning' : 'text-accent-danger'
                    )}>
                      Strength: {block.argumentStrength}
                    </div>
                  </div>
                  
                  {/* The Position */}
                  <div className="text-base font-medium text-text-primary leading-relaxed mb-4">
                    {block.position}
                  </div>
                  
                  {/* Referenced Knowledge Assets */}
                  <div className="pt-3 border-t border-border-subtle flex flex-wrap gap-2">
                    {block.supportingInsightIds.map(id => (
                      <div key={id} className="flex items-center gap-1.5 px-2 py-1 bg-bg-base border border-border-subtle rounded text-xs text-text-secondary shadow-sm">
                        <span className="text-accent-success">★</span>
                        <span className="truncate max-w-[200px]">{mockInsightPricing.statement}</span>
                      </div>
                    ))}
                    {block.openRiskIds.map(id => (
                      <div key={id} className="flex items-center gap-1.5 px-2 py-1 bg-accent-danger/5 border border-accent-danger/20 rounded text-xs text-accent-danger shadow-sm">
                        <span>⚠️ Open Risk</span>
                      </div>
                    ))}
                  </div>

                  {/* Transition */}
                  {block.transition && (
                    <div className="mt-4 pt-3 border-t border-border-subtle border-dashed">
                      <div className="text-[10px] font-mono text-text-tertiary uppercase mb-1">Transition to next block</div>
                      <div className="text-sm text-text-secondary italic">"{block.transition}"</div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
