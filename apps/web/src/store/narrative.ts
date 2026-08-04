import { create } from "zustand";

interface NarrativeState {
  activeNarrativeId: string | null;
  activeSectionId: string | null;
  activeArgumentBlockId: string | null;
  
  // Actions
  setActiveNarrative: (id: string | null) => void;
  setActiveSection: (id: string | null) => void;
  setActiveArgumentBlock: (id: string | null) => void;
}

export const useNarrativeStore = create<NarrativeState>((set) => ({
  activeNarrativeId: null,
  activeSectionId: null,
  activeArgumentBlockId: null,
  
  setActiveNarrative: (activeNarrativeId) => set({ activeNarrativeId, activeSectionId: null, activeArgumentBlockId: null }),
  setActiveSection: (activeSectionId) => set({ activeSectionId, activeArgumentBlockId: null }),
  setActiveArgumentBlock: (activeArgumentBlockId) => set({ activeArgumentBlockId })
}));
