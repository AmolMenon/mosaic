"use client";
import React from "react";
import { useNarrativeStore } from "../../store/narrative";
import { useNarratives } from "../../hooks/queries";
import { clsx } from "clsx";
import { FileText, Plus } from "lucide-react";

export function CenterPanel() {
  const { activeSectionId, activeArgumentBlockId, setActiveArgumentBlock } = useNarrativeStore();
  const { data: narrativesData, isLoading } = useNarratives();

  // If there are no narratives or we enforce empty state
  return (
    <div className="flex flex-col h-full overflow-y-auto bg-bg-base p-8">
      <div className="flex-1 flex flex-col items-center justify-center max-w-lg mx-auto text-center h-full">
        <div className="w-16 h-16 rounded-2xl bg-bg-surface border border-border-subtle flex items-center justify-center mb-6 shadow-sm">
          <FileText size={32} className="text-text-tertiary" />
        </div>
        <h2 className="text-2xl font-semibold text-text-primary mb-3">No Narratives Generated</h2>
        <p className="text-text-secondary mb-8 leading-relaxed">
          The investment memo canvas is currently empty. Generate a narrative to automatically synthesize insights from your data room into a structured investment argument.
        </p>
        <button className="flex items-center gap-2 px-6 py-3 bg-text-primary text-bg-base rounded-lg font-medium hover:bg-text-secondary transition-all shadow-md">
          <Plus size={18} /> Generate Narrative
        </button>
      </div>
    </div>
  );
}
