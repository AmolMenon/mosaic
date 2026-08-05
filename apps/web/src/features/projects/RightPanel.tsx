"use client";
import React from "react";
import { Project } from "@mosaic/contracts";
import { useEvidenceTrace } from "../../store/evidence-trace";
import { EvidenceCard } from "@mosaic/ui";
import { useInsights } from "../../hooks/queries";

export function RightPanel({ project }: { project: Project }) {
  const { isTraceActive, selectionMap } = useEvidenceTrace();
  const { data: insightsData } = useInsights(project.id);

  // If trace is active, Right panel becomes the Evidence Inspector
  if (isTraceActive) {
    const evidenceList = insightsData?.evidence || [];
    const linksList = insightsData?.links || [];

    return (
      <div className="p-4 h-full bg-bg-surface border-l border-border-subtle flex flex-col transition-colors duration-150">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-accent-primary animate-pulse" />
          <div className="text-xs text-text-primary font-mono uppercase tracking-wider font-semibold">Evidence Trace Active</div>
        </div>
        
        <div className="flex-1 overflow-y-auto space-y-4">
          <div className="text-xs text-text-secondary mb-2">Source Document Mapping</div>
          <div className="relative">
            {evidenceList.map((ev: any, idx: number) => (
              <React.Fragment key={idx}>
                <EvidenceCard evidence={ev} link={linksList[idx]} isTraced={true} />
                {idx < evidenceList.length - 1 && (
                  <div className="my-2 border-l-2 border-dashed border-border-subtle h-4 ml-4" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Default Right Panel
  return (
    <div className="p-4 h-full bg-bg-surface border-l border-border-subtle transition-colors duration-150">
      <div className="text-xs text-text-tertiary font-mono uppercase tracking-wider mb-4">Inspector</div>
      
      <div className="mb-6">
        <div className="text-xs font-semibold text-text-secondary mb-2">Pinned Evidence</div>
        <div className="p-3 border border-border-subtle rounded bg-bg-base text-xs text-text-tertiary italic text-center">
          No evidence pinned yet.
        </div>
      </div>

      <div className="mb-6">
        <div className="text-xs font-semibold text-text-secondary mb-2">Recent Documents</div>
        <div className="p-3 border border-border-subtle rounded bg-bg-base text-xs text-text-tertiary italic text-center">
          Upload a CIM to begin.
        </div>
      </div>
    </div>
  );
}
