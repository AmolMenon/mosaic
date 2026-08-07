"use client";
import React from "react";
import { useDiscoveryStore } from "../../store/discovery";
import { useDiscovery } from "../../hooks/queries";
import { clsx } from "clsx";
import { Search, Compass } from "lucide-react";

export function CenterPanel() {
  const { searchQuery, setSearchQuery, activeResultId, setActiveResult } = useDiscoveryStore();
  const { data, isLoading } = useDiscovery();
  
  const view = data?.discoveryView;

  return (
    <div className="flex flex-col h-full overflow-hidden bg-bg-base">
      
      {/* Top Search Bar */}
      <div className="p-6 border-b border-border-subtle bg-bg-surface flex-shrink-0">
        <div className="max-w-4xl mx-auto flex gap-4">
          <div className="flex-1 relative">
            <input 
              type="text" 
              placeholder="Discover institutional knowledge (e.g., &apos;pricing power&apos; or &apos;CAC trends&apos;)..." 
              className="w-full bg-bg-base border-2 border-border-strong rounded-lg pl-10 pr-4 py-3 text-sm text-text-primary outline-none focus:border-accent-primary transition-colors placeholder:text-text-tertiary shadow-sm"
              value={searchQuery || (view ? view.query : '')}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary"><Search size={18} /></span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-bg-base overflow-y-auto">
        <div className="max-w-lg mx-auto flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-bg-surface border border-border-subtle flex items-center justify-center mb-6 shadow-sm">
            <Compass size={32} className="text-text-tertiary" />
          </div>
          <h2 className="text-2xl font-semibold text-text-primary mb-3">Knowledge Discovery</h2>
          <p className="text-text-secondary leading-relaxed mb-8">
            Search across your firm&apos;s entire knowledge graph. Query past memos, market maps, and expert transcripts to discover hidden relationships and institutional intelligence.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
            <button className="flex-1 px-4 py-2 bg-bg-surface border border-border-strong rounded-lg text-sm font-medium hover:bg-bg-surface-hover transition-colors">
              &quot;B2B SaaS pricing models&quot;
            </button>
            <button className="flex-1 px-4 py-2 bg-bg-surface border border-border-strong rounded-lg text-sm font-medium hover:bg-bg-surface-hover transition-colors">
              &quot;AI infrastructure moats&quot;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
