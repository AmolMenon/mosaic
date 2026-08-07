"use client";
import React from "react";
import { useKnowledgeStore } from "../../store/knowledge";
import { useKnowledge } from "../../hooks/queries";
import { clsx } from "clsx";
import { KnowledgeAsset, TaxonomyNode } from "@mosaic/contracts";

export function LeftPanel() {
  const { activeAssetId, setActiveAsset, activeTaxonomyId, setActiveTaxonomy } = useKnowledgeStore();
  const { data } = useKnowledge();

  return (
    <div className="p-4 h-full flex flex-col bg-bg-base overflow-y-auto">
      <div className="mb-6">
        <div className="text-xs font-mono uppercase tracking-wider text-text-tertiary mb-3">Knowledge Taxonomy</div>
        <div className="text-sm text-text-tertiary italic p-2 bg-bg-surface border border-border-subtle rounded-md">
          No taxonomy available.
        </div>
      </div>
    </div>
  );
}
