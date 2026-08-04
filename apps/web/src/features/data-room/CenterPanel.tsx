"use client";
import React from "react";
import { useDataRoomStore } from "../../store/data-room";
import { clsx } from "clsx";
import { ReadingMode } from "@mosaic/contracts";

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
      <div className="flex-1 h-full flex items-center justify-center text-text-tertiary">
        Select a document from the library to begin semantic reading.
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

      {/* Semantic Canvas Mock */}
      <div className="flex-1 overflow-y-auto p-8 relative flex justify-center">
        {/* Document Page Canvas */}
        <div className="w-[800px] h-[1131px] bg-white text-black shadow-lg relative rounded-sm p-16">
          <h2 className="text-2xl font-bold mb-6 font-serif">Q3 Financial Results</h2>
          
          <div className="space-y-4 font-serif leading-relaxed text-sm">
            <p>
              The company delivered strong performance in Q3, achieving a 15% year-over-year revenue growth. 
              This was primarily driven by the expansion of our enterprise segment in the APAC region.
            </p>

            {/* Simulated Bounding Box Overlay based on mode */}
            <div className="relative">
              <p>
                However, management expects enterprise churn to increase to 8% due to macro headwinds 
                and aggressive pricing from competitors.
              </p>
              
              {/* Overlays */}
              {context.readingMode === 'evidence' && (
                <div className="absolute inset-0 bg-yellow-300/30 border border-yellow-500 rounded cursor-pointer hover:bg-yellow-300/50 transition-colors" />
              )}
              {context.readingMode === 'questions' && context.activeQuestionId && (
                <div className="absolute inset-0 bg-blue-300/30 border border-blue-500 rounded cursor-pointer hover:bg-blue-300/50 transition-colors" />
              )}
            </div>

            <p>
              Operating margins remained stable at 22%, thanks to disciplined cost management in the 
              marketing and sales organizations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
