"use client";
import React from "react";
import { useAiStore } from "../../store/ai";
import { useAI } from "../../hooks/queries";
import { clsx } from "clsx";

export function LeftPanel() {
  const { activeAssignmentId, setActiveAssignment } = useAiStore();
  const { data } = useAI();

  return (
    <div className="p-4 h-full flex flex-col bg-bg-base overflow-y-auto">
      <div className="mb-6">
        <div className="text-xs font-mono uppercase tracking-wider text-text-tertiary mb-3 flex items-center justify-between">
          <span>AI Operations</span>
        </div>
      </div>

      <div className="mb-6">
        <div className="text-[10px] font-mono text-text-secondary uppercase mb-2">Needs Review</div>
        <div className="space-y-2">
          <div className="p-3 border border-dashed border-border-strong rounded bg-bg-base text-center text-xs text-text-tertiary">
            No tasks require review.
          </div>
        </div>
      </div>

      <div>
        <div className="text-[10px] font-mono text-text-secondary uppercase mb-2">Running Tasks</div>
        <div className="p-3 border border-dashed border-border-strong rounded bg-bg-base text-center text-xs text-text-tertiary">
          No active tasks running.
        </div>
      </div>
    </div>
  );
}
