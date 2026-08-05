import React from "react";
import { AppShell, Sidebar } from "@mosaic/ui";

export function ProjectSkeleton() {
  return (
    <AppShell
      sidebar={
        <Sidebar width={280} className="border-r border-border-subtle bg-bg-surface">
          <div className="p-4 space-y-4 animate-pulse">
            <div className="h-8 bg-bg-subtle rounded w-3/4"></div>
            <div className="space-y-2 mt-8">
              <div className="h-4 bg-bg-subtle rounded w-full"></div>
              <div className="h-4 bg-bg-subtle rounded w-5/6"></div>
              <div className="h-4 bg-bg-subtle rounded w-4/6"></div>
            </div>
            <div className="space-y-2 mt-8">
              <div className="h-4 bg-bg-subtle rounded w-full"></div>
              <div className="h-4 bg-bg-subtle rounded w-5/6"></div>
              <div className="h-4 bg-bg-subtle rounded w-4/6"></div>
            </div>
          </div>
        </Sidebar>
      }
    >
      <div className="flex h-full w-full overflow-hidden">
        <main className="flex-1 min-w-0 h-full p-8 animate-pulse">
          <div className="h-10 bg-bg-subtle rounded w-1/3 mb-8"></div>
          <div className="space-y-4">
            <div className="h-32 bg-bg-subtle rounded w-full"></div>
            <div className="h-32 bg-bg-subtle rounded w-full"></div>
            <div className="h-32 bg-bg-subtle rounded w-full"></div>
          </div>
        </main>
        <Sidebar width={320} className="hidden lg:flex border-l border-border-subtle bg-bg-surface flex-shrink-0 z-10">
          <div className="p-4 space-y-4 animate-pulse w-full">
            <div className="h-6 bg-bg-subtle rounded w-1/2 mb-6"></div>
            <div className="h-20 bg-bg-subtle rounded w-full"></div>
            <div className="h-20 bg-bg-subtle rounded w-full"></div>
          </div>
        </Sidebar>
      </div>
    </AppShell>
  );
}
