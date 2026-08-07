"use client";
import React from "react";
import { useDataRoomStore } from "../../store/data-room";
import { clsx } from "clsx";
import { ReadingMode } from "@mosaic/contracts";
import { DocumentUploader } from "./components/DocumentUploader";

const MODES: { id: ReadingMode; label: string }[] = [
  { id: "original", label: "Original" },
  { id: "evidence", label: "Evidence" },
  { id: "questions", label: "Questions" },
  { id: "insights", label: "Insights" },
];

export function CenterPanel() {
  const { context, setReadingMode } = useDataRoomStore();

  if (!context.documentId) {
    return (
      <div className="flex-1 h-full flex flex-col items-center justify-center p-8 bg-[#1e1e1e]">
        <DocumentUploader />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e]"> {/* Darker bg representing PDF viewer wrapper */}
      
      {/* Viewer Header / Mode Switcher */}
      <div className="h-12 border-b border-[#2d2d2d] bg-[#1a1a1a] flex items-center justify-center flex-shrink-0 z-10">
        <div className="flex p-1 bg-bg-surface border border-border-subtle rounded-md">
          {MODES.map(m => (
            <button
              key={m.id}
              onClick={() => setReadingMode(m.id)}
              className={clsx(
                "px-3 py-1 text-xs font-medium rounded-sm transition-colors",
                context.readingMode === m.id ? "bg-bg-surface-active text-text-primary shadow-sm" : "text-text-secondary hover:text-text-primary"
              )}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Semantic Canvas */}
      <div className="flex-1 overflow-y-auto p-8 relative flex justify-center">
        {/* Document Page Canvas */}
        <div className="w-[800px] h-[1131px] bg-white text-black shadow-lg relative rounded-sm p-16 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <div className="text-4xl mb-4">📄</div>
            <h3 className="text-xl font-medium mb-2">Document Viewer</h3>
            <p className="text-sm">Document processing complete. Canvas rendering engine active.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
