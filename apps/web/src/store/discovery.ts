import { create } from "zustand";

interface DiscoveryState {
  searchQuery: string;
  activeViewId: string | null;
  activeResultId: string | null;
  
  // Actions
  setSearchQuery: (query: string) => void;
  setActiveView: (id: string | null) => void;
  setActiveResult: (id: string | null) => void;
}

export const useDiscoveryStore = create<DiscoveryState>((set) => ({
  searchQuery: '',
  activeViewId: null,
  activeResultId: null,
  
  setSearchQuery: (searchQuery) => set({ searchQuery, activeViewId: null }),
  setActiveView: (activeViewId) => set({ activeViewId }),
  setActiveResult: (activeResultId) => set({ activeResultId })
}));
