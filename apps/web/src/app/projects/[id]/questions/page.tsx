"use client";
import React from "react";
import { Sidebar } from "@mosaic/ui";
import { CenterPanel } from "../../../../features/questions/CenterPanel";
import { ContextPanel } from "../../../../features/questions/ContextPanel";

export default function QuestionsPage() {
  return (
    <div className="flex h-full w-full overflow-hidden bg-bg-base">
      <main className="flex-1 min-w-0 h-full overflow-hidden relative">
        <CenterPanel />
      </main>
      <Sidebar width={320} className="hidden lg:flex border-l border-border-subtle flex-shrink-0 z-10">
        <ContextPanel />
      </Sidebar>
    </div>
  );
}
