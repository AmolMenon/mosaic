import { create } from "zustand";

interface IngestionState {
  activePipelineId: string | null;
  activeStageId: string | null;
  
  // Actions
  setActivePipeline: (id: string | null) => void;
  setActiveStage: (id: string | null) => void;
}

export const useIngestionStore = create<IngestionState>((set) => ({
  activePipelineId: null,
  activeStageId: null,
  
  setActivePipeline: (activePipelineId) => set({ activePipelineId, activeStageId: null }),
  setActiveStage: (activeStageId) => set({ activeStageId })
}));
