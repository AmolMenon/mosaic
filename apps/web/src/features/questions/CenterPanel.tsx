"use client";
import React from "react";
import { useQuestionsStore } from "../../store/questions";
import { useQuestions } from "../../hooks/queries";
import { clsx } from "clsx";

import { useParams } from "next/navigation";

export function CenterPanel() {
  const { activeQuestionId } = useQuestionsStore();
  const params = useParams();
  const { data, isLoading } = useQuestions(params.id as string);

  if (isLoading) return <div className="flex-1 h-full flex items-center justify-center text-text-tertiary">Loading question...</div>;
  if (!data) return null;

  if (activeQuestionId !== data.questionPricing.id) {
    return (
      <div className="flex-1 h-full flex items-center justify-center text-text-tertiary">
        Select a question to begin investigation.
      </div>
    );
  }

  const q = data.questionPricing;
  const mockHypothesisPremium = data.hypothesisPremium;
  const mockHypothesisVulnerable = data.hypothesisVulnerable;
  const mockEvidence1 = data.evidence1;
  const mockEvidence2 = data.evidence2;

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-bg-base p-8">
      {/* Question Header */}
      <div className="mb-10 max-w-4xl">
        <div className="text-xs font-mono uppercase tracking-wider text-text-tertiary mb-3 flex items-center gap-2">
          <span>Active Investigation</span>
          <span className="w-1.5 h-1.5 rounded-full bg-accent-warning animate-pulse" />
        </div>
        <h1 className="text-3xl font-bold text-text-primary mb-4 leading-tight">{q.text}</h1>
        
        {/* Analyst Position */}
        <div className="p-4 bg-bg-surface border border-border-subtle rounded-md">
          <div className="text-xs font-semibold text-text-secondary uppercase mb-2">Analyst Position</div>
          <textarea 
            className="w-full bg-transparent resize-none outline-none text-sm text-text-primary leading-relaxed"
            rows={3}
            defaultValue={q.analystPosition}
          />
        </div>
      </div>

      <div className="flex gap-8 max-w-6xl">
        {/* Hypothesis 1 */}
        <div className="flex-1 space-y-6">
          <div className="p-5 border-2 border-accent-success/30 rounded-lg bg-bg-surface relative">
            <div className="absolute -top-3 left-4 px-2 bg-bg-surface text-[10px] font-bold uppercase tracking-wider text-accent-success border border-accent-success/30 rounded-full">
              Leading Hypothesis
            </div>
            <h3 className="text-base font-semibold mb-4 leading-snug">{mockHypothesisPremium.statement}</h3>
            
            <div className="space-y-4">
              <div>
                <div className="text-xs text-text-tertiary uppercase mb-2 font-mono">Explainable Confidence</div>
                <div className="p-3 bg-bg-base border border-border-subtle rounded text-sm text-text-secondary">
                  <span className="font-bold text-accent-warning">MEDIUM</span> — {mockHypothesisPremium.confidenceExplanation}
                </div>
              </div>

              <div>
                <div className="text-xs text-text-tertiary uppercase mb-2 font-mono">Assumptions</div>
                {mockHypothesisPremium.assumptions.map((a: any) => (
                  <div key={a.id} className="text-sm border-l-2 border-border-strong pl-3 py-1 mb-2 text-text-secondary">
                    {a.statement}
                  </div>
                ))}
              </div>

              <div>
                <div className="text-xs text-text-tertiary uppercase mb-2 font-mono text-accent-success">Supporting Evidence (2)</div>
                <div className="p-3 bg-bg-base border border-border-subtle rounded text-sm mb-2 shadow-sm">
                  &quot;{mockEvidence1.text}&quot;
                </div>
              </div>

              <div>
                <div className="text-xs text-text-tertiary uppercase mb-2 font-mono text-accent-danger">Counterarguments (1)</div>
                {mockHypothesisPremium.counterarguments.map((c: any) => (
                  <div key={c.id} className="p-3 bg-bg-base border border-accent-danger/30 rounded text-sm">
                    <span className="font-semibold text-accent-danger text-xs uppercase mr-2">OPEN RISK</span>
                    {c.statement}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Hypothesis 2 */}
        <div className="flex-1 space-y-6 opacity-70 hover:opacity-100 transition-opacity">
          <div className="p-5 border border-border-subtle rounded-lg bg-bg-surface">
            <div className="text-[10px] font-bold uppercase tracking-wider text-text-tertiary mb-3">
              Alternative Hypothesis
            </div>
            <h3 className="text-base font-semibold mb-4 leading-snug">{mockHypothesisVulnerable.statement}</h3>
            
            <div className="space-y-4">
              <div>
                <div className="text-xs text-text-tertiary uppercase mb-2 font-mono">Explainable Confidence</div>
                <div className="p-3 bg-bg-base border border-border-subtle rounded text-sm text-text-secondary">
                  <span className="font-bold text-accent-danger">LOW</span> — {mockHypothesisVulnerable.confidenceExplanation}
                </div>
              </div>

              <div>
                <div className="text-xs text-text-tertiary uppercase mb-2 font-mono text-accent-warning">Evidence Gaps (1)</div>
                <div className="p-3 bg-bg-base border border-border-subtle border-dashed rounded text-sm text-text-tertiary italic">
                  {mockHypothesisVulnerable.evidenceGaps[0]}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
