"use client";
import React from "react";
import { useQuestionsStore } from "../../store/questions";
import { useQuestions } from "../../hooks/queries";
import { clsx } from "clsx";

import { useParams } from "next/navigation";

export function CenterPanel() {
  const { activeQuestionId } = useQuestionsStore();
  const params = useParams();
  const { data, isLoading } = useQuestions(params.id as string);

  return (
    <div className="flex-1 h-full flex flex-col items-center justify-center bg-bg-base text-text-tertiary">
      <div className="w-24 h-24 mb-6 rounded-full bg-bg-surface border-2 border-border-dashed flex items-center justify-center">
        <span className="text-4xl text-accent-primary opacity-50">❓</span>
      </div>
      <h3 className="text-xl font-medium text-text-primary mb-2">No Active Investigations</h3>
      <p className="text-sm max-w-md text-center leading-relaxed">
        There are no open questions in this workspace. Create an investigation to start gathering evidence and challenging hypotheses.
      </p>
    </div>
  );
}
