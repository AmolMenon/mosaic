"use client";
import React, { useEffect } from "react";
import { AppShell, Sidebar } from "@mosaic/ui";
import { LeftPanel } from "../../../features/projects/LeftPanel";
import { RightPanel } from "../../../features/projects/RightPanel";
import { mockProjectLBO } from "@mosaic/testing";
import { useEvidenceTrace } from "../../../store/evidence-trace";

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
  const project = mockProjectLBO;
  const setTraceActive = useEvidenceTrace((state) => state.setTraceActive);
  const isTraceActive = useEvidenceTrace((state) => state.isTraceActive);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Alt') setTraceActive(true);
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Alt') setTraceActive(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [setTraceActive]);

  return (
    <AppShell 
      sidebar={
        <Sidebar width={280}>
          <LeftPanel project={project} />
        </Sidebar>
      }
      className={isTraceActive ? "bg-bg-surface-active transition-colors duration-150" : "transition-colors duration-150"}
    >
      <div className="flex h-full w-full overflow-hidden">
        <main className="flex-1 min-w-0 h-full overflow-y-auto">
          {children}
        </main>
        <Sidebar width={320} className="hidden lg:flex border-l border-border-subtle bg-bg-surface flex-shrink-0 z-10">
          <RightPanel project={project} />
        </Sidebar>
      </div>
    </AppShell>
  );
}
