"use client";
import React, { useState } from "react";
import { useIngestionStore } from "../../store/ingestion";
import { useIngestion, useUploadDocument } from "../../hooks/queries";
import { clsx } from "clsx";

export function LeftPanel() {
  const { activePipelineId, setActivePipeline } = useIngestionStore();
  const { data } = useIngestion();
  const uploadDoc = useUploadDocument();
  
  const [localPipelines, setLocalPipelines] = useState<any[]>([]);

  const pipelines = data ? [data.pipelineTranscript, ...localPipelines] : [...localPipelines]; // Mock queue

  React.useEffect(() => {
    if (!activePipelineId && pipelines.length > 0) {
      setActivePipeline(pipelines[0].id);
    }
  }, [activePipelineId, setActivePipeline, pipelines]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("document", file);
      
      uploadDoc.mutate(formData, {
        onSuccess: (res) => {
          if (res.pipeline) {
            setLocalPipelines(prev => [res.pipeline, ...prev]);
            setActivePipeline(res.pipeline.id);
          }
        }
      });
    }
  };

  return (
    <div className="p-4 h-full flex flex-col bg-bg-base overflow-y-auto">
      <div className="mb-6">
        <div className="text-xs font-mono uppercase tracking-wider text-text-tertiary mb-3 flex items-center justify-between">
          <span>Ingestion Pipelines</span>
          <label className={clsx("text-accent-primary hover:underline cursor-pointer", uploadDoc.isPending && "opacity-50 pointer-events-none")}>
            {uploadDoc.isPending ? "Uploading..." : "Upload"}
            <input type="file" className="hidden" accept=".pdf,.txt,.md" onChange={handleFileUpload} disabled={uploadDoc.isPending} />
          </label>
        </div>
      </div>

      <div className="mb-6">
        <div className="text-[10px] font-mono text-text-secondary uppercase mb-2">Active Workflows</div>
        <div className="space-y-2">
          {pipelines.filter(p => p.status === 'paused' || p.status === 'running').map(pipe => {
            const isActive = activePipelineId === pipe.id;
            return (
              <div 
                key={pipe.id}
                onClick={() => setActivePipeline(pipe.id)}
                className={clsx(
                  "p-3 rounded border cursor-pointer transition-all",
                  isActive ? "bg-selection-bg border-accent-primary" : "bg-bg-surface border-border-subtle hover:border-border-strong"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={clsx(
                    "text-[10px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider",
                    pipe.status === 'paused' ? "bg-accent-warning/20 text-accent-warning" : "bg-accent-primary/20 text-accent-primary"
                  )}>
                    {pipe.status}
                  </span>
                  <span className="text-[10px] text-text-tertiary uppercase font-mono">{pipe.profile.replace('_', ' ')}</span>
                </div>
                <div className="text-sm font-semibold text-text-primary line-clamp-1 mb-1">
                  {pipe.documentId}
                </div>
                {/* Progress bar mock */}
                <div className="w-full bg-border-subtle h-1.5 rounded-full overflow-hidden">
                  <div className="bg-accent-warning h-full" style={{ width: '66%' }}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <div className="text-[10px] font-mono text-text-secondary uppercase mb-2">Completed</div>
        <div className="p-3 border border-dashed border-border-strong rounded bg-bg-base text-center text-xs text-text-tertiary">
          No recently completed pipelines.
        </div>
      </div>

    </div>
  );
}
