import { create } from "zustand";
import { InsightStatus, InsightCategory } from "@mosaic/contracts";

interface InsightsState {
  activeInsightId: string | null;
  activeCollectionId: string | null;
  
  // Filters
  filterCategory: InsightCategory | 'all';
  filterStatus: InsightStatus | 'all';
  
  // Actions
  setActiveInsight: (id: string | null) => void;
  setActiveCollection: (id: string | null) => void;
  setCategoryFilter: (category: InsightCategory | 'all') => void;
  setStatusFilter: (status: InsightStatus | 'all') => void;
}

export const useInsightsStore = create<InsightsState>((set) => ({
  activeInsightId: null,
  activeCollectionId: null,
  
  filterCategory: 'all',
  filterStatus: 'all',
  
  setActiveInsight: (activeInsightId) => set({ activeInsightId }),
  setActiveCollection: (activeCollectionId) => set({ activeCollectionId, activeInsightId: null }),
  setCategoryFilter: (filterCategory) => set({ filterCategory }),
  setStatusFilter: (filterStatus) => set({ filterStatus })
}));
