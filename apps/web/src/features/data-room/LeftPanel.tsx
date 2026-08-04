"use client";
import React from "react";
import { mockDocumentCIM, mockDocumentTranscripts, mockProjectQuestions } from "@mosaic/testing";
import { useDataRoomStore } from "../../store/data-room";
import { clsx } from "clsx";

export function LeftPanel() {
  const { context, setDocument, setActiveQuestion } = useDataRoomStore();

  return (
    <div className="p-4 h-full flex flex-col bg-bg-surface overflow-y-auto">
      <div className="mb-6">
        <div className="text-xs text-text-tertiary font-mono uppercase tracking-wider mb-3">Library</div>
        <div className="space-y-1">
          <div 
            onClick={() => setDocument(mockDocumentCIM.id)}
            className={clsx("text-sm px-2 py-1.5 rounded cursor-pointer transition-colors truncate", context.documentId === mockDocumentCIM.id ? "bg-bg-surface-active text-text-primary" : "text-text-secondary hover:bg-bg-surface-hover")}
          >
            {mockDocumentCIM.title}
          </div>
          <div 
            onClick={() => setDocument(mockDocumentTranscripts.id)}
            className={clsx("text-sm px-2 py-1.5 rounded cursor-pointer transition-colors truncate", context.documentId === mockDocumentTranscripts.id ? "bg-bg-surface-active text-text-primary" : "text-text-secondary hover:bg-bg-surface-hover")}
          >
            {mockDocumentTranscripts.title}
          </div>
        </div>
      </div>

      <div className="mb-6 border-t border-border-subtle pt-6">
        <div className="text-xs text-text-tertiary font-mono uppercase tracking-wider mb-3">Reading Paths</div>
        <div className="space-y-2">
          {mockProjectQuestions.map((q, idx) => {
            // Fake ID for mock purposes
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
