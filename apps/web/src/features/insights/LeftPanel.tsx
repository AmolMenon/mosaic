import React from "react";
import { useInsightsStore } from "../../store/insights";
import { mockInsightPricing, mockInsightCollection } from "@mosaic/testing";
import { clsx } from "clsx";
import { Insight } from "@mosaic/contracts";

export function LeftPanel() {
  const { activeInsightId, setActiveInsight, activeCollectionId, setActiveCollection } = useInsightsStore();

  const collections = [mockInsightCollection];
  const insights = [mockInsightPricing]; // Realistically, we'd filter insights by active collection

  const renderInsight = (insight: Insight, isIndented = false) => {
    const isActive = activeInsightId === insight.id;
    return (
      <div 
        key={insight.id}
        onClick={() => setActiveInsight(insight.id)}
        className={clsx(
          "p-3 rounded-md cursor-pointer transition-colors border mt-2",
          isActive 
            ? "bg-selection-bg border-accent-primary" 
            : "bg-bg-surface border-border-subtle hover:border-border-strong",
          isIndented && "ml-4"
        )}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-text-tertiary">{insight.category}</span>
          <span className={clsx(
            "text-[10px] uppercase font-bold px-1.5 py-0.5 rounded",
            insight.status === 'validated' ? "bg-accent-success/20 text-accent-success" : "bg-accent-warning/20 text-accent-warning"
          )}>{insight.status}</span>
        </div>
        <div className={clsx("text-sm font-medium line-clamp-2", isActive ? "text-accent-primary" : "text-text-primary")}>
          {insight.statement}
        </div>
        {insight.isPromotedToPrinciple && (
          <div className="mt-2 text-[10px] uppercase font-bold text-accent-primary">★ Institutional Principle</div>
        )}
      </div>
    );
  };

  return (
    <div className="p-4 h-full flex flex-col bg-bg-base overflow-y-auto">
      <div className="mb-4 text-xs font-mono uppercase tracking-wider text-text-tertiary">Collections</div>
      
      {collections.map(col => (
        <div key={col.id} className="mb-6">
          <div 
            onClick={() => setActiveCollection(col.id)}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <span className="text-sm font-semibold text-text-primary group-hover:text-accent-primary transition-colors">📁 {col.name}</span>
          </div>
          <div className="mt-2 space-y-2">
            {insights.filter(i => col.insightIds.includes(i.id)).map(i => renderInsight(i, true))}
          </div>
        </div>
      ))}
    </div>
  );
}
