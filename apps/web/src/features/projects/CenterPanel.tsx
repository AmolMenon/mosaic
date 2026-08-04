"use client";
import React from "react";
import { Project } from "@mosaic/contracts";
import { useWorkMode, WorkMode } from "../../store/work-mode";
import { defaultWorkspaceModules } from "./WorkspaceModules";
import { clsx } from "clsx";

const MODES: { id: WorkMode; label: string }[] = [
  { id: "research", label: "Research" },
  { id: "analysis", label: "Analysis" },
  { id: "writing", label: "Writing" },
  { id: "review", label: "Review" },
];

export function CenterPanel({ project }: { project: Project }) {
  const { mode, setMode } = useWorkMode();

  return (
    <div className="max-w-3xl mx-auto py-12 px-8 h-full overflow-y-auto">
      {/* Header */}
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-2 text-sm text-text-secondary">
          <span className="px-2 py-0.5 rounded-sm bg-bg-surface border border-border-subtle">{project.targetCompany}</span>
          <span>•</span>
          <span>{project.industry}</span>
          <span>•</span>
          <span className="capitalize">{project.dealType}</span>
        </div>
        <h1 className="text-2xl font-semibold mb-4">{project.description}</h1>
        
        {/* Work Mode Toggle */}
        <div className="flex p-1 bg-bg-surface border border-border-subtle rounded-md w-fit">
          {MODES.map(m => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={clsx(
                "px-4 py-1.5 text-xs font-medium rounded-sm transition-colors",
                mode === m.id ? "bg-bg-surface-active text-text-primary shadow-sm" : "text-text-secondary hover:text-text-primary"
              )}
            >
              {m.label}
            </button>
          ))}
        </div>
      </header>

      {/* Dynamic Workspace Modules */}
      <div className="space-y-8">
        {defaultWorkspaceModules.map(module => {
          const Component = module.component;
          return <Component key={module.id} project={project} />;
        })}
      </div>
    </div>
  );
}
