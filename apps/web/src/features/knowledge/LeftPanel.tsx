"use client";
import React from "react";
import { useKnowledgeStore } from "../../store/knowledge";
import { useKnowledge } from "../../hooks/queries";
import { clsx } from "clsx";
import { KnowledgeAsset, TaxonomyNode } from "@mosaic/contracts";

export function LeftPanel() {
  const { activeAssetId, setActiveAsset, activeTaxonomyId, setActiveTaxonomy } = useKnowledgeStore();
  const { data } = useKnowledge();

  if (!data) return null;
  const { 
    knowledgeAssetPricing: mockKnowledgeAssetPricing, 
    taxonomyRoot: mockTaxonomyRoot, 
    taxonomyPricing: mockTaxonomyPricing, 
    taxonomyPremiumization: mockTaxonomyPremiumization, 
    taxonomyElasticity: mockTaxonomyElasticity 
  } = data;

  const taxonomyNodes = [mockTaxonomyRoot, mockTaxonomyPricing, mockTaxonomyPremiumization, mockTaxonomyElasticity];
  const assets = [mockKnowledgeAssetPricing];

  React.useEffect(() => {
    if (!activeAssetId) setActiveAsset(mockKnowledgeAssetPricing.id);
    if (!activeTaxonomyId) setActiveTaxonomy(mockTaxonomyElasticity.id);
  }, [activeAssetId, activeTaxonomyId, setActiveAsset, setActiveTaxonomy, mockKnowledgeAssetPricing.id, mockTaxonomyElasticity.id]);

  const renderTaxonomyTree = (node: TaxonomyNode, depth = 0) => {
    const isActive = activeTaxonomyId === node.id;
    return (
      <div key={node.id} className="mt-1">
        <div 
          onClick={() => setActiveTaxonomy(node.id)}
          className={clsx(
            "text-sm py-1 px-2 rounded cursor-pointer transition-colors flex items-center gap-2",
            isActive ? "bg-selection-bg text-accent-primary font-semibold" : "text-text-secondary hover:bg-bg-surface-hover hover:text-text-primary"
          )}
          style={{ paddingLeft: `${(depth * 12) + 8}px` }}
        >
          <span className="text-[10px]">📁</span>
          <span>{node.name}</span>
        </div>
        {node.childrenIds.map(childId => {
          const child = taxonomyNodes.find(n => n.id === childId);
          if (child) return renderTaxonomyTree(child, depth + 1);
          return null;
        })}
      </div>
    );
  };

  const renderAsset = (asset: KnowledgeAsset) => {
    const isActive = activeAssetId === asset.id;
    return (
      <div 
        key={asset.id}
        onClick={() => setActiveAsset(asset.id)}
        className={clsx(
          "p-3 rounded-md cursor-pointer transition-colors border mt-2",
          isActive 
            ? "bg-selection-bg border-accent-primary" 
            : "bg-bg-surface border-border-subtle hover:border-border-strong"
        )}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-text-tertiary">{asset.type}</span>
          <span className={clsx(
            "text-[10px] uppercase font-bold px-1.5 py-0.5 rounded",
            asset.freshness === 'current' ? "bg-accent-success/20 text-accent-success" :
            asset.freshness === 'needs_review' ? "bg-accent-warning/20 text-accent-warning" : "bg-border-strong text-text-secondary"
          )}>{asset.freshness}</span>
        </div>
        <div className={clsx("text-sm font-medium line-clamp-2 mb-2", isActive ? "text-accent-primary" : "text-text-primary")}>
          {asset.title}
        </div>
        <div className="flex gap-3 text-[10px] text-text-tertiary font-mono">
          <span title="Uses" className="flex items-center gap-1">🔄 {asset.confidence.numberOfUses}</span>
          <span title="Validations" className="flex items-center gap-1 text-accent-success">✓ {asset.confidence.successfulValidations}</span>
          <span title="Contradictions" className="flex items-center gap-1 text-accent-danger">✕ {asset.confidence.contradictions}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 h-full flex flex-col bg-bg-base overflow-y-auto">
      <div className="mb-6">
        <div className="text-xs font-mono uppercase tracking-wider text-text-tertiary mb-3">Knowledge Taxonomy</div>
        {renderTaxonomyTree(mockTaxonomyRoot)}
      </div>

      <div className="mb-4">
        <div className="text-xs font-mono uppercase tracking-wider text-text-tertiary mb-3 flex items-center justify-between">
          <span>Assets in Category</span>
          <span className="bg-bg-surface border border-border-subtle px-1.5 py-0.5 rounded-full text-[10px]">{assets.length}</span>
        </div>
        <div className="space-y-2">
          {assets.map(a => renderAsset(a))}
        </div>
      </div>
    </div>
  );
}
