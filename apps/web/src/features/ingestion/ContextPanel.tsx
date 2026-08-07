"use client";
import React from "react";
import { useIngestionStore } from "../../store/ingestion";
import { useIngestion } from "../../hooks/queries";

export function ContextPanel() {
  const { activeStageId } = useIngestionStore();
  const { data } = useIngestion();

  if (!activeStageId) {
    return (
      <div className="p-4 h-full bg-bg-surface border-l border-border-subtle text-text-tertiary text-sm flex items-center justify-center text-center">
        Select a stage to inspect<br/>its Artifact contracts.
      </div>
    );
  }

  return (
    <div className="p-4 h-full bg-bg-surface border-l border-border-subtle flex flex-col overflow-y-auto">
      <div className="text-xs text-text-tertiary font-mono uppercase tracking-wider mb-6">Stage Artifacts</div>
      <div className="text-sm text-text-tertiary italic p-3 text-center border border-dashed border-border-strong rounded-md">
        No artifacts available.
      </div>
    </div>
  );
}
