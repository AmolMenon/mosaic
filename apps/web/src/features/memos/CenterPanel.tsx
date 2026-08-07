"use client";
import React from "react";
import { useMemoStore } from "../../store/memo";
import { useMemos } from "../../hooks/queries";
import { clsx } from "clsx";

export function CenterPanel() {
  const { activeBlockId, setActiveBlock, heatmapEnabled, setHeatmapEnabled } = useMemoStore();
  const { data, isLoading } = useMemos();

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-bg-base text-text-tertiary">
      <div className="text-4xl mb-4">📄</div>
      <h3 className="text-lg font-medium text-text-primary mb-2">No Memo Found</h3>
      <p className="text-sm max-w-md text-center">
        Create a memo to synthesize your workspace insights into a structured investment narrative.
      </p>
    </div>
  );
}
