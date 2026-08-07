"use client";
import React from "react";
import { useParams } from "next/navigation";
import { useQuestionsStore } from "../../store/questions";
import { useQuestions } from "../../hooks/queries";

export function ContextPanel() {
  const { activeQuestionId } = useQuestionsStore();
  const params = useParams();
  const { data } = useQuestions(params.id as string);

  if (!activeQuestionId) {
    return (
      <div className="p-4 h-full bg-bg-surface border-l border-border-subtle text-text-tertiary text-sm flex items-center justify-center">
        Context unavailable.
      </div>
    );
  }

  return (
    <div className="p-4 h-full bg-bg-surface border-l border-border-subtle flex flex-col">
      <div className="text-xs text-text-tertiary font-mono uppercase tracking-wider mb-6">Hypothesis Context</div>

      <div className="text-sm text-text-tertiary italic p-3 text-center border border-dashed border-border-strong rounded-md">
        No context available.
      </div>
    </div>
  );
}
