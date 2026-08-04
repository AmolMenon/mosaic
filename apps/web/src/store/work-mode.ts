import { create } from "zustand";

export type WorkMode = "research" | "analysis" | "writing" | "review";

interface WorkModeState {
  mode: WorkMode;
  setMode: (mode: WorkMode) => void;
}

export const useWorkMode = create<WorkModeState>((set) => ({
  mode: "analysis",
  setMode: (mode) => set({ mode }),
}));
