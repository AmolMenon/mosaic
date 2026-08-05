"use client";
import React from "react";
import { useIngestionStore } from "../../store/ingestion";
import { useIngestion } from "../../hooks/queries";

export function ContextPanel() {
  const { activeStageId } = useIngestionStore();
  const { data } = useIngestion();

  if (!activeStageId) {
    return (
      <div className="p-4 h-full bg-bg-surface border-l border-border-subtle text-text-tertiary text-sm flex items-center justify-center text-center">
        Select a stage to inspect<br/>its Artifact contracts.
      </div>
    );
  }

  if (!data) return null;
  const mockPipelineTranscript = data.pipelineTranscript;
  const stage = mockPipelineTranscript.stages.find((s: any) => s.id === activeStageId);
  if (!stage) return null;

  return (
    <div className="p-4 h-full bg-bg-surface border-l border-border-subtle flex flex-col overflow-y-auto">
      <div className="text-xs text-text-tertiary font-mono uppercase tracking-wider mb-6">Stage Artifacts</div>

      <div className="space-y-6">
        
        {/* Input Contract */}
        <div>
          <div className="text-xs font-semibold text-text-secondary mb-2">Input Artifact Types</div>
          <div className="flex flex-wrap gap-2 mb-4">
            {stage.contract.inputArtifactTypes.map((type: string) => (
              <span key={type} className="text-[10px] font-mono bg-bg-base border border-border-strong px-2 py-0.5 rounded text-text-secondary">
                {type}
              </span>
            ))}
          </div>

          {stage.inputArtifactIds.length > 0 && (
            <div className="space-y-2">
              <div className="text-[10px] uppercase text-text-tertiary font-bold tracking-wider">Consumed Artifacts</div>
              {stage.inputArtifactIds.map((id: string) => {
                const art = mockPipelineTranscript.artifacts.find((a: any) => a.id === id);
                return art && (
                  <div key={id} className="p-2 border border-border-subtle rounded bg-bg-base">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-text-primary">{art.type}</span>
                      <span className="text-[10px] text-text-tertiary font-mono">{art.id}</span>
                    </div>
                    <div className="text-[10px] text-text-secondary flex gap-2">
                      <span>Provider: <span className="font-mono">{art.provenance.provider}</span></span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Output Contract */}
        <div className="pt-4 border-t border-border-subtle">
          <div className="text-xs font-semibold text-text-secondary mb-2">Output Artifact Types</div>
          <div className="flex flex-wrap gap-2 mb-4">
            {stage.contract.outputArtifactTypes.map((type: string) => (
              <span key={type} className="text-[10px] font-mono bg-bg-base border border-border-strong px-2 py-0.5 rounded text-text-secondary">
                {type}
              </span>
            ))}
          </div>

          {stage.outputArtifactIds.length > 0 && (
            <div className="space-y-2">
              <div className="text-[10px] uppercase text-text-tertiary font-bold tracking-wider">Produced Artifacts</div>
              {stage.outputArtifactIds.map((id: string) => {
                const art = mockPipelineTranscript.artifacts.find((a: any) => a.id === id);
                return art && (
                  <div key={id} className="p-2 border border-border-subtle rounded bg-bg-base cursor-pointer hover:border-accent-primary transition-colors">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-accent-primary">{art.type}</span>
                      <span className="text-[10px] text-text-tertiary font-mono">{art.id}</span>
                    </div>
                    <div className="bg-bg-surface rounded border border-border-strong p-2 overflow-x-auto text-[10px] font-mono text-text-secondary">
                      {JSON.stringify(art.payload, null, 2)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
