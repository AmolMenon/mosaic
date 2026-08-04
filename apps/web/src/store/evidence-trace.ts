import { create } from "zustand";

export type SelectionState = 'none' | 'focused' | 'hovered' | 'selected' | 'pinned' | 'compared' | 'dragged' | 'referenced';

interface TraceState {
  isTraceActive: boolean;
  setTraceActive: (active: boolean) => void;
  
  // Selection Model
  selectionMap: Record<string, SelectionState>;
  setSelection: (evidenceId: string, state: SelectionState) => void;
  clearSelection: () => void;
}

export const useEvidenceTrace = create<TraceState>((set) => ({
  isTraceActive: false,
  setTraceActive: (active) => set({ isTraceActive: active }),
  
  selectionMap: {},
  setSelection: (evidenceId, state) => set((prev) => ({
    selectionMap: {
      ...prev.selectionMap,
      [evidenceId]: state
    }
  })),
  clearSelection: () => set({ selectionMap: {} })
}));

// In a real browser environment, we'd mount this listener in a global Provider or App shell.
// if (typeof window !== 'undefined') {
//   window.addEventListener('keydown', (e) => {
//     if (e.key === 'Alt') useEvidenceTrace.getState().setTraceActive(true);
//   });
//   window.addEventListener('keyup', (e) => {
//     if (e.key === 'Alt') useEvidenceTrace.getState().setTraceActive(false);
//   });
// }
