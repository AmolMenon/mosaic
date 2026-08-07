"use client";
import React, { useState } from "react";
import { useKnowledgeStore } from "../../store/knowledge";
import { useKnowledge } from "../../hooks/queries";
import { clsx } from "clsx";

export function CenterPanel() {
  const { activeAssetId } = useKnowledgeStore();
  const { data, isLoading } = useKnowledge();
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  return (
    <div className="flex-1 h-full flex flex-col items-center justify-center bg-bg-base text-text-tertiary">
      <div className="w-24 h-24 mb-6 rounded-full bg-bg-surface border-2 border-border-dashed flex items-center justify-center">
        <span className="text-4xl">🕸️</span>
      </div>
      <h3 className="text-xl font-medium text-text-primary mb-2">Knowledge Graph Explorer</h3>
      <p className="text-sm max-w-md text-center leading-relaxed">
        Your institutional knowledge graph is currently empty. As you upload documents and extract insights, the graph will automatically build relationship mappings.
      </p>
    </div>
  );
}
