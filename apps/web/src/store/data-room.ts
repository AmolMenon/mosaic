import { create } from "zustand";
import { ReadingContext, ReadingMode } from "@mosaic/contracts";

interface DataRoomState {
  context: ReadingContext;
  
  // Actions
  setReadingMode: (mode: ReadingMode) => void;
  setDocument: (documentId: string) => void;
  setPage: (pageNumber: number) => void;
  setParagraph: (paragraphIndex: number | null) => void;
  setActiveQuestion: (questionId: string | null) => void;
  setActiveInsight: (insightId: string | null) => void;
  setSelectedEvidence: (evidenceId: string | null) => void;
}

export const useDataRoomStore = create<DataRoomState>((set) => ({
  context: {
    documentId: null,
    pageNumber: null,
    paragraphIndex: null,
    selectedEvidenceId: null,
    activeQuestionId: null,
    activeInsightId: null,
    readingMode: 'original'
  },
  
  setReadingMode: (mode) => set((state) => ({ 
    context: { ...state.context, readingMode: mode } 
  })),
  
  setDocument: (documentId) => set((state) => ({ 
    context: { ...state.context, documentId, pageNumber: 1, paragraphIndex: null } 
  })),

  setPage: (pageNumber) => set((state) => ({ 
    context: { ...state.context, pageNumber, paragraphIndex: null } 
  })),

  setParagraph: (paragraphIndex) => set((state) => ({ 
    context: { ...state.context, paragraphIndex } 
  })),

  setActiveQuestion: (activeQuestionId) => set((state) => ({
    context: { ...state.context, activeQuestionId, readingMode: activeQuestionId ? 'questions' : state.context.readingMode }
  })),

  setActiveInsight: (activeInsightId) => set((state) => ({
    context: { ...state.context, activeInsightId, readingMode: activeInsightId ? 'insights' : state.context.readingMode }
  })),

  setSelectedEvidence: (selectedEvidenceId) => set((state) => ({
    context: { ...state.context, selectedEvidenceId }
  }))
}));
