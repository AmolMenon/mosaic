"use client";
import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { 
  CheckCircle2, 
  CircleDashed, 
  Terminal, 
  AlertTriangle, 
  XCircle, 
  Clock, 
  RotateCcw,
  Loader2
} from "lucide-react";
import { clsx } from "clsx";

const PIPELINE_STEPS = [
  { id: "init", label: "Initialize Secure Environment", status: "success", time: "0.2s" },
  { id: "scan", label: "Scan Data Room Documents", status: "success", time: "1.4s" },
  { id: "extract", label: "Extract Key Insights", status: "success", time: "3.2s" },
  { id: "synthesize", label: "Synthesize Evidence", status: "warning", time: "2.1s", warning: "Missing 2 documents in appendix" },
  { id: "draft", label: "Draft Strategic Proposals", status: "in_progress", time: null },
  { id: "verify", label: "Verify Risk Assertions", status: "pending", time: null },
  { id: "finalize", label: "Finalize Deliverables", status: "pending", time: null },
];

const LOG_STREAM = [
  "[System] Allocating compute resources...",
  "[System] Container ready (0.12s) - Image: mosaic-ai-core:latest",
  "[AI] Connecting to enterprise data room #A-102...",
  "[AI] Indexing completed. Found 4,203 documents.",
  "[AI] Filtering by semantic relevance to 'Acquisition target'...",
  "[AI] 142 documents identified for deep scanning.",
  "[AI] Extracting financial metrics from Q3 and Q4 reports...",
  "[AI] Extracting legal liabilities from employment contracts...",
  "[Warning] Document 'Appx_C.pdf' OCR confidence low (<60%), skipping.",
  "[AI] Synthesizing cross-references across entities...",
  "[System] Invoking multi-agent LLM chain: 'Drafting Proposals'...",
  "[System] Agent 'Financial_Analyst' starting...",
  "[System] Token streaming started...",
];

