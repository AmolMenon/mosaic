import { create } from "zustand";
import { RenderingProfile } from "@mosaic/contracts";

interface MemoState {
  activeMemoId: string | null;
  activeBlockId: string | null;
  activeProfile: RenderingProfile;
  heatmapEnabled: boolean;
  
  // Actions
  setActiveMemo: (id: string | null) => void;
  setActiveBlock: (id: string | null) => void;
  setActiveProfile: (profile: RenderingProfile) => void;
  setHeatmapEnabled: (enabled: boolean) => void;
}

export const useMemoStore = create<MemoState>((set) => ({
  activeMemoId: null,
  activeBlockId: null,
  activeProfile: 'investment_committee',
  heatmapEnabled: false,
  
  setActiveMemo: (activeMemoId) => set({ activeMemoId, activeBlockId: null }),
  setActiveBlock: (activeBlockId) => set({ activeBlockId }),
  setActiveProfile: (activeProfile) => set({ activeProfile }),
  setHeatmapEnabled: (heatmapEnabled) => set({ heatmapEnabled })
}));
