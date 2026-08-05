"use client";
import React from "react";
import { useDataRoomStore } from "../../store/data-room";
import { clsx } from "clsx";
import { useDocuments, useQuestions } from "../../hooks/queries";

export function LeftPanel() {
  const { context, setDocument, setActiveQuestion } = useDataRoomStore();
  const projectId = 'defaultProjectId'; // hardcoded since it's a prototype and not passed in props here
  
  const { data: documents, isLoading: loadingDocs } = useDocuments(projectId);
  const { data: questions, isLoading: loadingQuestions } = useQuestions(projectId);

  return (
    <div className="p-4 h-full flex flex-col bg-bg-surface overflow-y-auto">
      <div className="mb-6">
        <div className="text-xs text-text-tertiary font-mono uppercase tracking-wider mb-3">Library</div>
        <div className="space-y-1">
          {loadingDocs ? (
            <div className="animate-pulse h-8 bg-bg-surface-hover rounded" />
          ) : documents?.map((doc: any) => (
            <div 
              key={doc.id}
              onClick={() => setDocument(doc.id)}
              className={clsx("text-sm px-2 py-1.5 rounded cursor-pointer transition-colors truncate", context.documentId === doc.id ? "bg-bg-surface-active text-text-primary" : "text-text-secondary hover:bg-bg-surface-hover")}
            >
              {doc.title}
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6 border-t border-border-subtle pt-6">
        <div className="text-xs text-text-tertiary font-mono uppercase tracking-wider mb-3">Reading Paths</div>
        <div className="space-y-2">
          {loadingQuestions ? (
            <div className="animate-pulse h-16 bg-bg-surface-hover rounded" />
          ) : questions?.map((q: string, idx: number) => {
            const qId = `q_${idx}`;
            const isActive = context.activeQuestionId === qId;
            return (
              <div 
                key={idx}
                onClick={() => setActiveQuestion(isActive ? null : qId)}
                className={clsx(
                  "text-xs px-2 py-2 rounded cursor-pointer transition-colors leading-relaxed", 
                  isActive ? "bg-selection-bg text-accent-primary font-medium" : "text-text-secondary hover:bg-bg-surface-hover"
                )}
              >
                {q}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
