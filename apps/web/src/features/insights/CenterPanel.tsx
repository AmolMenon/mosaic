"use client";
import React from "react";
import { useInsightsStore } from "../../store/insights";
import { useInsightsAll } from "../../hooks/queries";

export function CenterPanel() {
  const { activeInsightId } = useInsightsStore();
  const { data, isLoading } = useInsightsAll();

  if (isLoading) return <div className="flex-1 h-full flex items-center justify-center text-text-tertiary">Loading insights...</div>;
  if (!data) return null;
  const { insightPricing: insight } = data;

  if (activeInsightId !== insight.id) {
    return (
      <div className="flex-1 h-full flex items-center justify-center text-text-tertiary">
        Select an insight to view the reasoning canvas.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-bg-base p-8">
      {/* Insight Header */}
      <div className="mb-10 max-w-4xl">
        <div className="flex items-center justify-between mb-4">
          <div className="text-xs font-mono uppercase tracking-wider text-text-tertiary flex items-center gap-2">
            <span>Validated Insight</span>
            <span className="w-1.5 h-1.5 rounded-full bg-accent-success" />
          </div>
          <div className="flex items-center gap-4 text-xs text-text-tertiary font-mono">
            <span>Author: {insight.ownership.authorId}</span>
            <span>Reviewer: {insight.ownership.reviewerId}</span>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-text-primary mb-6 leading-tight font-serif italic text-accent-primary bg-selection-bg p-6 rounded-lg border-l-4 border-accent-primary">
          &quot;{insight.statement}&quot;
        </h1>
        
        {/* Analyst Commentary */}
        <div className="p-4 bg-bg-surface border border-border-subtle rounded-md">
          <div className="text-xs font-semibold text-text-secondary uppercase mb-2">Analyst Commentary</div>
          <div className="text-sm text-text-primary leading-relaxed">
            {insight.analystCommentary}
          </div>
        </div>
      </div>

      <div className="max-w-4xl border-t border-border-subtle pt-8">
        <h2 className="text-lg font-bold mb-6 font-mono uppercase tracking-wider text-text-secondary">Insight Validation</h2>
        
        <div className="grid grid-cols-2 gap-8">
          
          <div className="space-y-6">
            <div className="p-5 border-2 border-accent-success/30 rounded-lg bg-bg-surface">
              <div className="text-[10px] font-bold uppercase tracking-wider text-accent-success mb-3">
                Supporting Evidence ({insight.validation.supportingEvidenceIds.length})
              </div>
              <div className="p-3 bg-bg-base border border-border-subtle rounded text-sm text-text-primary mb-2 shadow-sm">
                &quot;Q3 enterprise revenue grew by 15% year-over-year, driven primarily by expansion in the APAC region.&quot;
              </div>
            </div>

            <div className="p-5 border border-border-subtle rounded-lg bg-bg-surface">
              <div className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary mb-3">
                Outstanding Assumptions ({insight.validation.outstandingAssumptionIds.length})
              </div>
              <div className="text-sm text-text-secondary border-l-2 border-border-strong pl-3">
                Enterprise IT budgets will not be cut by more than 5% this year.
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-5 border border-accent-danger/30 rounded-lg bg-bg-surface">
              <div className="text-[10px] font-bold uppercase tracking-wider text-accent-danger mb-3">
                Contradicting Evidence ({insight.validation.contradictingEvidenceIds.length})
              </div>
              <div className="p-3 bg-bg-base border border-border-subtle rounded text-sm text-text-primary shadow-sm">
                &quot;Management expects enterprise churn to increase to 8% due to macro headwinds.&quot;
              </div>
            </div>

            <div className="p-5 border border-accent-warning/30 rounded-lg bg-bg-surface">
              <div className="text-[10px] font-bold uppercase tracking-wider text-accent-warning mb-3">
                Explainable Confidence
              </div>
              <div className="text-sm font-bold text-accent-warning mb-1 uppercase">{insight.validation.confidence}</div>
              <div className="text-sm text-text-secondary leading-relaxed">
                {insight.validation.confidenceExplanation}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
