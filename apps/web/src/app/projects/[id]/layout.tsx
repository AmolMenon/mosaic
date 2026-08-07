"use client";
import React, { useEffect } from "react";
import { AppShell, Sidebar } from "@mosaic/ui";
import { LeftPanel } from "../../../features/projects/LeftPanel";
import { RightPanel } from "../../../features/projects/RightPanel";
import { useProject } from "../../../hooks/queries";
import { useEvidenceTrace } from "../../../store/evidence-trace";

import { useParams, usePathname } from "next/navigation";
import { ProjectSkeleton } from "../../../components/ProjectSkeleton";
import { AnimatePresence, motion } from "framer-motion";

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const id = params?.id as string;
  const pathname = usePathname();
  const { data: project, isLoading } = useProject(id);
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

  if (isLoading) return <ProjectSkeleton />;
  if (!project) return <div className="flex h-screen w-full bg-bg-base items-center justify-center text-accent-danger font-ui">Project not found</div>;

  return (
    <AppShell 
      sidebar={
        <Sidebar width={280}>
          <LeftPanel project={project} />
        </Sidebar>
      }
      className={isTraceActive ? "bg-bg-surface-active transition-colors duration-300" : "bg-bg-base transition-colors duration-300"}
    >
      <div className="flex h-full w-full overflow-hidden">
        <main className="flex-1 min-w-0 h-full overflow-y-auto relative bg-bg-base">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="h-full w-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
        <Sidebar width={320} className="hidden lg:flex border-l border-border-subtle bg-bg-surface/50 backdrop-blur-md flex-shrink-0 z-10 shadow-lg">
          <RightPanel project={project} />
        </Sidebar>
      </div>
    </AppShell>
  );
}
