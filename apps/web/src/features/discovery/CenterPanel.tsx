"use client";
import React from "react";
import { useDiscoveryStore } from "../../store/discovery";
import { useDiscovery } from "../../hooks/queries";
import { clsx } from "clsx";

export function CenterPanel() {
  const { searchQuery, setSearchQuery, activeResultId, setActiveResult } = useDiscoveryStore();
  const { data, isLoading } = useDiscovery();
  
  if (isLoading) return <div className="flex-1 overflow-hidden bg-bg-base p-8">Loading...</div>;
  if (!data) return null;

  const view = data.discoveryView;
  const results = [data.discoveryResultPrinciple]; // Mock feed

  return (
    <div className="flex flex-col h-full overflow-hidden bg-bg-base">
      
      {/* Top Search Bar */}
      <div className="p-6 border-b border-border-subtle bg-bg-surface flex-shrink-0">
        <div className="max-w-4xl mx-auto flex gap-4">
          <div className="flex-1 relative">
            <input 
              type="text" 
              placeholder="Discover institutional knowledge (e.g., 'pricing power' or 'CAC trends')..." 
              className="w-full bg-bg-base border-2 border-border-strong rounded-lg pl-10 pr-4 py-3 text-sm text-text-primary outline-none focus:border-accent-primary transition-colors placeholder:text-text-tertiary shadow-sm"
              value={searchQuery || (view ? view.query : '')}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary">🔍</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto">
          
          <div className="mb-6 flex items-center justify-between">
            <div className="text-xs font-mono uppercase tracking-wider text-text-tertiary">
              Discovery Feed <span className="lowercase">({results.length} matches)</span>
            </div>
            <div className="flex gap-2">
              <span className="text-[10px] bg-bg-surface border border-border-subtle px-2 py-1 rounded-full text-text-secondary uppercase">Principles First</span>
            </div>
          </div>

          <div className="space-y-6">
            {results.map((result) => {
              const isActive = activeResultId === result.id;
              return (
                <div 
                  key={result.id} 
                  onClick={() => setActiveResult(result.id)}
                  className={clsx(
                    "p-6 rounded-lg border transition-all cursor-pointer shadow-sm relative overflow-hidden",
                    isActive 
                      ? "bg-selection-bg/30 border-accent-primary ring-1 ring-accent-primary/20" 
                      : "bg-bg-surface border-border-subtle hover:border-border-strong"
                  )}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-[10px] font-bold text-accent-primary uppercase tracking-wider bg-selection-bg px-2 py-1 rounded border border-accent-primary/20">
                      {result.type}
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-text-primary mb-3 leading-snug">{result.title}</h3>
                  <div className="text-sm text-text-secondary leading-relaxed mb-6">
                    {result.snippet}
                  </div>

                  {/* Explainable Match */}
                  <div className="p-4 bg-bg-base border border-border-subtle rounded-md text-sm">
                    <div className="text-[10px] font-mono text-accent-success uppercase tracking-wider mb-2">Explainable Discovery</div>
                    <div className="font-semibold text-text-primary mb-1">
                      Matched: <span className="bg-selection-bg px-1 rounded">&quot;{result.explanation.matchedTerm}&quot;</span>
                    </div>
                    <div className="text-text-secondary mb-3">{result.explanation.matchReason}</div>
                    
                    <div className="text-[10px] font-mono text-text-tertiary uppercase mb-1">Knowledge Path Traversed</div>
                    <div className="flex items-center gap-2 text-xs text-text-secondary">
                      {result.explanation.traversedRelationships[0].split('->').map((step: string, idx: number, arr: string[]) => (
                        <React.Fragment key={idx}>
                          <span className="bg-bg-surface px-1.5 py-0.5 rounded border border-border-subtle">{step.trim()}</span>
                          {idx < arr.length - 1 && <span className="text-border-strong">→</span>}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}
