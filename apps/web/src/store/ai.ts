import { create } from "zustand";

interface AiState {
  activeAssignmentId: string | null;
  activeProposalId: string | null;
  
  // Actions
  setActiveAssignment: (id: string | null) => void;
  setActiveProposal: (id: string | null) => void;
}

export const useAiStore = create<AiState>((set) => ({
  activeAssignmentId: null,
  activeProposalId: null,
  
  setActiveAssignment: (activeAssignmentId) => set({ activeAssignmentId, activeProposalId: null }),
  setActiveProposal: (activeProposalId) => set({ activeProposalId })
}));
