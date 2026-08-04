"use client";
import React from "react";
import { Project } from "@mosaic/contracts";
import { useEvidenceTrace } from "../../store/evidence-trace";
import { mockEvidence1, mockEvidence2, mockLink1, mockLink2 } from "@mosaic/testing";
import { EvidenceCard } from "@mosaic/ui";

export function RightPanel({ project }: { project: Project }) {
  const { isTraceActive, selectionMap } = useEvidenceTrace();

  // If trace is active, Right panel becomes the Evidence Inspector
  if (isTraceActive) {
    return (
      <div className="p-4 h-full bg-bg-surface border-l border-border-subtle flex flex-col transition-colors duration-150">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-accent-primary animate-pulse" />
          <div className="text-xs text-text-primary font-mono uppercase tracking-wider font-semibold">Evidence Trace Active</div>
        </div>
        
        <div className="flex-1 overflow-y-auto space-y-4">
          <div className="text-xs text-text-secondary mb-2">Source Document Mapping</div>
          {/* We show the mocked evidence cards here to represent the connection */}
          <div className="relative">
            <EvidenceCard evidence={mockEvidence1} link={mockLink1} isTraced={true} />
            <div className="my-2 border-l-2 border-dashed border-border-subtle h-4 ml-4" />
            <EvidenceCard evidence={mockEvidence2} link={mockLink2} isTraced={true} />
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
