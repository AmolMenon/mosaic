import { create } from "zustand";
import { KnowledgeAssetType, KnowledgeFreshness } from "@mosaic/contracts";

interface KnowledgeState {
  activeAssetId: string | null;
  activeTaxonomyId: string | null;
  
  // Filters
  filterType: KnowledgeAssetType | 'all';
  filterFreshness: KnowledgeFreshness | 'all';
  
  // Actions
  setActiveAsset: (id: string | null) => void;
  setActiveTaxonomy: (id: string | null) => void;
  setTypeFilter: (type: KnowledgeAssetType | 'all') => void;
  setFreshnessFilter: (freshness: KnowledgeFreshness | 'all') => void;
}

export const useKnowledgeStore = create<KnowledgeState>((set) => ({
  activeAssetId: null,
  activeTaxonomyId: null,
  
  filterType: 'all',
  filterFreshness: 'all',
  
  setActiveAsset: (activeAssetId) => set({ activeAssetId }),
  setActiveTaxonomy: (activeTaxonomyId) => set({ activeTaxonomyId, activeAssetId: null }),
  setTypeFilter: (filterType) => set({ filterType }),
  setFreshnessFilter: (filterFreshness) => set({ filterFreshness })
}));
