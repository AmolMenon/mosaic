"use client";
import React, { useState } from "react";
import { useIngestionStore } from "../../store/ingestion";
import { useIngestion } from "../../hooks/queries";
import { clsx } from "clsx";
import { Uploader } from "./Uploader";
import { motion, AnimatePresence } from "framer-motion";

export function LeftPanel() {
  const { activePipelineId, setActivePipeline } = useIngestionStore();
  const { data } = useIngestion();
  
  const [localPipelines, setLocalPipelines] = useState<any[]>([]);

  const pipelines = React.useMemo(() => {
    return data ? [data.pipelineTranscript, ...localPipelines].filter(Boolean) : [...localPipelines];
  }, [data, localPipelines]);

  React.useEffect(() => {
    if (!activePipelineId && pipelines.length > 0) {
      setActivePipeline(pipelines[0].id);
    }
  }, [activePipelineId, setActivePipeline, pipelines]);

  const handleUploadSuccess = (pipeline: any) => {
    setLocalPipelines(prev => [pipeline, ...prev]);
    setActivePipeline(pipeline.id);
  };

  const activeWorkflows = pipelines.filter(p => p.status === 'paused' || p.status === 'running');
  const completedWorkflows = pipelines.filter(p => p.status === 'complete' || p.status === 'completed');

  return (
    <div className="p-4 h-full flex flex-col bg-bg-base overflow-y-auto">
      <div className="mb-6">
        <div className="text-xs font-mono uppercase tracking-wider text-text-tertiary mb-3 flex items-center justify-between">
          <span>Ingestion</span>
        </div>
        <Uploader onUploadSuccess={handleUploadSuccess} />
      </div>

      <div className="mb-6">
        <div className="text-[10px] font-mono text-text-secondary uppercase mb-2">Active Workflows</div>
        {activeWorkflows.length === 0 ? (
          <div className="p-3 border border-dashed border-border-strong rounded bg-bg-base text-center text-xs text-text-tertiary">
            No active workflows.
          </div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence>
              {activeWorkflows.map(pipe => {
                const isActive = activePipelineId === pipe.id;
                return (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
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
                      <span className="text-[10px] text-text-tertiary uppercase font-mono">{pipe.profile?.replace('_', ' ') || 'DEFAULT'}</span>
                    </div>
                    <div className="text-sm font-semibold text-text-primary line-clamp-1">
                      {pipe.documentId || 'Unknown Document'}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      <div>
        <div className="text-[10px] font-mono text-text-secondary uppercase mb-2">Completed</div>
        {completedWorkflows.length === 0 ? (
          <div className="p-3 border border-dashed border-border-strong rounded bg-bg-base text-center text-xs text-text-tertiary">
            No recently completed pipelines.
          </div>
        ) : (
          <div className="space-y-2">
             <AnimatePresence>
              {completedWorkflows.map(pipe => {
                const isActive = activePipelineId === pipe.id;
                return (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    key={pipe.id}
                    onClick={() => setActivePipeline(pipe.id)}
                    className={clsx(
                      "p-3 rounded border cursor-pointer transition-all",
                      isActive ? "bg-selection-bg border-accent-primary" : "bg-bg-surface border-border-subtle hover:border-border-strong opacity-70 hover:opacity-100"
                    )}
                  >
                     <div className="text-sm font-semibold text-text-primary line-clamp-1 mb-1">
                      {pipe.documentId || 'Unknown Document'}
                    </div>
                    <div className="text-[10px] text-text-tertiary uppercase font-mono">{pipe.profile?.replace('_', ' ') || 'DEFAULT'}</div>
                  </motion.div>
                )
              })}
             </AnimatePresence>
          </div>
        )}
      </div>

    </div>
  );
}
