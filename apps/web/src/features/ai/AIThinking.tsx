"use client";
import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { 
  CheckCircle2, 
  CircleDashed, 
  MessageSquareText, 
  AlertTriangle, 
  XCircle, 
  Clock, 
  RotateCcw,
  Loader2
} from "lucide-react";
import { clsx } from "clsx";
import { useAiStore } from "../../store/ai";
import { useProgressSubscriber } from "../../streaming/ProgressSubscriber";

const STATIC_STEPS = [
  { id: "READING", label: "Reading Annual Report", time: "0.2s" },
  { id: "EXTRACTING", label: "Extracting Financial Metrics", time: "1.4s" },
  { id: "ANALYZING", label: "Identifying Risks", time: "3.2s" },
  { id: "SYNTHESIZING", label: "Comparing Competitors", time: "2.1s" },
  { id: "HYPOTHESES", label: "Generating Initial Hypotheses", time: null },
  { id: "REVIEW", label: "Reviewing Findings", time: null },
  { id: "COMPLETED", label: "Preparing Investment Memo", time: null },
];

export function AIThinking() {
  const { activeExecutionId } = useAiStore();
  const progressEvent = useProgressSubscriber(activeExecutionId || "");
  const [messages, setMessages] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync messages from SSE logs
  useEffect(() => {
    if (progressEvent && progressEvent.logs) {
      setMessages(progressEvent.logs);
    } else if (progressEvent && progressEvent.stage) {
       // if no logs but stage changed, add stage as a message
       setMessages(prev => {
          if (!prev.includes(progressEvent.stage)) {
            return [...prev, `Transitioned to stage: ${progressEvent.stage}`];
          }
          return prev;
       });
    }
  }, [progressEvent]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const currentStage = progressEvent?.stage || "READING";
  const status = progressEvent?.status || "RUNNING";
  const isComplete = status === "COMPLETED";
  const isFailed = status === "FAILED";

  const getStepStatus = (stepId: string, index: number) => {
    const currentIndex = STATIC_STEPS.findIndex(s => s.id === currentStage);
    if (isFailed && stepId === currentStage) return "failed";
    if (isComplete || index < currentIndex) return "success";
    if (index === currentIndex && status === "RUNNING") return "in_progress";
    return "pending";
  };

  return (
    <div className="flex flex-col h-full bg-bg-base font-ui text-text-primary p-8 overflow-y-auto w-full">
      <div className="max-w-5xl w-full mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Header Skeleton / Loading State */}
        <div className="flex items-start justify-between border-b border-border-subtle pb-6">
          <div className="space-y-3">
            <h1 className="text-2xl font-bold flex items-center gap-3">
              {!isComplete && !isFailed && <Loader2 className="animate-spin text-accent-primary" size={24} />}
              {isComplete && <CheckCircle2 className="text-accent-success" size={24} />}
              {isFailed && <XCircle className="text-accent-danger" size={24} />}
              AI Analysis Processing
            </h1>
            <div className="flex gap-4">
              <div className="text-sm text-text-secondary">
                Execution ID: {activeExecutionId || "Pending..."}
              </div>
            </div>
          </div>
          <div className="flex gap-8 text-sm bg-bg-surface p-4 rounded-lg border border-border-subtle shadow-sm">
            <div className="flex flex-col">
              <span className="text-text-tertiary text-[10px] uppercase font-bold tracking-wider mb-1">Status</span>
              <span className="font-medium text-accent-primary flex items-center gap-1.5">
                {!isComplete && !isFailed && (
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-primary"></span>
                  </span>
                )}
                {isComplete ? "Completed" : isFailed ? "Failed" : "Analyzing"}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-10">
          
          {/* Timeline */}
          <div className="col-span-5 space-y-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-4 flex items-center gap-2">
              Processing Steps
            </h2>
            <div className="relative border-l border-border-strong ml-3 space-y-8">
              {STATIC_STEPS.map((step, index) => {
                const stepStatus = getStepStatus(step.id, index);
                const isSuccess = stepStatus === "success";
                const isInProgress = stepStatus === "in_progress";
                const isFailedStep = stepStatus === "failed";
                const isPending = stepStatus === "pending";

                return (
                  <div key={step.id} className="relative pl-6">
                    <div className={clsx(
                      "absolute -left-[11px] top-0 bg-bg-base rounded-full border-2",
                      isSuccess && "text-accent-success border-accent-success bg-accent-success/10",
                      isInProgress && "text-accent-primary border-accent-primary bg-selection-bg",
                      isFailedStep && "text-accent-danger border-accent-danger bg-accent-danger/10",
                      isPending && "text-border-strong border-border-strong bg-bg-surface",
                    )}>
                      {isSuccess && <CheckCircle2 size={18} />}
                      {isInProgress && <Loader2 size={18} className="animate-spin" />}
                      {isFailedStep && <XCircle size={18} />}
                      {isPending && <CircleDashed size={18} />}
                    </div>

                    <div className="flex flex-col">
                      <div className="flex items-center justify-between">
                        <span className={clsx(
                          "font-medium text-sm transition-colors",
                          isPending ? "text-text-tertiary" : "text-text-primary"
                        )}>
                          {step.label}
                        </span>
                      </div>
                      
                      {isFailedStep && (
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

          {/* Conversational Progress */}
          <div className="col-span-7">
            <h2 className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-4 flex items-center gap-2">
              <MessageSquareText size={14} /> AI Analyst Updates
            </h2>
            <div className="bg-bg-surface border border-border-subtle rounded-xl shadow-sm overflow-hidden flex flex-col h-[550px]">
              <div className="p-6 flex-1 overflow-y-auto space-y-6">
                {messages.length === 0 && (
                  <div className="text-text-tertiary text-sm italic">Waiting for connection...</div>
                )}
                {messages.map((message, i) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={i} 
                    className="flex gap-4 max-w-[90%]"
                  >
                    <div className="w-8 h-8 rounded-full bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-accent-primary font-bold text-xs">AI</span>
                    </div>
                    <div className="bg-bg-base border border-border-subtle p-4 rounded-2xl rounded-tl-none shadow-sm text-sm text-text-primary leading-relaxed">
                      {message}
                    </div>
                  </motion.div>
                ))}
                
                {!isComplete && !isFailed && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-4 max-w-[90%]"
                  >
                    <div className="w-8 h-8 rounded-full bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-accent-primary font-bold text-xs">AI</span>
                    </div>
                    <div className="bg-bg-base border border-border-subtle p-4 rounded-2xl rounded-tl-none shadow-sm text-sm text-text-secondary flex items-center gap-2">
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-text-tertiary animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-text-tertiary animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-text-tertiary animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
