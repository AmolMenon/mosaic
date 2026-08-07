"use client";
import React from "react";
import { useIngestionStore } from "../../store/ingestion";
import { useIngestion } from "../../hooks/queries";
import { clsx } from "clsx";
import { Play, RotateCcw, SkipForward } from "lucide-react";

export function CenterPanel() {
  const { activeStageId, setActiveStage } = useIngestionStore();
  const { data, isLoading } = useIngestion();

  if (isLoading) return <div className="flex-1 overflow-hidden bg-bg-base p-8 text-text-tertiary">Loading document...</div>;
  if (!data) return null;

  const { pipelineTranscript: pipeline } = data;

  return (
    <div className="flex flex-col h-full overflow-hidden bg-bg-base">
      
      {/* Document Header */}
      <div className="p-8 border-b border-border-subtle bg-bg-surface flex-shrink-0">
        <div className="max-w-4xl mx-auto flex justify-between items-end">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-[10px] font-bold text-accent-primary uppercase tracking-wider bg-selection-bg px-2 py-1 rounded border border-accent-primary/20">
                Profile: {pipeline.profile.replace('_', ' ')}
              </span>
              <span className="text-xs font-mono text-text-secondary">Analysis: {pipeline.id}</span>
            </div>
            <h1 className="text-2xl font-bold text-text-primary mb-2">Document: {pipeline.documentId}</h1>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-3 py-1.5 bg-bg-surface border border-border-strong rounded hover:bg-bg-surface-hover text-sm">
              <RotateCcw size={14} /> Restart Analysis
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          <div className="text-lg font-bold text-text-primary mb-4">Document Processing</div>
          
          <div className="space-y-4">
            {pipeline.stages.map((stage: any, idx: number) => {
              const isActive = activeStageId === stage.id;
              
              const statusColors = {
                success: "border-accent-success/50 bg-accent-success/5",
                awaiting_human: "border-accent-warning/50 bg-accent-warning/5 ring-1 ring-accent-warning/30",
                failed: "border-accent-danger/50 bg-accent-danger/5",
                pending: "border-border-subtle bg-bg-surface",
                running: "border-accent-primary/50 bg-accent-primary/5",
                skipped: "border-border-subtle bg-bg-surface opacity-60"
              };

              return (
                <div 
                  key={stage.id}
                  onClick={() => setActiveStage(stage.id)}
                  className={clsx(
                    "flex flex-col rounded-lg border transition-all cursor-pointer relative overflow-hidden",
                    statusColors[stage.status as keyof typeof statusColors],
                    isActive ? "ring-2 ring-accent-primary shadow-sm" : "hover:border-border-strong"
                  )}
                >
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-bg-base border border-border-strong flex items-center justify-center font-mono text-xs font-bold text-text-secondary">
                        {idx + 1}
                      </div>
                      <div>
                        <div className="font-semibold text-text-primary">{stage.name}</div>
                        <div className="text-xs text-text-tertiary flex gap-2">
                          <span>{stage.id}</span>
                          {stage.startTime && <span>• {new Date(stage.startTime).toLocaleTimeString()}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded bg-bg-base border border-border-subtle">
                      {stage.status.replace('_', ' ')}
                    </div>
                  </div>

                  {isActive && (
                    <div className="px-4 py-4 border-t border-border-subtle bg-bg-base/50">
                      
                      {/* Quality Gates */}
                      {stage.qualityGates.length > 0 && (
                        <div className="mb-4">
                          <div className="text-xs font-mono uppercase tracking-wider text-text-secondary mb-2">Quality Gates</div>
                          {stage.qualityGates.map((gate: any, i: number) => (
                            <div key={i} className="flex items-center justify-between text-xs p-2 rounded bg-bg-surface border border-border-subtle mb-1">
                              <span className="font-medium text-text-primary">{gate.metric}</span>
                              <div className="flex items-center gap-4">
                                <span className="text-text-tertiary">Threshold: {gate.threshold}</span>
                                <span className={clsx("font-bold", gate.passed ? "text-accent-success" : "text-accent-warning")}>
                                  Actual: {gate.actualValue}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Logs */}
                      <div className="mb-4">
                        <div className="text-xs font-mono uppercase tracking-wider text-text-secondary mb-2">Stage Logs</div>
                        <div className="bg-bg-surface font-mono text-[10px] p-3 rounded border border-border-subtle space-y-1 overflow-x-auto">
                          {stage.logs.map((log: any, i: number) => (
                            <div key={i} className={clsx(
                              "flex gap-3",
                              log.level === 'error' ? "text-accent-danger" : log.level === 'warn' ? "text-accent-warning" : "text-text-secondary"
                            )}>
                              <span className="opacity-50 flex-shrink-0">{new Date(log.timestamp).toISOString().split('T')[1].replace('Z','')}</span>
                              <span className="uppercase w-10 flex-shrink-0">[{log.level}]</span>
                              <span>{log.message}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Controls for paused/failed stages */}
                      {stage.status === 'awaiting_human' && (
                        <div className="flex gap-2 pt-2 border-t border-border-subtle">
                          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-accent-primary text-bg-base rounded text-xs font-bold hover:opacity-90">
                            <Play size={14} /> Resume Processing
                          </button>
                          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-bg-surface border border-border-strong text-text-primary rounded text-xs font-bold hover:bg-bg-surface-hover">
                            <SkipForward size={14} /> Skip Stage
                          </button>
                        </div>
                      )}

                    </div>
                  )}

                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}