export function AIThinking({ step = 0 }: { step?: number }) {
  const [logs, setLogs] = useState<string[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < LOG_STREAM.length) {
        setLogs(prev => [...prev, LOG_STREAM[i]]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 600);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return (
    <div className="flex flex-col h-full bg-bg-base font-ui text-text-primary p-8 overflow-y-auto w-full">
      <div className="max-w-5xl w-full mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Header Skeleton / Loading State */}
        <div className="flex items-start justify-between border-b border-border-subtle pb-6">
          <div className="space-y-3">
            <h1 className="text-2xl font-bold flex items-center gap-3">
              <Loader2 className="animate-spin text-accent-primary" size={24} />
              AI Pipeline Execution
            </h1>
            <div className="flex gap-4">
              <div className="h-4 w-32 bg-bg-surface rounded animate-pulse" />
              <div className="h-4 w-64 bg-bg-surface rounded animate-pulse" />
            </div>
          </div>
          <div className="flex gap-8 text-sm bg-bg-surface p-4 rounded-lg border border-border-subtle shadow-sm">
            <div className="flex flex-col">
              <span className="text-text-tertiary text-[10px] uppercase font-bold tracking-wider mb-1">Est. Completion</span>
              <span className="font-mono font-medium text-text-primary flex items-center gap-1.5">
                <Clock size={14} className="text-accent-primary" /> ~ 45s
              </span>
            </div>
            <div className="w-px bg-border-strong" />
            <div className="flex flex-col">
              <span className="text-text-tertiary text-[10px] uppercase font-bold tracking-wider mb-1">Status</span>
              <span className="font-medium text-accent-primary flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-primary"></span>
                </span>
                In Progress
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-10">
          
          {/* Timeline */}
          <div className="col-span-4 space-y-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-4 flex items-center gap-2">
              Execution Steps
            </h2>
            <div className="relative border-l border-border-strong ml-3 space-y-8">
              {PIPELINE_STEPS.map((pipelineStep) => {
                const isSuccess = pipelineStep.status === "success";
                const isInProgress = pipelineStep.status === "in_progress";
                const isWarning = pipelineStep.status === "warning";
                const isFailed = pipelineStep.status === "failed";
                const isPending = pipelineStep.status === "pending";

                return (
                  <div key={pipelineStep.id} className="relative pl-6">
                    <div className={clsx(
                      "absolute -left-[11px] top-0 bg-bg-base rounded-full border-2",
                      isSuccess && "text-accent-success border-accent-success bg-accent-success/10",
                      isInProgress && "text-accent-primary border-accent-primary bg-selection-bg",
                      isWarning && "text-accent-warning border-accent-warning bg-accent-warning/10",
                      isFailed && "text-accent-danger border-accent-danger bg-accent-danger/10",
                      isPending && "text-border-strong border-border-strong bg-bg-surface",
                    )}>
                      {isSuccess && <CheckCircle2 size={18} />}
                      {isInProgress && <Loader2 size={18} className="animate-spin" />}
                      {isWarning && <AlertTriangle size={18} />}
                      {isFailed && <XCircle size={18} />}
                      {isPending && <CircleDashed size={18} />}
                    </div>

                    <div className="flex flex-col">
                      <div className="flex items-center justify-between">
                        <span className={clsx(
                          "font-medium text-sm transition-colors",
                          isPending ? "text-text-tertiary" : "text-text-primary"
                        )}>
                          {pipelineStep.label}
                        </span>
                        {pipelineStep.time && (
                          <span className="text-[10px] font-mono text-text-tertiary bg-bg-surface px-1.5 py-0.5 rounded">{pipelineStep.time}</span>
                        )}
                      </div>
                      
                      {pipelineStep.warning && (
                        <div className="text-xs text-accent-warning mt-1.5 flex items-center gap-1.5 bg-accent-warning/5 p-2 rounded border border-accent-warning/20">
                          <AlertTriangle size={12} className="flex-shrink-0" /> 
                          <span>{pipelineStep.warning}</span>
                        </div>
                      )}
                      
                      {isFailed && (
                        <div className="mt-2 text-xs">
                          <button className="flex items-center gap-1.5 text-accent-primary hover:text-accent-primary-hover bg-selection-bg px-3 py-1.5 rounded font-medium transition-colors">
                            <RotateCcw size={12} /> Retry Step
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Terminal / Live Logs */}
          <div className="col-span-8">
            <h2 className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-4 flex items-center gap-2">
              <Terminal size={14} /> Live Logs
            </h2>
            <div className="bg-[#0A0D10] border border-border-strong rounded-lg shadow-xl overflow-hidden flex flex-col h-[500px]">
              <div className="flex items-center justify-between px-4 py-2 border-b border-[#2A313C] bg-[#14181E]">
                <div className="flex gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
                </div>
                <div className="text-[10px] text-gray-500 font-mono tracking-wider">ai-worker-node-1</div>
              </div>
              <div className="p-5 flex-1 overflow-y-auto font-mono text-[13px] leading-relaxed space-y-1.5">
                {logs.map((log, i) => (
                  <div key={i} className={clsx(
                    "whitespace-pre-wrap break-all flex gap-3",
                    log.includes("[Warning]") ? "text-yellow-400" :
                    log.includes("[Error]") ? "text-red-400" :
                    log.includes("[System]") ? "text-blue-400" :
                    log.includes("[AI]") ? "text-emerald-400" : "text-gray-300"
                  )}>
                    <span className="text-gray-600 flex-shrink-0 select-none">
                      {new Date().toISOString().split('T')[1].slice(0,12)}
                    </span>
                    <span>{log}</span>
                  </div>
                ))}
                {logs.length < LOG_STREAM.length && (
                  <div className="flex items-center text-gray-500 mt-2">
                    <span className="animate-pulse mr-2 text-accent-primary">▊</span>
                  </div>
                )}
                <div ref={logsEndRef} />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
