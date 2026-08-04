import React from "react";
import { useQuestionsStore } from "../../store/questions";
import { mockQuestionPricing, mockQuestionLoyalty, mockQuestionDependencies } from "@mosaic/testing";
import { clsx } from "clsx";
import { Question } from "@mosaic/contracts";

export function LeftPanel() {
  const { activeQuestionId, setActiveQuestion } = useQuestionsStore();

  const questions = [mockQuestionPricing, mockQuestionLoyalty];

  const renderQuestion = (q: Question, isDependency = false) => {
    const isActive = activeQuestionId === q.id;
    return (
      <div 
        key={q.id}
        onClick={() => setActiveQuestion(q.id)}
        className={clsx(
          "p-3 rounded-md cursor-pointer transition-colors border",
          isActive 
            ? "bg-selection-bg border-accent-primary" 
            : "bg-bg-surface border-border-subtle hover:border-border-strong",
          isDependency ? "ml-6 mt-2 relative before:absolute before:-left-4 before:top-1/2 before:w-3 before:h-[1px] before:bg-border-subtle" : "mt-3"
        )}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-text-tertiary">{q.category}</span>
          <span className={clsx(
            "text-[10px] uppercase font-bold px-1.5 py-0.5 rounded",
            q.status === 'investigating' ? "bg-accent-warning/20 text-accent-warning" : "bg-accent-success/20 text-accent-success"
          )}>{q.status}</span>
        </div>
        <div className={clsx("text-sm font-medium", isActive ? "text-accent-primary" : "text-text-primary")}>
          {q.text}
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 h-full flex flex-col bg-bg-base overflow-y-auto">
      <div className="mb-4 text-xs font-mono uppercase tracking-wider text-text-tertiary">Question Library</div>
      
      {/* Root questions */}
      {renderQuestion(mockQuestionPricing)}
      
      {/* Dependencies */}
      <div className="text-xs text-text-tertiary mt-2 ml-6 italic">Required to answer:</div>
      {renderQuestion(mockQuestionLoyalty, true)}

    </div>
  );
}
