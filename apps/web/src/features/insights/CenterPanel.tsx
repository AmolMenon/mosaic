"use client";
import React from "react";
import { useInsightsStore } from "../../store/insights";
import { useInsightsAll } from "../../hooks/queries";
import { Lightbulb, Plus } from "lucide-react";

export function CenterPanel() {
  const { activeInsightId } = useInsightsStore();
  const { data, isLoading } = useInsightsAll();

  // Show empty state for Insights Canvas
  return (
    <div className="flex flex-col h-full overflow-y-auto bg-bg-base p-8">
      <div className="flex-1 flex flex-col items-center justify-center max-w-lg mx-auto text-center h-full">
        <div className="w-16 h-16 rounded-2xl bg-bg-surface border border-border-subtle flex items-center justify-center mb-6 shadow-sm">
          <Lightbulb size={32} className="text-text-tertiary" />
        </div>
        <h2 className="text-2xl font-semibold text-text-primary mb-3">No Insights Extracted</h2>
        <p className="text-text-secondary mb-8 leading-relaxed">
          The insights canvas is currently empty. Start analyzing data room documents or run an AI agent to extract verifiable insights and build your investment thesis.
        </p>
        <button className="flex items-center gap-2 px-6 py-3 bg-text-primary text-bg-base rounded-lg font-medium hover:bg-text-secondary transition-all shadow-md">
          <Plus size={18} /> Create Insight
        </button>
      </div>
    </div>
  );
}
