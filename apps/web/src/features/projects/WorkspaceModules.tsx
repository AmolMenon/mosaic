import React from "react";
import { Project } from "@mosaic/contracts";
import { mockProjectQuestions, mockClaim1, mockClaim2, mockEvidence1, mockEvidence2, mockLink1, mockLink2, mockInsight1 } from "@mosaic/testing";
import { EvidenceCard } from "@mosaic/ui";
import { useEvidenceTrace } from "../../store/evidence-trace";

export interface WorkspaceModuleProps {
  project: Project;
}

export interface WorkspaceModule {
  id: string;
  title: string;
  component: React.FC<WorkspaceModuleProps>;
}

export const KeyQuestionsModule: React.FC<WorkspaceModuleProps> = ({ project }) => {
  return (
    <div className="mb-8">
      <h3 className="text-sm font-semibold mb-3">Key Questions</h3>
      <div className="space-y-3">
        {mockProjectQuestions.map((q, idx) => (
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

  return (
    <div className="mb-8">
      <h3 className="text-sm font-semibold mb-3">Diligence Insights</h3>
      <div className="p-4 border border-border-subtle rounded bg-bg-base space-y-4">
        
        {/* Insight Header */}
        <div>
          <div className="text-[10px] font-mono text-text-tertiary uppercase tracking-wider mb-1">Synthesized Finding</div>
          <p className="text-sm font-medium leading-relaxed">{mockInsight1.summary}</p>
        </div>

        {/* Claims & Evidence */}
        <div className="pl-4 border-l-2 border-border-subtle space-y-4 mt-4">
          
          {/* Claim 1 */}
          <div>
            <div className="text-sm font-semibold mb-2">{mockClaim1.statement}</div>
            <EvidenceCard 
              evidence={mockEvidence1} 
              link={mockLink1} 
              isTraced={isTraceActive} 
            />
          </div>

          {/* Claim 2 */}
          <div>
            <div className="text-sm font-semibold mb-2 mt-4">{mockClaim2.statement}</div>
            <EvidenceCard 
              evidence={mockEvidence2} 
              link={mockLink2} 
              isTraced={isTraceActive} 
            />
          </div>

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
