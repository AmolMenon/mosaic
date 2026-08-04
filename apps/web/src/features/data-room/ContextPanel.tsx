import React from "react";
import { useDataRoomStore } from "../../store/data-room";
import { EvidenceCard } from "@mosaic/ui";
import { mockEvidence2, mockLink2 } from "@mosaic/testing";

export function ContextPanel() {
  const { context } = useDataRoomStore();

  if (!context.documentId) {
    return (
      <div className="p-4 h-full bg-bg-surface border-l border-border-subtle text-text-tertiary text-sm flex items-center justify-center">
        Context unavailable.
      </div>
    );
  }

  return (
    <div className="p-4 h-full bg-bg-surface border-l border-border-subtle flex flex-col">
      <div className="text-xs text-text-tertiary font-mono uppercase tracking-wider mb-6">Context Panel</div>

      {context.readingMode === 'evidence' && (
        <div className="space-y-4">
          <div className="text-xs font-semibold text-text-secondary">Evidence on Page 1</div>
          <EvidenceCard evidence={mockEvidence2} link={mockLink2} />
        </div>
      )}

      {context.readingMode === 'questions' && (
        <div className="space-y-4">
          <div className="text-xs font-semibold text-text-secondary">Related Question</div>
          {context.activeQuestionId ? (
            <div className="p-3 border border-accent-primary bg-selection-bg rounded-md text-sm text-text-primary">
              Where does the projected 15% YoY growth originate?
            </div>
          ) : (
            <div className="text-xs text-text-tertiary italic">Select a question reading path from the library to see context.</div>
          )}
        </div>
      )}

      {context.readingMode === 'original' && (
        <div className="text-xs text-text-tertiary italic text-center mt-10">
          Switch reading mode to view semantic context.
        </div>
      )}
    </div>
  );
}
