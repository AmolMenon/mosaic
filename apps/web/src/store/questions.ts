import { create } from "zustand";
import { QuestionCategory, QuestionStatus } from "@mosaic/contracts";

interface QuestionsState {
  activeQuestionId: string | null;
  activeHypothesisId: string | null;
  
  // Filters
  filterCategory: QuestionCategory | 'all';
  filterStatus: QuestionStatus | 'all';
  
  // Actions
  setActiveQuestion: (id: string | null) => void;
  setActiveHypothesis: (id: string | null) => void;
  setCategoryFilter: (category: QuestionCategory | 'all') => void;
  setStatusFilter: (status: QuestionStatus | 'all') => void;
}

export const useQuestionsStore = create<QuestionsState>((set) => ({
  activeQuestionId: null,
  activeHypothesisId: null,
  
  filterCategory: 'all',
  filterStatus: 'all',
  
  setActiveQuestion: (activeQuestionId) => set({ activeQuestionId, activeHypothesisId: null }),
  setActiveHypothesis: (activeHypothesisId) => set({ activeHypothesisId }),
  setCategoryFilter: (filterCategory) => set({ filterCategory }),
  setStatusFilter: (filterStatus) => set({ filterStatus })
}));
