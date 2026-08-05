"use client";
import React from "react";
import { Project } from "@mosaic/contracts";
import { EvidenceCard } from "@mosaic/ui";
import { useEvidenceTrace } from "../../store/evidence-trace";
import { useQuestions, useInsights } from "../../hooks/queries";

export interface WorkspaceModuleProps {
  project: Project;
}

export interface WorkspaceModule {
  id: string;
  title: string;
  component: React.FC<WorkspaceModuleProps>;
}

export const KeyQuestionsModule: React.FC<WorkspaceModuleProps> = ({ project }) => {
  const { data: questions, isLoading } = useQuestions(project.id);
  
  if (isLoading) return <div className="mb-8"><div className="animate-pulse bg-bg-surface h-24 rounded border border-border-subtle" /></div>;
  if (!questions) return null;

  return (
    <div className="mb-8">
      <h3 className="text-sm font-semibold mb-3">Key Questions</h3>
      <div className="space-y-3">
        {questions.map((q: string, idx: number) => (
          <div key={idx} className="p-3 border border-border-subtle rounded bg-bg-surface hover:bg-bg-surface-hover cursor-pointer transition-colors text-sm">
            {q}
          </div>
        ))}
      </div>
    </div>
  );
};

export const InsightsModule: React.FC<WorkspaceModuleProps> = ({ project }) => {
  const { isTraceActive } = useEvidenceTrace();
  const { data: insightsData, isLoading } = useInsights(project.id);

  if (isLoading) return <div className="mb-8"><div className="animate-pulse bg-bg-surface h-32 rounded border border-border-subtle" /></div>;
  if (!insightsData) return null;

  const { insight, claims, evidence, links } = insightsData;

  return (
    <div className="mb-8">
      <h3 className="text-sm font-semibold mb-3">Diligence Insights</h3>
      <div className="p-4 border border-border-subtle rounded bg-bg-base space-y-4">
        
        {/* Insight Header */}
        <div>
          <div className="text-[10px] font-mono text-text-tertiary uppercase tracking-wider mb-1">Synthesized Finding</div>
          <p className="text-sm font-medium leading-relaxed">{insight?.summary}</p>
        </div>

        {/* Claims & Evidence */}
        <div className="pl-4 border-l-2 border-border-subtle space-y-4 mt-4">
          
          {claims?.map((claim: any, idx: number) => (
            <div key={idx} className={idx > 0 ? "mt-4" : ""}>
              <div className="text-sm font-semibold mb-2">{claim.statement}</div>
              {evidence && evidence[idx] && links && links[idx] && (
                <EvidenceCard 
                  evidence={evidence[idx]} 
                  link={links[idx]} 
                  isTraced={isTraceActive} 
                />
              )}
            </div>
          ))}

        </div>

      </div>
    </div>
  );
};

export const OpenWorkstreamsModule: React.FC<WorkspaceModuleProps> = ({ project }) => {
  return (
    <div className="mb-8">
      <h3 className="text-sm font-semibold mb-3">Open Workstreams</h3>
      <div className="p-4 border border-border-subtle rounded bg-bg-surface text-sm text-text-secondary text-center">
        No active workstreams. Start a diligence thread to begin.
      </div>
    </div>
  );
};

export const defaultWorkspaceModules: WorkspaceModule[] = [
  { id: "key-questions", title: "Key Questions", component: KeyQuestionsModule },
  { id: "insights", title: "Diligence Insights", component: InsightsModule },
  { id: "open-workstreams", title: "Open Workstreams", component: OpenWorkstreamsModule },
];
