"use client";
import React from "react";
import { useMemoStore } from "../../store/memo";
import { useMemos } from "../../hooks/queries";
import { clsx } from "clsx";

export function CenterPanel() {
  const { activeBlockId, setActiveBlock, heatmapEnabled, setHeatmapEnabled } = useMemoStore();
  const { data, isLoading } = useMemos();

  if (isLoading) {
    return (
      <div className="flex-1 overflow-hidden bg-bg-base flex items-center justify-center relative">
        <div className="w-full max-w-4xl px-8 flex gap-8 animate-pulse">
          <div className="hidden lg:block w-48 space-y-4 pt-20">
            <div className="h-4 bg-border-subtle rounded w-3/4"></div>
            <div className="h-3 bg-border-subtle rounded w-5/6"></div>
            <div className="h-3 bg-border-subtle rounded w-2/3"></div>
          </div>
          <div className="flex-1 space-y-6 pt-20">
            <div className="h-10 bg-border-subtle rounded w-1/2 mx-auto mb-16"></div>
            <div className="h-6 bg-border-subtle rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-border-subtle rounded w-full"></div>
              <div className="h-4 bg-border-subtle rounded w-full"></div>
              <div className="h-4 bg-border-subtle rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data || !data.memoApolloIC) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-bg-base text-text-tertiary">
        <div className="text-4xl mb-4">📄</div>
        <h3 className="text-lg font-medium text-text-primary mb-2">No Memo Found</h3>
        <p className="text-sm">Select or create a memo to get started.</p>
      </div>
    );
  }

  const memo = data.memoApolloIC;

  return (
    <div className="flex flex-col h-full overflow-hidden bg-bg-base relative">
      
      {/* Top Toolbar */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-bg-surface/80 backdrop-blur-md border border-border-strong rounded-full shadow-lg flex items-center p-1.5 z-20">
        <div className="text-[10px] font-mono text-text-tertiary uppercase tracking-wider px-4 border-r border-border-subtle">
          Authoring Mode
        </div>
        <div className="px-3">
          <label className="flex items-center gap-2 text-xs font-medium text-text-secondary cursor-pointer hover:text-text-primary transition-colors">
            <input 
              type="checkbox" 
              checked={heatmapEnabled} 
              onChange={(e) => setHeatmapEnabled(e.target.checked)} 
              className="accent-accent-primary w-4 h-4 rounded border-border-strong"
            />
            Evidence Heatmap
          </label>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* TOC / Outline Sidebar */}
        <div className="hidden lg:block w-56 flex-shrink-0 overflow-y-auto border-r border-border-subtle bg-bg-base pt-24 pb-8 px-6">
          <h3 className="text-[10px] font-mono text-text-tertiary uppercase tracking-wider mb-6">Outline</h3>
          <nav className="space-y-3">
            {memo.sections.map((section: any) => (
              <a 
                key={section.id} 
                href={`#section-${section.id}`}
                className="block text-sm text-text-secondary hover:text-text-primary transition-colors truncate"
              >
                {section.order}. {section.title}
              </a>
            ))}
          </nav>
        </div>

        {/* Editor Area */}
        <div className="flex-1 overflow-y-auto pt-24 pb-32 px-8 lg:px-16 scroll-smooth">
          <div className="max-w-3xl mx-auto prose prose-slate lg:prose-lg dark:prose-invert">
            <h1 className="text-4xl font-bold text-text-primary mb-4 text-center font-serif tracking-tight leading-tight">{memo.title}</h1>
            <div className="text-center text-xs text-text-tertiary mb-20 uppercase tracking-widest font-mono">
              Strictly Confidential
            </div>

            {memo.sections.map((section: any) => (
              <div key={section.id} id={`section-${section.id}`} className="mb-16 scroll-mt-24">
                <h2 className="text-2xl font-bold text-text-primary mb-8 font-sans tracking-tight border-b border-border-subtle pb-2">
                  {section.order}. {section.title}
                </h2>
                
                <div className="space-y-6 text-lg leading-loose text-text-secondary font-serif">
                  {section.blocks.map((block: any) => {
                    const isActive = activeBlockId === block.id;
                    
                    let heatClass = "";
                    if (heatmapEnabled) {
                      if (block.evidenceStrength === 'high') heatClass = "bg-accent-success/10 text-text-primary decoration-accent-success/50 decoration-2 underline-offset-4";
                      else if (block.evidenceStrength === 'medium') heatClass = "bg-accent-warning/10 text-text-primary decoration-accent-warning/50 decoration-2 underline-offset-4";
                      else heatClass = "bg-accent-danger/10 text-text-primary decoration-accent-danger/50 decoration-2 underline-offset-4";
                    }

                    return (
                      <div 
                        key={block.id}
                        onClick={() => setActiveBlock(block.id)}
                        className={clsx(
                          "relative rounded-lg transition-all duration-300 cursor-text group p-2 -mx-2",
                          isActive ? "bg-selection-bg ring-1 ring-accent-primary/20" : "hover:bg-bg-surface-hover",
                        )}
                      >
                        {/* Source pill indicator on hover */}
                        <div className="absolute -left-4 lg:-left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className={clsx(
                            "w-1.5 h-8 rounded-full transition-colors",
                            isActive ? "bg-accent-primary" : "bg-border-strong"
                          )}></div>
                        </div>
                        
                        <span className={clsx("transition-all duration-300 rounded", heatClass, heatmapEnabled && "px-1 -mx-1")}>
                          {block.renderedText}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
