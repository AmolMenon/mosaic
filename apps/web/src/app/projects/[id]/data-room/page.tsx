"use client";
import React from "react";
import { Sidebar } from "@mosaic/ui";
import { CenterPanel } from "../../../../features/data-room/CenterPanel";
import { ContextPanel } from "../../../../features/data-room/ContextPanel";

export default function DataRoomPage() {
  return (
    <div className="flex h-full w-full overflow-hidden bg-bg-base">
      <main className="flex-1 min-w-0 h-full overflow-hidden relative">
        <CenterPanel />
      </main>
      <Sidebar width={340} className="hidden lg:flex border-l border-border-subtle flex-shrink-0 z-10">
        <ContextPanel />
      </Sidebar>
    </div>
  );
}
