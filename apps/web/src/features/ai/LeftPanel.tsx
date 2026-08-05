"use client";
import React from "react";
import { useAiStore } from "../../store/ai";
import { useAI } from "../../hooks/queries";
import { clsx } from "clsx";

export function LeftPanel() {
  const { activeAssignmentId, setActiveAssignment } = useAiStore();
  const { data } = useAI();

  React.useEffect(() => {
    if (data && !activeAssignmentId) setActiveAssignment(data.assignmentChallengePricing.id);
  }, [activeAssignmentId, setActiveAssignment, data]);

  if (!data) return null;
  const mockAssignmentChallengePricing = data.assignmentChallengePricing;

  const assignments = [mockAssignmentChallengePricing]; // Mock queue

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
          {assignments.filter(a => a.status === 'needs_review').map(assign => {
            const isActive = activeAssignmentId === assign.id;
            return (
              <div 
                key={assign.id}
                onClick={() => setActiveAssignment(assign.id)}
                className={clsx(
                  "p-3 rounded border cursor-pointer transition-all",
                  isActive ? "bg-selection-bg border-accent-primary" : "bg-bg-surface border-border-subtle hover:border-border-strong"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] bg-accent-warning/20 text-accent-warning px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">Review Ready</span>
                  <span className="text-[10px] text-text-tertiary uppercase font-mono">{assign.specialistRole.replace('_', ' ')}</span>
                </div>
                <div className="text-sm font-semibold text-text-primary line-clamp-2">
                  {assign.objective}
                </div>
              </div>
            );
          })}
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
