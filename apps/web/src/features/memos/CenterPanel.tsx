"use client";
import React from "react";
import { useMemoStore } from "../../store/memo";
import { useMemos } from "../../hooks/queries";
import { clsx } from "clsx";

export function CenterPanel() {
  const { activeBlockId, setActiveBlock, heatmapEnabled, setHeatmapEnabled } = useMemoStore();
  const { data, isLoading } = useMemos();

  if (isLoading) return <div className="flex-1 overflow-hidden bg-[#F9FAFB] flex items-center justify-center">Loading memo...</div>;
  if (!data) return null;

  const memo = data.memoApolloIC;

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[#F9FAFB] relative">
      
      {/* Top Toolbar */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-bg-base border border-border-subtle rounded-full shadow-lg flex items-center p-1.5 z-10">
        <div className="text-[10px] font-mono text-text-tertiary uppercase tracking-wider px-3 border-r border-border-subtle">
          Presentation Layer
        </div>
        <div className="px-2">
          <label className="flex items-center gap-2 text-xs text-text-secondary cursor-pointer hover:text-text-primary transition-colors">
            <input 
              type="checkbox" 
              checked={heatmapEnabled} 
              onChange={(e) => setHeatmapEnabled(e.target.checked)} 
              className="accent-accent-primary"
            />
            Traceability Heatmap
          </label>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pt-20 pb-16 px-8">
        <div className="max-w-3xl mx-auto bg-bg-base shadow-sm border border-border-subtle min-h-[800px] p-16 font-serif">
          
          <h1 className="text-3xl font-bold text-text-primary mb-8 text-center">{memo.title}</h1>
          <div className="text-center text-sm text-text-tertiary mb-16 uppercase tracking-widest font-sans">
            Strictly Confidential
          </div>

          {memo.sections.map(section => (
            <div key={section.id} className="mb-12">
              <h2 className="text-xl font-bold text-text-primary mb-6 font-sans">{section.order}. {section.title}</h2>
              
              <div className="space-y-4 text-[15px] leading-relaxed text-text-secondary">
                {section.blocks.map(block => {
                  const isActive = activeBlockId === block.id;
                  
                  // Heatmap coloring logic
                  let heatClass = "";
                  if (heatmapEnabled) {
                    if (block.evidenceStrength === 'high') heatClass = "bg-accent-success/20";
                    else if (block.evidenceStrength === 'medium') heatClass = "bg-accent-warning/20";
                    else heatClass = "bg-accent-danger/20";
                  }

                  return (
                    <div 
                      key={block.id}
                      onClick={() => setActiveBlock(block.id)}
                      className={clsx(
                        "relative rounded transition-colors cursor-text group",
                        isActive ? "ring-2 ring-accent-primary ring-offset-4 ring-offset-bg-base" : "hover:bg-bg-surface-hover",
                        heatClass
                      )}
                    >
                      {/* Source pill indicator on hover */}
                      <div className="absolute -left-6 top-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-1.5 h-full min-h-[20px] bg-accent-primary rounded-full"></div>
                      </div>
                      
                      {block.renderedText}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}
