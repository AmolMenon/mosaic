"use client";
import React from "react";
import { useAiStore } from "../../store/ai";
import { useAI } from "../../hooks/queries";
import { clsx } from "clsx";

export function CenterPanel() {
  const { activeProposalId, setActiveProposal } = useAiStore();
  const { data, isLoading } = useAI();
  
  if (isLoading) return <div className="flex-1 overflow-hidden bg-bg-base p-8">Loading AI tasks...</div>;
  if (!data) return null;

  const assignment = data.assignmentChallengePricing;

  return (
    <div className="flex flex-col h-full overflow-hidden bg-bg-base">
      
      {/* Assignment Header */}
      <div className="p-8 border-b border-border-subtle bg-bg-surface flex-shrink-0">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-[10px] font-bold text-accent-primary uppercase tracking-wider bg-selection-bg px-2 py-1 rounded border border-accent-primary/20">
              {assignment.specialistRole.replace('_', ' ')}
            </span>
            <span className="text-xs text-text-secondary">Project: {assignment.projectId}</span>
          </div>
          <h1 className="text-2xl font-bold text-text-primary mb-2">{assignment.objective}</h1>
          <div className="text-sm text-text-secondary">Scope: {assignment.scope}</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto space-y-12">
          
          {/* AI Plan (Approved) */}
          {assignment.plan && (
            <div className="border border-border-subtle rounded-lg bg-bg-base overflow-hidden">
              <div className="bg-bg-surface border-b border-border-subtle p-3 flex justify-between items-center">
                <div className="text-xs font-mono uppercase tracking-wider text-text-secondary">Execution Plan</div>
                <div className="text-[10px] bg-accent-success/10 text-accent-success px-2 py-1 rounded font-bold uppercase">Approved</div>
              </div>
              <div className="p-5 grid grid-cols-2 gap-6">
                <div>
                  <div className="text-[10px] text-text-tertiary uppercase font-mono mb-2">Steps Executed</div>
                  <ul className="text-sm text-text-secondary space-y-1.5 list-disc pl-4">
                    {assignment.plan.estimatedSteps.map((step: string, i: number) => <li key={i}>{step}</li>)}
                  </ul>
                </div>
                <div>
                  <div className="text-[10px] text-text-tertiary uppercase font-mono mb-2">Generated Outputs</div>
                  <ul className="text-sm text-text-secondary space-y-1.5 list-disc pl-4">
                    {assignment.plan.expectedOutputs.map((out: string, i: number) => <li key={i}>{out}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Deliverables & Proposals */}
          <div>
            <h2 className="text-lg font-bold text-text-primary mb-6 flex items-center justify-between">
              <span>Deliverables for Review</span>
              <span className="text-xs font-normal text-text-tertiary">All AI proposals require explicit human approval.</span>
            </h2>

            {assignment.deliverables.map((deliverable: any) => (
              <div key={deliverable.id} className="mb-8">
                <div className="text-sm font-semibold text-text-primary mb-4 border-b border-border-subtle pb-2">
                  {deliverable.type}: {deliverable.title}
                </div>

                <div className="space-y-4">
                  {deliverable.proposals.map((proposal: any) => {
                    const isActive = activeProposalId === proposal.id;
                    return (
                      <div 
                        key={proposal.id}
                        onClick={() => setActiveProposal(proposal.id)}
                        className={clsx(
                          "border rounded-lg p-5 transition-all cursor-pointer relative",
                          isActive ? "bg-selection-bg/30 border-accent-primary ring-1 ring-accent-primary/20" : "bg-bg-base border-border-subtle hover:border-border-strong"
                        )}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="text-[10px] font-mono uppercase tracking-wider text-accent-primary">
                            Proposed {proposal.proposalType.replace('_proposal', '')}
                          </div>
                          <div className="text-[10px] uppercase font-bold text-accent-warning bg-accent-warning/10 px-2 py-0.5 rounded">
                            {proposal.status.replace('_', ' ')}
                          </div>
                        </div>

                        {/* Rendering the Proposed Object */}
                        <div className="p-4 bg-bg-surface border border-border-strong rounded mb-4 font-serif text-lg leading-relaxed text-text-primary">
                          "{proposal.targetObject.statement}"
                        </div>

                        {/* Inline Actions */}
                        <div className="flex gap-2 border-t border-border-subtle pt-4 mt-4">
                          <button className="px-4 py-1.5 bg-accent-success text-bg-base rounded text-xs font-bold transition-opacity hover:opacity-90">Accept Proposal</button>
                          <button className="px-4 py-1.5 bg-bg-surface border border-border-strong text-text-primary rounded text-xs font-bold hover:bg-bg-surface-hover">Modify...</button>
                          <button className="px-4 py-1.5 bg-bg-surface border border-border-strong text-accent-danger rounded text-xs font-bold hover:bg-accent-danger/10 border-accent-danger/30">Reject</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
